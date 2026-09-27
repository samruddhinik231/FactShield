import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import logo from "../Images/logo.png"; // Import the logo image
import './Header.css'; // Import custom CSS (if any)
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JS for toggle functionality

const Header = () => {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <div className="container">
          {/* Logo */}
          <a className="navbar-brand logo-name" href="/">
          <img src={logo} alt="Logo" className="custom-logo" />
            Fact Check
          </a>
          {/* Mobile Menu Toggle */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          {/* Collapsible Navigation Links */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/">
                  Validation
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
