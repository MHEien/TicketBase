import { createFileRoute } from "@tanstack/react-router";
import { getCurrentOrganization } from "../lib/server-organization";
import { pagesApi } from "@ticketbase/api";
import { useBaseSEO } from "../hooks/use-seo";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Star, 
  Zap, 
  Shield, 
  Sparkles, 
  TrendingUp, 
  Award, 
  Clock, 
  Heart, 
  ArrowRight,
  Play,
  CheckCircle,
  Globe,
  Music,
  Camera,
  Ticket
} from "lucide-react";
import { useEffect, useState } from "react";
import { Renderer } from "@repo/editor"

export const Route = createFileRoute("/")({
  component: Index,
  loader: async () => {
    const organization = await getCurrentOrganization();
    if (!organization) {
      return { organization: null, homepage: null };
    }

    // Try to get a custom Puck homepage
    try {
      const homepage = await pagesApi.getHomepage(organization.id);
      console.log('Homepage found:', JSON.stringify(homepage));
      return { organization, homepage };
    } catch (error) {
      // No custom homepage found, use default layout
      console.log('No custom homepage found, using default layout:', error);
      return { organization, homepage: null };
    }
  },
});

function Index() {
  const { organization, homepage } = Route.useLoaderData();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Apply SEO for home page
  useBaseSEO({
    title: organization?.name
      ? `${organization.name} - Premium Events Platform`
      : "Events Platform - Discover Amazing Events",
    description:
      organization?.checkoutMessage ||
      "Discover and book tickets for amazing events. From concerts to conferences, find your next unforgettable experience.",
    keywords: [
      "events",
      "tickets",
      "booking",
      "entertainment",
      "concerts",
      "conferences",
      organization?.name || "events platform",
    ].filter(Boolean),
  });

  const organizationName = organization?.name || "Events Platform";

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    setIsLoaded(true);
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // If we have a custom Puck homepage, render it
  if (homepage) {
    console.log('Rendering homepage with content:', homepage.content);
    return (
      <div className="min-h-screen bg-white">
        <Renderer data={homepage.content} />
      </div>
    );
  }

  // Otherwise, render the default homepage layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-40">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)`
        }} />
        {/* Gentle floating elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className={`text-center transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Organization Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-blue-200 shadow-lg mb-8">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 animate-pulse" />
              <span className="text-base font-medium text-gray-700">Welcome to {organizationName}</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {organizationName}
              </span>
              <br />
              <span className="text-3xl md:text-5xl font-normal text-gray-700">Events & Experiences</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl mb-10 text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {organization?.checkoutMessage ||
                "Discover amazing events, connect with your community, and create memories that last a lifetime. Your next great experience is just a click away."}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                size="lg"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Browse Events
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              {organization?.email && (
                <Button
                  size="lg"
                  variant="outline"
                  className="group px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-300 text-gray-700 hover:bg-white hover:border-blue-400 hover:text-blue-600 font-semibold rounded-xl transition-all duration-300"
                  onClick={() => window.location.href = `mailto:${organization.email}`}
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Get in Touch
                </Button>
              )}
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 mb-16">
              <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                <span className="text-sm font-medium">Secure Booking</span>
              </div>
              <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <Shield className="w-5 h-5 mr-2 text-blue-500" />
                <span className="text-sm font-medium">Verified Events</span>
              </div>
              <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <Clock className="w-5 h-5 mr-2 text-purple-500" />
                <span className="text-sm font-medium">Instant Confirmation</span>
              </div>
            </div>
            
            {/* Event Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                <div className="text-gray-600 text-sm font-medium">Events This Year</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl font-bold text-purple-600 mb-2">10K+</div>
                <div className="text-gray-600 text-sm font-medium">Happy Attendees</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl font-bold text-pink-600 mb-2">98%</div>
                <div className="text-gray-600 text-sm font-medium">Satisfaction Rate</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                <div className="text-gray-600 text-sm font-medium">Support Available</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center bg-white/50 backdrop-blur-sm">
            <div className="w-1 h-3 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* What Makes Us Special */}
      <section className="relative py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-5 py-2 rounded-full bg-blue-50 border border-blue-200 shadow-sm mb-6">
              <Star className="w-4 h-4 mr-2 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">What Makes Us Special</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              The <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{organizationName}</span> Experience
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We create unforgettable moments through exceptional events, genuine community connections, and attention to every detail that matters.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group">
              <Card className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Music className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 text-center">Curated Events</h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  Handpicked experiences featuring talented performers, inspiring speakers, and entertainment that creates lasting memories.
                </p>
              </Card>
            </div>

            {/* Feature 2 */}
            <div className="group">
              <Card className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 text-center">Community Focused</h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  Join a welcoming community where every attendee matters. Connect, share experiences, and build meaningful relationships.
                </p>
              </Card>
            </div>

            {/* Feature 3 */}
            <div className="group">
              <Card className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 text-center">Quality Promise</h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  Every event is thoughtfully planned and professionally executed. Your satisfaction and enjoyment are our top priorities.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Showcase */}
      <section className="relative py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-5 py-2 rounded-full bg-orange-50 border border-orange-200 shadow-sm mb-6">
              <Zap className="w-4 h-4 mr-2 text-orange-600" />
              <span className="text-sm font-semibold text-orange-700">Don't Miss Out</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Upcoming</span> Events
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover amazing experiences waiting for you. Join us for events that bring people together and create lasting memories.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Event 1 - Featured */}
            <div className="group md:col-span-2">
              <Card className="relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1">
                <div className="md:flex">
                  <div className="relative md:w-1/2 h-64 md:h-80 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 overflow-hidden">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute top-6 left-6">
                      <div className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full mb-3 shadow-lg">
                        ⭐ FEATURED EVENT
                      </div>
                      <div className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold rounded-full">
                        Limited Seats
                      </div>
                    </div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                        <Users className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">1,200+ attending</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 md:w-1/2 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 group-hover:text-purple-600 transition-colors">
                        Summer Music Festival
                      </h3>
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="w-5 h-5 mr-3 text-blue-500" />
                        <span>Central Park, New York</span>
                      </div>
                      <div className="flex items-center text-gray-600 mb-6">
                        <Calendar className="w-5 h-5 mr-3 text-purple-500" />
                        <span>July 15-17, 2024</span>
                      </div>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        Three days of incredible music featuring top artists, food trucks, and an unforgettable atmosphere in the heart of NYC.
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-3xl font-bold text-gray-900">$89</span>
                        <span className="text-green-600 text-sm ml-2 font-semibold">early bird</span>
                      </div>
                      <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0 rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all">
                        Get Tickets
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Event 2 */}
            <div className="group">
              <Card className="relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                <div className="relative h-48 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 overflow-hidden">
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                    NEW
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">Trending</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-cyan-600 transition-colors">
                    Tech Innovation Summit
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="text-sm">Convention Center, SF</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                    <span className="text-sm">August 10-12, 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">$299</span>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 rounded-xl px-6 font-semibold shadow-lg hover:shadow-xl transition-all">
                      Book Now
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Event 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <Card className="relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-500 group-hover:scale-105">
                <div className="relative h-48 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">
                    VIP
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      <span className="text-sm">Exclusive</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-emerald-300 transition-colors">
                    Art Gallery Opening
                  </h3>
                  <div className="flex items-center text-gray-400 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">Modern Art Museum</span>
                  </div>
                  <div className="flex items-center text-gray-400 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">September 5, 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-black text-white">$149</span>
                    </div>
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white border-0 rounded-xl px-6">
                      Reserve
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Event 4 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <Card className="relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-500 group-hover:scale-105">
                <div className="relative h-48 bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    HOT
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">Selling Fast</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-orange-300 transition-colors">
                    Food & Wine Festival
                  </h3>
                  <div className="flex items-center text-gray-400 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">Waterfront Park</span>
                  </div>
                  <div className="flex items-center text-gray-400 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">October 20-22, 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-black text-white">$75</span>
                    </div>
                    <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white border-0 rounded-xl px-6">
                      Join Us
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="text-center mt-16">
            <Button 
              size="lg" 
              className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-2xl shadow-2xl shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 border-0 text-lg"
            >
              <Globe className="w-6 h-6 mr-3" />
              View All Our Events
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 bg-gradient-to-b from-black via-purple-900/20 to-black">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-pink-900/10 to-blue-900/10" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 mb-8">
            <Heart className="w-5 h-5 mr-3 text-purple-400" />
            <span className="text-base font-medium text-purple-300">Join Our Community</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
            Ready for Your Next
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Adventure?
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Don't just attend events – become part of the {organizationName} family. 
            Every ticket is your gateway to extraordinary experiences and lasting memories.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button
              size="lg"
              className="group relative px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-2xl shadow-2xl shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 border-0 text-xl"
            >
              <Ticket className="w-7 h-7 mr-4" />
              Browse All Events
              <ArrowRight className="w-7 h-7 ml-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            {organization?.email && (
              <Button
                size="lg"
                variant="outline"
                className="group px-12 py-6 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 font-bold rounded-2xl transition-all duration-300 text-xl"
                onClick={() => window.location.href = `mailto:${organization.email}`}
              >
                <Heart className="w-7 h-7 mr-4" />
                Get In Touch
              </Button>
            )}
          </div>
          
          {/* Social Proof */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-8 border-t border-white/10">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-black text-purple-400 mb-2">5★</div>
              <div className="text-gray-400 text-sm uppercase tracking-wide">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-black text-pink-400 mb-2">24/7</div>
              <div className="text-gray-400 text-sm uppercase tracking-wide">Customer Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-black text-blue-400 mb-2">100%</div>
              <div className="text-gray-400 text-sm uppercase tracking-wide">Secure Payments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-black text-green-400 mb-2">∞</div>
              <div className="text-gray-400 text-sm uppercase tracking-wide">Memories Made</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
