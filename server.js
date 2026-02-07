const express = require('express');
const Parser = require('rss-parser');
const cron = require('node-cron');
const fs = require('fs');

const app = express();
const parser = new Parser();

let todayArticle = null;

async function fetchArticle() {
    try {
        const feed = await parser.parseURL(
            'https://www.theartstory.org/rss.xml'
        );

        const article = feed.items[0];

        let articles = [];

        if (fs.existsSync('articles.json')) {
            articles = JSON.parse(fs.readFileSync('articles.json'));
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


// каждый день в 9:00
cron.schedule('0 9 * * *', fetchArticle);

app.get('/', (req, res) => {
    if (!todayArticle && fs.existsSync('article.json')) {
        todayArticle = JSON.parse(fs.readFileSync('article.json'));
    }

    if (!todayArticle) return res.send("Loading article...");

    res.send(`
        <h1>Article of the Day</h1>
        <h2>${todayArticle.title}</h2>
        <p>${todayArticle.contentSnippet || ''}</p>
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
