"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Home,
  BarChart3,
  Layers,
  Users,
  Calendar,
  Settings,
  Search,
  Plus,
  Bell,
  MessageSquare,
  Command,
} from "lucide-react";
import { AuthStatus } from "@/components/ui/auth-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCommandMenu } from "@/hooks/use-command-menu";
import { useRouter } from "next/navigation";
import { useDashboardNav } from "@/hooks/useDashboardNav";

export function CommandHub() {
  const [expanded, setExpanded] = useState(false);
  const hubRef = useRef<HTMLDivElement>(null);
  const { setIsOpen } = useCommandMenu();
  const router = useRouter();
  const { activeSection, setActiveSection } = useDashboardNav();
  const navItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "plugins", label: "Plugins", icon: Layers },
    { id: "users", label: "Users", icon: Users },
    { id: "events", label: "Events", icon: Calendar },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (hubRef.current && !hubRef.current.contains(event.target as Node)) {
        setExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNewEvent = () => {
    router.push("/events/new");
  };

  const handleNavItemClick = (id: string) => {
    if (id === "events") {
      router.push("/events");
    } else if (id === "users") {
      router.push("/users");
    } else if (id === "settings") {
      router.push("/settings");
    } else if (id === "plugins") {
      router.push("/settings/plugins");
    } else {
      setActiveSection(id);
    }
    setExpanded(false);
  };

  return (
    <motion.div
      ref={hubRef}
      className="fixed left-1/2 top-6 z-50 -translate-x-1/2 transform"
      animate={{
        width: expanded ? "calc(100% - 48px)" : "auto",
        maxWidth: expanded ? "1200px" : "800px",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <motion.div
        className="relative overflow-hidden rounded-full border bg-background/80 backdrop-blur-md"
        animate={{
          borderRadius: expanded ? "1rem" : "9999px",
          height: expanded ? "auto" : "56px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Main Command Bar */}
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={() => setExpanded(!expanded)}
            >
              <Command className="h-5 w-5" />
            </Button>

            <div className="hidden items-center gap-1 md:flex">
              {navItems.slice(0, 3).map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "secondary" : "ghost"}
                  className="h-9 gap-2 rounded-full px-3 text-sm"
                  onClick={() => handleNavItemClick(item.id)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-full"
              onClick={() => {}}
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute right-0 top-0 h-2 w-2 rounded-full p-0" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={() => {}}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              className="h-9 gap-2 rounded-full px-3 text-sm"
              onClick={() => setIsOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search...</span>
              <span className="hidden text-xs text-muted-foreground md:inline">
                ⌘K
              </span>
            </Button>

            <Button
              variant="default"
              className="h-9 gap-2 rounded-full px-3 text-sm"
              onClick={handleNewEvent}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Event</span>
            </Button>

            <AuthStatus />
          </div>
        </div>

        {/* Expanded Content */}
        {expanded && (
          <motion.div
            className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-2 rounded-lg border bg-background/50 p-3">
              <h3 className="text-sm font-medium">Navigation</h3>
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? "secondary" : "ghost"}
                    className="justify-start gap-2 text-sm"
                    onClick={() => handleNavItemClick(item.id)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2 rounded-lg border bg-background/50 p-3">
              <h3 className="text-sm font-medium">Recent Events</h3>
              <div className="space-y-2">
                {[
                  "Summer Music Festival",
                  "Tech Conference 2023",
                  "Art Exhibition",
                ].map((event, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    className="w-full justify-start text-sm"
                    onClick={() => {
                      router.push("/events");
                      setExpanded(false);
                    }}
                  >
                    {event}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2 rounded-lg border bg-background/50 p-3 md:col-span-2 lg:col-span-1">
              <h3 className="text-sm font-medium">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md bg-background p-2">
                  <p className="text-xs text-muted-foreground">Total Sales</p>
                  <p className="text-lg font-bold">$24,521</p>
                </div>
                <div className="rounded-md bg-background p-2">
                  <p className="text-xs text-muted-foreground">Active Events</p>
                  <p className="text-lg font-bold">12</p>
                </div>
                <div className="rounded-md bg-background p-2">
                  <p className="text-xs text-muted-foreground">Tickets Sold</p>
                  <p className="text-lg font-bold">1,245</p>
                </div>
                <div className="rounded-md bg-background p-2">
                  <p className="text-xs text-muted-foreground">New Users</p>
                  <p className="text-lg font-bold">+85</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
