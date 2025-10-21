// src/pages/Help.jsx
import React, { useState } from 'react';
import { Search, BookOpen, MessageCircle, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import '../styles/help.css';

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (itemId) => {
    setOpenItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const faqCategories = {
    'getting-started': {
      title: 'Getting Started',
      icon: '🚀',
      items: [
        {
          id: 'gs-1',
          question: 'How do I create an account?',
          answer: 'Click the "Sign Up" button in the top navigation, fill in your email, create a password, and choose a display name. You\'ll receive a verification email to activate your account.'
        },
        {
          id: 'gs-2',
          question: 'Is WAR free to use?',
          answer: 'Yes! WAR is completely free to play. You can enjoy all games, earn points, and redeem rewards without any cost.'
        },
        {
          id: 'gs-3',
          question: 'What devices are supported?',
          answer: 'WAR works on all modern web browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version for the best experience.'
        }
      ]
    },
    'games': {
      title: 'Games & Gameplay',
      icon: '🎮',
      items: [
        {
          id: 'game-1',
          question: 'How do I earn points?',
          answer: 'You earn points by playing games and achieving high scores. Points are awarded based on game difficulty and performance: Easy (25), Medium (50), Hard (75), Extreme (100) points.'
        },
        {
          id: 'game-2',
          question: 'What happens if I lose a game?',
          answer: 'You still earn points based on your score, though fewer than for winning. Consistent playing helps improve your skills and earn more points over time.'
        },
        {
          id: 'game-3',
          question: 'Can I play games multiple times?',
          answer: 'Yes! You can play any game as many times as you want. Your best scores are recorded, and you can earn points each time you play.'
        }
      ]
    },
    'points-rewards': {
      title: 'Points & Rewards',
      icon: '⭐',
      items: [
        {
          id: 'pr-1',
          question: 'How do I redeem my points?',
          answer: 'Go to the "Redeem" page, choose your preferred gift card, and follow the redemption process. Your request will be processed within 24 hours.'
        },
        {
          id: 'pr-2',
          question: 'What gift cards are available?',
          answer: 'We currently offer Starbucks and Tim Hortons gift cards in $10, $20, and $30 denominations. More options may be added in the future.'
        },
        {
          id: 'pr-3',
          question: 'Do points expire?',
          answer: 'Points do not expire as long as your account remains active. We consider an account active if you log in at least once every 12 months.'
        }
      ]
    },
    'account': {
      title: 'Account & Profile',
      icon: '👤',
      items: [
        {
          id: 'acc-1',
          question: 'How do I reset my password?',
          answer: 'Click "Forgot Password" on the login page, enter your email, and follow the instructions sent to your inbox to reset your password.'
        },
        {
          id: 'acc-2',
          question: 'Can I change my display name?',
          answer: 'Yes! Go to your Profile page and click "Edit Profile" to change your display name, bio, and other personal information.'
        },
        {
          id: 'acc-3',
          question: 'How do I delete my account?',
          answer: 'Contact our support team through the Contact Us page, and we\'ll assist you with account deletion. Note: This action is irreversible.'
        }
      ]
    },
    'technical': {
      title: 'Technical Support',
      icon: '🔧',
      items: [
        {
          id: 'tech-1',
          question: 'The game is not loading properly',
          answer: 'Try refreshing the page, clearing your browser cache, or using a different browser. Ensure you have a stable internet connection.'
        },
        {
          id: 'tech-2',
          question: 'My points are not updating',
          answer: 'Points usually update immediately. If you\'re experiencing delays, try refreshing the page. If the issue persists, contact support.'
        },
        {
          id: 'tech-3',
          question: 'I found a bug in a game',
          answer: 'Please report any bugs through the Contact Us page with details about the issue, your device, and browser information.'
        }
      ]
    }
  };

  const filteredCategories = Object.entries(faqCategories).reduce((acc, [key, category]) => {
    if (!searchTerm) return faqCategories;
    
    const filteredItems = category.items.filter(item => 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filteredItems.length > 0) {
      acc[key] = { ...category, items: filteredItems };
    }
    
    return acc;
  }, {});

  const contactMethods = [
    {
      icon: <MessageCircle size={24} />,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      availability: 'Available 9 AM - 6 PM EST',
      action: 'Start Chat'
    },
    {
      icon: <Mail size={24} />,
      title: 'Email Support',
      description: 'Send us a detailed message',
      availability: 'Response within 24 hours',
      action: 'Send Email'
    },
    {
      icon: <Phone size={24} />,
      title: 'Phone Support',
      description: 'Speak directly with our team',
      availability: 'Mon-Fri, 10 AM - 4 PM EST',
      action: 'Call Now'
    }
  ];

  return (
    <div className="help-container">
      {/* Header */}
      <div className="help-header">
        <div className="help-hero">
          <BookOpen size={48} className="help-hero-icon" />
          <h1>Help Center</h1>
          <p>Find answers to common questions and get support</p>
        </div>
        
        {/* Search */}
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Help</h2>
        <div className="contact-grid">
          {contactMethods.map((method, index) => (
            <div key={index} className="contact-card">
              <div className="contact-icon">{method.icon}</div>
              <h3>{method.title}</h3>
              <p>{method.description}</p>
              <div className="availability">{method.availability}</div>
              <button className="contact-btn">{method.action}</button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="faq-sections">
        <div className="faq-sidebar">
          <h3>Categories</h3>
          {Object.entries(filteredCategories).map(([key, category]) => (
            <button
              key={key}
              className={`sidebar-item ${activeCategory === key ? 'active' : ''}`}
              onClick={() => setActiveCategory(key)}
            >
              <span className="category-icon">{category.icon}</span>
              {category.title}
              <span className="item-count">{category.items.length}</span>
            </button>
          ))}
        </div>

        <div className="faq-content">
          <h2>{filteredCategories[activeCategory]?.title} FAQs</h2>
          <div className="faq-list">
            {filteredCategories[activeCategory]?.items.map((item) => (
              <div key={item.id} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => toggleItem(item.id)}
                >
                  <span>{item.question}</span>
                  {openItems[item.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {openItems[item.id] && (
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredCategories[activeCategory]?.items.length === 0 && (
            <div className="no-results">
              <Search size={48} className="no-results-icon" />
              <h3>No results found</h3>
              <p>Try adjusting your search terms or browse other categories</p>
            </div>
          )}
        </div>
      </div>

      {/* Still Need Help */}
      <div className="need-help-section">
        <div className="need-help-card">
          <MessageCircle size={48} className="help-section-icon" />
          <div className="need-help-content">
            <h2>Still need help?</h2>
            <p>Can't find what you're looking for? Our support team is here to assist you.</p>
            <div className="help-actions">
              <button className="btn btn-primary">Contact Support</button>
              <button className="btn btn-secondary">Browse Documentation</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;