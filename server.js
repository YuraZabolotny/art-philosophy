require('dotenv').config();
const cron = require('node-cron');
const express = require('express');
const fs = require('fs');
// Use the common library
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

const categoriesListAllXml = `<?xml version="1.0"?>
<response>
  <results_size>373</results_size>
  <results>
    <item>
      <id>1</id>
      <title>Root Catalog</title>
      <description></description>
      <image_url></image_url>
      <last_update>1768812103000</last_update>
      <blob>
        <url_key></url_key>
      </blob>
    </item>
    <item>
      <id>2</id>
      <title>Default Category</title>
      <description></description>
      <image_url></image_url>
      <last_update>1768812103000</last_update>
      <blob>
        <url_key>default-category</url_key>
      </blob>
    </item>
    <item>
      <id>3</id>
      <title>Paint</title>
      <description></description>
      <image_url></image_url>
      <last_update>1733759243000</last_update>
      <blob>
        <url_key>paint</url_key>
      </blob>
    </item>
    <item>
      <id>4</id>
      <title>Shop By Colour</title>
      <description>&lt;p&gt;&amp;lt;p&amp;gt;&amp;lt;span&amp;gt;The Little Greene paint collections bring together the most useful and beautiful luxury paint colours from all the key periods in the history of decoration. &amp;lt;/span&amp;gt;&amp;lt;/p&amp;gt;&lt;br /&gt;&amp;lt;p&amp;gt;Browse the colour families below and order &amp;lt;a href="https://www.littlegreene.com/samples-55/paint"&amp;gt;60ml sample pots&amp;lt;/a&amp;gt; of our Absolute Matt Emulsion paint colours to test in your home. Testing our luxury paint colours in your home is the perfect way to choose paint colours that go together with the light and feel of your space.&amp;lt;/p&amp;gt;&lt;br /&gt;&amp;lt;p&amp;gt;If you have a colour card in your hand you might find it easier to &amp;lt;span style="color: #008000;"&amp;gt;&amp;lt;span style="color: #008000;"&amp;gt;&amp;lt;a href="https://www.littlegreene.com/paint/collection"&amp;gt;shop by collection&amp;lt;/a&amp;gt;. &amp;lt;/span&amp;gt;&amp;lt;/span&amp;gt;Or, for more detailed information on the different types of paint, try &amp;lt;span style="color: #008000;"&amp;gt;&amp;lt;a href="https://www.littlegreene.com/paint/finish"&amp;gt;&amp;lt;span style="color: #008000;"&amp;gt;shopping by finish&amp;lt;/span&amp;gt;&amp;lt;/a&amp;gt;&amp;lt;/span&amp;gt;.&amp;lt;/p&amp;gt;&lt;/p&gt;</description>
      <image_url></image_url>
      <last_update>1728308884000</last_update>
      <blob>
        <url_key>colour</url_key>
      </blob>
    </item>
    <item>
      <id>5</id>
      <title>Neutral</title>
      <description></description>
      <image_url>/media/catalog/category/Neutral.jpg</image_url>
      <last_update>1714486194000</last_update>
      <blob>
        <url_key>neutral-paint-colours</url_key>
      </blob>
    </item>
    <item>
      <id>6</id>
      <title>White</title>
      <description></description>
      <image_url>/media/catalog/category/White.jpg</image_url>
      <last_update>1714486237000</last_update>
      <blob>
        <url_key>white</url_key>
      </blob>
    </item>
    <item>
      <id>7</id>
      <title>Green</title>
      <description></description>
      <image_url>/media/catalog/category/Green.jpg</image_url>
      <last_update>1714486256000</last_update>
      <blob>
        <url_key>green</url_key>
      </blob>
    </item>
    <item>
      <id>8</id>
      <title>Blue</title>
      <description></description>
      <image_url>/media/catalog/category/_0005_Etruria.jpg</image_url>
      <last_update>1714578040000</last_update>
      <blob>
        <url_key>blue</url_key>
      </blob>
    </item>
    <item>
      <id>9</id>
      <title>Red &amp; Pink</title>
      <description></description>
      <image_url>/media/catalog/category/Pink.jpg</image_url>
      <last_update>1714486277000</last_update>
      <blob>
        <url_key>red-pink</url_key>
      </blob>
    </item>
    <item>
      <id>10</id>
      <title>Yellow</title>
      <description></description>
      <image_url>/media/catalog/category/Yellow.jpg</image_url>
      <last_update>1714486302000</last_update>
      <blob>
        <url_key>yellow</url_key>
      </blob>
    </item>
    <item>
      <id>11</id>
      <title>Black</title>
      <description></description>
      <image_url>/media/catalog/category/CatGrd_Paint_ByColour_Black_1.jpg</image_url>
      <last_update>1692190213000</last_update>
      <blob>
        <url_key>black</url_key>
      </blob>
    </item>
    <item>
      <id>12</id>
      <title>Grey</title>
      <description></description>
      <image_url>/media/catalog/category/Grey.jpg</image_url>
      <last_update>1767886032000</last_update>
      <blob>
        <url_key>grey</url_key>
      </blob>
    </item>
    <item>
      <id>13</id>
      <title>Archive</title>
      <description></description>
      <image_url>/media/catalog/category/Archive.jpg</image_url>
      <last_update>1728308884000</last_update>
      <blob>
        <url_key>archive</url_key>
      </blob>
    </item>
    <item>
      <id>14</id>
      <title>Paint Collections</title>
      <description></description>
      <image_url></image_url>
      <last_update>1701770851000</last_update>
      <blob>
        <url_key>collections</url_key>
      </blob>
    </item>
    <item>
      <id>15</id>
      <title>Colours of England</title>
      <description></description>
      <image_url>/media/catalog/category/CatGrd_Paint_ByCollection_CofE.jpg</image_url>
      <last_update>1774878779000</last_update>
      <blob>
        <url_key>colours-of-england</url_key>
      </blob>
    </item>
    <item>
      <id>16</id>
      <title>Stone</title>
      <description></description>
      <image_url>/media/catalog/category/CatGrd_Paint_ByCollection_Stone.jpg</image_url>
      <last_update>1774878836000</last_update>
      <blob>
        <url_key>stone</url_key>
      </blob>
    </item>
    <item>
      <id>17</id>
      <title>Grey</title>
      <description></description>
      <image_url>/media/catalog/category/CatGrd_Paint_ByCollection_Grey_1.jpg</image_url>
      <last_update>1692191980000</last_update>
      <blob>
        <url_key>grey</url_key>
      </blob>
    </item>
    <item>
      <id>18</id>
      <title>Colour Scales</title>
      <description></description>
      <image_url>/media/catalog/category/CatGrd_Paint_ByCollection_ColScales.jpg</image_url>
      <last_update>1759763215000</last_update>
      <blob>
        <url_key>colour-scales</url_key>
      </blob>
    </item>
    <item>
      <id>19</id>
      <title>Green</title>
      <description></description>
      <image_url>/media/catalog/category/CatGrd_Paint_ByCollection_Green.jpg</image_url>
      <last_update>1652179272000</last_update>
      <blob>
        <url_key>green</url_key>
      </blob>
    </item>
    <item>
      <id>20</id>
      <title>Paint Period</title>
      <description></description>
      <image_url></image_url>
      <last_update>1717072895000</last_update>
      <blob>
        <url_key>period</url_key>
      </blob>
    </item>
    <item>
      <id>21</id>
      <title>Georgian Paint Colours</title>
      <description></description>
      <image_url>/media/catalog/category/CatGrd_Paint_ByPeriod_Georgian.jpg</image_url>
      <last_update>1692192254000</last_update>
      <blob>
        <url_key>georgian-paint-colours</url_key>
      </blob>
    </item>
    <item>
      <id>22</id>
      <title>Regency Paint Colours</title>
      <description></description>
      <image_url>/media/catalog/category/CatGrd_Paint_ByPeriod_Regency.jpg</image_url>
      <last_update>1692192334000</last_update>
      <blob>
        <url_key>regency-paint-colours</url_key>
      </blob>
    </item>
    <item>
      <id>23</id>
      <title>Victorian Paint Colours</title>
      <description></description>
      <image_url>/media/catalog/category/CatGrd_Paint_ByPeriod_Victorian.jpg</image_url>
      <last_update>1692192383000</last_update>
      <blob>
        <url_key>victorian-paint-colours</url_key>
      </blob>
    </item>
    <item>
      <id>24</id>
      <title>1930s Paint Colours</title>
      <description></description>
      <image_url>/media/catalog/category/CatGrd_Paint_ByPeriod_1930s.jpg</image_url>
      <last_update>1692192445000</last_update>
      <blob>
        <url_key>1930s-paint-colours</url_key>
      </blob>
    </item>
    <item>
      <id>25</id>
      <title>1950s Paint Colours</title>
      <description></description>
      <image_url>/media/catalog/category/CatGrd_Paint_ByPeriod_1950s.jpg</image_url>
      <last_update>1692192471000</last_update>
      <blob>
        <url_key>1950s-paint-colours</url_key>
      </blob>
    </item>
    <item>
      <id>26</id>
      <title>1960s Paint Colours</title>
      <description></description>
      <image_url>/media/catalog/category/CatGrd_Paint_ByPeriod_1960s.jpg</image_url>
      <last_update>1692192516000</last_update>
      <blob>
        <url_key>1960s-paint-colours</url_key>
      </blob>
    </item>
    <item>
      <id>27</id>
      <title>1970s Paint Colours</title>
      <description></description>
      <image_url>/media/catalog/category/CatGrd_Paint_ByPeriod_1970s.jpg</image_url>
      <last_update>1692192555000</last_update>
      <blob>
        <url_key>1970s-paint-colours</url_key>
      </blob>
    </item>
    <item>
      <id>28</id>
      <title>Paint Finishes</title>
      <description></description>
      <image_url></image_url>
      <last_update>1692192864000</last_update>
      <blob>
        <url_key>finishes</url_key>
      </blob>
    </item>
    <item>
      <id>29</id>
      <title>Interior Paint Finishes</title>
      <description></description>
      <image_url></image_url>
      <last_update>1692955339000</last_update>
      <blob>
        <url_key>interior-paint-finishes</url_key>
      </blob>
    </item>
    <item>
      <id>30</id>
      <title>Exterior Paint Finishes</title>
      <description></description>
      <image_url></image_url>
      <last_update>1743428788000</last_update>
      <blob>
        <url_key>exterior-paint-finishes</url_key>
      </blob>
    </item>
    <item>
      <id>31</id>
      <title>Primers &amp; Undercoats</title>
      <description></description>
      <image_url></image_url>
      <last_update>1646740105000</last_update>
      <blob>
        <url_key>primers-undercoats</url_key>
      </blob>
    </item>
    <item>
      <id>32</id>
      <title>Paint Sample Pots</title>
      <description></description>
      <image_url></image_url>
      <last_update>1694008345000</last_update>
      <blob>
        <url_key>sample-pots</url_key>
      </blob>
    </item>
    <item>
      <id>33</id>
      <title>Wallpaper</title>
      <description></description>
      <image_url></image_url>
      <last_update>1768812103000</last_update>
      <blob>
        <url_key>wallpaper</url_key>
      </blob>
    </item>
    <item>
      <id>34</id>
      <title>Wallpaper by Colour</title>
      <description></description>
      <image_url></image_url>
      <last_update>1692194076000</last_update>
      <blob>
        <url_key>colour</url_key>
      </blob>
    </item>
    <item>
      <id>35</id>
      <title>Neutral</title>
      <description></description>
      <image_url>/media/catalog/category/Neutral_1.jpg</image_url>
      <last_update>1726567067000</last_update>
      <blob>
        <url_key>neutral-wallpapers</url_key>
      </blob>
    </item>
    <item>
      <id>36</id>
      <title>Grey</title>
      <description></description>
      <image_url>/media/catalog/category/Grey_1.jpg</image_url>
      <last_update>1767886015000</last_update>
      <blob>
        <url_key>grey-wallpaper</url_key>
      </blob>
    </item>
    <item>
      <id>37</id>
      <title>Red</title>
      <description></description>
      <image_url>/media/catalog/category/tulip_red.jpg</image_url>
      <last_update>1729591825000</last_update>
      <blob>
        <url_key>red-wallpaper</url_key>
      </blob>
    </item>
    <item>
      <id>38</id>
      <title>Yellow</title>
      <description></description>
      <image_url>/media/catalog/category/Yellow_1.jpg</image_url>
      <last_update>1726569456000</last_update>
      <blob>
        <url_key>yellow-wallpapers</url_key>
      </blob>
    </item>
    <item>
      <id>39</id>
      <title>Green</title>
      <description></description>
      <image_url>/media/catalog/category/Green_1.jpg</image_url>
      <last_update>1726569483000</last_update>
      <blob>
        <url_key>green-wallpapers</url_key>
      </blob>
    </item>
    <item>
      <id>40</id>
      <title>Blue</title>
      <description></description>
      <image_url>/media/catalog/category/Blue.jpg</image_url>
      <last_update>1726569500000</last_update>
      <blob>
        <url_key>blue-wallpaper</url_key>
      </blob>
    </item>
    <item>
      <id>41</id>
      <title>Pink</title>
      <description></description>
      <image_url>/media/catalog/category/Pink_1.jpg</image_url>
      <last_update>1726569529000</last_update>
      <blob>
        <url_key>pink-wallpaper</url_key>
      </blob>
    </item>
    <item>
      <id>42</id>
      <title>Black</title>
      <description></description>
      <image_url>/media/catalog/category/Black-325x481px.jpg</image_url>
      <last_update>1693408397000</last_update>
      <blob>
        <url_key>black-wallpapers</url_key>
      </blob>
    </item>
    <item>
      <id>43</id>
      <title>Wallpapers by Style</title>
      <description></description>
      <image_url></image_url>
      <last_update>1692194623000</last_update>
      <blob>
        <url_key>style</url_key>
      </blob>
    </item>
    <item>
      <id>44</id>
      <title>Floral Wallpapers</title>
      <description></description>
      <image_url>/media/catalog/category/Floral.jpg</image_url>
      <last_update>1726569568000</last_update>
      <blob>
        <url_key>wallpaper-style-floral-wallpaper</url_key>
      </blob>
    </item>
    <item>
      <id>45</id>
      <title>Metallic Wallpapers</title>
      <description></description>
      <image_url>/media/catalog/category/Metallic.jpg</image_url>
      <last_update>1734082465000</last_update>
      <blob>
        <url_key>metallic-wallpapers</url_key>
      </blob>
    </item>
    <item>
      <id>46</id>
      <title>Classical Wallpapers</title>
      <description></description>
      <image_url>/media/catalog/category/Classical.jpg</image_url>
      <last_update>1726569612000</last_update>
      <blob>
        <url_key>classical-wallpapers</url_key>
      </blob>
    </item>
    <item>
      <id>47</id>
      <title>Damask Wallpapers</title>
      <description></description>
      <image_url>/media/catalog/category/Damask.jpg</image_url>
      <last_update>1726569636000</last_update>
      <blob>
        <url_key>damask-wallpaper</url_key>
      </blob>
    </item>
    <item>
      <id>48</id>
      <title>Geometric Wallpapers</title>
      <description></description>
      <image_url>/media/catalog/category/Geometric.jpg</image_url>
      <last_update>1726569654000</last_update>
      <blob>
        <url_key>geometric</url_key>
      </blob>
    </item>
    <item>
      <id>49</id>
      <title>Striped Wallpapers</title>
      <description></description>
      <image_url>/media/catalog/category/Striped.jpg</image_url>
      <last_update>1726580981000</last_update>
      <blob>
        <url_key>striped</url_key>
      </blob>
    </item>
    <item>
      <id>50</id>
      <title>Small Print Wallpapers</title>
      <description></description>
      <image_url>/media/catalog/category/Small_Print.jpg</image_url>
      <last_update>1726569680000</last_update>
      <blob>
        <url_key>small-print</url_key>
      </blob>
    </item>
  </results>
</response>
`;

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
    res.type('application/xml');
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
