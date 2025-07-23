import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Calendar, MapPin, ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react';

// Mock event data - in real implementation, this would fetch from API
const mockEvents = [
  {
    id: '1',
    title: 'Summer Music Festival 2024',
    description: 'Experience the biggest music festival of the year with top artists from around the world',
    startDate: new Date('2024-07-15'),
    startTime: '18:00',
    location: 'Central Park Amphitheater',
    city: 'New York',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    price: 89.99,
    originalPrice: 120.00,
    category: 'music',
    featured: true,
    soldOut: false,
    ticketsLeft: 45,
    attendees: 2500,
  },
  {
    id: '2',
    title: 'Tech Innovation Summit',
    description: 'Join industry leaders and innovators for a day of cutting-edge technology discussions',
    startDate: new Date('2024-08-20'),
    startTime: '09:00',
    location: 'Convention Center',
    city: 'San Francisco',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    price: 299.99,
    originalPrice: 399.99,
    category: 'conference',
    featured: true,
    soldOut: false,
    ticketsLeft: 120,
    attendees: 800,
  },
  {
    id: '3',
    title: 'Gourmet Food & Wine Experience',
    description: 'Indulge in exquisite culinary creations paired with premium wines from renowned vineyards',
    startDate: new Date('2024-09-10'),
    startTime: '19:30',
    location: 'Rooftop Garden',
    city: 'Los Angeles',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    price: 150.00,
    originalPrice: 180.00,
    category: 'food',
    featured: true,
    soldOut: false,
    ticketsLeft: 8,
    attendees: 200,
  },
];

export function EventCarousel({ title, subtitle, autoPlay, showDots, showArrows, slideInterval }: {
  title: string;
  subtitle?: string;
  autoPlay: boolean;
  showDots: boolean;
  showArrows: boolean;
  slideInterval: number;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mockEvents.length);
    }, slideInterval * 1000);

    return () => clearInterval(interval);
  }, [autoPlay, slideInterval]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % mockEvents.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + mockEvents.length) % mockEvents.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentEvent = mockEvents[currentSlide];

  return (
    <section className="relative py-16 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${currentEvent.image})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Carousel Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[500px]">
          {/* Event Details */}
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-blue-600 rounded-full text-sm font-medium">
              {currentEvent.category.toUpperCase()}
            </div>
            
            <h3 className="text-3xl md:text-5xl font-bold leading-tight">
              {currentEvent.title}
            </h3>
            
            <p className="text-lg text-gray-200 leading-relaxed">
              {currentEvent.description}
            </p>

            {/* Event Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span>{currentEvent.startDate.toLocaleDateString()} at {currentEvent.startTime}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span>{currentEvent.location}, {currentEvent.city}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>{currentEvent.attendees} attending</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className={currentEvent.ticketsLeft < 20 ? 'text-red-400 font-semibold' : ''}>
                  {currentEvent.ticketsLeft} tickets left
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-center space-x-4">
              <div className="text-3xl font-bold text-green-400">
                ${currentEvent.price}
              </div>
              {currentEvent.originalPrice > currentEvent.price && (
                <div className="text-lg text-gray-400 line-through">
                  ${currentEvent.originalPrice}
                </div>
              )}
              {currentEvent.ticketsLeft < 20 && (
                <div className="px-3 py-1 bg-red-600 rounded-full text-sm font-semibold">
                  Almost Sold Out!
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.location.href = `/events/${currentEvent.id}`}
              >
                Get Tickets Now
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg transition-all duration-300"
                onClick={() => window.location.href = `/events/${currentEvent.id}`}
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Event Image Card */}
          <div className="relative">
            <Card className="overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <div className="aspect-[4/3] bg-gray-200 overflow-hidden">
                <img
                  src={currentEvent.image}
                  alt={currentEvent.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
          </div>
        </div>

        {/* Navigation Arrows */}
        {showArrows && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full transition-all duration-300 z-20"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full transition-all duration-300 z-20"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}

        {/* Dots Navigation */}
        {showDots && (
          <div className="flex justify-center space-x-3 mt-8">
            {mockEvents.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-white scale-125'
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
