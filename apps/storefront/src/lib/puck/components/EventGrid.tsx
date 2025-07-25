import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Calendar, MapPin, Users } from 'lucide-react';

// Mock event data - in real implementation, this would fetch from API
const mockEvents = [
  {
    id: '1',
    title: 'Summer Music Festival',
    description: 'Join us for an amazing outdoor music experience',
    startDate: new Date('2024-07-15'),
    location: 'Central Park',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
    price: 49.99,
    category: 'music',
    featured: true,
  },
  {
    id: '2',
    title: 'Tech Conference 2024',
    description: 'Learn about the latest in technology and innovation',
    startDate: new Date('2024-08-20'),
    location: 'Convention Center',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
    price: 199.99,
    category: 'conference',
    featured: false,
  },
  {
    id: '3',
    title: 'Food & Wine Tasting',
    description: 'Explore culinary delights from around the world',
    startDate: new Date('2024-09-10'),
    location: 'Downtown Gallery',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    price: 75.00,
    category: 'food',
    featured: true,
  },
];

export function EventGrid({ title, subtitle, limit, showFeatured, category }: {
  title: string;
  subtitle?: string;
  limit: number;
  showFeatured: boolean;
  category?: string;
}) {
  // Filter and limit events based on props
  let filteredEvents = mockEvents;
  
  if (showFeatured) {
    filteredEvents = filteredEvents.filter(event => event.featured);
  }
  
  if (category) {
    filteredEvents = filteredEvents.filter(event => event.category === category);
  }
  
  filteredEvents = filteredEvents.slice(0, limit);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-video bg-gray-200 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {event.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {event.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    {event.startDate.toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">
                    ${event.price}
                  </span>
                  
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => window.location.href = `/events/${event.id}`}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
}
