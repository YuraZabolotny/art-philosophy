require('dotenv').config();
const cron = require('node-cron');
const express = require('express');
const fs = require('fs');
// Use the common library
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// CONFIGURATION: Try these model names if one doesn't work:
// - "gemini-2.5-flash" (newest, recommended)
// - "gemini-2.5-pro" (more capable but slower)
// - "gemini-2.0-flash"
// - "gemini-flash-latest"
const MODEL_NAME = process.env.MODEL_NAME || "gemini-2.5-flash";

// 1. Initialize GenAI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. Initialize the model - try different model name formats
// Some API keys require the full path with 'models/' prefix
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

/**
 * Check if the API connection works and list available models
 */
async function checkModels() {
    try {
        console.log("Checking API connection...");

        // Try to list available models
        try {
            const listResponse = await fetch(
                'https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GEMINI_API_KEY
            );
            const data = await listResponse.json();

            if (data.models) {
                console.log("\nAvailable models:");
                data.models.forEach(m => {
                    console.log(`  - ${m.name} (${m.displayName})`);
                });
            }
        } catch (listErr) {
            console.log("Could not list models:", listErr.message);
        }

        // Test the connection
        const result = await model.generateContent("test");
        if (result.response) {
            console.log("Connection successful!");
            console.log("Using model: gemini-pro\n");
        }
    } catch (e) {
        console.error("Connection failed. Check your API Key or Model Name.");
        console.error("Error Message:", e.message);
        console.log("\nTrying alternative model names...");

        // The error suggests we should try different model names
        console.log("Please update MODEL_NAME in your .env file to one of these:");
        console.log("  - gemini-2.5-flash (recommended)");
        console.log("  - gemini-2.5-pro");
        console.log("  - gemini-flash-latest");
        console.log("  - gemini-2.0-flash");
    }
}

checkModels();

let todayArticle = null;

async function fetchArticle() {
    console.log("Starting fetchArticle...");
    const article = await generateArticle();
    if (!article) return;

    try {
        const summaryPrompt = `Summarize this article in 5 short lines:\n\n${article.content}`;
        const summaryResult = await model.generateContent(summaryPrompt);
        article.summary = summaryResult.response.text();
    } catch (e) {
        article.summary = "Summary unavailable.";
        console.error("AI summary error:", e);
    }

    let articles = [];
    if (fs.existsSync("articles.json")) {
        try {
            articles = JSON.parse(fs.readFileSync("articles.json"));
        } catch (err) {
            articles = [];
        }
    }

    articles.unshift(article);
    fs.writeFileSync("articles.json", JSON.stringify(articles, null, 2));

    todayArticle = article;
    console.log("AI article generated successfully!");
}

async function generateArticle() {
    try {
        const topics = [
            'aesthetic experience and beauty',
            'art as expression vs representation',
            'the nature of artistic creativity',
            'formalism in art criticism',
            'art and emotion',
            'the definition of art',
            'aesthetic judgment',
            'art and morality',
            'the ontology of artworks',
            'interpretation in art'
        ];

        const randomTopic = topics[Math.floor(Math.random() * topics.length)];

        // Curated art images - these are high quality art photos from Unsplash
        const artImages = [
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5', // Abstract painting
            'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8', // Colorful art
            'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9', // Museum art
            'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec', // Gallery art
            'https://images.unsplash.com/photo-1536924940846-227afb31e2a5', // Sculpture
            'https://images.unsplash.com/photo-1561214115-f2f134cc4912', // Abstract art
            'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3', // Modern art
            'https://images.unsplash.com/photo-1513364776144-60967b0f800f', // Art gallery
            'https://images.unsplash.com/photo-1518998053901-5348d3961a04', // Classical art
            'https://images.unsplash.com/photo-1571115177098-24ec42ed204d', // Painting
            'https://images.unsplash.com/photo-1549887534-1541e9326642', // Art museum
            'https://images.unsplash.com/photo-1547891654-e66ed7ebb968', // Contemporary art
            'https://images.unsplash.com/photo-1544947950-fa07a98d237f', // Abstract colorful
            'https://images.unsplash.com/photo-1580477667995-2b94f01c9516', // Renaissance art
            'https://images.unsplash.com/photo-1561214078-f3247647fc5e'  // Fine art
        ];

        const prompt = `Write a philosophical article about ${randomTopic}.

Structure:
1. Start with an engaging title (without numbering)
2. Write 3-4 paragraphs of content exploring key philosophical questions and perspectives
3. Make it accessible but intellectually engaging
4. Include references to relevant philosophers when appropriate

Keep the total article between 250-350 words.`;

        // Use generateContent
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const lines = text.split('\n').filter(l => l.trim() !== '');

        // Extract title (first non-empty line)
        const title = lines[0].replace(/^#+\s*/, '').replace(/^\*\*/, '').replace(/\*\*$/, '').trim();

        // Join remaining lines as content
        const content = lines.slice(1).join('\n\n').trim();

        // Select a random art image from curated collection
        const randomImage = artImages[Math.floor(Math.random() * artImages.length)];
        const imageUrl = `${randomImage}?w=800&h=500&fit=crop&q=80`;

        return {
            title: title || "Philosophy of Art",
            content: content || "Content could not be parsed.",
            summary: "",
            topic: randomTopic,
            link: "#",
            enclosure: { url: imageUrl },
            date: new Date().toISOString()
        };
    } catch (e) {
        console.error("Generation Error Details:", e.message);
        return null;
    }
}

// ... Rest of your Express routes (unchanged) ...

app.get('/', (req, res) => {
    if (!todayArticle) return res.send("Generating article... please refresh in 10 seconds.");

    // Load all articles
    let articles = [];
    if (fs.existsSync("articles.json")) {
        try {
            articles = JSON.parse(fs.readFileSync("articles.json"));
        } catch (err) {
            articles = [todayArticle];
        }
    } else {
        articles = [todayArticle];
    }

    // Get current article index from query parameter
    const currentIndex = parseInt(req.query.index) || 0;
    const article = articles[currentIndex] || todayArticle;

    const hasNewer = currentIndex > 0;
    const hasOlder = currentIndex < articles.length - 1;

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${article.title} - Daily Philosophy of Art</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Georgia', serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px;
                line-height: 1.6;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #434343 0%, #000000 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
                position: relative;
            }
            .header h1 { font-size: 2em; margin-bottom: 10px; }
            .date { opacity: 0.9; font-size: 1em; }
            .article-counter {
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(255,255,255,0.2);
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 0.9em;
            }
            .article-image {
                width: 100%;
                height: 400px;
                object-fit: cover;
                display: block;
            }
            .content { padding: 40px 30px; }
            .topic {
                display: inline-block;
                background: #667eea;
                color: white;
                padding: 8px 20px;
                border-radius: 20px;
                font-size: 0.9em;
                margin-bottom: 20px;
                text-transform: capitalize;
            }
            .article-title {
                font-size: 2em;
                margin-bottom: 20px;
                color: #333;
                line-height: 1.3;
            }
            .article-content {
                font-size: 1.1em;
                line-height: 1.8;
                color: #555;
                white-space: pre-wrap;
            }
            .summary {
                background: #f5f5f5;
                padding: 20px;
                border-left: 4px solid #667eea;
                margin-top: 30px;
                font-style: italic;
            }
            .navigation {
                display: flex;
                gap: 15px;
                justify-content: center;
                margin-top: 30px;
                flex-wrap: wrap;
            }
            .nav-btn, .refresh-btn {
                padding: 12px 30px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 25px;
                font-size: 1em;
                cursor: pointer;
                text-decoration: none;
                transition: background 0.3s;
                display: inline-block;
            }
            .nav-btn:hover, .refresh-btn:hover { 
                background: #5568d3; 
            }
            .nav-btn:disabled {
                background: #ccc;
                cursor: not-allowed;
            }
            .refresh-btn {
                background: #28a745;
            }
            .refresh-btn:hover {
                background: #218838;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="article-counter">${currentIndex + 1} / ${articles.length}</div>
                <h1>Daily Philosophy of Art</h1>
                <div class="date">${new Date(article.date || Date.now()).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })}</div>
            </div>
            <img src="${article.enclosure.url}" alt="${article.title}" class="article-image" onerror="this.src='https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=500&fit=crop&q=80'">
            <div class="content">
                <span class="topic">${article.topic || 'Philosophy of Art'}</span>
                <h2 class="article-title">${article.title}</h2>
                <div class="article-content">${article.content}</div>
                ${article.summary ? `<div class="summary"><strong>Summary:</strong> ${article.summary}</div>` : ''}
                
                <div class="navigation">
                    ${hasOlder ? `<a href="/?index=${currentIndex + 1}" class="nav-btn">← Older Article</a>` : '<button class="nav-btn" disabled>← Older Article</button>'}
                    <a href="/generate" class="refresh-btn">✨ Generate New</a>
                    ${hasNewer ? `<a href="/?index=${currentIndex - 1}" class="nav-btn">Newer Article →</a>` : '<button class="nav-btn" disabled>Newer Article →</button>'}
                </div>
            </div>
        </div>
        
        <script>
            // Keyboard navigation
            document.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowLeft' && ${hasOlder}) {
                    window.location.href = '/?index=${currentIndex + 1}';
                } else if (e.key === 'ArrowRight' && ${hasNewer}) {
                    window.location.href = '/?index=${currentIndex - 1}';
                }
            });
        </script>
    </body>
    </html>
    `;

    res.send(html);
});

// API endpoint to get current article as JSON
app.get('/api/article', (req, res) => {
    if (!todayArticle) {
        return res.status(404).json({ error: 'No article available yet. Please wait.' });
    }
    res.json(todayArticle);
});

// Endpoint to trigger new article generation
app.get('/generate', async (req, res) => {
    res.send('Generating new article... <script>setTimeout(() => window.location.href = "/", 3000);</script>');
    await fetchArticle();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log('Server running on', PORT);
    await fetchArticle();
});