// src/pages/Terms.jsx
import React from 'react';
import { Shield, AlertTriangle, Book, Users, Gift, Ban } from 'lucide-react';
import '../styles/terms.css';

const Terms = () => {
  const lastUpdated = "December 1, 2024";

  const sections = [
    {
      icon: <Book size={24} />,
      title: "Acceptance of Terms",
      content: `
        <p>By accessing or using the WAR (Win & Rule) platform, you agree to be bound by these Terms of Service and our Privacy Policy. If you disagree with any part of these terms, you may not access our platform.</p>
        
        <h4>Eligibility</h4>
        <p>To use WAR, you must:</p>
        <ul>
          <li>Be at least 13 years of age</li>
          <li>Have the legal capacity to enter into agreements</li>
          <li>Provide accurate and complete registration information</li>
          <li>Maintain the security of your account credentials</li>
        </ul>
        
        <p>We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance of the modified terms.</p>
      `
    },
    {
      icon: <Users size={24} />,
      title: "User Accounts and Responsibilities",
      content: `
        <h4>Account Creation</h4>
        <p>When creating an account, you agree to:</p>
        <ul>
          <li>Provide accurate and current information</li>
          <li>Maintain and update your information as needed</li>
          <li>Keep your password secure and confidential</li>
          <li>Notify us immediately of any unauthorized access</li>
        </ul>
        
        <h4>Prohibited Activities</h4>
        <p>You may not:</p>
        <ul>
          <li>Use another user's account without permission</li>
          <li>Attempt to circumvent platform security measures</li>
          <li>Use automated systems or bots to play games</li>
          <li>Engage in cheating, hacking, or exploitation of game mechanics</li>
          <li>Harass, threaten, or abuse other users</li>
          <li>Post inappropriate or offensive content</li>
          <li>Violate any applicable laws or regulations</li>
        </ul>
      `
    },
    {
      icon: <Gift size={24} />,
      title: "Points and Rewards System",
      content: `
        <h4>Points Earning</h4>
        <p>Points are earned through legitimate gameplay:</p>
        <ul>
          <li>Points are awarded based on game performance and difficulty</li>
          <li>We reserve the right to adjust point values and earning mechanisms</li>
          <li>Points have no monetary value and cannot be transferred or sold</li>
          <li>Points may be revoked for violations of these terms</li>
        </ul>
        
        <h4>Reward Redemption</h4>
        <p>When redeeming points for rewards:</p>
        <ul>
          <li>Rewards are subject to availability</li>
          <li>Redemption requests are processed within 24 hours</li>
          <li>We reserve the right to limit redemptions per user</li>
          <li>Gift cards are delivered electronically via email</li>
          <li>All redemptions are final and cannot be reversed</li>
        </ul>
        
        <h4>Reward Limitations</h4>
        <p>We are not responsible for:</p>
        <ul>
          <li>Gift card redemption issues with third-party merchants</li>
          <li>Lost or stolen gift card codes after delivery</li>
          <li>Changes in third-party gift card terms and conditions</li>
        </ul>
      `
    },
    {
      icon: <Shield size={24} />,
      title: "Intellectual Property",
      content: `
        <h4>Platform Content</h4>
        <p>All content on WAR, including but not limited to:</p>
        <ul>
          <li>Games, graphics, and user interfaces</li>
          <li>Logos, trademarks, and brand elements</li>
          <li>Software code and platform architecture</li>
          <li>Documentation and marketing materials</li>
        </ul>
        <p>is the property of WAR and protected by intellectual property laws.</p>
        
        <h4>User Content</h4>
        <p>By using our platform, you grant us a license to:</p>
        <ul>
          <li>Display your profile information and game statistics</li>
          <li>Showcase your scores on leaderboards</li>
          <li>Use anonymized data for platform improvement</li>
        </ul>
        
        <p>You retain ownership of your personal content while granting us necessary rights to operate the platform.</p>
      `
    },
    {
      icon: <AlertTriangle size={24} />,
      title: "Limitation of Liability",
      content: `
        <h4>Platform Availability</h4>
        <p>We strive to maintain 24/7 platform availability but cannot guarantee uninterrupted service. We may need to perform maintenance, updates, or address technical issues that may temporarily affect availability.</p>
        
        <h4>No Warranty</h4>
        <p>WAR is provided "as is" without warranties of any kind, either express or implied. We do not warrant that:</p>
        <ul>
          <li>The platform will meet your specific requirements</li>
          <li>Service will be uninterrupted, timely, or error-free</li>
          <li>Results obtained from using the platform will be accurate or reliable</li>
          <li>Any errors in the platform will be corrected</li>
        </ul>
        
        <h4>Liability Cap</h4>
        <p>To the maximum extent permitted by law, WAR shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the platform.</p>
      `
    },
    {
      icon: <Ban size={24} />,
      title: "Termination and Suspension",
      content: `
        <h4>User Termination</h4>
        <p>You may stop using our platform at any time. Account deletion requests can be made through the Contact Us page.</p>
        
        <h4>Platform Termination Rights</h4>
        <p>We may suspend or terminate your account if:</p>
        <ul>
          <li>You violate these Terms of Service</li>
          <li>We suspect fraudulent or abusive activity</li>
          <li>Required by law or legal process</li>
          <li>For platform security or integrity reasons</li>
        </ul>
        
        <h4>Effects of Termination</h4>
        <p>Upon termination:</p>
        <ul>
          <li>Your right to use the platform immediately ceases</li>
          <li>Any unused points will be forfeited</li>
          <li>Your profile and game data may be deleted</li>
          <li>Pending reward redemptions may be canceled</li>
        </ul>
      `
    }
  ];

  return (
    <div className="terms-container">
      {/* Header */}
      <div className="terms-header">
        <div className="terms-hero">
          <Shield size={48} className="terms-hero-icon" />
          <h1>Terms of Service</h1>
          <p className="last-updated">Last updated: {lastUpdated}</p>
        </div>
        <div className="terms-intro">
          <p>
            Welcome to WAR (Win & Rule)! These Terms of Service govern your use of our gaming platform. 
            Please read them carefully before using our services.
          </p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="terms-nav">
        <h3>Table of Contents</h3>
        <div className="nav-links">
          {sections.map((section, index) => (
            <a 
              key={index}
              href={`#section-${index}`}
              className="nav-link"
            >
              {section.icon}
              <span>{section.title}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Terms Sections */}
      <div className="terms-content">
        {sections.map((section, index) => (
          <section 
            key={index}
            id={`section-${index}`}
            className="terms-section"
          >
            <div className="section-header">
              <div className="section-icon">
                {section.icon}
              </div>
              <h2>{section.title}</h2>
            </div>
            <div 
              className="section-content"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </section>
        ))}
      </div>

      {/* Important Notice */}
      <div className="important-notice">
        <div className="notice-header">
          <AlertTriangle size={32} />
          <h3>Important Notice</h3>
        </div>
        <p>
          These Terms of Service constitute a legal agreement between you and WAR. 
          By using our platform, you acknowledge that you have read, understood, 
          and agree to be bound by these terms. If you do not agree with any part 
          of these terms, please discontinue use of our platform immediately.
        </p>
      </div>

      {/* Contact Section */}
      <div className="terms-contact">
        <div className="contact-card">
          <h3>Questions About Our Terms?</h3>
          <p>
            If you have any questions or concerns about these Terms of Service, 
            please contact our legal team for clarification.
          </p>
          <button className="btn btn-primary">Contact Legal Team</button>
        </div>
      </div>
    </div>
  );
};

export default Terms;