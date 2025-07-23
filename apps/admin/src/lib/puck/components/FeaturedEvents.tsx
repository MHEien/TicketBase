import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Calendar, MapPin, Users, Star } from 'lucide-react';

// Mock data for admin preview
const mockEvents = [
  {
    id: '1',
    title: 'Summer Music Festival',
    description: 'An amazing outdoor music festival with top artists',
    date: '2024-08-15',
    location: 'Central Park',
    price: 45,
    attendees: 1200,
    rating: 4.8,
    featured: true,
  },
  {
    id: '2',
    title: 'Tech Conference 2024',
    description: 'Latest trends in technology and innovation',
    date: '2024-09-20',
    location: 'Convention Center',
    price: 199,
    attendees: 500,
    rating: 4.9,
    featured: true,
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
  const displayEvents = mockEvents.slice(0, maxEvents);

  const layoutClasses = {
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    carousel: 'flex space-x-6 overflow-x-auto pb-4',
    list: 'space-y-4',
  };

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

        <div className={layoutClasses[layout]}>
          {displayEvents.map((event) => (
            <Card key={event.id} className={`overflow-hidden hover:shadow-lg transition-shadow ${layout === 'carousel' ? 'flex-shrink-0 w-80' : ''}`}>
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600"></div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <Badge variant="secondary">Featured</Badge>
                </div>
                <CardDescription>{event.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                  {showAttendeeCount && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-2" />
                      {event.attendees} attending
                    </div>
                  )}
                  {showRatings && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
                      {event.rating} rating
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">${event.price}</span>
                  <Button size="sm">Get Tickets</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
