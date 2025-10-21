// src/pages/Contact.jsx
import React, { useState } from 'react';
import { Mail, Phone, MessageCircle, Clock, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import '../styles/contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactMethods = [
    {
      icon: <Mail size={24} />,
      title: 'Email Support',
      description: 'Send us a detailed message',
      contact: 'support@war-gaming.com',
      response: 'Within 24 hours',
      action: 'mailto:support@war-gaming.com'
    },
    {
      icon: <Phone size={24} />,
      title: 'Phone Support',
      description: 'Speak with our team directly',
      contact: '+1 (555) 123-WAR9',
      response: 'Mon-Fri, 10 AM - 4 PM EST',
      action: 'tel:+15551239279'
    },
    {
      icon: <MessageCircle size={24} />,
      title: 'Live Chat',
      description: 'Get instant help online',
      contact: 'Available on website',
      response: '9 AM - 6 PM EST',
      action: '#live-chat'
    }
  ];

  const faqItems = [
    {
      question: 'How long does it take to get a response?',
      answer: 'We typically respond to emails within 24 hours. Live chat and phone support provide immediate assistance during business hours.'
    },
    {
      question: 'What information should I include in my support request?',
      answer: 'Please include your username, a detailed description of the issue, steps to reproduce it, and any relevant screenshots or error messages.'
    },
    {
      question: 'Can I get help with technical issues?',
      answer: 'Yes! Our technical support team can help with game performance issues, account problems, and platform troubleshooting.'
    },
    {
      question: 'How do I report a bug or glitch?',
      answer: 'Use the "Technical Support" category when contacting us and provide as much detail as possible about the bug, including when it occurs and what you were doing.'
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-container">
      {/* Header */}
      <div className="contact-header">
        <div className="contact-hero">
          <Mail size={48} className="contact-hero-icon" />
          <h1>Contact Us</h1>
          <p>We're here to help! Get in touch with our support team</p>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="contact-methods">
        <h2>Get in Touch</h2>
        <div className="methods-grid">
          {contactMethods.map((method, index) => (
            <div key={index} className="method-card">
              <div className="method-icon">{method.icon}</div>
              <h3>{method.title}</h3>
              <p>{method.description}</p>
              <div className="contact-info">
                <strong>{method.contact}</strong>
              </div>
              <div className="response-time">
                <Clock size={16} />
                {method.response}
              </div>
              <a href={method.action} className="method-btn">
                Contact via {method.title.split(' ')[0]}
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="contact-content">
        {/* Contact Form */}
        <div className="contact-form-section">
          <div className="form-header">
            <h2>Send us a Message</h2>
            <p>Fill out the form below and we'll get back to you as soon as possible</p>
          </div>

          {submitStatus === 'success' && (
            <div className="alert alert-success">
              <CheckCircle size={20} />
              <span>Message sent successfully! We'll get back to you within 24 hours.</span>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="alert alert-error">
              <AlertCircle size={20} />
              <span>There was an error sending your message. Please try again.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Brief subject of your message"
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Support</option>
                  <option value="account">Account Issues</option>
                  <option value="billing">Billing & Payments</option>
                  <option value="feedback">Feedback & Suggestions</option>
                  <option value="report">Report a Problem</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Please provide detailed information about your inquiry..."
              />
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>

        {/* FAQ & Info */}
        <div className="contact-sidebar">
          {/* FAQ Section */}
          <div className="faq-section">
            <h3>Frequently Asked Questions</h3>
            <div className="faq-list">
              {faqItems.map((item, index) => (
                <div key={index} className="faq-item">
                  <h4>{item.question}</h4>
                  <p>{item.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Business Info */}
          <div className="business-info">
            <h3>Business Hours</h3>
            <div className="hours-list">
              <div className="hour-item">
                <span>Monday - Friday</span>
                <span>9:00 AM - 6:00 PM EST</span>
              </div>
              <div className="hour-item">
                <span>Saturday</span>
                <span>10:00 AM - 4:00 PM EST</span>
              </div>
              <div className="hour-item">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
            </div>

            <div className="location-info">
              <MapPin size={20} />
              <div>
                <strong>WAR Gaming Inc.</strong>
                <span>123 Gaming Street, Suite 100</span>
                <span>Toronto, ON M5V 2T6</span>
                <span>Canada</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Notice */}
      <div className="emergency-notice">
        <AlertCircle size={24} />
        <div>
          <h4>Urgent Account Issues?</h4>
          <p>
            If you're experiencing urgent account security issues, please call our support line immediately. 
            We're here to help secure your account and resolve critical issues quickly.
          </p>
        </div>
        <a href="tel:+15551239279" className="emergency-btn">
          Call Now
        </a>
      </div>
    </div>
  );
};

export default Contact;