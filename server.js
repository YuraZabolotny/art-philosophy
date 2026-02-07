require('dotenv').config();
const express = require('express');
const Parser = require('rss-parser');
const cron = require('node-cron');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const parser = new Parser();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash'
});

const RSS_FEEDS = [
    'https://www.artforum.com/rss',
    'https://www.artnews.com/rss/',
];

let todayArticle = null;

// === AI summary ===
async function generateSummary(text) {
    try {
        const prompt = `
Summarize the following article in 5 short, clear lines.
Focus on philosophy and art meaning.

Text:
${text}
`;
        const result = await model.generateContent(prompt);
        return result.response?.text() || "Summary unavailable";
    } catch (e) {
        console.error('Gemini summary error:', e);
        return "Summary unavailable";
    }
}

// === Fetch RSS article ===
async function fetchArticle() {
    try {
        const allArticles = await fetchArticlesFromAllFeeds();
        if (allArticles.length === 0) {
            console.log("No articles from any feed");
            return;
        }

        // сортируем по score
        allArticles.forEach(a => a.score = scoreArticle(a));
        allArticles.sort((a, b) => b.score - a.score);

        const article = allArticles[0]; // самая интересная

        const summary = await generateSummary(
            article.contentSnippet || article.content || article.title
        );
        article.summary = summary;

        let articles = [];
        try {
            if (fs.existsSync('articles.json')) {
                articles = JSON.parse(fs.readFileSync('articles.json'));
            }
        } catch (e) {
            console.error('Error reading articles.json', e);
        }

        // добавляем, если нет дубликата
        if (!articles.find(a => a.link === article.link)) {
            articles.unshift(article);
            try {
                fs.writeFileSync('articles.json', JSON.stringify(articles, null, 2));
            } catch (e) {
                console.error('Error writing articles.json', e);
            }
        }

        todayArticle = article;
        console.log('Article updated:', article.title);

    } catch (e) {
        console.error('RSS fetch error', e);
    }
}

function scoreArticle(article) {
    const keywords = ['philosophy', 'art', 'aesthetics', 'modern', 'painting', 'sculpture'];
    let score = 0;

    const text = (article.contentSnippet || article.title || '').toLowerCase();

    keywords.forEach(k => {
        if (text.includes(k)) score += 1;
    });

    // чуть выше для длинного контента
    if ((article.contentSnippet || '').length > 100) score += 1;

    return score;
}

async function fetchArticlesFromAllFeeds() {
    const allArticles = [];

    for (const url of RSS_FEEDS) {
        try {
            const feed = await parser.parseURL(url);
            if (!feed.items) continue;

            feed.items.forEach(item => {
                allArticles.push({
                    ...item,
                    source: url
                });
            });
        } catch (e) {
            console.error('RSS fetch error', url, e);
        }
    }

    return allArticles;
}


// === Cron: каждый день в 9:00 ===
cron.schedule('0 9 * * *', () => {
    fetchArticle().catch(e => console.error('Cron fetch error', e));
});

// === Homepage ===
app.get('/', (req, res) => {
    if (!todayArticle && fs.existsSync('articles.json')) {
        try {
            todayArticle = JSON.parse(fs.readFileSync('articles.json'))[0];
        } catch (e) {
            console.error('Error reading todayArticle', e);
        }
    }

    if (!todayArticle) return res.send("Loading article...");

    res.send(`
        <h1>Article of the Day</h1>
        <h2>${todayArticle.title}</h2>
        <p>${todayArticle.contentSnippet || ''}</p>
        <p><strong>Summary:</strong> ${todayArticle.summary || ''}</p>
        <a href="${todayArticle.link}" target="_blank">Read full article</a>
    `);
});

// === Archive page ===
app.get('/archive', (req, res) => {
    if (!fs.existsSync('articles.json')) return res.send("No articles yet");

    let articles = [];
    try {
        articles = JSON.parse(fs.readFileSync('articles.json'));
    } catch (e) {
        console.error('Error reading articles.json', e);
    }

    const list = articles.map(a => `
        <li>
            <a href="${a.link}" target="_blank">${a.title}</a>
        </li>
    `).join('');

    res.send(`
        <h1>Archive</h1>
        <ul>${list}</ul>
    `);
});

// === Start server ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server running on', PORT);
    fetchArticle().catch(e => console.error('Initial fetch error', e)); // первый запуск
});
