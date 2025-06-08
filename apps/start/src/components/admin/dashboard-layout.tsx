"use client";

import { CommandHub } from "@/components/command-hub";
import { CommandMenu } from "@/components/command-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCommandMenu } from "@/hooks/use-command-menu";
import { DashboardNavProvider } from "@/hooks/useDashboardNav";
import { Outlet } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useUser, useHasRole } from "@repo/api-sdk";

export function DashboardLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, setIsOpen } = useCommandMenu();
  const user = useUser();
  const isAdmin = useHasRole("admin");

  useEffect(() => {
    if (!isAdmin) {
      window.location.href = "/login?error=unauthorized";
      return;
    }

    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isAdmin]);

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <DashboardNavProvider>
      <div className="relative min-h-screen w-full bg-gradient-to-br from-background to-background/80">
        {isLoading ? (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="relative h-24 w-24">
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary/20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="flex h-screen flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CommandHub />

            <main className="relative flex-1 overflow-y-auto px-6 pb-6 pt-20 md:px-8 md:pt-24">
              <Outlet />
            </main>

            <div className="fixed bottom-6 right-6 z-50">
              <ThemeToggle />
            </div>
          </motion.div>
        )}

        <CommandMenu isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </DashboardNavProvider>
  );
}
