import React, { useState, useEffect } from "react";
import axios from "axios";
import RelatedLinks from "../Components/RelatedLinkCard";
import NewsArticles from "../Components/NewsArticles";
import "../Components/UrlContent.css";
import "bootstrap/dist/css/bootstrap.min.css";

const UrlContentFact = () => {
  const [tweetUrl, setTweetUrl] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [correctedContent, setCorrectedContent] = useState("");
  const [result, setResult] = useState(null);
  const [googleResults, setGoogleResults] = useState([]);
  const [newsArticles, setNewsArticles] = useState([]);
  const [outputLanguage, setOutputLanguage] = useState("english");
  const [isValidated, setIsValidated] = useState(false);

  const handleScrape = async () => {
    setError("");
    setData(null);

    if (!tweetUrl.trim()) {
      setError("Please enter a valid Tweet URL.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5001/scrape-tweet", { tweetUrl });
      setData(response.data);
      setContent(response.data.caption || "");
    } catch (err) {
      setError("Failed to fetch tweet details. Please check the URL or try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleValidateContent = async (correctedText) => {
    setError(null);
    try {
      const response = await axios.post("http://localhost:5001/validate", {
        correctedContent: correctedText,
        outputLanguage,
      });

      const validationResult = response.data;
      setResult({
        title: validationResult.title,
        statement: validationResult.statement,
        trueOrFalse: validationResult.trueOrFalse,
        accuracy: validationResult.accuracy,
        evidence: validationResult.evidence,
        relatedLinks: validationResult.relatedLinks,
      });

      return validationResult;
    } catch (error) {
      setError("An error occurred while processing your request.");
      console.error(error);
      throw error;
    }
  };

  const handleCorrectGrammar = async () => {
    setError(null);
    try {
      const response = await axios.post("http://localhost:5001/correctGrammar", {
        content,
        language: outputLanguage,
      });
      const correctedText = response.data.correctedContent;
      setCorrectedContent(correctedText);
      return correctedText;
    } catch (err) {
      setError("Failed to correct grammar. Please try again.");
      throw err;
    }
  };

  const handleGoogleScrape = async (query) => {
    setError(null);
    try {
      const response = await axios.get("http://localhost:5001/scrape/google", {
        params: { query },
      });
      setGoogleResults(response.data.results);
    } catch (error) {
      setError("No related content available on Google.");
      console.error(error);
    }
  };

  const handleFetchNews = async (title) => {
    setError(null);
    try {
      const truncatedTitle = title.length > 512 ? title.substring(0, 512) : title;

      const response = await axios.get("http://localhost:5001/news/fetch", {
        params: { title: truncatedTitle },
      });

      console.log("Fetched News Articles:", response.data); // Debugging log
      setNewsArticles(response.data.articles);
      return response.data.articles;
    } catch (error) {
      setError("Failed to fetch news articles.");
      console.error(error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCorrectedContent("");
    setResult(null);
    setGoogleResults([]);
    setNewsArticles([]);
    setError(null);
    setLoading(true);
    setIsValidated(false);

    try {
      const correctedText = await handleCorrectGrammar();
      if (correctedText) {
        const validationResult = await handleValidateContent(correctedText);

        if (validationResult?.trueOrFalse) {
          await handleGoogleScrape(correctedText);
          const resultTitle = validationResult.title;
          if (resultTitle) {
            await handleFetchNews(resultTitle);
          } else {
            setError("No title found to fetch related news.");
          }
        }
      } else {
        setError("No content to validate.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsValidated(true);
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="container-fluid">
      <div className="title col-md-12">
        <h1 className="validator-title1">Post Caption Text Validation</h1>
        <h5 className="TitlePage">Verify URL Caption-Text</h5>
      </div>

      <div className="container">
        <div className="inputDiv col-md-6">
          <input
            type="text"
            value={tweetUrl}
            onChange={(e) => setTweetUrl(e.target.value)}
            placeholder="Enter URL..."
            className="input col-md-12"
          />
          <button onClick={handleScrape} className="btn Scarpurl mb-3" disabled={loading}>
            {loading ? "Scraping..." : "Scrape Tweet"}
          </button>
          {error && <p className="error">{error}</p>}

          <textarea
            className="form-control textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter or correct the text"
            rows="6"
          />

          <button
            onClick={handleSubmit}
            className="btn valiadateBtn"
            disabled={loading || !content.trim()}
          >
            {loading ? "Processing..." : "Validate Content"}
          </button>
        </div>

        {correctedContent && (
          <div className="row corrected-text-container">
            <div className="col-12">
              <h5>Corrected Text:</h5>
              <p>{correctedContent}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="row validation-result-container">
            <div className="col-12">
              <h3>Validation Result</h3>
              <h5>Title: {result.title}</h5>
              <strong>Truthfulness Assessment:</strong> {result.trueOrFalse}
              <div className="progress">
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${result.accuracy}%` }}
                >
                  {result.accuracy}%
                </div>
              </div>
              <h5>Evidence:</h5>
              <p>{result.evidence}</p>
            </div>
          </div>
        )}

        {googleResults.length > 0 && (
          <div className="google-results-container">
            <RelatedLinks links={googleResults} />
          </div>
        )}

        {newsArticles.length > 0 && (
          <div className="news-articles-container">
            <h3 className="relatedNews">Related News Articles</h3>
            <NewsArticles news={newsArticles} />
          </div>
        )}

        {isValidated && (
          <button
            type="button"
            className="btn btn-secondary mt-3 refresh-button"
            style={{ fontSize: "14px", width: "150px", margin: "0 auto", display: "block" }}
            onClick={refreshPage}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default UrlContentFact;
