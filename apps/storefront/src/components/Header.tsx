import React from "react";
import { Link } from "@tanstack/react-router";
import { Search, Menu, X } from "lucide-react";
import { Button } from "./ui/Button";
import { clsx } from "clsx";
import { DevelopmentTenantSwitcher } from "./domain/DevelopmentTenantSwitcher";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Default to centered alignment - can be overridden by server-side branding
  const headerAlignment = "justify-center";

  // Organization data will be applied via server-side rendering and CSS variables
  const organizationName = "Events Platform"; // Fallback, actual name applied via branding
  const organizationLogo = null; // Logo applied via server-side branding

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={clsx("flex items-center h-16", headerAlignment)}>
          {/* Logo/Brand */}
          <Link
            to="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: "var(--primary-color, #3b82f6)" }}
            >
              {organizationName.charAt(0)}
            </div>
            <span className="text-xl font-bold text-gray-900">
              {organizationName}
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8 ml-8">
            <a
              href="/events"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Events
            </a>
            <a
              href="/categories"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Categories
            </a>
            <a
              href="/search"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Search
            </a>
            <a
              href="/plugins"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Plugins
            </a>
            <Link
              to="/about"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{
                    "--tw-ring-color": "var(--primary-color, #3b82f6)",
                  } as React.CSSProperties}
                />
              </div>
            </form>
          </div>

          {/* Development Tenant Switcher - Only in development */}
          {import.meta.env.DEV && (
            <DevelopmentTenantSwitcher className="hidden md:block mr-4" />
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Development Tenant Switcher - Mobile */}
              {import.meta.env.DEV && (
                <div className="mb-4 px-3">
                  <DevelopmentTenantSwitcher />
                </div>
              )}

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{
                      "--tw-ring-color": "var(--primary-color, #3b82f6)",
                    } as React.CSSProperties}
                  />
                </div>
              </form>

              {/* Mobile Navigation */}
              <a
                href="/events"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </a>
              <a
                href="/categories"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </a>
              <a
                href="/search"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Search
              </a>
              <a
                href="/plugins"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Plugins
              </a>
              <Link
                to="/about"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
