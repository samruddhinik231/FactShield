import React from "react";
import "./RelatedLink.css";

const RelatedLinks = ({ links }) => {
  return (
    <div className="related-links-container">
      <h4 className="related-links-title">Related Links</h4>
      <ul className="related-links-list">
        {links.map((link, index) => (
          <li key={index} className="related-link-item">
            <div className="link-details">
              <h5 className="link-heading">
                {link.pageHeading || "No Heading"}
              </h5>
              <p className="link-meta">
                <span className="website-name">{link.websiteName}</span>
                <br />
                {/* <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-url"
                >
                  {link.url}
                </a> */}
              </p>
            </div>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="open-link-button"
            >
             Learn More
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedLinks;
