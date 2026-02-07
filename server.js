require('dotenv').config();
const express = require('express');
const Parser = require('rss-parser');
const cron = require('node-cron');
const fs = require('fs');

const app = express();
const parser = new Parser();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash'
});

let todayArticle = null;

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

async function fetchArticle() {
    try {
        const feed = await parser.parseURL(
            'https://www.theartstory.org/rss.xml'
        );

        if (!feed.items || feed.items.length === 0) {
            console.log("No articles in feed");
            return;
        }

        const article = feed.items[0];

        const summary = await generateSummary(
            article.contentSnippet || article.content || article.title
        );

        article.summary = summary;

        let articles = [];

        try {
            if (fs.existsSync('articles.json')) {
                articles = JSON.parse(fs.readFileSync('articles.json'));
            }
        } catch(e) {
            console.error('Error reading articles.json', e);
        }

        if (!articles.find(a => a.link === article.link)) {
            articles.unshift(article);
            fs.writeFileSync('articles.json', JSON.stringify(articles, null, 2));
        }

        todayArticle = article;

        console.log('Article updated:', article.title);
    } catch (e) {
        console.error('RSS fetch error', e);
    }
}


cron.schedule('0 9 * * *', () => {
    fetchArticle().catch(e => console.error('Cron fetch error', e));
});

app.get('/', (req, res) => {
    if (!todayArticle && fs.existsSync('article.json')) {
        todayArticle = JSON.parse(fs.readFileSync('article.json'));
    }

    if (!todayArticle) return res.send("Loading article...");

    res.send(`
        <h1>Article of the Day</h1>
        <h2>${todayArticle.title}</h2>
        <p>${article.summary || 'Loading...'}</p>
        <p>${todayArticle.summary || ''}</p>
        <a href="${todayArticle.link}">Read full article</a>
    `);
});

app.get('/archive', (req, res) => {

    if (!fs.existsSync('articles.json')) {
        return res.send("No articles yet");
    }

    const articles = JSON.parse(fs.readFileSync('articles.json'));

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server running on', PORT);
    fetchArticle(); // первый запуск сразу
});
