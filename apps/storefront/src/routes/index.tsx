import { createFileRoute } from "@tanstack/react-router";
import { useOrganization } from "../contexts/OrganizationContext";
import { useBaseSEO } from "../hooks/use-seo";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Calendar, MapPin, Users, Star, Zap, Shield } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { organization, loading } = useOrganization();

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const organizationName = organization?.name || "Events Platform";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to {organizationName}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              {organization?.checkoutMessage ||
                "Discover incredible events, book tickets instantly, and create unforgettable memories"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Browse Events
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose {organizationName}?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make discovering and booking events simple, secure, and
              enjoyable.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Easy Booking</h3>
              <p className="text-gray-600">
                Book tickets in just a few clicks with our streamlined checkout
                process.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Secure Payments</h3>
              <p className="text-gray-600">
                Your transactions are protected with enterprise-grade security.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Instant Confirmation
              </h3>
              <p className="text-gray-600">
                Get your tickets immediately with instant email confirmation.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Events Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Events
            </h2>
            <p className="text-xl text-gray-600">
              Don't miss out on these amazing experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Sample event cards */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-r from-pink-500 to-rose-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Summer Music Festival
                </h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">Central Park, New York</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="text-sm">July 15-17, 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">$89</span>
                  <Button size="sm">View Details</Button>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Tech Conference 2024
                </h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">Convention Center, SF</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="text-sm">August 10-12, 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">$299</span>
                  <Button size="sm">View Details</Button>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-r from-green-500 to-teal-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Art Exhibition Gala
                </h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">Museum of Modern Art</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="text-sm">September 5, 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">$149</span>
                  <Button size="sm">View Details</Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              View All Events
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Events Hosted</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">
                250K+
              </div>
              <div className="text-gray-600">Tickets Sold</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600">Cities</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">98%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Discover Amazing Events?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of event-goers who trust {organizationName} for their
            entertainment needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Browse Events Now
            </Button>
            {organization?.email && (
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
                onClick={() =>
                  (window.location.href = `mailto:${organization.email}`)
                }
              >
                Contact Us
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
