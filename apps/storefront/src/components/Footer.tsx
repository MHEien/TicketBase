import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
} from "lucide-react";

// Social media icon mapping
const socialIcons = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  github: Github,
};

export const Footer: React.FC = () => {
  // Organization data will be applied via server-side rendering and CSS variables
  const organizationName = "Events Platform"; // Fallback, actual name applied via branding
  const currentYear = new Date().getFullYear();

  // Footer links and social links will be handled by server-side rendering
  const footerLinks: any[] = []; // Will be populated by server-side data
  const socialLinks: any[] = []; // Will be populated by server-side data

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold"
                style={{
                  backgroundColor: "var(--primary-color, #3b82f6)",
                }}
              >
                {organizationName.charAt(0)}
              </div>
              <span className="text-xl font-bold">{organizationName}</span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Discover and book tickets for amazing events. From concerts to conferences, find your next unforgettable experience.
            </p>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-3">Follow Us</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((link, index) => {
                    const IconComponent =
                      socialIcons[
                        link.platform.toLowerCase() as keyof typeof socialIcons
                      ];
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label={`Follow us on ${link.platform}`}
                      >
                        {IconComponent ? (
                          <IconComponent size={20} />
                        ) : (
                          <span className="text-sm">{link.platform}</span>
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="/events"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Events
                </a>
              </li>
              <li>
                <a
                  href="/categories"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Categories
                </a>
              </li>
              <li>
                <a
                  href="/search"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Search
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-gray-400">
              <p>
                <Link to="/" className="hover:text-white transition-colors">
                  Support
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Custom Footer Links */}
        {footerLinks.length > 0 && (
          <>
            <hr className="my-8 border-gray-700" />
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Links</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {footerLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.text}
                  </a>
                ))}
              </div>
            </div>
          </>
        )}

        <hr className="my-8 border-gray-700" />

        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>
            © {currentYear} {organizationName}. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/" className="hover:text-white transition-colors">
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
