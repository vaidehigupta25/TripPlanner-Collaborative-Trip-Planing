import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Trip Dashboard", href: "/trip-dashboard" },
        { name: "Collaborative Planner", href: "/collaborative-planner" },
        { name: "Smart Recommendations", href: "/smart-recommendations" },
        { name: "Budget Coordinator", href: "/budget-coordinator" },
        { name: "Community Gallery", href: "/community-gallery" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
        { name: "Blog", href: "/blog" },
        { name: "Contact", href: "/contact" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Travel Guides", href: "/guides" },
        { name: "API Documentation", href: "/api" },
        { name: "Community Forum", href: "/forum" },
        { name: "Travel Insurance", href: "/insurance" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "Data Protection", href: "/data-protection" },
        { name: "Accessibility", href: "/accessibility" }
      ]
    }
  ];

  const socialLinks = [
    { name: "Twitter", icon: "Twitter", href: "https://twitter.com/tripplanner" },
    { name: "Instagram", icon: "Instagram", href: "https://instagram.com/tripplanner" },
    { name: "Facebook", icon: "Facebook", href: "https://facebook.com/tripplanner" },
    { name: "LinkedIn", icon: "Linkedin", href: "https://linkedin.com/company/tripplanner" },
    { name: "YouTube", icon: "Youtube", href: "https://youtube.com/tripplanner" }
  ];

  const Logo = () => (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <svg width="32" height="32" viewBox="0 0 32 32" className="text-primary">
          <defs>
            <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-secondary)" />
            </linearGradient>
          </defs>
          <circle cx="16" cy="16" r="14" fill="url(#footerLogoGradient)" />
          <path 
            d="M12 10l8 6-8 6V10z" 
            fill="white" 
            className="drop-shadow-sm"
          />
          <circle cx="24" cy="8" r="3" fill="var(--color-accent)" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-poppins font-bold text-xl text-foreground tracking-tight">
          Trip Planner
        </span>
        <span className="font-inter text-xs text-muted-foreground -mt-1">
          Plan Together
        </span>
      </div>
    </div>
  );

  return (
    <footer className="bg-card border-t border-border">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="container mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to start planning your next adventure?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who've discovered the joy of collaborative trip planning. Get travel tips, destination guides, and exclusive deals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <Button variant="default" size="lg" iconName="Send" iconPosition="left">
                Get Started
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </motion.div>
        </div>
      </div>
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Logo />
            
            <p className="text-muted-foreground mt-4 mb-6 leading-relaxed">
              Transform trip planning from a stressful solo task into an engaging group experience. Plan together, budget smart, and discover more with real-time collaboration.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-3">
              {socialLinks?.map((social) => (
                <a
                  key={social?.name}
                  href={social?.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg flex items-center justify-center transition-all duration-200 group"
                  aria-label={social?.name}
                >
                  <Icon name={social?.icon} size={18} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerSections?.map((section, index) => (
            <motion.div
              key={section?.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold text-foreground mb-4">{section?.title}</h4>
              <ul className="space-y-3">
                {section?.links?.map((link) => (
                  <li key={link?.name}>
                    <a
                      href={link?.href}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm"
                    >
                      {link?.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-muted-foreground">
              <span>© {currentYear} Trip Planner. All rights reserved.</span>
              <div className="flex items-center space-x-4">
                <a href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy
                </a>
                <a href="/terms" className="hover:text-foreground transition-colors">
                  Terms
                </a>
                <a href="/cookies" className="hover:text-foreground transition-colors">
                  Cookies
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="MapPin" size={14} />
                <span>Made with ❤️ in Indore</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Trust Badges */}
      <div className="bg-muted/30 border-t border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-center space-x-8 opacity-60">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Icon name="Shield" size={16} />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Icon name="Lock" size={16} />
              <span>Privacy Protected</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Icon name="Award" size={16} />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Icon name="CheckCircle" size={16} />
              <span>SOC 2 Certified</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;