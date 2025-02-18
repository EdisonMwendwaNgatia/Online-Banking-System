import React from 'react';
import { Link } from 'react-router-dom';
import './landingpage.css'; // Import the external CSS

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="logo-container">
          <img src="/images/bank-logo.jpeg" alt="SimpleBank Logo" className="logo" />
          <span className="bank-name">SimpleBank</span>
        </div>
        <div className="button-container">
          <Link to="/login">
            <button className="button">Login</button>
          </Link>
          <Link to="/register">
            <button className="button">Register</button>
          </Link>
        </div>
      </div>

      {/* Description Section */}
      <div className="description-section">
        <h1>Welcome to Simple Bank</h1>
        <p>
          SimpleBank is your trusted partner in managing your finances with ease and security. 
          We offer a wide range of services, including savings accounts, loans, and virtual cards. 
          Our user-friendly platform ensures seamless transactions and 24/7 access to your funds. 
          With state-of-the-art security measures, your money is always safe with us. 
          Join SimpleBank today and experience banking made simple.
        </p>
      </div>

      {/* Bank Cards Section */}
      <div className="cards-section">
        <div className="card">
          <img src="/images/gold-card.jpeg" alt="Gold Card" className="card-image" />
          <h3>Gold Card</h3>
          <p>Enjoy exclusive benefits with the Gold Card. It offers premium services, higher transaction limits, and more rewards!</p>
        </div>
        <div className="card">
          <img src="/images/silver-card.jpeg" alt="Silver Card" className="card-image" />
          <h3>Silver Card</h3>
          <p>The Silver Card is perfect for regular users. It comes with essential benefits and an affordable fee structure.</p>
        </div>
        <div className="card">
          <img src="/images/bronze-card.jpeg" alt="Bronze Card" className="card-image" />
          <h3>Bronze Card</h3>
          <p>The Bronze Card is ideal for new customers who want to start their banking journey with low fees and essential features.</p>
        </div>
      </div>

      {/* Animations Section */}
      <div className="animations-section">
        <div className="animation-item">
          <img src="/images/loan-icon.jpeg" alt="Loan Icon" className="icon" />
          <h3>Fast Loans</h3>
          <p>Get approved for loans in minutes with our streamlined process. Simple terms and fast disbursement make borrowing easy.</p>
        </div>
        <div className="animation-item">
          <img src="/images/security-icon.jpeg" alt="Security Icon" className="icon" />
          <h3>Advanced Security</h3>
          <p>We use the latest security technologies to protect your money and personal information, ensuring peace of mind.</p>
        </div>
        <div className="animation-item">
          <img src="/images/support-icon.jpeg" alt="Support Icon" className="icon" />
          <h3>24/7 Customer Support</h3>
          <p>Our dedicated support team is always available to assist you with any questions or issues, anytime, anywhere.</p>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <p>Contact Us: info@simplebank.com | +123 456 7890</p>
        <p>Location: 123 Simple Street, Simple City, SC 12345</p>
        <p>© 2023 SimpleBank. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LandingPage;
