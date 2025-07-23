import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { Calendar, MapPin, Users, Search, Filter } from 'lucide-react';

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
    soldOut: false,
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
    soldOut: false,
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
    soldOut: true,
  },
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
  let filteredEvents = mockEvents;
  
  if (!showSoldOut) {
    filteredEvents = filteredEvents.filter(event => !event.soldOut);
  }
  
  if (showFeaturedFirst) {
    filteredEvents = filteredEvents.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }
  
  const displayEvents = filteredEvents.slice(0, itemsPerPage);

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

        {/* Filters and Search */}
        {(showFilters || showSearch) && (
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {showSearch && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search events..." className="pl-10" />
              </div>
            )}
            
            {showFilters && (
              <div className="flex gap-2">
                <Select defaultValue={defaultCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="arts">Arts</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600"></div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <div className="flex gap-1">
                    {event.featured && (
                      <Badge variant="secondary">Featured</Badge>
                    )}
                    {event.soldOut && (
                      <Badge variant="destructive">Sold Out</Badge>
                    )}
                  </div>
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
                  <Button size="sm" disabled={event.soldOut}>
                    {event.soldOut ? 'Sold Out' : 'Get Tickets'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Badge variant="outline">1 of 1</Badge>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
