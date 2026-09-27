const puppeteer = require('puppeteer');
const { URL } = require('url');

async function scrapeGoogleSearch(query) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    try {
        await page.goto('https://www.google.com/search?q=' + encodeURIComponent(query), {
            waitUntil: 'domcontentloaded',
        });

        // Wait for search result elements
        await page.waitForSelector('h3', { timeout: 60000 });
        console.log("Found search results!");

        const resultData = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('h3'));
            return links.slice(0, 5).map(link => {
                const anchor = link.parentElement;
                const href = anchor ? anchor.href : '';
                const websiteName = href ? new URL(href).hostname.replace('www.', '') : '';
                return {
                    url: href,
                    websiteName: websiteName,
                };
            });
        });

        const resultsWithDetails = [];
        for (const result of resultData) {
            const { url, websiteName } = result;
            if (!url) continue;

            try {
                const newPage = await browser.newPage();
                await newPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

                const pageData = await newPage.evaluate(() => {
                    // Get the page heading (<h1>)
                    const pageHeading = document.querySelector('h1')?.textContent || 'No Heading';

                    return {
                        pageHeading,
                    };
                });

                resultsWithDetails.push({
                    url,
                    websiteName,
                    pageHeading: pageData.pageHeading,
                });

                await newPage.close();
            } catch (error) {
                console.log(`Error scraping ${url}:`, error.message);
            }
        }

        await browser.close();
        return resultsWithDetails.filter(data => data.url && data.websiteName);
    } catch (error) {
        console.error("Error scraping Google search:", error.message);
        await browser.close();
        throw new Error('Failed to scrape Google search results. Please check the query or the page structure.');
    }
}

module.exports = { scrapeGoogleSearch };
