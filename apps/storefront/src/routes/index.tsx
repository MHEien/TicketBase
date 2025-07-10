import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Calendar, MapPin, Clock, ArrowRight, Search } from 'lucide-react'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/Card'
import { Button } from '~/components/ui/Button'
import { useOrganization } from '~/contexts/OrganizationContext'
import { eventsApi } from '~/lib/api/events'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { organization, branding } = useOrganization()
  
  // Fetch upcoming events
  const { data: upcomingEvents, isLoading: upcomingLoading } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: () => eventsApi.getUpcomingEvents(6),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Fetch featured events
  const { data: featuredEvents, isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-events'],
    queryFn: () => eventsApi.getFeaturedEvents(3),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const organizationName = organization?.name || 'Events Platform'

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing Events
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              {organization?.checkoutMessage || 'Find and book tickets for unforgettable experiences'}
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search events, venues, or categories..."
                  className="w-full pl-12 pr-4 py-4 text-lg rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                />
                <Button 
                  className="absolute right-2 top-2 bottom-2"
                  variant="primary"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      {featuredEvents && featuredEvents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Events</h2>
              <p className="text-lg text-gray-600">Don't miss these amazing upcoming events</p>
            </div>
            
                         <div className="grid md:grid-cols-3 gap-8">
               {featuredEvents.map((event) => (
                 <Card 
                   key={event.id} 
                   hover 
                   className="overflow-hidden cursor-pointer"
                   onClick={() => window.location.href = `/events/${event.id}`}
                 >
                   <div className="aspect-video bg-gray-200 relative">
                    <img
                      src={event.featuredImage || '/api/placeholder/400/240'}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {event.category}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.shortDescription}</p>
                    
                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{format(new Date(event.startDate), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{event.startTime}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>
                          {event.locationType === 'virtual' ? 'Virtual Event' : `${event.city}, ${event.country}`}
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full group"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.location.href = `/events/${event.id}`
                      }}
                    >
                      View Event
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-lg text-gray-600">Discover what's happening soon</p>
          </div>
          
          {upcomingLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-gray-200"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : upcomingEvents && upcomingEvents.length > 0 ? (
                         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {upcomingEvents.map((event) => (
                 <Card 
                   key={event.id} 
                   hover 
                   className="overflow-hidden cursor-pointer"
                   onClick={() => window.location.href = `/events/${event.id}`}
                 >
                   <div className="aspect-video bg-gray-200 relative">
                    <img
                      src={event.featuredImage || '/api/placeholder/400/240'}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.shortDescription}</p>
                    
                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{format(new Date(event.startDate), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{event.startTime}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>
                          {event.locationType === 'virtual' ? 'Virtual Event' : `${event.city}, ${event.country}`}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">
                        {event.ticketTypes && event.ticketTypes.length > 0 && (
                          `From $${Math.min(...event.ticketTypes.map(t => t.price))}`
                        )}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.location.href = `/events/${event.id}`
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No upcoming events found.</p>
              <Button className="mt-4" variant="primary">
                Create Your First Event
              </Button>
            </div>
          )}
          
          {upcomingEvents && upcomingEvents.length > 0 && (
            <div className="text-center mt-12">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.location.href = '/events'}
              >
                View All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Event Categories</h2>
            <p className="text-lg text-gray-600">Find events by category</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Music', 'Conference', 'Sports', 'Arts', 'Food', 'Technology', 'Business', 'Community'].map((category) => (
              <Card 
                key={category} 
                hover 
                className="text-center cursor-pointer"
                onClick={() => window.location.href = `/events?category=${encodeURIComponent(category)}`}
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎵</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{category}</h3>
                  <p className="text-gray-600">Explore {category.toLowerCase()} events</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
