import React from 'react';
import { Link } from '@tanstack/react-router';
import { useOrganization } from '../contexts/OrganizationContext';

export const Footer: React.FC = () => {
  const { organization, branding } = useOrganization();

  const organizationName = organization?.name || 'Events Platform';
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              {branding?.logo ? (
                <img 
                  src={branding.logo} 
                  alt={organizationName}
                  className="h-8 w-auto"
                />
              ) : (
                <div 
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: branding?.primaryColor || '#3b82f6' }}
                >
                  {organizationName.charAt(0)}
                </div>
              )}
              <span className="text-xl font-bold">{organizationName}</span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              {organization?.checkoutMessage || 'Discover and book tickets for amazing events. From concerts to conferences, find your next unforgettable experience.'}
            </p>
            {organization?.website && (
              <a 
                href={organization.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Visit our website
              </a>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="/events" className="text-gray-400 hover:text-white transition-colors">
                  Events
                </a>
              </li>
              <li>
                <a href="/categories" className="text-gray-400 hover:text-white transition-colors">
                  Categories
                </a>
              </li>
              <li>
                <a href="/search" className="text-gray-400 hover:text-white transition-colors">
                  Search
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-gray-400">
              {organization?.email && (
                <p>
                  <a 
                    href={`mailto:${organization.email}`}
                    className="hover:text-white transition-colors"
                  >
                    {organization.email}
                  </a>
                </p>
              )}
              {organization?.phone && (
                <p>
                  <a 
                    href={`tel:${organization.phone}`}
                    className="hover:text-white transition-colors"
                  >
                    {organization.phone}
                  </a>
                </p>
              )}
              <p>
                <Link to="/" className="hover:text-white transition-colors">
                  Support
                </Link>
              </p>
            </div>
          </div>
        </div>

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