"use client"

import { OnboardingProvider } from "@/lib/onboarding-context"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
          {children}
        </main>
      </div>
    </OnboardingProvider>
  )
} 