"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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
      // Send the completed onboarding data to the API
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(onboardingData),
      });

      if (response.ok) {
        setIsCompleted(true);
        return;
      }

      throw new Error("Failed to save onboarding data");
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
