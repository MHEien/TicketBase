import { createFileRoute } from "@tanstack/react-router";
import { useOrganization } from "../contexts/OrganizationContext";
import { useBaseSEO } from "../hooks/use-seo";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  const { organization, branding, domainInfo, loading } = useOrganization();

  const organizationName = organization?.name || "Events Platform";

  // Apply SEO for about page
  useBaseSEO({
    title: `About ${organizationName} - Your Premier Events Platform`,
    description: `Learn more about ${organizationName} and our mission to bring amazing events to life. Discover our story, values, and commitment to exceptional event experiences.`,
    keywords: [
      "about",
      organizationName.toLowerCase(),
      "events",
      "platform",
      "story",
      "mission",
      "values",
    ],
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

  const currentTheme = branding?.themeName || "default";

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to {organizationName}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {organization?.checkoutMessage ||
              "Your premier destination for discovering and booking amazing events. From intimate gatherings to large-scale productions, we bring experiences to life."}
          </p>
        </div>

        {/* Organization Info */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              About Our Organization
            </h2>
            <div className="space-y-3 text-gray-600">
              <p>
                <strong>Name:</strong> {organizationName}
              </p>
              {organization?.website && (
                <p>
                  <strong>Website:</strong>
                  <a
                    href={organization.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-branded-primary hover:underline ml-2"
                  >
                    {organization.website}
                  </a>
                </p>
              )}
              {organization?.email && (
                <p>
                  <strong>Email:</strong>
                  <a
                    href={`mailto:${organization.email}`}
                    className="text-branded-primary hover:underline ml-2"
                  >
                    {organization.email}
                  </a>
                </p>
              )}
              {organization?.phone && (
                <p>
                  <strong>Phone:</strong>
                  <a
                    href={`tel:${organization.phone}`}
                    className="text-branded-primary hover:underline ml-2"
                  >
                    {organization.phone}
                  </a>
                </p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Custom Domain Info</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                <strong>Current Domain:</strong>{" "}
                {domainInfo?.domain || "localhost"}
              </p>
              <p>
                <strong>Custom Domain:</strong>{" "}
                {domainInfo?.isCustomDomain ? "Yes" : "No"}
              </p>
              {organization?.customDomain && (
                <p>
                  <strong>Configured Domain:</strong>{" "}
                  {organization.customDomain}
                </p>
              )}
              <p>
                <strong>Domain Status:</strong>{" "}
                {organization?.domainVerified ? "Verified" : "Not Verified"}
              </p>
              <p>
                <strong>Current Mode:</strong> {import.meta.env.MODE}
              </p>
              <p>
                <strong>Current Environment:</strong>{" "}
                {import.meta.env.DEV ? "Development" : "Production"}
              </p>
              <p>
                <strong>Current PROD:</strong>{" "}
                {import.meta.env.PROD ? "Yes" : "No"}
              </p>
            </div>
          </Card>
        </div>

        {/* Branding Showcase */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Branding Showcase
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Color Scheme */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Color Scheme</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-12 h-12 rounded-lg shadow-md border-2 border-white"
                    style={{
                      backgroundColor: branding?.primaryColor || "#3b82f6",
                    }}
                  ></div>
                  <div>
                    <p className="font-medium">Primary Color</p>
                    <p className="text-sm text-gray-600">
                      {branding?.primaryColor || "#3b82f6"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div
                    className="w-12 h-12 rounded-lg shadow-md border-2 border-white"
                    style={{
                      backgroundColor: branding?.secondaryColor || "#64748b",
                    }}
                  ></div>
                  <div>
                    <p className="font-medium">Secondary Color</p>
                    <p className="text-sm text-gray-600">
                      {branding?.secondaryColor || "#64748b"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Typography */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Typography</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Font Family</p>
                  <p className="text-sm text-gray-600">
                    {branding?.fontFamily || "Inter, system-ui, sans-serif"}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Theme</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {currentTheme}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Button Style</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {branding?.buttonStyle || "rounded"}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Interactive Elements Showcase */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Interactive Elements
          </h2>

          <Card className="p-8">
            <div className="space-y-6">
              {/* Buttons */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Buttons</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                </div>
              </div>

              {/* Inputs */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Form Elements</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    className="input-branded"
                  />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="input-branded"
                  />
                </div>
              </div>

              {/* Sample Content */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Sample Content</h3>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    This is a sample paragraph showing how content appears with
                    the current branding. Links will appear in the{" "}
                    <span className="text-branded-primary">primary color</span>
                    while secondary elements use the{" "}
                    <span className="text-branded-secondary">
                      secondary color
                    </span>
                    .
                  </p>
                  <div className="bg-branded-primary text-white p-4 rounded-lg">
                    <p className="font-medium">Primary Background Example</p>
                    <p className="text-sm opacity-90">
                      This shows content with primary background color
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Social Links */}
        {organization?.settings?.socialLinks &&
          organization.settings.socialLinks.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-center mb-8">
                Connect With Us
              </h2>
              <Card className="p-8 text-center">
                <p className="text-gray-600 mb-6">
                  Follow us on social media for updates and announcements
                </p>
                <div className="flex justify-center space-x-6">
                  {organization.settings.socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-branded-primary hover:text-branded-secondary transition-colors font-medium"
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              </Card>
            </div>
          )}

        {/* Contact Information */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
          <Card className="p-8">
            <p className="text-gray-600 mb-6">
              Have questions about our events or need assistance? We're here to
              help!
            </p>
            <div className="flex justify-center space-x-4">
              {organization?.email && (
                <Button
                  variant="primary"
                  onClick={() =>
                    (window.location.href = `mailto:${organization.email}`)
                  }
                >
                  Send Email
                </Button>
              )}
              {organization?.phone && (
                <Button
                  variant="outline"
                  onClick={() =>
                    (window.location.href = `tel:${organization.phone}`)
                  }
                >
                  Call Us
                </Button>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
