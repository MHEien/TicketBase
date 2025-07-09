"use client";

import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { useOnboarding } from "@/lib/onboarding-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import OrganizationDetailsForm from "../../components/onboarding/steps/organization-details";
import EventPreferencesForm from "../../components/onboarding/steps/event-preferences";
import BrandSettingsForm from "../../components/onboarding/steps/brand-settings";
import PaymentDetailsForm from "../../components/onboarding/steps/payment-details";
import OnboardingComplete from "../../components/onboarding/steps/onboarding-complete";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding/")({ 
  component: OnboardingPage,
})

function OnboardingPage() {
  const router = useRouter();
  const { currentStep, totalSteps, goToStep, isCompleted } = useOnboarding();

  // Redirect to dashboard if onboarding is already completed
  useEffect(() => {
    if (isCompleted) {
      router.navigate({ to: "/admin" });
    }
  }, [isCompleted, router]);

  // Steps progression
  const steps = [
    {
      id: 1,
      title: "Organization Details",
      description: "Tell us about your organization",
      component: <OrganizationDetailsForm />,
    },
    {
      id: 2,
      title: "Event Preferences",
      description: "Tell us about the events you'll host",
      component: <EventPreferencesForm />,
    },
    {
      id: 3,
      title: "Brand Settings",
      description: "Customize your event storefront",
      component: <BrandSettingsForm />,
    },
    {
      id: 4,
      title: "Payment Settings",
      description: "Set up how you'll get paid",
      component: <PaymentDetailsForm />,
    },
  ];

  // If all steps are completed, show completion
  if (currentStep > totalSteps) {
    return <OnboardingComplete />;
  }

  const currentStepData = steps.find((step) => step.id === currentStep);

  return (
    <div className="flex flex-col items-center">
      {/* Progress indicator */}
      <div className="w-full max-w-3xl mb-8">
        <div className="flex justify-between">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center"
              onClick={() => goToStep(step.id)}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer
                  ${
                    step.id < currentStep
                      ? "bg-green-500 text-white"
                      : step.id === currentStep
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300"
                  }`}
              >
                {step.id < currentStep ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`text-sm mt-2 font-medium
                  ${
                    step.id === currentStep
                      ? "text-blue-500"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>

        {/* Progress line */}
        <div className="relative mt-4">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="relative flex justify-between">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`h-0.5 ${
                  step.id <= currentStep ? "bg-blue-500" : "bg-transparent"
                }`}
                style={{
                  width: `${100 / (steps.length - 1)}%`,
                  marginLeft:
                    step.id === 1 ? "0" : `-${100 / (steps.length * 2)}%`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Current step content */}
      <Card className="w-full max-w-3xl p-6">
        <h2 className="text-2xl font-bold mb-2">{currentStepData?.title}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {currentStepData?.description}
        </p>

        {currentStepData?.component}
      </Card>
    </div>
  );
}
