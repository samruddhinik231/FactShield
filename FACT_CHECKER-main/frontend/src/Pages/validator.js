import React, { useState } from "react";
import axios from "axios";
import Tesseract from "tesseract.js";
import RelatedLinks from "../Components/RelatedLinkCard";
import NewsArticles from "../Components/NewsArticles";
import "./validate.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Validator = () => {
  const [content, setContent] = useState("");
  const [correctedContent, setCorrectedContent] = useState("");
  const [result, setResult] = useState(null);
  const [googleResults, setGoogleResults] = useState([]);
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [outputLanguage, setOutputLanguage] = useState("english");
  const [isValidated, setIsValidated] = useState(false);  // New state for button visibility

  // Handle language change
  const handleLanguageChange = (e) => {
    setOutputLanguage(e.target.value);
  };

  // Handle grammar correction
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

  // Handle content validation
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

  const handleGoogleScrape = async (query) => {
    setError(null);
    try {
      const response = await axios.get("http://localhost:5001/scrape/google", {
        params: { query },
      });
      setGoogleResults(response.data.results);
      return response.data.results;
    } catch (error) {
     // setError("that realated content not available in google.");
      console.error(error);
      throw error;
    }
  };

  const handleFetchNews = async (title) => {
    setError(null);
    try {
      const truncatedTitle = title.length > 512 ? title.substring(0, 512) : title;

      const response = await axios.get("http://localhost:5001/news/fetch", {
        params: { title: truncatedTitle },
      });
      setNewsArticles(response.data.articles);
      return response.data.articles;
    } catch (error) {
      setError("Failed to fetch news articles.");
      console.error(error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCorrectedContent("");
    setResult(null);
    setGoogleResults([]);
    setNewsArticles([]);
    setError(null);
    setLoading(true);
    setIsValidated(false);  // Hide reset button initially

    try {
      const correctedText = await handleCorrectGrammar();
      if (correctedText) {
        const validationResult = await handleValidateContent(correctedText);

        if (validationResult?.trueOrFalse) {
          const googleResults = await handleGoogleScrape(correctedText);
          if (googleResults?.length > 0) {
            const resultTitle = validationResult.title;
            if (resultTitle) {
              await handleFetchNews(resultTitle);
            } else {
              setError("No title found to fetch related news.");
            }
          }
        }
      } else {
        setError("No content to validate.");
      }
    } catch (err) {
      //setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
      setIsValidated(true);  // Show reset button after validation
    }
  };

  // Handle content change in textarea
  const handleContentChange = (e) => {
    setContent(e.target.value);
    setCorrectedContent("");
    setResult(null);
  };

  // Handle image upload and text extraction via OCR
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (file && allowedTypes.includes(file.type)) {
      setUploadedImage(URL.createObjectURL(file));
      setContent("");
      setImageLoading(true);
      setError(null);

      Tesseract.recognize(file, "eng+mar+hin", {
        logger: (info) => {
          if (info.status === "recognizing text") {
            setOcrProgress(Math.round(info.progress * 100));
          }
        },
      })
        .then(({ data: { text } }) => {
          setContent(text.trim());
        })
        .catch(() => {
          setError("Failed to extract text from the image. Please try again.");
        })
        .finally(() => {
          setImageLoading(false);
          setOcrProgress(0);
        });
    } else {
      setError("Please upload a valid image file (JPEG/PNG).");
    }
  };

  // Refresh the entire page
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <section className="InputFiled">
      <div className="title  col-md-12">
          <h1 className="validator-title ">Fact Check</h1>
          <h5 className="TitlePage">Verify images text information or text to be fact-checked</h5>
        </div>

      <div className="container">
         
        <div className="row InputSection">
          <div className="inputDiv col-md-6">
            <input
              type="file"
              className="form-control file-input"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={imageLoading || loading}
            />
            {imageLoading && (
              <div className="loading-container">
                <p>Extracting text from image... {ocrProgress}%</p>
                <div className="progress mb-3">
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated "
                    role="progressbar"
                    style={{ width: `${ocrProgress}%` }}
                  >
                    {ocrProgress}%
                  </div>
                </div>
              </div>
            )}
            <textarea
              className="form-control text-area"
              placeholder="Enter statement here or use extracted text"
              value={content}
              onChange={handleContentChange}
              rows="6"
            />
            <div className="language-select-container">
              <label htmlFor="outputLanguage" className="form-label">
                Select Output Language:
              </label>
              <select
                id="outputLanguage"
                className="form-select language-select"
                value={outputLanguage}
                onChange={handleLanguageChange}
                disabled={loading || imageLoading}
              >
                <option value="english">English</option>
                <option value="marathi">Marathi</option>
                <option value="hindi">Hindi</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn valiadateBtn submit-button"
              disabled={loading || imageLoading || !content.trim()}
              onClick={handleSubmit}
            >
              {loading ? "Processing..." : "Check Fact"}
            </button>

            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </div>

          <div className="col-md-6 image-preview-container">
            {uploadedImage && (
              <img
                src={uploadedImage}
                alt="Uploaded Preview"
                className="img-fluid preview-image"
              />
            )}
          </div>
        </div>

        {correctedContent && (
          <div className="row corrected-text-container">
            <div className="col-12">
              <h5 className="">Corrected Text:</h5>
              <p>{correctedContent}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="row validation-result-container">
            <div className="col-12">
              <h3>Validation Result</h3>
              <div className="validation-title">
                <h5>Title: {result.title}</h5>
              </div>
              <div className="validation-status">
                <strong>Truthfulness Assessment:</strong> {result.trueOrFalse}
              </div>
              <div className="accuracy-container">
                <strong>Accuracy:</strong>
                <div className="progress">
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${result.accuracy}%` }}
                  >
                    {result.accuracy}%
                  </div>
                </div>
              </div>
              <div className="evidence-container">
                <h5>Evidence:</h5>
                <p>{result.evidence}</p>
              </div>
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
    </section>
  );
};

export default Validator;
