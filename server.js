require('dotenv').config();
const express = require('express');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// Gemini for AI summary (optional)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

let todayArticle = null;

// === Load article from JSON file ===
function loadArticle() {
    if (fs.existsSync('articles.json')) {
        try {
            const articles = JSON.parse(fs.readFileSync('articles.json'));
            todayArticle = articles[0]; // first article
        } catch (e) {
            console.error('Error reading articles.json', e);
        }
    }
}

// === Homepage: full article with image ===
app.get('/', (req, res) => {
    if (!todayArticle) loadArticle();
    if (!todayArticle) return res.send("Article of the Day is not available yet.");

    // image tag
    let imgTag = '';
    if (todayArticle.enclosure?.url || todayArticle.image?.url) {
        const imgUrl = todayArticle.enclosure?.url || todayArticle.image?.url;
        imgTag = `<img src="${imgUrl}" alt="Article Image" style="max-width:100%; height:auto; border-radius:10px; margin:20px 0;">`;
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Article of the Day</title>
            <style>
                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    margin: 0;
                    font-family: Arial, sans-serif;
                    background: #f0f0f0;
                }
                .container {
                    max-width: 600px;
                    width: 90%;
                    background: #fff;
                    padding: 20px;
                    border-radius: 15px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                }
                h1 {
                    text-align: center;
                }
                p {
                    line-height: 1.6;
                }
                a {
                    display: block;
                    text-align: center;
                    margin-top: 15px;
                    color: #0077cc;
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
                img {
                    display: block;
                    margin: 0 auto;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>${todayArticle.title}</h1>
                ${imgTag}
                <p>${todayArticle.content || todayArticle.contentSnippet || ''}</p>
                ${todayArticle.summary ? `<p><strong>Summary:</strong> ${todayArticle.summary}</p>` : ''}
                <a href="${todayArticle.link}" target="_blank">Read original article</a>
            </div>
        </body>
        </html>
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
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Article Archive</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                ul { padding-left: 20px; }
                li { margin-bottom: 10px; }
                a { color: #0077cc; text-decoration: none; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <h1>Article Archive</h1>
            <ul>${list}</ul>
        </body>
        </html>
    `);
});

// === Start server ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server running on', PORT);
    loadArticle(); // load article at start
});
