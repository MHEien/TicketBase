"use client";

import { OnboardingProvider } from "@/lib/onboarding-context";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingLayout,
});

function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <div className="min-h-screen">
        {/* Logo and branding at the top */}
        <header className="p-6 border-b">
          <div className="max-w-7xl mx-auto flex items-center justify-center">
            <h1 className="text-2xl font-bold text-center">
              eTickets Platform
            </h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-6">
          <Outlet />
        </main>
      </div>
    </OnboardingProvider>
  );
}
