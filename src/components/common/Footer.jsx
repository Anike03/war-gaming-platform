import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Github, Twitter, Mail, GamepadIcon } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Games', path: '/games' },
      { name: 'Leaderboard', path: '/leaderboard' },
      { name: 'Redeem', path: '/redeem' },
      { name: 'FAQ', path: '/faq' }
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' }
    ],
    support: [
      { name: 'Help Center', path: '/help' },
      { name: 'Community', path: '/community' },
      { name: 'Report Issue', path: '/report' }
    ]
  };

  return (
    <footer className="bg-card border-t border-border-color mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-1 md:grid-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link to="/" className="logo flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <GamepadIcon className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold">WAR</span>
            </Link>
            <p className="text-muted mb-4">
              Win And Rule - Play, earn points, and redeem exciting rewards in our skill-based gaming platform.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} className="text-primary" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} className="text-primary" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors"
                aria-label="Email"
              >
                <Mail size={18} className="text-primary" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border-color mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted text-sm flex items-center gap-1">
            © {currentYear} WAR Gaming. Made with <Heart size={14} className="text-danger fill-current" /> by Aniket Sharma
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-muted hover:text-primary text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted hover:text-primary text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;