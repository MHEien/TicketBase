"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOnboarding } from "@/src/lib/onboarding-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

const eventCategoryOptions = [
  { id: "music", label: "Music & Concerts" },
  { id: "conferences", label: "Conferences & Seminars" },
  { id: "sports", label: "Sports & Fitness" },
  { id: "workshops", label: "Workshops & Classes" },
  { id: "exhibitions", label: "Exhibitions & Trade Shows" },
  { id: "networking", label: "Networking & Meetups" },
  { id: "festivals", label: "Festivals & Fairs" },
  { id: "fundraisers", label: "Fundraisers & Charity" },
];

const frequencyOptions = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
  { value: "occasionally", label: "Occasionally" },
];

const eventPreferencesSchema = z.object({
  categories: z
    .array(z.string())
    .min(1, { message: "Please select at least one category" }),
  typicalAttendees: z.number().min(1).max(100000),
  frequency: z.enum([
    "weekly",
    "monthly",
    "quarterly",
    "yearly",
    "occasionally",
  ]),
  primaryLocation: z.string().optional(),
});

type EventPreferencesFormValues = z.infer<typeof eventPreferencesSchema>;

export default function EventPreferencesForm() {
  const {
    onboardingData,
    updateOnboardingData,
    goToNextStep,
    goToPreviousStep,
  } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EventPreferencesFormValues>({
    resolver: zodResolver(eventPreferencesSchema),
    defaultValues: {
      categories: onboardingData.eventPreferences.categories || [],
      typicalAttendees: onboardingData.eventPreferences.typicalAttendees || 100,
      frequency: onboardingData.eventPreferences.frequency || "occasionally",
      primaryLocation: onboardingData.eventPreferences.primaryLocation || "",
    },
  });

  async function onSubmit(data: EventPreferencesFormValues) {
    setIsLoading(true);

    try {
      // Update onboarding data
      updateOnboardingData("eventPreferences", data);

      // Move to the next step
      goToNextStep();
    } catch (error) {
      console.error("Error saving event preferences:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="categories"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Event Categories</FormLabel>
                <FormDescription>
                  Select the types of events you plan to organize
                </FormDescription>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {eventCategoryOptions.map((option) => (
                  <FormField
                    key={option.id}
                    control={form.control}
                    name="categories"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={option.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(option.id)}
                              onCheckedChange={(checked) => {
                                const updatedCategories = checked
                                  ? [...field.value, option.id]
                                  : field.value?.filter(
                                      (value) => value !== option.id,
                                    );
                                field.onChange(updatedCategories);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {option.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="typicalAttendees"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Typical Number of Attendees</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <Slider
                    min={1}
                    max={1000}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {field.value < 50
                        ? "Small"
                        : field.value < 250
                          ? "Medium"
                          : field.value < 500
                            ? "Large"
                            : "Very large"}
                    </span>
                    <span className="font-medium">{field.value}</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>How often do you host events?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {frequencyOptions.map((option) => (
                    <FormItem
                      key={option.value}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem value={option.value} />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="primaryLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Where do you typically host events?</FormLabel>
              <FormDescription>
                This helps us customize your experience (optional)
              </FormDescription>
              <FormControl>
                <Input placeholder="City, Region, or Online" {...field} />
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
            {isLoading ? "Saving..." : "Next: Brand Settings"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
