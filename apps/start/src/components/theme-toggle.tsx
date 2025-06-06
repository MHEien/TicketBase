"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: theme === "dark" ? 0 : 180 }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        {theme === "dark" ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </motion.div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
