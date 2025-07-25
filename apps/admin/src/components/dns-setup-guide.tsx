import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Copy,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

interface DNSSetupGuideProps {
  organization: {
    name: string;
    customDomain?: string;
    domainVerified?: boolean;
    domainVerificationToken?: string;
  };
  onCopyToClipboard: (text: string) => void;
}

export const DNSSetupGuide: React.FC<DNSSetupGuideProps> = ({
  organization,
  onCopyToClipboard,
}) => {
  const domain = organization.customDomain || "your-domain.com";
  const token =
    organization.domainVerificationToken || "your-verification-token";
  const platformDomain = "your-platform.com"; // This should come from environment

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onCopyToClipboard(text);
  };

  const getStatus = () => {
    if (!organization.customDomain) {
      return { icon: Clock, color: "text-gray-500", label: "Not Configured" };
    }
    if (organization.domainVerified) {
      return { icon: CheckCircle, color: "text-green-500", label: "Verified" };
    }
    return {
      icon: AlertCircle,
      color: "text-yellow-500",
      label: "Pending Verification",
    };
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>DNS Configuration Status</span>
            <Badge
              variant={organization.domainVerified ? "default" : "secondary"}
            >
              <StatusIcon className={`mr-1 h-4 w-4 ${status.color}`} />
              {status.label}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">Domain</h3>
              <p className="text-sm text-gray-600">{domain}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Organization</h3>
              <p className="text-sm text-gray-600">{organization.name}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DNS Configuration Steps */}
      <Card>
        <CardHeader>
          <CardTitle>DNS Configuration Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Domain Verification */}
          <div>
            <h3 className="text-lg font-medium mb-4">
              Step 1: Domain Verification
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Choose one of the following methods to verify domain ownership:
            </p>

            <div className="space-y-4">
              {/* Method 1: DNS TXT Record */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">
                  Option A: DNS TXT Record (Recommended)
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Add a TXT record to your DNS settings to verify ownership.
                </p>
                <div className="bg-gray-50 p-3 rounded-md">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr>
                        <td className="font-medium text-gray-700 pr-4">
                          Type:
                        </td>
                        <td className="font-mono">TXT</td>
                      </tr>
                      <tr>
                        <td className="font-medium text-gray-700 pr-4">
                          Name:
                        </td>
                        <td className="font-mono">_verify-{token}</td>
                        <td>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(`_verify-${token}`)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium text-gray-700 pr-4">
                          Value:
                        </td>
                        <td className="font-mono">{token}</td>
                        <td>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(token)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium text-gray-700 pr-4">TTL:</td>
                        <td className="font-mono">300</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Method 2: File Upload */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Option B: File Upload</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Upload a verification file to your website's root directory.
                </p>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="space-y-2">
                    <div>
                      <strong>File Path:</strong>
                      <code className="ml-2 bg-gray-200 px-2 py-1 rounded text-sm">
                        /.well-known/ticket-platform-verification
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            "/.well-known/ticket-platform-verification",
                          )
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <strong>File Content:</strong>
                      <code className="ml-2 bg-gray-200 px-2 py-1 rounded text-sm">
                        {token}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(token)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Method 3: Meta Tag */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Option C: HTML Meta Tag</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Add a meta tag to your website's homepage &lt;head&gt;
                  section.
                </p>
                <div className="bg-gray-50 p-3 rounded-md">
                  <code className="text-sm">
                    &lt;meta name="ticket-platform-domain-verification"
                    content="{token}" /&gt;
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        `<meta name="ticket-platform-domain-verification" content="${token}" />`,
                      )
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: CNAME Record */}
          <div>
            <h3 className="text-lg font-medium mb-4">
              Step 2: Traffic Routing
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              After domain verification, add a CNAME record to point your domain
              to our platform.
            </p>

            <div className="bg-gray-50 p-4 rounded-md">
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="font-medium text-gray-700 pr-4">Type:</td>
                    <td className="font-mono">CNAME</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700 pr-4">Name:</td>
                    <td className="font-mono">@</td>
                    <td className="text-gray-500">
                      (or leave blank for root domain)
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700 pr-4">Value:</td>
                    <td className="font-mono">{platformDomain}</td>
                    <td>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(platformDomain)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700 pr-4">TTL:</td>
                    <td className="font-mono">300</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Some DNS providers don't support
                CNAME records for root domains. If you encounter issues, you may
                need to:
                <ul className="mt-2 ml-4 list-disc">
                  <li>
                    Use an A record instead (contact support for IP addresses)
                  </li>
                  <li>
                    Use a subdomain like <code>events.{domain}</code>
                  </li>
                  <li>
                    Use ALIAS or ANAME records if your provider supports them
                  </li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>

          {/* Step 3: SSL Certificate */}
          <div>
            <h3 className="text-lg font-medium mb-4">
              Step 3: SSL Certificate
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              SSL certificates are automatically provisioned once your domain is
              verified and DNS is configured.
            </p>

            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-medium text-blue-900 mb-2">
                What happens automatically:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• SSL certificate is requested from Let's Encrypt</li>
                <li>• Certificate is installed on our servers</li>
                <li>• HTTPS is enabled for your domain</li>
                <li>• HTTP traffic is redirected to HTTPS</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Common DNS Providers */}
      <Card>
        <CardHeader>
          <CardTitle>DNS Provider Guides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="font-medium">Popular DNS Providers</h3>
              <div className="space-y-2">
                <a
                  href="https://support.cloudflare.com/hc/en-us/articles/360019093151"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  Cloudflare DNS Guide
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
                <a
                  href="https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/rrsets-working-with.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  AWS Route 53 Guide
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
                <a
                  href="https://support.google.com/domains/answer/3290350"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  Google Domains Guide
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
                <a
                  href="https://help.godaddy.com/help/680"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  GoDaddy DNS Guide
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Troubleshooting</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• DNS changes can take up to 48 hours to propagate</p>
                <p>
                  • Use tools like <code>dig</code> or <code>nslookup</code> to
                  check DNS records
                </p>
                <p>
                  • Contact your DNS provider if you need help with
                  configuration
                </p>
                <p>• Reach out to our support team if you encounter issues</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testing Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Testing & Validation Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">DNS Lookup Tools</h3>
              <div className="space-y-2">
                <a
                  href={`https://www.whatsmydns.net/#TXT/_verify-${token}.${domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  Check TXT Record Propagation
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
                <a
                  href={`https://www.whatsmydns.net/#CNAME/${domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  Check CNAME Record Propagation
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">SSL Testing</h3>
              <div className="space-y-2">
                <a
                  href={`https://www.ssllabs.com/ssltest/analyze.html?d=${domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  SSL Labs Test
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
                <a
                  href={`https://www.sslshopper.com/ssl-checker.html#hostname=${domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  SSL Checker
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
