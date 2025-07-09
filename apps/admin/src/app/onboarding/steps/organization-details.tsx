"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOnboarding } from "@/src/lib/onboarding-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

type OrganizationFormValues = z.infer<typeof organizationSchema>;

export default function OrganizationDetailsForm() {
  const { onboardingData, updateOnboardingData, goToNextStep } =
    useOnboarding();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: onboardingData.organizationDetails.name || "",
      website: onboardingData.organizationDetails.website || "",
      phone: onboardingData.organizationDetails.phone || "",
      addressLine1: onboardingData.organizationDetails.address?.line1 || "",
      addressLine2: onboardingData.organizationDetails.address?.line2 || "",
      city: onboardingData.organizationDetails.address?.city || "",
      state: onboardingData.organizationDetails.address?.state || "",
      postalCode: onboardingData.organizationDetails.address?.postalCode || "",
      country: onboardingData.organizationDetails.address?.country || "",
    },
  });

  async function onSubmit(data: OrganizationFormValues) {
    setIsLoading(true);

    try {
      // Update onboarding data
      updateOnboardingData("organizationDetails", {
        name: data.name,
        website: data.website,
        phone: data.phone,
        address: {
          line1: data.addressLine1,
          line2: data.addressLine2,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
        },
      });

      // Move to the next step
      goToNextStep();
    } catch (error) {
      console.error("Error saving organization details:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name *</FormLabel>
              <FormControl>
                <Input placeholder="Your Event Company" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://www.example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4">Address Information</h3>

          <FormField
            control={form.control}
            name="addressLine1"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Address Line 1</FormLabel>
                <FormControl>
                  <Input placeholder="123 Event St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="addressLine2"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Address Line 2</FormLabel>
                <FormControl>
                  <Input placeholder="Suite 100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Eventville" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State/Province</FormLabel>
                  <FormControl>
                    <Input placeholder="California" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="90210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="United States" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Next: Event Preferences"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
