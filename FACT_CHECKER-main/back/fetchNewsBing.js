const puppeteer = require('puppeteer');

// Function to scrape detailed news data
async function scrapeNews(topic) {
    const encodedTopic = encodeURIComponent(topic);
    const url = `https://www.bing.com/news/search?q=${encodedTopic}&FORM=HDRSC6`;

    try {
        // Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        // Set user-agent to mimic a real browser
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        );

        // Go to the Bing News page
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Scrape the news data
        const newsData = await page.evaluate(() => {
            const articles = [];
            const articleElements = document.querySelectorAll('.news-card'); // Update the selector if required

            articleElements.forEach(article => {
                const title = article.querySelector('a.title')?.innerText || null;
                const description = article.querySelector('.snippet')?.innerText || null;
                const url = article.querySelector('a.title')?.href || null;
                const urlToImage = article.querySelector('img')?.src || null;
                const pubDate = article.querySelector('.source')?.innerText.split('·')[1]?.trim() || null; // Example: "CNN · 2h ago"
                const publisher = article.querySelector('.source')?.innerText.split('·')[0]?.trim() || null;

                if (title && url) {
                    articles.push({
                        title,
                        description,
                        url,
                        urlToImage,
                        pubDate,
                        publisher,
                    });
                }
            });

            return articles;
        });

        // Close the browser
        await browser.close();

        // Print the results in JSON format
        console.log(JSON.stringify(newsData, null, 2));
        return newsData;

    } catch (error) {
        console.error("Error fetching news:", error.message);
        return [];
    }
}

module.exports = { scrapeNews };