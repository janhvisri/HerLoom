import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h2>HerLoom</h2>
          <p>
            Your ultimate destination for curated fashion, premium accessories, and the latest electronics. Handpicked with love in a premium experience.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/shop">Shop Catalog</Link>
            </li>
            <li>
              <Link to="/cart">My Cart</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: srivastavjanhvi75@gmail.com</p>
          <p>Phone: +91 9119686926</p>
          <p>Delhi NCR, India</p>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="social-link"
          >
            Facebook
          </a>
          <br />
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="social-link"
          >
            Instagram
          </a>
          <br />
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="social-link"
          >
            Twitter
          </a>
        </div>
      </div>

      <p className="footer-bottom">
        © {new Date().getFullYear()} HerLoom E-Commerce. Made with 💕 for Janhvi.
      </p>
    </footer>
  );
};

export default Footer;