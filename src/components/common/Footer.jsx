// src/components/common/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { 
  Sword, 
  Trophy, 
  Users, 
  Shield, 
  Heart, 
  MessageCircle,
  Github,
  Twitter,
  Mail,
  Gamepad2,
  Crown,
  Sparkles
} from "lucide-react";
import warLogo from "../../assets/Gears-of-War-Logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-content">
        {/* Main Footer Sections */}
        <div className="footer-sections">
          {/* Brand Section */}
          <div className="footer-section">
            <div className="footer-brand">
              <div className="footer-logo">
                <img 
                  src={warLogo} 
                  alt="WAR Logo" 
                  className="footer-logo-image"
                />
              </div>
              <div className="footer-brand-text">
                <h3>WAR • WIN & RULE</h3>
                <p>Test your skills, earn rewards, and dominate the leaderboards!</p>
              </div>
            </div>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="GitHub">
                <Github size={18} />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="social-link" aria-label="Discord">
                <MessageCircle size={18} />
              </a>
              <a href="mailto:aniketsharma9360@gmail.com" className="social-link" aria-label="Contact">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Play</h4>
            <div className="footer-links">
              <Link to="/games" className="footer-link">
                <Gamepad2 size={16} />
                All Games
              </Link>
              <Link to="/leaderboard" className="footer-link">
                <Trophy size={16} />
                Leaderboard
              </Link>
              <Link to="/redeem" className="footer-link">
                <Crown size={16} />
                Redeem Points
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4>Support</h4>
            <div className="footer-links">
              <Link to="/help" className="footer-link">
                <Sparkles size={16} />
                Help Center
              </Link>
              <Link to="/privacy" className="footer-link">
                <Shield size={16} />
                Privacy Policy
              </Link>
              <Link to="/terms" className="footer-link">
                <Shield size={16} />
                Terms of Service
              </Link>
              <Link to="/contact" className="footer-link">
                <Mail size={16} />
                Contact Us
              </Link>
            </div>
          </div>

          {/* Community */}
          <div className="footer-section">
            <h4>Community</h4>
            <div className="footer-links">
              <Link to="/tournaments" className="footer-link">
                <Trophy size={16} />
                Tournaments
              </Link>
              <Link to="/achievements" className="footer-link">
                <Crown size={16} />
                Achievements
              </Link>
              <Link to="/blog" className="footer-link">
                <MessageCircle size={16} />
                Game Blog
              </Link>
            </div>
          </div>
        </div>

        {/* Centered Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <span>© {currentYear} WAR • Win & Rule. Made with </span>
            <Heart size={14} className="heart-icon" />
            <span> for gamers worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;