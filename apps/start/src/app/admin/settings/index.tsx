"use client";

import { useState, useEffect } from "react";
import { useRouter, createFileRoute } from "@tanstack/react-router";
import { useSession } from "@repo/api-sdk";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";
import { Switch } from "@repo/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { toast } from "@repo/ui/use-toast";

export const Route = createFileRoute("/admin/settings/")({
  component: SettingsPage,
});

const organizationSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Organization name must be at least 2 characters" }),
  website: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  checkoutMessage: z.string().optional(),
});

const brandingSchema = z.object({
  primaryColor: z.string().min(4),
  secondaryColor: z.string().optional(),
  buttonStyle: z.enum(["rounded", "square", "pill"]).default("rounded"),
  fontFamily: z.string().optional(),
  headerStyle: z
    .enum(["centered", "left", "right", "full-width"])
    .default("centered"),
  allowGuestCheckout: z.boolean().default(true),
  defaultCurrency: z.string().min(1),
  customStylesheet: z.string().optional(),
  customHeadHtml: z.string().optional(),
});

const domainSchema = z.object({
  customDomain: z.string().optional(),
});

type OrganizationFormValues = z.infer<typeof organizationSchema>;
type BrandingFormValues = z.infer<typeof brandingSchema>;
type DomainFormValues = z.infer<typeof domainSchema>;

function SettingsPage() {
  const router = useRouter();
  const { user } = useSession();
  const [activeTab, setActiveTab] = useState("organization");
  const [isOrganizationLoading, setIsOrganizationLoading] = useState(false);
  const [isBrandingLoading, setIsBrandingLoading] = useState(false);
  const [isDomainLoading, setIsDomainLoading] = useState(false);

  // Organization form
  const organizationForm = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      website: "",
      phone: "",
      email: "",
      logo: "",
      favicon: "",
      checkoutMessage: "",
    },
  });

  // Branding form
  const brandingForm = useForm<BrandingFormValues>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      primaryColor: "#3b82f6",
      secondaryColor: "",
      buttonStyle: "rounded",
      fontFamily: "",
      headerStyle: "centered",
      allowGuestCheckout: true,
      defaultCurrency: "USD",
      customStylesheet: "",
      customHeadHtml: "",
    },
  });

  // Domain form
  const domainForm = useForm<DomainFormValues>({
    resolver: zodResolver(domainSchema),
    defaultValues: {
      customDomain: "",
    },
  });

  // Fetch organization settings on component mount
  useEffect(() => {
    if (user?.organizationId) {
      fetchOrganizationSettings();
    }
  }, [user]);

  // Function to fetch organization settings
  const fetchOrganizationSettings = async () => {
    try {
      const response = await fetch("/api/organizations/settings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Update organization form
        organizationForm.reset({
          name: data.name || "",
          website: data.website || "",
          phone: data.phone || "",
          email: data.email || "",
          logo: data.logo || "",
          favicon: data.favicon || "",
          checkoutMessage: data.checkoutMessage || "",
        });

        // Update branding form
        brandingForm.reset({
          primaryColor: data.settings?.primaryColor || "#3b82f6",
          secondaryColor: data.settings?.secondaryColor || "",
          buttonStyle: data.settings?.buttonStyle || "rounded",
          fontFamily: data.settings?.fontFamily || "",
          headerStyle: data.settings?.headerStyle || "centered",
          allowGuestCheckout: data.settings?.allowGuestCheckout || true,
          defaultCurrency: data.settings?.defaultCurrency || "USD",
          customStylesheet: data.settings?.customStylesheet || "",
          customHeadHtml: data.settings?.customHeadHtml || "",
        });

        // Update domain form
        domainForm.reset({
          customDomain: data.customDomain || "",
        });
      }
    } catch (error) {
      console.error("Error fetching organization settings:", error);
    }
  };

  // Save organization settings
  const saveOrganizationSettings = async (data: OrganizationFormValues) => {
    setIsOrganizationLoading(true);

    try {
      const response = await fetch("/api/organizations/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          website: data.website,
          phone: data.phone,
          email: data.email,
          logo: data.logo,
          favicon: data.favicon,
          checkoutMessage: data.checkoutMessage,
        }),
      });

      if (response.ok) {
        toast({
          title: "Organization settings saved",
          description:
            "Your organization settings have been updated successfully.",
        });
      } else {
        toast({
          title: "Error saving settings",
          description:
            "There was a problem saving your organization settings. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving organization settings:", error);
      toast({
        title: "Error saving settings",
        description:
          "There was a problem saving your organization settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOrganizationLoading(false);
    }
  };

  // Save branding settings
  const saveBrandingSettings = async (data: BrandingFormValues) => {
    setIsBrandingLoading(true);

    try {
      const response = await fetch("/api/organizations/branding", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          settings: {
            primaryColor: data.primaryColor,
            secondaryColor: data.secondaryColor,
            buttonStyle: data.buttonStyle,
            fontFamily: data.fontFamily,
            headerStyle: data.headerStyle,
            allowGuestCheckout: data.allowGuestCheckout,
            defaultCurrency: data.defaultCurrency,
            customStylesheet: data.customStylesheet,
            customHeadHtml: data.customHeadHtml,
          },
        }),
      });

      if (response.ok) {
        toast({
          title: "Branding settings saved",
          description: "Your branding settings have been updated successfully.",
        });
      } else {
        toast({
          title: "Error saving branding settings",
          description:
            "There was a problem saving your branding settings. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving branding settings:", error);
      toast({
        title: "Error saving branding settings",
        description:
          "There was a problem saving your branding settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBrandingLoading(false);
    }
  };

  // Save domain settings
  const saveDomainSettings = async (data: DomainFormValues) => {
    setIsDomainLoading(true);

    try {
      const response = await fetch("/api/organizations/domain", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customDomain: data.customDomain,
        }),
      });

      if (response.ok) {
        toast({
          title: "Domain settings saved",
          description: "Your domain settings have been updated successfully.",
        });
      } else {
        toast({
          title: "Error saving domain settings",
          description:
            "There was a problem saving your domain settings. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving domain settings:", error);
      toast({
        title: "Error saving domain settings",
        description:
          "There was a problem saving your domain settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDomainLoading(false);
    }
  };

  return (
    <div className="container max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-6">Organization Settings</h1>

      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="domain">Domain</TabsTrigger>
        </TabsList>

        {/* Organization Settings */}
        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>
                Manage your organization's basic information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...organizationForm}>
                <form
                  onSubmit={organizationForm.handleSubmit(
                    saveOrganizationSettings,
                  )}
                  className="space-y-6"
                >
                  <FormField
                    control={organizationForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={organizationForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={organizationForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={organizationForm.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={organizationForm.control}
                      name="logo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Logo URL</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            URL to your organization's logo
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={organizationForm.control}
                      name="favicon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Favicon URL</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            URL to your browser tab icon
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={organizationForm.control}
                    name="checkoutMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Checkout Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Thank you for your purchase!"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Message displayed to attendees after checkout
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isOrganizationLoading}>
                      {isOrganizationLoading
                        ? "Saving..."
                        : "Save Organization Settings"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Settings */}
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Branding Settings</CardTitle>
              <CardDescription>
                Customize your event storefront appearance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...brandingForm}>
                <form
                  onSubmit={brandingForm.handleSubmit(saveBrandingSettings)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={brandingForm.control}
                      name="primaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Color</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-6 h-6 rounded border"
                                style={{ backgroundColor: field.value }}
                              ></div>
                              <Input placeholder="#3b82f6" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Main color for buttons and accents
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={brandingForm.control}
                      name="secondaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secondary Color</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-6 h-6 rounded border"
                                style={{
                                  backgroundColor: field.value || "#FFFFFF",
                                }}
                              ></div>
                              <Input placeholder="#60a5fa" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Used for gradients and highlights
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={brandingForm.control}
                      name="buttonStyle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Button Style</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select button style" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="rounded">Rounded</SelectItem>
                              <SelectItem value="square">Square</SelectItem>
                              <SelectItem value="pill">Pill</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Shape of buttons throughout your site
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={brandingForm.control}
                      name="fontFamily"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Font Family</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Inter, system-ui, sans-serif"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            CSS font-family value
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={brandingForm.control}
                      name="headerStyle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Header Layout</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select header style" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="centered">Centered</SelectItem>
                              <SelectItem value="left">Left-aligned</SelectItem>
                              <SelectItem value="right">
                                Right-aligned
                              </SelectItem>
                              <SelectItem value="full-width">
                                Full Width
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Layout style for the header navigation
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={brandingForm.control}
                      name="defaultCurrency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Currency</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="USD">
                                US Dollar (USD)
                              </SelectItem>
                              <SelectItem value="EUR">Euro (EUR)</SelectItem>
                              <SelectItem value="GBP">
                                British Pound (GBP)
                              </SelectItem>
                              <SelectItem value="CAD">
                                Canadian Dollar (CAD)
                              </SelectItem>
                              <SelectItem value="AUD">
                                Australian Dollar (AUD)
                              </SelectItem>
                              <SelectItem value="JPY">
                                Japanese Yen (JPY)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Default currency for tickets
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={brandingForm.control}
                    name="allowGuestCheckout"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Allow Guest Checkout
                          </FormLabel>
                          <FormDescription>
                            Let attendees purchase tickets without creating an
                            account
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={brandingForm.control}
                    name="customStylesheet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom CSS</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder=".custom-class { color: #ff0000; }"
                            className="min-h-[150px] font-mono"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Custom CSS to apply to your storefront
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={brandingForm.control}
                    name="customHeadHtml"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom HTML Head</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="<script>console.log('Custom script');</script>"
                            className="min-h-[150px] font-mono"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Custom HTML to add to the head tag (analytics, fonts,
                          etc.)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isBrandingLoading}>
                      {isBrandingLoading
                        ? "Saving..."
                        : "Save Branding Settings"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Domain Settings */}
        <TabsContent value="domain">
          <Card>
            <CardHeader>
              <CardTitle>Custom Domain</CardTitle>
              <CardDescription>
                Configure a custom domain for your event storefront
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...domainForm}>
                <form
                  onSubmit={domainForm.handleSubmit(saveDomainSettings)}
                  className="space-y-6"
                >
                  <FormField
                    control={domainForm.control}
                    name="customDomain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Domain</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="events.yourdomain.com"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter a domain or subdomain to use for your event
                          storefront. You'll need to set up DNS records to point
                          this domain to our servers.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-medium">DNS Configuration</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      To use your custom domain, add the following DNS records:
                    </p>

                    <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-medium">Record Type</span>
                        <span className="font-medium">Value</span>
                      </div>
                      <div className="flex items-center justify-between text-sm py-2 border-t">
                        <span>CNAME</span>
                        <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                          events.ticketsplatform.com
                        </code>
                      </div>
                      <div className="flex items-center justify-between text-sm py-2 border-t">
                        <span>TXT</span>
                        <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                          ticketsplatform-verification={"{verification-token}"}
                        </code>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                      After adding these records, click the verify button below.
                      It may take up to 24 hours for DNS changes to propagate.
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      type="button"
                      disabled={isDomainLoading}
                    >
                      Verify Domain
                    </Button>
                    <Button type="submit" disabled={isDomainLoading}>
                      {isDomainLoading ? "Saving..." : "Save Domain Settings"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
