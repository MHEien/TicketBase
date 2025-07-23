import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock data for admin preview
const mockEvents = [
  {
    id: '1',
    title: 'Summer Music Festival',
    description: 'An amazing outdoor music festival with top artists',
    date: '2024-08-15',
    location: 'Central Park',
    price: 45,
    image: 'https://via.placeholder.com/600x300',
  },
  {
    id: '2',
    title: 'Tech Conference 2024',
    description: 'Latest trends in technology and innovation',
    date: '2024-09-20',
    location: 'Convention Center',
    price: 199,
    image: 'https://via.placeholder.com/600x300',
  },
];

export function EventCarousel({ 
  title, 
  subtitle, 
  autoPlay, 
  showDots, 
  showArrows, 
  slideInterval 
}: {
  title: string;
  subtitle?: string;
  autoPlay: boolean;
  showDots: boolean;
  showArrows: boolean;
  slideInterval: number;
}) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="relative">
          {/* Carousel Content */}
          <div className="overflow-hidden rounded-lg">
            <div className="flex transition-transform duration-300">
              {mockEvents.map((event) => (
                <div key={event.id} className="w-full flex-shrink-0">
                  <Card className="overflow-hidden">
                    <div 
                      className="h-64 bg-gradient-to-br from-blue-500 to-purple-600 bg-cover bg-center"
                      style={{ backgroundImage: `url(${event.image})` }}
                    >
                      <div className="h-full bg-black bg-opacity-40 flex items-end p-6">
                        <div className="text-white">
                          <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                          <p className="text-lg opacity-90 mb-4">{event.description}</p>
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {new Date(event.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {event.location}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">${event.price}</span>
                            <Button variant="secondary">Get Tickets</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {showArrows && (
            <>
              <button className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg">
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {showDots && (
            <div className="flex justify-center mt-6 space-x-2">
              {mockEvents.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Auto-play indicator */}
        {autoPlay && (
          <div className="text-center mt-4">
            <Badge variant="outline">
              Auto-play: {slideInterval}s intervals
            </Badge>
          </div>
        )}
      </div>
    </section>
  );
}
