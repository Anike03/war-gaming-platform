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
          <li>Logos, trademarks, and branding</li>
          <li>Software code and platform architecture</li>
          <li>Documentation and support materials</li>
        </ul>
        <p>are the property of WAR Gaming Inc. and are protected by intellectual property laws.</p>
        
        <h4>User Content</h4>
        <p>By posting content on our platform, you grant us a license to:</p>
        <ul>
          <li>Display and distribute your content within the platform</li>
          <li>Modify and adapt content for technical purposes</li>
          <li>Use your content for platform operation and improvement</li>
        </ul>
        <p>You retain ownership of your original content while granting us these usage rights.</p>
      `
    },
    {
      icon: <AlertTriangle size={24} />,
      title: "Limitation of Liability",
      content: `
        <p>To the maximum extent permitted by law:</p>
        
        <h4>Service Availability</h4>
        <p>We provide WAR on an "as is" and "as available" basis. We do not guarantee:</p>
        <ul>
          <li>Uninterrupted or error-free service</li>
          <li>Immediate resolution of technical issues</li>
          <li>Availability of specific games or features</li>
          <li>Accuracy of leaderboard rankings in real-time</li>
        </ul>
        
        <h4>Damages</h4>
        <p>WAR Gaming Inc. shall not be liable for:</p>
        <ul>
          <li>Indirect, incidental, or consequential damages</li>
          <li>Loss of data, points, or account access</li>
          <li>Issues arising from third-party services</li>
          <li>User interactions or disputes</li>
          <li>Technical failures beyond our reasonable control</li>
        </ul>
      `
    },
    {
      icon: <Ban size={24} />,
      title: "Termination and Suspension",
      content: `
        <h4>User Termination</h4>
        <p>You may terminate your account at any time by:</p>
        <ul>
          <li>Contacting our support team</li>
          <li>Requesting account deletion</li>
          <li>Ceasing to use our platform</li>
        </ul>
        <p>Upon termination, your right to use WAR immediately ceases.</p>
        
        <h4>Platform Termination Rights</h4>
        <p>We may suspend or terminate your access if:</p>
        <ul>
          <li>You violate these Terms of Service</li>
          <li>We suspect fraudulent or abusive activity</li>
          <li>Required by law or legal process</li>
          <li>For platform security or maintenance reasons</li>
        </ul>
        
        <h4>Effect of Termination</h4>
        <p>Upon termination:</p>
        <ul>
          <li>All earned points are forfeited</li>
          <li>Pending reward redemptions may be cancelled</li>
          <li>Your profile and game data may be deleted</li>
          <li>Access to platform features is revoked</li>
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
        <h3>Quick Navigation</h3>
        <div className="nav-links">
          {sections.map((section, index) => (
            <a 
              key={index}
              href={`#section-${index}`}
              className="nav-link"
            >
              {section.icon}
              {section.title}
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
        <AlertTriangle size={32} className="notice-icon" />
        <div className="notice-content">
          <h3>Important Legal Notice</h3>
          <p>
            These Terms of Service constitute a legal agreement between you and WAR Gaming Inc. 
            By using our platform, you acknowledge that you have read, understood, and agree to be bound by these terms. 
            If you do not agree with any part of these terms, you must discontinue use of our services immediately.
          </p>
          <p>
            For questions about these terms, contact our legal team at 
            <a href="mailto:aniketsharma9360@gmail.com"> aniketsharma9360@gmail.com</a>.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="terms-contact">
        <div className="contact-card">
          <h3>Need Help Understanding Our Terms?</h3>
          <p>
            If you have questions about these Terms of Service or need clarification on any section, 
            our support team is here to help.
          </p>
          <div className="contact-actions">
            <a href="/contact" className="btn btn-primary">Contact Support</a>
            <a href="/help" className="btn btn-secondary">Visit Help Center</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;