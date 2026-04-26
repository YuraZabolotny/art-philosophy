require('dotenv').config();
const cron = require('node-cron');
const express = require('express');
const fs = require('fs');
// Use the common library
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

const categoriesListAllXml = `{"results_size":373,"results":[{"id":"1","title":"Root Catalog","description":null,"image_url":null,"last_update":1768812103000,"blob":{"url_key":null}},{"id":"2","title":"Default Category","description":null,"image_url":null,"last_update":1768812103000,"blob":{"url_key":"default-category"}},{"id":"3","title":"Paint","description":null,"image_url":null,"last_update":1733759243000,"blob":{"url_key":"paint"}},{"id":"4","title":"Shop By Colour","description":"<p>&lt;p&gt;&lt;span&gt;The Little Greene paint collections bring together the most useful and beautiful luxury paint colours from all the key periods in the history of decoration. &lt;\/span&gt;&lt;\/p&gt;<br \/>&lt;p&gt;Browse the colour families below and order &lt;a href=\"https:\/\/www.littlegreene.com\/samples-55\/paint\"&gt;60ml sample pots&lt;\/a&gt; of our Absolute Matt Emulsion paint colours to test in your home. Testing our luxury paint colours in your home is the perfect way to choose paint colours that go together with the light and feel of your space.&lt;\/p&gt;<br \/>&lt;p&gt;If you have a colour card in your hand you might find it easier to &lt;span style=\"color: #008000;\"&gt;&lt;span style=\"color: #008000;\"&gt;&lt;a href=\"https:\/\/www.littlegreene.com\/paint\/collection\"&gt;shop by collection&lt;\/a&gt;. &lt;\/span&gt;&lt;\/span&gt;Or, for more detailed information on the different types of paint, try &lt;span style=\"color: #008000;\"&gt;&lt;a href=\"https:\/\/www.littlegreene.com\/paint\/finish\"&gt;&lt;span style=\"color: #008000;\"&gt;shopping by finish&lt;\/span&gt;&lt;\/a&gt;&lt;\/span&gt;.&lt;\/p&gt;<\/p>","image_url":null,"last_update":1728308884000,"blob":{"url_key":"colour"}},{"id":"5","title":"Neutral","description":null,"image_url":"\/media\/catalog\/category\/Neutral.jpg","last_update":1714486194000,"blob":{"url_key":"neutral-paint-colours"}},{"id":"6","title":"White","description":null,"image_url":"\/media\/catalog\/category\/White.jpg","last_update":1714486237000,"blob":{"url_key":"white"}},{"id":"7","title":"Green","description":null,"image_url":"\/media\/catalog\/category\/Green.jpg","last_update":1714486256000,"blob":{"url_key":"green"}},{"id":"8","title":"Blue","description":null,"image_url":"\/media\/catalog\/category\/_0005_Etruria.jpg","last_update":1714578040000,"blob":{"url_key":"blue"}},{"id":"9","title":"Red & Pink","description":null,"image_url":"\/media\/catalog\/category\/Pink.jpg","last_update":1714486277000,"blob":{"url_key":"red-pink"}},{"id":"10","title":"Yellow","description":null,"image_url":"\/media\/catalog\/category\/Yellow.jpg","last_update":1714486302000,"blob":{"url_key":"yellow"}},{"id":"11","title":"Black","description":null,"image_url":"\/media\/catalog\/category\/CatGrd_Paint_ByColour_Black_1.jpg","last_update":1692190213000,"blob":{"url_key":"black"}},{"id":"12","title":"Grey","description":null,"image_url":"\/media\/catalog\/category\/Grey.jpg","last_update":1767886032000,"blob":{"url_key":"grey"}},{"id":"13","title":"Archive","description":null,"image_url":"\/media\/catalog\/category\/Archive.jpg","last_update":1728308884000,"blob":{"url_key":"archive"}},{"id":"14","title":"Paint Collections","description":null,"image_url":null,"last_update":1701770851000,"blob":{"url_key":"collections"}},{"id":"15","title":"Colours of England","description":null,"image_url":"\/media\/catalog\/category\/CatGrd_Paint_ByCollection_CofE.jpg","last_update":1774878779000,"blob":{"url_key":"colours-of-england"}},{"id":"16","title":"Stone","description":null,"image_url":"\/media\/catalog\/category\/CatGrd_Paint_ByCollection_Stone.jpg","last_update":1774878836000,"blob":{"url_key":"stone"}},{"id":"17","title":"Grey","description":null,"image_url":"\/media\/catalog\/category\/CatGrd_Paint_ByCollection_Grey_1.jpg","last_update":1692191980000,"blob":{"url_key":"grey"}},{"id":"18","title":"Colour Scales","description":null,"image_url":"\/media\/catalog\/category\/CatGrd_Paint_ByCollection_ColScales.jpg","last_update":1759763215000,"blob":{"url_key":"colour-scales"}},{"id":"19","title":"Green","description":null,"image_url":"\/media\/catalog\/category\/CatGrd_Paint_ByCollection_Green.jpg","last_update":1652179272000,"blob":{"url_key":"green"}},{"id":"20","title":"Paint Period","description":null,"image_url":null,"last_update":1717072895000,"blob":{"url_key":"period"}},{"id":"21","title":"Georgian Paint Colours","description":null,"image_url":"\/media\/catalog\/category\/CatGrd_Paint_ByPeriod_Georgian.jpg","last_update":1692192254000,"blob":{"url_key":"georgian-paint-colours"}},{"id":"22","title":"Regency Paint Colours","description":null,"image_url":"\/media\/catalog\/category\/CatGrd_Paint_ByPeriod_Regency.jpg","last_update":1692192334000,"blob":{"url_key":"regency-paint-colours"}},{"id":"23","title":"Victorian Paint Colours","description":null,"image_url":"\/media\/catalog\/category\/CatGrd_Paint_ByPeriod_Victorian.jpg","last_update":1692192383000,"blob":{"url_key":"victorian-paint-colours"}},{"id":"24","title":"1930s Paint Colours","description":null,"image_url":"\/media\/catalog\/category\/CatGrd_Paint_ByPeriod_1930s.jpg","last_update":1692192445000,"blob":{"url_key":"1930s-paint-colours"}},{"id":"25","title":"1950s Paint Colours","description":null,"image_url":"\/media\/catalog\/category\/CatGrd_Paint_ByPeriod_1950s.jpg","last_update":1692192471000,"blob":{"url_key":"1950s-paint-colours"}},{"id":"26","title":"1960s Paint Colours","description":null,"image_url":"\/media\/catalog\/category\/CatGrd_Paint_ByPeriod_1960s.jpg","last_update":1692192516000,"blob":{"url_key":"1960s-paint-colours"}},{"id":"27","title":"1970s Paint Colours","description":null,"image_url":"\/media\/catalog\/category\/CatGrd_Paint_ByPeriod_1970s.jpg","last_update":1692192555000,"blob":{"url_key":"1970s-paint-colours"}},{"id":"28","title":"Paint Finishes","description":null,"image_url":null,"last_update":1692192864000,"blob":{"url_key":"finishes"}},{"id":"29","title":"Interior Paint Finishes","description":null,"image_url":null,"last_update":1692955339000,"blob":{"url_key":"interior-paint-finishes"}},{"id":"30","title":"Exterior Paint Finishes","description":null,"image_url":null,"last_update":1743428788000,"blob":{"url_key":"exterior-paint-finishes"}},{"id":"31","title":"Primers & Undercoats","description":null,"image_url":null,"last_update":1646740105000,"blob":{"url_key":"primers-undercoats"}},{"id":"32","title":"Paint Sample Pots","description":null,"image_url":null,"last_update":1694008345000,"blob":{"url_key":"sample-pots"}},{"id":"33","title":"Wallpaper","description":null,"image_url":null,"last_update":1768812103000,"blob":{"url_key":"wallpaper"}},{"id":"34","title":"Wallpaper by Colour","description":null,"image_url":null,"last_update":1692194076000,"blob":{"url_key":"colour"}},{"id":"35","title":"Neutral","description":null,"image_url":"\/media\/catalog\/category\/Neutral_1.jpg","last_update":1726567067000,"blob":{"url_key":"neutral-wallpapers"}},{"id":"36","title":"Grey","description":null,"image_url":"\/media\/catalog\/category\/Grey_1.jpg","last_update":1767886015000,"blob":{"url_key":"grey-wallpaper"}},{"id":"37","title":"Red","description":null,"image_url":"\/media\/catalog\/category\/tulip_red.jpg","last_update":1729591825000,"blob":{"url_key":"red-wallpaper"}},{"id":"38","title":"Yellow","description":null,"image_url":"\/media\/catalog\/category\/Yellow_1.jpg","last_update":1726569456000,"blob":{"url_key":"yellow-wallpapers"}},{"id":"39","title":"Green","description":null,"image_url":"\/media\/catalog\/category\/Green_1.jpg","last_update":1726569483000,"blob":{"url_key":"green-wallpapers"}},{"id":"40","title":"Blue","description":null,"image_url":"\/media\/catalog\/category\/Blue.jpg","last_update":1726569500000,"blob":{"url_key":"blue-wallpaper"}},{"id":"41","title":"Pink","description":null,"image_url":"\/media\/catalog\/category\/Pink_1.jpg","last_update":1726569529000,"blob":{"url_key":"pink-wallpaper"}},{"id":"42","title":"Black","description":null,"image_url":"\/media\/catalog\/category\/Black-325x481px.jpg","last_update":1693408397000,"blob":{"url_key":"black-wallpapers"}},{"id":"43","title":"Wallpapers by Style","description":null,"image_url":null,"last_update":1692194623000,"blob":{"url_key":"style"}},{"id":"44","title":"Floral Wallpapers","description":null,"image_url":"\/media\/catalog\/category\/Floral.jpg","last_update":1726569568000,"blob":{"url_key":"wallpaper-style-floral-wallpaper"}},{"id":"45","title":"Metallic Wallpapers","description":null,"image_url":"\/media\/catalog\/category\/Metallic.jpg","last_update":1734082465000,"blob":{"url_key":"metallic-wallpapers"}},{"id":"46","title":"Classical Wallpapers","description":null,"image_url":"\/media\/catalog\/category\/Classical.jpg","last_update":1726569612000,"blob":{"url_key":"classical-wallpapers"}},{"id":"47","title":"Damask Wallpapers","description":null,"image_url":"\/media\/catalog\/category\/Damask.jpg","last_update":1726569636000,"blob":{"url_key":"damask-wallpaper"}},{"id":"48","title":"Geometric Wallpapers","description":null,"image_url":"\/media\/catalog\/category\/Geometric.jpg","last_update":1726569654000,"blob":{"url_key":"geometric"}},{"id":"49","title":"Striped Wallpapers","description":null,"image_url":"\/media\/catalog\/category\/Striped.jpg","last_update":1726580981000,"blob":{"url_key":"striped"}},{"id":"50","title":"Small Print Wallpapers","description":null,"image_url":"\/media\/catalog\/category\/Small_Print.jpg","last_update":1726569680000,"blob":{"url_key":"small-print"}}]}`;

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

app.get('/categories/list-all', (req, res) => {
    res.type('application/json');
    res.send(categoriesListAllXml);
});

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
            .xml-link-wrap {
                margin-top: 20px;
                text-align: center;
            }
            .xml-link {
                color: #667eea;
                text-decoration: none;
                font-weight: 600;
            }
            .xml-link:hover {
                text-decoration: underline;
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

                <div class="xml-link-wrap">
                    <a href="/categories/list-all" class="xml-link">Open categories/list-all XML feed</a>
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
