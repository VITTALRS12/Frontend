import React from "react";
import "./Footer.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-columns">
        <div>
          <h4>ABOUT</h4>
          <ul>
            <li>Contact Us</li>
            <li>About Us</li>
            <li>Careers</li>
            <li>Flipkart Stories</li>
            <li>Press</li>
            <li>Corporate Information</li>
          </ul>
        </div>
        <div>
          <h4>GROUP COMPANIES</h4>
          <ul>
            <li>Myntra</li>
            <li>Cleartrip</li>
            <li>Shopsy</li>
          </ul>
        </div>
        <div>
          <h4>HELP</h4>
          <ul>
            <li>Payments</li>
            <li>Shipping</li>
            <li>Cancellation & Returns</li>
            <li>FAQ</li>
          </ul>
        </div>
        <div>
          <h4>CONSUMER POLICY</h4>
          <ul>
            <li>Cancellation & Returns</li>
            <li>Terms Of Use</li>
            <li>Security</li>
            <li>Privacy</li>
            <li>Sitemap</li>
            <li>Grievance Redressal</li>
            <li>EPR Compliance</li>
          </ul>
        </div>
        <div className="footer-address">
          <h4>Mail Us:</h4>
          <p>
            Flipkart Internet Private Limited,<br />
            Buildings Alyssa, Begonia & Clove Embassy Tech Village,<br />
            Outer Ring Road, Devarabeesanahalli Village,<br />
            Bengaluru, 560103,<br />
            Karnataka, India
          </p>
        </div>
        <div className="footer-address">
          <h4>Registered Office Address:</h4>
          <p>
            Flipkart Internet Private Limited,<br />
            Buildings Alyssa, Begonia & Clove Embassy Tech Village,<br />
            Outer Ring Road, Devarabeesanahalli Village,<br />
            Bengaluru, 560103,<br />
            Karnataka, India<br />
            CIN : U51109KA2012PTC066107<br />
            Telephone: <a href="tel:04445614700">044-45614700</a> /
            <a href="tel:04467415800"> 044-67415800</a>
          </p>
          <div className="social-icons">
            <FaFacebookF />
            <FaTwitter />
            <FaYoutube />
            <FaInstagram />
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="bottom-links">
          <span>Become a Seller</span>
          <span>Advertise</span>
          <span>Gift Cards</span>
          <span>Help Center</span>
        </div>
        <p>© 2007-{new Date().getFullYear()} Zoocart.com</p>
      </div>
    </footer>
  );
}
