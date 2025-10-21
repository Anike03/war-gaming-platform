// src/pages/Privacy.jsx
import React from 'react';
import { Shield, Eye, Database, UserCheck, Lock, Mail } from 'lucide-react';
import '../styles/privacy.css';

const Privacy = () => {
  const lastUpdated = "October 21, 2025";

  const sections = [
    {
      icon: <Eye size={24} />,
      title: "Information We Collect",
      content: `
        <h4>Personal Information</h4>
        <p>When you register for WAR, we collect:</p>
        <ul>
          <li>Email address</li>
          <li>Display name</li>
          <li>Password (encrypted)</li>
          <li>Optional profile information (bio, hobbies, date of birth)</li>
        </ul>
        
        <h4>Game Data</h4>
        <p>We collect information about your gaming activity:</p>
        <ul>
          <li>Game scores and performance</li>
          <li>Points earned and redeemed</li>
          <li>Game preferences and play history</li>
          <li>Leaderboard rankings</li>
        </ul>
        
        <h4>Technical Information</h4>
        <p>Automatically collected data includes:</p>
        <ul>
          <li>IP address and browser type</li>
          <li>Device information</li>
          <li>Cookies and usage data</li>
        </ul>
      `
    },
    {
      icon: <Database size={24} />,
      title: "How We Use Your Information",
      content: `
        <p>We use your information to:</p>
        <ul>
          <li>Provide and improve our gaming services</li>
          <li>Process point redemptions and deliver rewards</li>
          <li>Maintain leaderboards and competitive features</li>
          <li>Send important updates and notifications</li>
          <li>Ensure platform security and prevent fraud</li>
          <li>Analyze usage patterns to enhance user experience</li>
        </ul>
        
        <p><strong>We do not sell your personal information to third parties.</strong></p>
      `
    },
    {
      icon: <UserCheck size={24} />,
      title: "Information Sharing",
      content: `
        <p>We may share your information in these limited circumstances:</p>
        
        <h4>Service Providers</h4>
        <p>Trusted partners who help us operate our platform:</p>
        <ul>
          <li>Hosting and infrastructure services</li>
          <li>Payment processors for reward fulfillment</li>
          <li>Analytics and monitoring services</li>
        </ul>
        
        <h4>Legal Requirements</h4>
        <p>We may disclose information when required by law or to:</p>
        <ul>
          <li>Comply with legal obligations</li>
          <li>Protect our rights and property</li>
          <li>Prevent fraud or security issues</li>
          <li>Protect the safety of our users</li>
        </ul>
      `
    },
    {
      icon: <Lock size={24} />,
      title: "Data Security",
      content: `
        <p>We implement robust security measures to protect your data:</p>
        <ul>
          <li>Encryption of sensitive data in transit and at rest</li>
          <li>Regular security assessments and updates</li>
          <li>Access controls and authentication systems</li>
          <li>Secure data storage with industry standards</li>
        </ul>
        
        <h4>Your Responsibilities</h4>
        <p>Please help keep your account secure by:</p>
        <ul>
          <li>Choosing a strong, unique password</li>
          <li>Not sharing your login credentials</li>
          <li>Logging out when using shared devices</li>
          <li>Reporting any suspicious activity immediately</li>
        </ul>
      `
    },
    {
      icon: <Mail size={24} />,
      title: "Your Rights and Choices",
      content: `
        <p>You have control over your personal information:</p>
        
        <h4>Access and Correction</h4>
        <ul>
          <li>View and update your profile information</li>
          <li>Access your game history and points data</li>
          <li>Correct inaccurate information</li>
        </ul>
        
        <h4>Data Management</h4>
        <ul>
          <li>Export your data upon request</li>
          <li>Delete your account and associated data</li>
          <li>Opt-out of promotional communications</li>
        </ul>
        
        <h4>Cookies and Tracking</h4>
        <p>You can manage cookies through your browser settings, though this may affect platform functionality.</p>
      `
    },
    {
      icon: <Shield size={24} />,
      title: "Children's Privacy",
      content: `
        <p>WAR is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.</p>
        
        <p>If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately. We will take steps to remove that information and terminate the account.</p>
        
        <p>For users between 13-18 years old, we recommend parental guidance and approval before using our platform.</p>
      `
    }
  ];

  return (
    <div className="privacy-container">
      {/* Header */}
      <div className="privacy-header">
        <div className="privacy-hero">
          <Shield size={48} className="privacy-hero-icon" />
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last updated: {lastUpdated}</p>
        </div>
        <div className="privacy-intro">
          <p>
            At WAR (Win & Rule), we take your privacy seriously. This policy explains how we collect, 
            use, and protect your personal information when you use our gaming platform.
          </p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="privacy-nav">
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

      {/* Policy Sections */}
      <div className="privacy-content">
        {sections.map((section, index) => (
          <section 
            key={index}
            id={`section-${index}`}
            className="policy-section"
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

      {/* Contact Section */}
      <div className="privacy-contact">
        <div className="contact-card">
          <h3>Questions or Concerns?</h3>
          <p>
            If you have any questions about this Privacy Policy or how we handle your data, 
            please don't hesitate to contact our privacy team.
          </p>
          <div className="contact-actions">
            <a href="mailto:aniketsharma9360@gmail.com" className="btn btn-primary">Contact Privacy Team</a>
            <button className="btn btn-secondary">Data Request Form</button>
          </div>
        </div>
      </div>

      {/* Policy Updates */}
      <div className="policy-updates">
        <h3>Policy Updates</h3>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes 
          by posting the new policy on this page and updating the "Last Updated" date. 
          Continued use of our platform after changes constitutes acceptance of the updated policy.
        </p>
      </div>
    </div>
  );
};

export default Privacy;