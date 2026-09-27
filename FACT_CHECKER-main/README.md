# AI Fact-Checker Platform (Backend)

An automated backend service designed to combat misinformation on social media by evaluating the truthfulness of online claims. Built with Node.js and Express, this platform utilizes web scraping (Puppeteer) and Large Language Models (OpenAI) to extract, process, and cross-reference news from multiple sources.

## Core Features

*   **AI Claim Validation:** Integrates with OpenAI (gpt-4o-mini) to evaluate statements, provide accuracy percentages, and generate evidence-based reasoning for whether a claim is True, False, or Partially True.
*   **Automated Web Scraping:** Utilizes headless browsing via Puppeteer to scrape live news data and search results from Google, Bing, and The Economic Times.
*   **Social Media Integration:** Connects directly to the Twitter API v2 to extract tweet captions and media URLs for real-time validation.
*   **Grammar & NLP Processing:** Features a grammar correction pipeline to clean scraped social media text before passing it to the validation engine.

## Tech Stack

*   **Framework:** Node.js, Express.js
*   **Web Scraping:** Puppeteer, Cheerio, Axios
*   **APIs:** OpenAI API, Twitter API v2, NewsData.io
*   **Security:** `dotenv` for environment variable management

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/samruddhinik231/Fact-Checker.git](https://github.com/samruddhinik231/Fact-Checker.git)
   cd Fact-Checker/back
