const puppeteer = require('puppeteer');

async function fetchEconomicTimesNews(category = 'All') {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'], 
    });

    const page = await browser.newPage();

  
    const categoryURLs = {
      All: 'https://economictimes.indiatimes.com/news/india',
      Sports: 'https://economictimes.indiatimes.com/news/sports',
      Entertainment: 'https://economictimes.indiatimes.com/industry/media-/-entertainment/entertainment',
      International: 'https://economictimes.indiatimes.com/news/international/global-trends',
    };

   
    const url = categoryURLs[category] || categoryURLs['All'];

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
    });

   
    const newsData = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.eachStory')).map((story) => {
        const heading = story.querySelector('h3 a, h4 a')?.innerText || 'No headline'; 
        const image = story.querySelector('img')?.src || 'No image';
        const paragraph = story.querySelector('p')?.innerText || 'No description';
        const link = story.querySelector('h3 a, h4 a')?.href || 'No link'; 
        return { heading, image, paragraph, link };
      });
    });
    
    await browser.close();
    return newsData;
  } catch (error) {
    console.error('Error fetching news data:', error.message);
    throw new Error('Failed to fetch news');
  }
}

module.exports = { fetchEconomicTimesNews };
