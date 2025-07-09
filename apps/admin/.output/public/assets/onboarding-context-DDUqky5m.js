import { r as reactExports, j as jsxRuntimeExports } from "./main-D54NVj6U.js";

const defaultOnboardingData = {
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
const OnboardingContext = reactExports.createContext(void 0);
function OnboardingProvider({ children }) {
  const [currentStep, setCurrentStep] = reactExports.useState(1);
  const [onboardingData, setOnboardingData] = reactExports.useState(
    defaultOnboardingData,
  );
  const [isCompleted, setIsCompleted] = reactExports.useState(false);
  const totalSteps = 4;
  reactExports.useEffect(() => {
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
  reactExports.useEffect(() => {
    try {
      localStorage.setItem("onboardingData", JSON.stringify(onboardingData));
      localStorage.setItem("onboardingStep", currentStep.toString());
      localStorage.setItem("onboardingCompleted", isCompleted.toString());
    } catch (error) {
      console.error("Error saving onboarding data:", error);
    }
  }, [onboardingData, currentStep, isCompleted]);
  const goToStep = (step) => {
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
  const updateOnboardingData = (section, data) => {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(OnboardingContext.Provider, {
    value: {
      currentStep,
      totalSteps,
      onboardingData,
      isCompleted,
      goToStep,
      goToNextStep,
      goToPreviousStep,
      updateOnboardingData,
      completeOnboarding,
    },
    children,
  });
}
function useOnboarding() {
  const context = reactExports.useContext(OnboardingContext);
  if (context === void 0) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}

export { OnboardingProvider as O, useOnboarding as u };
