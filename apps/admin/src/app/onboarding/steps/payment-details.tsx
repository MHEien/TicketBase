"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOnboarding } from "@/src/lib/onboarding-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Slider } from "@/components/ui/slider";

const paymentMethodOptions = [
  { id: "credit_card", label: "Credit/Debit Cards" },
  { id: "paypal", label: "PayPal" },
  { id: "bank_transfer", label: "Bank Transfer" },
  { id: "apple_pay", label: "Apple Pay" },
  { id: "google_pay", label: "Google Pay" },
];

const feeStrategyOptions = [
  { value: "absorb", label: "Absorb all fees (you pay them)" },
  {
    value: "pass-to-attendee",
    label: "Pass fees to attendees (they pay them)",
  },
  { value: "split", label: "Split fees between you and attendees" },
];

const paymentDetailsSchema = z.object({
  preferredPaymentMethods: z
    .array(z.string())
    .min(1, { message: "Please select at least one payment method" }),
  defaultFeeStrategy: z.enum(["absorb", "pass-to-attendee", "split"]),
  customFeePercentage: z.number().min(0).max(100).optional(),
});

type PaymentDetailsFormValues = z.infer<typeof paymentDetailsSchema>;

export default function PaymentDetailsForm() {
  const {
    onboardingData,
    updateOnboardingData,
    goToNextStep,
    goToPreviousStep,
    completeOnboarding,
  } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);
  const [showFeeSlider, setShowFeeSlider] = useState(
    onboardingData.paymentDetails.defaultFeeStrategy === "split",
  );

  const form = useForm<PaymentDetailsFormValues>({
    resolver: zodResolver(paymentDetailsSchema),
    defaultValues: {
      preferredPaymentMethods: onboardingData.paymentDetails
        .preferredPaymentMethods || ["credit_card"],
      defaultFeeStrategy:
        onboardingData.paymentDetails.defaultFeeStrategy || "pass-to-attendee",
      customFeePercentage:
        onboardingData.paymentDetails.customFeePercentage || 50,
    },
  });

  // Update fee slider visibility when strategy changes
  const watchFeeStrategy = form.watch("defaultFeeStrategy");
  if (watchFeeStrategy === "split" && !showFeeSlider) {
    setShowFeeSlider(true);
  } else if (watchFeeStrategy !== "split" && showFeeSlider) {
    setShowFeeSlider(false);
  }

  async function onSubmit(data: PaymentDetailsFormValues) {
    setIsLoading(true);

    try {
      // Update onboarding data
      updateOnboardingData("paymentDetails", data);

      // Complete the onboarding process
      await completeOnboarding();

      // Move to the final step
      goToNextStep();
    } catch (error) {
      console.error("Error saving payment details:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="preferredPaymentMethods"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Payment Methods</FormLabel>
                <FormDescription>
                  Select the payment methods you'd like to offer
                </FormDescription>
              </div>
              <div className="space-y-2">
                {paymentMethodOptions.map((option) => (
                  <FormField
                    key={option.id}
                    control={form.control}
                    name="preferredPaymentMethods"
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
                                const updatedMethods = checked
                                  ? [...field.value, option.id]
                                  : field.value?.filter(
                                      (value) => value !== option.id,
                                    );
                                field.onChange(updatedMethods);
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
          name="defaultFeeStrategy"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>How do you want to handle processing fees?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value);
                    // Show fee slider if split option is selected
                    setShowFeeSlider(value === "split");
                  }}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {feeStrategyOptions.map((option) => (
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

        {showFeeSlider && (
          <FormField
            control={form.control}
            name="customFeePercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fee Split Percentage</FormLabel>
                <FormDescription>
                  What percentage of fees should attendees pay?
                </FormDescription>
                <FormControl>
                  <div className="space-y-3">
                    <Slider
                      min={0}
                      max={100}
                      step={5}
                      defaultValue={[field.value || 50]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm">
                        You pay: {100 - (field.value || 0)}%
                      </span>
                      <span className="font-medium">{field.value || 0}%</span>
                      <span className="text-sm">
                        Attendees pay: {field.value || 0}%
                      </span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="border-t pt-4 mt-6">
          <FormDescription className="mb-4 text-center">
            You'll be able to connect payment gateways and customize your
            payment settings later in the admin dashboard.
          </FormDescription>
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={goToPreviousStep}>
            Back
          </Button>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Complete Setup"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
