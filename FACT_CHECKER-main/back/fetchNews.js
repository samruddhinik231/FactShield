const axios = require('axios');
const puppeteer = require('puppeteer');

async function fetchNews(title) {
  console.log('Fetching news for title:', title);

  try {
    const response = await axios.get('https://newsdata.io/api/1/latest', {
      params: {
        apikey: process.env.NEWSDATA_API_KEY,
        q: title,
        language: 'en',
      },
    });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch news: ${response.status}`);
    }

    if (!response.data.results || response.data.results.length === 0) {
      console.log('No articles found for this query.');
      return [];
    }

   
    const articles = response.data.results.map((article) => ({
      title: article.title,
      description: article.description,
      url: article.link,
      urlToImage: article.image_url,
      pubDate: article.pubDate,
      publisher: article.source_name || 'Unknown',  
    }));

    console.log(articles);

    return articles;
  } catch (error) {
    console.error('Error fetching news from NewsData.io:', error.response ? error.response.data : error.message);
    throw new Error('Failed to fetch news articles from NewsData.io.');
  }
}

module.exports = { fetchNews };
