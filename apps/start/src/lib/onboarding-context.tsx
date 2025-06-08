"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthControllerClient } from "@repo/api-sdk";

export interface OnboardingData {
  organizationDetails: {
    name: string;
    logo?: string;
    website?: string;
    phone?: string;
    address?: {
      line1: string;
      line2?: string;
      city: string;
      state?: string;
      postalCode: string;
      country: string;
    };
  };
  eventPreferences: {
    categories: string[];
    typicalAttendees: number;
    frequency: "weekly" | "monthly" | "quarterly" | "yearly" | "occasionally";
    primaryLocation?: string;
  };
  brandSettings: {
    primaryColor: string;
    secondaryColor?: string;
    buttonStyle: "rounded" | "square" | "pill";
    fontFamily?: string;
    headerStyle: "centered" | "left" | "right" | "full-width";
    allowGuestCheckout: boolean;
    defaultCurrency: string;
  };
  paymentDetails: {
    preferredPaymentMethods: string[];
    defaultFeeStrategy: "absorb" | "pass-to-attendee" | "split";
    customFeePercentage?: number;
  };
}

const defaultOnboardingData: OnboardingData = {
  organizationDetails: {
    name: "",
  },
  eventPreferences: {
    categories: [],
    typicalAttendees: 0,
    frequency: "occasionally",
  },
  brandSettings: {
    primaryColor: "#3b82f6",
    buttonStyle: "rounded",
    headerStyle: "centered",
    allowGuestCheckout: true,
    defaultCurrency: "USD",
  },
  paymentDetails: {
    preferredPaymentMethods: ["credit_card"],
    defaultFeeStrategy: "pass-to-attendee",
  },
};

interface OnboardingContextType {
  currentStep: number;
  totalSteps: number;
  onboardingData: OnboardingData;
  isCompleted: boolean;
  goToStep: (step: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  updateOnboardingData: (section: keyof OnboardingData, data: any) => void;
  completeOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(
    defaultOnboardingData,
  );
  const [isCompleted, setIsCompleted] = useState(false);
  const totalSteps = 4;

  // Load data from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("onboardingData");
      const savedStep = localStorage.getItem("onboardingStep");
      const completedFlag = localStorage.getItem("onboardingCompleted");

      if (savedData) {
        setOnboardingData(JSON.parse(savedData));
      }

      if (savedStep) {
        setCurrentStep(parseInt(savedStep, 10));
      }

      if (completedFlag === "true") {
        setIsCompleted(true);
      }
    } catch (error) {
      console.error("Error loading onboarding data:", error);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("onboardingData", JSON.stringify(onboardingData));
      localStorage.setItem("onboardingStep", currentStep.toString());
      localStorage.setItem("onboardingCompleted", isCompleted.toString());
    } catch (error) {
      console.error("Error saving onboarding data:", error);
    }
  }, [onboardingData, currentStep, isCompleted]);

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateOnboardingData = (section: keyof OnboardingData, data: any) => {
    setOnboardingData({
      ...onboardingData,
      [section]: {
        ...onboardingData[section],
        ...data,
      },
    });
  };

  const completeOnboarding = async () => {
    try {
      // Use the SDK's client directly since it accepts the correct payload type
      await AuthControllerClient.updateUserSettings({
        data: {
          onboardingCompleted: true,
          onboardingCompletedAt: new Date().toISOString(),
          organizationSettings: {
            details: {
              name: onboardingData.organizationDetails.name,
              website: onboardingData.organizationDetails.website,
              phone: onboardingData.organizationDetails.phone,
              address: onboardingData.organizationDetails.address && {
                street: onboardingData.organizationDetails.address.line1,
                additionalStreet:
                  onboardingData.organizationDetails.address.line2,
                city: onboardingData.organizationDetails.address.city,
                state: onboardingData.organizationDetails.address.state,
                postalCode:
                  onboardingData.organizationDetails.address.postalCode,
                country: onboardingData.organizationDetails.address.country,
              },
            },
            brandSettings: {
              primaryColor: onboardingData.brandSettings.primaryColor,
              secondaryColor: onboardingData.brandSettings.secondaryColor,
              buttonStyle: onboardingData.brandSettings.buttonStyle,
              fontFamily: onboardingData.brandSettings.fontFamily,
              headerStyle: onboardingData.brandSettings.headerStyle,
              allowGuestCheckout:
                onboardingData.brandSettings.allowGuestCheckout,
              defaultCurrency: onboardingData.brandSettings.defaultCurrency,
            },
            eventPreferences: {
              categories: onboardingData.eventPreferences.categories,
              typicalAttendees:
                onboardingData.eventPreferences.typicalAttendees,
              frequency: onboardingData.eventPreferences.frequency,
              primaryLocation: onboardingData.eventPreferences.primaryLocation,
            },
            paymentPreferences: {
              preferredMethods:
                onboardingData.paymentDetails.preferredPaymentMethods,
              feeStrategy: onboardingData.paymentDetails.defaultFeeStrategy,
              customFeePercentage:
                onboardingData.paymentDetails.customFeePercentage,
            },
          },
        },
      });

      setIsCompleted(true);
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      throw error;
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        totalSteps,
        onboardingData,
        isCompleted,
        goToStep,
        goToNextStep,
        goToPreviousStep,
        updateOnboardingData,
        completeOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
