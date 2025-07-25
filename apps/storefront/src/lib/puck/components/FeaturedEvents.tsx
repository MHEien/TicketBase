import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Calendar, MapPin, Users, Star, Clock, Zap } from 'lucide-react';

// Mock featured events data
const mockFeaturedEvents = [
  {
    id: '1',
    title: 'Summer Music Festival 2024',
    description: 'The biggest music festival of the year featuring world-renowned artists',
    startDate: new Date('2024-07-15'),
    startTime: '18:00',
    location: 'Central Park Amphitheater',
    city: 'New York',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600',
    price: 89.99,
    originalPrice: 120.00,
    category: 'music',
    ticketsLeft: 45,
    attendees: 2500,
    rating: 4.8,
    isHotSelling: true,
  },
  {
    id: '2',
    title: 'Tech Innovation Summit',
    description: 'Join industry leaders for cutting-edge technology discussions and networking',
    startDate: new Date('2024-08-20'),
    startTime: '09:00',
    location: 'Convention Center',
    city: 'San Francisco',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
    price: 299.99,
    originalPrice: 399.99,
    category: 'conference',
    ticketsLeft: 120,
    attendees: 800,
    rating: 4.9,
    isHotSelling: false,
  },
  {
    id: '3',
    title: 'Gourmet Food & Wine Experience',
    description: 'Indulge in exquisite culinary creations paired with premium wines',
    startDate: new Date('2024-09-10'),
    startTime: '19:30',
    location: 'Rooftop Garden',
    city: 'Los Angeles',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600',
    price: 150.00,
    originalPrice: 180.00,
    category: 'food',
    ticketsLeft: 8,
    attendees: 200,
    rating: 4.7,
    isHotSelling: true,
  },
];

export function FeaturedEvents({ 
  title, 
  subtitle, 
  layout, 
  showRatings, 
  showAttendeeCount,
  maxEvents 
}: {
  title: string;
  subtitle?: string;
  layout: 'grid' | 'carousel' | 'list';
  showRatings: boolean;
  showAttendeeCount: boolean;
  maxEvents: number;
}) {
  const events = mockFeaturedEvents.slice(0, maxEvents);

  const layoutClasses = {
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
    carousel: 'flex space-x-6 overflow-x-auto pb-4',
    list: 'space-y-6',
  };

  return (
    <section className="py-16 bg-white">
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

        {/* Events Container */}
        <div className={layoutClasses[layout]}>
          {events.map((event) => (
            <Card 
              key={event.id} 
              className={`overflow-hidden hover:shadow-xl transition-all duration-300 relative ${
                layout === 'carousel' ? 'flex-shrink-0 w-80' : ''
              } ${layout === 'list' ? 'flex flex-col md:flex-row' : ''}`}
            >
              {/* Hot Selling Badge */}
              {event.isHotSelling && (
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                  <Zap className="w-3 h-3" />
                  <span>Hot</span>
                </div>
              )}

              {/* Low Stock Badge */}
              {event.ticketsLeft < 20 && (
                <div className="absolute top-4 right-4 z-10 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{event.ticketsLeft} left</span>
                </div>
              )}

              {/* Image */}
              <div className={`bg-gray-200 overflow-hidden ${
                layout === 'list' ? 'md:w-1/3 aspect-video md:aspect-square' : 'aspect-video'
              }`}>
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Content */}
              <div className={`p-6 ${layout === 'list' ? 'md:w-2/3 flex flex-col justify-between' : ''}`}>
                {/* Category and Rating */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                    {event.category}
                  </span>
                  {showRatings && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 font-medium">{event.rating}</span>
                    </div>
                  )}
                </div>

                <h3 className={`font-bold text-gray-900 mb-3 ${
                  layout === 'list' ? 'text-2xl' : 'text-xl'
                } line-clamp-2`}>
                  {event.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {event.description}
                </p>
                
                {/* Event Details */}
                <div className="space-y-2 mb-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                    <span>{event.startDate.toLocaleDateString()} at {event.startTime}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                    <span>{event.location}, {event.city}</span>
                  </div>

                  {showAttendeeCount && (
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-blue-500" />
                      <span>{event.attendees.toLocaleString()} attending</span>
                    </div>
                  )}
                </div>
                
                {/* Pricing and CTA */}
                <div className={`flex items-center justify-between ${
                  layout === 'list' ? 'mt-auto' : ''
                }`}>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-blue-600">
                      ${event.price}
                    </span>
                    {event.originalPrice > event.price && (
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-400 line-through">
                          ${event.originalPrice}
                        </span>
                        <span className="text-xs text-green-600 font-semibold">
                          Save ${(event.originalPrice - event.price).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => window.location.href = `/events/${event.id}`}
                  >
                    Get Tickets
                  </Button>
                </div>

                {/* Urgency Message */}
                {event.ticketsLeft < 20 && (
                  <div className="mt-3 text-center">
                    <span className="text-sm text-red-600 font-semibold bg-red-50 px-3 py-1 rounded-full">
                      ⚡ Only {event.ticketsLeft} tickets remaining!
                    </span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold rounded-lg transition-all duration-300"
            onClick={() => window.location.href = '/events'}
          >
            View All Events
          </Button>
        </div>
      </div>
    </section>
  );
}
