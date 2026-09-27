const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser'); 
const { TwitterApi } = require('twitter-api-v2');

const { correctGrammar, validateContent } = require('./validation');
const { fetchEconomicTimesNews } = require('./newsScrapeer');
const { scrapeGoogleSearch } = require('./scrapeGoogleSearch');
const { fetchNews } = require('./fetchNews');
//const { scrapeNews } = require('./nnnn');

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json()); 


// Re-added: Twitter API initialization
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});
const rwClient = twitterClient.readWrite;


app.post('/correctGrammar', async (req, res) => {
  const { content, language } = req.body;

  if (!content || !language) {
    return res.status(400).json({ error: 'Content and language are required.' });
  }

  try {
    const correctedContent = await correctGrammar(content, language);
    res.json({ correctedContent });
  } catch (error) {
    console.error('Error in /correctGrammar endpoint:', error.message);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

// Endpoint to validate content
app.post('/validate', async (req, res) => {
  const { correctedContent, outputLanguage } = req.body;

  if (!correctedContent || !outputLanguage) {
    return res.status(400).json({ error: 'Corrected content and outputLanguage are required.' });
  }

  console.log('Validating content:', correctedContent);

  try {
    const result = await validateContent(correctedContent, outputLanguage);
    console.log('Validation Result:', result);
    res.json(result);
  } catch (error) {
    console.error('Error in /validate endpoint:', error.message);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});


app.get('/news/economic-times', async (req, res) => {
  try {
    const category = req.query.category || 'All';
    const news = await fetchEconomicTimesNews(category);
    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});


app.get('/news/fetch', async (req, res) => {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({ error: 'Title query parameter is required.' });
  }

  try {
    const articles = await scrapeNews(title);
    res.json({ articles });
  } catch (error) {
    console.error('Error in /news/fetch endpoint:', error.message);
    res.status(500).json({ error: 'Failed to fetch news articles.' });
  }
});


app.get('/scrape/google', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required.' });
  }

  try {
    const results = await scrapeGoogleSearch(query);
    res.json({ results });
  } catch (error) {
    console.error('Error in /scrape/google endpoint:', error.message);
    res.status(500).json({ error: 'Failed to scrape Google search results.' });
  }
});

// Restored: /scrape-tweet endpoint
app.post('/scrape-tweet', async (req, res) => {
  try {
    const { tweetUrl } = req.body;

    const tweetIdMatch = tweetUrl.match(/status\/(\d+)/);
    if (!tweetIdMatch) {
      return res.status(400).json({ error: 'Invalid Tweet URL' });
    }
    const tweetId = tweetIdMatch[1];

    const tweet = await rwClient.v2.singleTweet(tweetId, {
      expansions: 'attachments.media_keys',
      'media.fields': 'url',
      'tweet.fields': 'text',
    });

    const caption = tweet.data.text;

    const media = tweet.includes?.media?.[0];
    const imageUrl = media?.url || null;

    res.json({ caption, imageUrl });
  } catch (error) {
    console.error('Error in /scrape-tweet endpoint:', error.message);
    res.status(500).json({ error: 'Failed to scrape tweet.' });
  }
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
