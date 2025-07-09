import { a as useRouter, u as useSession, r as reactExports, f as useForm, t, o as objectType, j as jsxRuntimeExports, T as Card, $ as CardHeader, a1 as CardTitle, a2 as CardDescription, _ as CardContent, F as Form, g as FormField, h as FormItem, i as FormLabel, k as FormControl, I as Input, l as FormMessage, D as FormDescription, a7 as Textarea, B as Button, S as Select, K as SelectTrigger, L as SelectValue, M as SelectContent, N as SelectItem, Q as Switch, m as stringType, n as literalType, R as booleanType, G as enumType, a8 as toast } from './main-D54NVj6U.js';
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from './tabs-DWHFZA6o.js';
import './index-DACOVT_t.js';

const organizationSchema = objectType({
  name: stringType().min(2, {
    message: "Organization name must be at least 2 characters"
  }),
  website: stringType().url({
    message: "Please enter a valid URL"
  }).optional().or(literalType("")),
  phone: stringType().optional(),
  email: stringType().email({
    message: "Please enter a valid email address"
  }).optional(),
  logo: stringType().optional(),
  favicon: stringType().optional(),
  checkoutMessage: stringType().optional()
});
const brandingSchema = objectType({
  primaryColor: stringType().min(4),
  secondaryColor: stringType().optional(),
  buttonStyle: enumType(["rounded", "square", "pill"]).default("rounded"),
  fontFamily: stringType().optional(),
  headerStyle: enumType(["centered", "left", "right", "full-width"]).default("centered"),
  allowGuestCheckout: booleanType().default(true),
  defaultCurrency: stringType().min(1),
  customStylesheet: stringType().optional(),
  customHeadHtml: stringType().optional()
});
const domainSchema = objectType({
  customDomain: stringType().optional()
});
const SplitComponent = function SettingsPage() {
  useRouter();
  const {
    data: session,
    update
  } = useSession();
  const [activeTab, setActiveTab] = reactExports.useState("organization");
  const [isOrganizationLoading, setIsOrganizationLoading] = reactExports.useState(false);
  const [isBrandingLoading, setIsBrandingLoading] = reactExports.useState(false);
  const [isDomainLoading, setIsDomainLoading] = reactExports.useState(false);
  const organizationForm = useForm({
    resolver: t(organizationSchema),
    defaultValues: {
      name: "",
      website: "",
      phone: "",
      email: "",
      logo: "",
      favicon: "",
      checkoutMessage: ""
    }
  });
  const brandingForm = useForm({
    resolver: t(brandingSchema),
    defaultValues: {
      primaryColor: "#3b82f6",
      secondaryColor: "",
      buttonStyle: "rounded",
      fontFamily: "",
      headerStyle: "centered",
      allowGuestCheckout: true,
      defaultCurrency: "USD",
      customStylesheet: "",
      customHeadHtml: ""
    }
  });
  const domainForm = useForm({
    resolver: t(domainSchema),
    defaultValues: {
      customDomain: ""
    }
  });
  reactExports.useEffect(() => {
    if (session?.user) {
      fetchOrganizationSettings();
    }
  }, [session]);
  const fetchOrganizationSettings = async () => {
    try {
      const response = await fetch("/api/organizations/settings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        const data = await response.json();
        organizationForm.reset({
          name: data.name || "",
          website: data.website || "",
          phone: data.phone || "",
          email: data.email || "",
          logo: data.logo || "",
          favicon: data.favicon || "",
          checkoutMessage: data.checkoutMessage || ""
        });
        brandingForm.reset({
          primaryColor: data.settings?.primaryColor || "#3b82f6",
          secondaryColor: data.settings?.secondaryColor || "",
          buttonStyle: data.settings?.buttonStyle || "rounded",
          fontFamily: data.settings?.fontFamily || "",
          headerStyle: data.settings?.headerStyle || "centered",
          allowGuestCheckout: data.settings?.allowGuestCheckout || true,
          defaultCurrency: data.settings?.defaultCurrency || "USD",
          customStylesheet: data.settings?.customStylesheet || "",
          customHeadHtml: data.settings?.customHeadHtml || ""
        });
        domainForm.reset({
          customDomain: data.customDomain || ""
        });
      }
    } catch (error) {
      console.error("Error fetching organization settings:", error);
    }
  };
  const saveOrganizationSettings = async (data) => {
    setIsOrganizationLoading(true);
    try {
      const response = await fetch("/api/organizations/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: data.name,
          website: data.website,
          phone: data.phone,
          email: data.email,
          logo: data.logo,
          favicon: data.favicon,
          checkoutMessage: data.checkoutMessage
        })
      });
      if (response.ok) {
        toast({
          title: "Organization settings saved",
          description: "Your organization settings have been updated successfully."
        });
      } else {
        toast({
          title: "Error saving settings",
          description: "There was a problem saving your organization settings. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error saving organization settings:", error);
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your organization settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsOrganizationLoading(false);
    }
  };
  const saveBrandingSettings = async (data) => {
    setIsBrandingLoading(true);
    try {
      const response = await fetch("/api/organizations/branding", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
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
            customHeadHtml: data.customHeadHtml
          }
        })
      });
      if (response.ok) {
        toast({
          title: "Branding settings saved",
          description: "Your branding settings have been updated successfully."
        });
      } else {
        toast({
          title: "Error saving branding settings",
          description: "There was a problem saving your branding settings. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error saving branding settings:", error);
      toast({
        title: "Error saving branding settings",
        description: "There was a problem saving your branding settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsBrandingLoading(false);
    }
  };
  const saveDomainSettings = async (data) => {
    setIsDomainLoading(true);
    try {
      const response = await fetch("/api/organizations/domain", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customDomain: data.customDomain
        })
      });
      if (response.ok) {
        toast({
          title: "Domain settings saved",
          description: "Your domain settings have been updated successfully."
        });
      } else {
        toast({
          title: "Error saving domain settings",
          description: "There was a problem saving your domain settings. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error saving domain settings:", error);
      toast({
        title: "Error saving domain settings",
        description: "There was a problem saving your domain settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDomainLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container max-w-5xl py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold mb-6", children: "Organization Settings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: activeTab, onValueChange: setActiveTab, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "organization", children: "Organization" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "branding", children: "Branding" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "domain", children: "Domain" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "organization", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Organization Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Manage your organization's basic information" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...organizationForm, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: organizationForm.handleSubmit(saveOrganizationSettings), className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { control: organizationForm.control, name: "name", render: ({
            field
          }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Organization Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { ...field }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { control: organizationForm.control, name: "email", render: ({
              field
            }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Email Address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { ...field }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { control: organizationForm.control, name: "phone", render: ({
              field
            }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Phone Number" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { ...field }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { control: organizationForm.control, name: "website", render: ({
            field
          }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Website" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { ...field }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { control: organizationForm.control, name: "logo", render: ({
              field
            }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Logo URL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { ...field }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormDescription, { children: "URL to your organization's logo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { control: organizationForm.control, name: "favicon", render: ({
              field
            }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Favicon URL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { ...field }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormDescription, { children: "URL to your browser tab icon" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { control: organizationForm.control, name: "checkoutMessage", render: ({
            field
          }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Checkout Message" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { placeholder: "Thank you for your purchase!", className: "min-h-[100px]", ...field }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormDescription, { children: "Message displayed to attendees after checkout" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isOrganizationLoading, children: isOrganizationLoading ? "Saving..." : "Save Organization Settings" }) })
        ] }) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "branding", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Branding Settings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Customize your event storefront appearance" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...brandingForm, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: brandingForm.handleSubmit(saveBrandingSettings), className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { control: brandingForm.control, name: "primaryColor", render: ({
              field
            }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Primary Color" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded border", style: {
                  backgroundColor: field.value
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "#3b82f6", ...field })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormDescription, { children: "Main color for buttons and accents" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { control: brandingForm.control, name: "secondaryColor", render: ({
              field
            }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Secondary Color" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded border", style: {
                  backgroundColor: field.value || "#FFFFFF"
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "#60a5fa", ...field })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormDescription, { children: "Used for gradients and highlights" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { control: brandingForm.control, name: "buttonStyle", render: ({
              field
            }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Button Style" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: field.value, onValueChange: field.onChange, defaultValue: field.value, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select button style" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "rounded", children: "Rounded" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "square", children: "Square" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pill", children: "Pill" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormDescription, { children: "Shape of buttons throughout your site" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { control: brandingForm.control, name: "fontFamily", render: ({
              field
            }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Font Family" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Inter, system-ui, sans-serif", ...field }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormDescription, { children: "CSS font-family value" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { control: brandingForm.control, name: "headerStyle", render: ({
              field
            }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Header Layout" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: field.value, onValueChange: field.onChange, defaultValue: field.value, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select header style" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "centered", children: "Centered" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "left", children: "Left-aligned" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "right", children: "Right-aligned" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "full-width", children: "Full Width" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormDescription, { children: "Layout style for the header navigation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { control: brandingForm.control, name: "defaultCurrency", render: ({
              field
            }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Default Currency" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: field.value, onValueChange: field.onChange, defaultValue: field.value, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select currency" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "USD", children: "US Dollar (USD)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "EUR", children: "Euro (EUR)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "GBP", children: "British Pound (GBP)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "CAD", children: "Canadian Dollar (CAD)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AUD", children: "Australian Dollar (AUD)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "JPY", children: "Japanese Yen (JPY)" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormDescription, { children: "Default currency for tickets" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { control: brandingForm.control, name: "allowGuestCheckout", render: ({
            field
          }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { className: "flex flex-row items-center justify-between rounded-lg border p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-base", children: "Allow Guest Checkout" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormDescription, { children: "Let attendees purchase tickets without creating an account" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: field.value, onCheckedChange: field.onChange }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { control: brandingForm.control, name: "customStylesheet", render: ({
            field
          }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Custom CSS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { placeholder: ".custom-class { color: #ff0000; }", className: "min-h-[150px] font-mono", ...field }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormDescription, { children: "Custom CSS to apply to your storefront" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { control: brandingForm.control, name: "customHeadHtml", render: ({
            field
          }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Custom HTML Head" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { placeholder: "<script>console.log('Custom script');<\/script>", className: "min-h-[150px] font-mono", ...field }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormDescription, { children: "Custom HTML to add to the head tag (analytics, fonts, etc.)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isBrandingLoading, children: isBrandingLoading ? "Saving..." : "Save Branding Settings" }) })
        ] }) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "domain", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Custom Domain" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Configure a custom domain for your event storefront" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...domainForm, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: domainForm.handleSubmit(saveDomainSettings), className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { control: domainForm.control, name: "customDomain", render: ({
            field
          }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Custom Domain" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "events.yourdomain.com", ...field }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormDescription, { children: "Enter a domain or subdomain to use for your event storefront. You'll need to set up DNS records to point this domain to our servers." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-medium", children: "DNS Configuration" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "To use your custom domain, add the following DNS records:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-gray-50 dark:bg-gray-800 p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Record Type" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Value" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm py-2 border-t", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "CNAME" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded", children: "events.ticketsplatform.com" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm py-2 border-t", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "TXT" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("code", { className: "bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded", children: [
                  "ticketsplatform-verification=",
                  "{verification-token}"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-4", children: "After adding these records, click the verify button below. It may take up to 24 hours for DNS changes to propagate." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", type: "button", disabled: isDomainLoading, children: "Verify Domain" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isDomainLoading, children: isDomainLoading ? "Saving..." : "Save Domain Settings" })
          ] })
        ] }) }) })
      ] }) })
    ] })
  ] });
};

export { SplitComponent as component };
