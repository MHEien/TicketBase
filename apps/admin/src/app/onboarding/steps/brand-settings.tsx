"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOnboarding } from "@/src/lib/onboarding-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const currencyOptions = [
  { value: "USD", label: "US Dollar ($)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GBP", label: "British Pound (£)" },
  { value: "CAD", label: "Canadian Dollar (C$)" },
  { value: "AUD", label: "Australian Dollar (A$)" },
  { value: "JPY", label: "Japanese Yen (¥)" },
];

const brandSchema = z.object({
  primaryColor: z.string().min(4),
  secondaryColor: z.string().optional(),
  buttonStyle: z.enum(["rounded", "square", "pill"]).default("rounded"),
  fontFamily: z.string().optional(),
  headerStyle: z
    .enum(["centered", "left", "right", "full-width"])
    .default("centered"),
  allowGuestCheckout: z.boolean().default(true),
  defaultCurrency: z.string().min(1),
});

type BrandFormValues = z.infer<typeof brandSchema>;

export default function BrandSettingsForm() {
  const {
    onboardingData,
    updateOnboardingData,
    goToNextStep,
    goToPreviousStep,
  } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);
  const [previewStyle, setPreviewStyle] = useState<React.CSSProperties>({});

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      primaryColor: onboardingData.brandSettings.primaryColor || "#3b82f6",
      secondaryColor: onboardingData.brandSettings.secondaryColor || "",
      buttonStyle: onboardingData.brandSettings.buttonStyle || "rounded",
      fontFamily: onboardingData.brandSettings.fontFamily || "",
      headerStyle: onboardingData.brandSettings.headerStyle || "centered",
      allowGuestCheckout:
        onboardingData.brandSettings.allowGuestCheckout || true,
      defaultCurrency: onboardingData.brandSettings.defaultCurrency || "USD",
    },
  });

  // Update preview when colors change
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "primaryColor" || name === "secondaryColor") {
        const primaryColor = (value.primaryColor as string) || "#3b82f6";
        const secondaryColor = (value.secondaryColor as string) || primaryColor;

        setPreviewStyle({
          backgroundImage: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        });
      }
    });

    // Initial render
    const primaryColor = form.getValues("primaryColor") || "#3b82f6";
    const secondaryColor = form.getValues("secondaryColor") || primaryColor;
    setPreviewStyle({
      backgroundImage: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
    });

    return () => subscription.unsubscribe();
  }, [form]);

  async function onSubmit(data: BrandFormValues) {
    setIsLoading(true);

    try {
      // Update onboarding data
      updateOnboardingData("brandSettings", data);

      // Move to the next step
      goToNextStep();
    } catch (error) {
      console.error("Error saving brand settings:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-2">Brand Preview</h3>
          <div className="flex flex-col space-y-4 items-center">
            <div
              className="w-full h-32 rounded-md flex items-center justify-center text-white font-bold text-xl"
              style={previewStyle}
            >
              Your Event Branding
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" size="sm">
                Secondary Button
              </Button>
              <Button
                style={{ backgroundColor: form.watch("primaryColor") }}
                size="sm"
              >
                Primary Button
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="secondaryColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary Color (Optional)</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: field.value || "#FFFFFF" }}
                    ></div>
                    <Input placeholder="#60a5fa" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="buttonStyle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Button Style</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fontFamily"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Font Family (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Inter, system-ui, sans-serif"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="headerStyle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Header Layout</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select header style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="centered">Centered</SelectItem>
                  <SelectItem value="left">Left-aligned</SelectItem>
                  <SelectItem value="right">Right-aligned</SelectItem>
                  <SelectItem value="full-width">Full Width</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="defaultCurrency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Currency</FormLabel>
              <FormDescription>
                The currency you'll primarily sell tickets in
              </FormDescription>
              <FormControl>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  {...field}
                >
                  {currencyOptions.map((currency) => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allowGuestCheckout"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Guest Checkout</FormLabel>
                <FormDescription>
                  Allow customers to purchase tickets without creating an
                  account
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={goToPreviousStep}>
            Back
          </Button>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Next: Payment Settings"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
