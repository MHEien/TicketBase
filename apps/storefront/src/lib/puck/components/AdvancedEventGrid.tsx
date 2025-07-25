import { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Calendar, MapPin, Users, Filter, Search, X, Clock, Star } from 'lucide-react';

// Extended mock event data with more filtering options
const mockEvents = [
  {
    id: '1',
    title: 'Summer Music Festival',
    description: 'Experience the biggest music festival with top artists',
    startDate: new Date('2024-07-15'),
    startTime: '18:00',
    location: 'Central Park Amphitheater',
    city: 'New York',
    state: 'NY',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
    price: 89.99,
    originalPrice: 120.00,
    category: 'music',
    featured: true,
    soldOut: false,
    ticketsLeft: 45,
    attendees: 2500,
    rating: 4.8,
    tags: ['outdoor', 'festival', 'live-music'],
  },
  {
    id: '2',
    title: 'Tech Innovation Summit',
    description: 'Join industry leaders for cutting-edge tech discussions',
    startDate: new Date('2024-08-20'),
    startTime: '09:00',
    location: 'Convention Center',
    city: 'San Francisco',
    state: 'CA',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
    price: 299.99,
    originalPrice: 399.99,
    category: 'conference',
    featured: true,
    soldOut: false,
    ticketsLeft: 120,
    attendees: 800,
    rating: 4.9,
    tags: ['technology', 'networking', 'business'],
  },
  {
    id: '3',
    title: 'Gourmet Food & Wine',
    description: 'Indulge in exquisite culinary creations and premium wines',
    startDate: new Date('2024-09-10'),
    startTime: '19:30',
    location: 'Rooftop Garden',
    city: 'Los Angeles',
    state: 'CA',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    price: 150.00,
    originalPrice: 180.00,
    category: 'food',
    featured: false,
    soldOut: false,
    ticketsLeft: 8,
    attendees: 200,
    rating: 4.7,
    tags: ['food', 'wine', 'upscale'],
  },
  {
    id: '4',
    title: 'Comedy Night Spectacular',
    description: 'Laugh out loud with the funniest comedians in town',
    startDate: new Date('2024-07-25'),
    startTime: '20:00',
    location: 'Comedy Club Downtown',
    city: 'Chicago',
    state: 'IL',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400',
    price: 45.00,
    originalPrice: 45.00,
    category: 'entertainment',
    featured: false,
    soldOut: true,
    ticketsLeft: 0,
    attendees: 300,
    rating: 4.6,
    tags: ['comedy', 'indoor', 'evening'],
  },
  {
    id: '5',
    title: 'Art Gallery Opening',
    description: 'Discover contemporary art from emerging local artists',
    startDate: new Date('2024-08-05'),
    startTime: '18:00',
    location: 'Modern Art Gallery',
    city: 'New York',
    state: 'NY',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    price: 25.00,
    originalPrice: 25.00,
    category: 'arts',
    featured: false,
    soldOut: false,
    ticketsLeft: 150,
    attendees: 180,
    rating: 4.4,
    tags: ['art', 'culture', 'gallery'],
  },
];

const categories = ['all', 'music', 'conference', 'food', 'entertainment', 'arts'];
const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $200', min: 100, max: 200 },
  { label: '$200+', min: 200, max: Infinity },
];

export function AdvancedEventGrid({ 
  title, 
  subtitle, 
  showFilters, 
  showSearch, 
  defaultCategory, 
  showFeaturedFirst,
  itemsPerPage,
  showSoldOut 
}: {
  title: string;
  subtitle?: string;
  showFilters: boolean;
  showSearch: boolean;
  defaultCategory: string;
  showFeaturedFirst: boolean;
  itemsPerPage: number;
  showSoldOut: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory || 'all');
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [selectedCity, setSelectedCity] = useState('all');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique cities for filter
  const cities = ['all', ...Array.from(new Set(mockEvents.map(event => event.city)))];

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let filtered = mockEvents.filter(event => {
      // Search filter
      if (searchTerm && !event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !event.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && event.category !== selectedCategory) {
        return false;
      }

      // Price filter
      if (event.price < selectedPriceRange.min || event.price > selectedPriceRange.max) {
        return false;
      }

      // City filter
      if (selectedCity !== 'all' && event.city !== selectedCity) {
        return false;
      }

      // Sold out filter
      if (!showSoldOut && event.soldOut) {
        return false;
      }

      return true;
    });

    // Sort events
    if (showFeaturedFirst) {
      filtered.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      });
    } else {
      filtered.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedPriceRange, selectedCity, showFeaturedFirst, showSoldOut]);

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedPriceRange(priceRanges[0]);
    setSelectedCity('all');
    setCurrentPage(1);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Search and Filter Controls */}
        {(showSearch || showFilters) && (
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            {showSearch && (
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Filter Toggle */}
            {showFilters && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                  className="flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                  {(selectedCategory !== 'all' || selectedPriceRange !== priceRanges[0] || selectedCity !== 'all') && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </Button>
              </div>
            )}

            {/* Filters Panel */}
            {showFilters && showFiltersPanel && (
              <div className="bg-white p-6 rounded-lg shadow-lg border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <select
                      value={priceRanges.indexOf(selectedPriceRange)}
                      onChange={(e) => setSelectedPriceRange(priceRanges[parseInt(e.target.value)])}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {priceRanges.map((range, index) => (
                        <option key={index} value={index}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {cities.map(city => (
                        <option key={city} value={city}>
                          {city === 'all' ? 'All Cities' : city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {filteredEvents.length} events found
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="flex items-center space-x-1"
                  >
                    <X className="w-4 h-4" />
                    <span>Clear Filters</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {paginatedEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
              {/* Featured Badge */}
              {event.featured && (
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Featured
                </div>
              )}

              {/* Sold Out Badge */}
              {event.soldOut && (
                <div className="absolute top-4 right-4 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Sold Out
                </div>
              )}

              {/* Low Stock Badge */}
              {!event.soldOut && event.ticketsLeft < 20 && (
                <div className="absolute top-4 right-4 z-10 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {event.ticketsLeft} left
                </div>
              )}

              <div className="aspect-video bg-gray-200 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-6">
                {/* Category and Rating */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                    {event.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{event.rating}</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {event.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {event.description}
                </p>
                
                {/* Event Details */}
                <div className="space-y-2 mb-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {event.startDate.toLocaleDateString()} at {event.startTime}
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}, {event.city}
                  </div>

                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    {event.attendees} attending
                  </div>
                </div>
                
                {/* Pricing */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-blue-600">
                      ${event.price}
                    </span>
                    {event.originalPrice > event.price && (
                      <span className="text-sm text-gray-400 line-through">
                        ${event.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* CTA Button */}
                <Button
                  size="sm"
                  className={`w-full ${event.soldOut 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                  disabled={event.soldOut}
                  onClick={() => !event.soldOut && (window.location.href = `/events/${event.id}`)}
                >
                  {event.soldOut ? 'Sold Out' : 'Get Tickets'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No events found matching your criteria.</p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
