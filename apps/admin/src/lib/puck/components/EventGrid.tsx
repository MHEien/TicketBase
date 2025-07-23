import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Calendar, MapPin, Users } from 'lucide-react';

// Mock data for admin preview
const mockEvents = [
  {
    id: '1',
    title: 'Summer Music Festival',
    description: 'An amazing outdoor music festival',
    date: '2024-08-15',
    location: 'Central Park',
    price: 45,
    attendees: 1200,
    category: 'music',
    featured: true,
  },
  {
    id: '2',
    title: 'Tech Conference 2024',
    description: 'Latest trends in technology',
    date: '2024-09-20',
    location: 'Convention Center',
    price: 199,
    attendees: 500,
    category: 'conference',
    featured: false,
  },
  {
    id: '3',
    title: 'Food & Wine Tasting',
    description: 'Gourmet food and wine experience',
    date: '2024-07-30',
    location: 'Downtown Restaurant',
    price: 75,
    attendees: 80,
    category: 'food',
    featured: true,
  },
];

export function EventGrid({ 
  title, 
  subtitle, 
  limit, 
  showFeatured, 
  category 
}: {
  title: string;
  subtitle?: string;
  limit: number;
  showFeatured: boolean;
  category?: string;
}) {
  let filteredEvents = mockEvents;
  
  if (showFeatured) {
    filteredEvents = filteredEvents.filter(event => event.featured);
  }
  
  if (category && category !== 'all') {
    filteredEvents = filteredEvents.filter(event => event.category === category);
  }
  
  const displayEvents = filteredEvents.slice(0, limit);

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600"></div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  {event.featured && (
                    <Badge variant="secondary">Featured</Badge>
                  )}
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
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4 mr-2" />
                    {event.attendees} attending
                  </div>
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
