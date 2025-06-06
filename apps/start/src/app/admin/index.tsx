import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WidgetDashboard } from "@/components/widget-dashboard";
import { DataVisualization } from "@/components/data-visualization";
import { PluginGallery } from "@/components/plugin-gallery";
import { useTheme } from "@/components/theme-provider";
import { useCommandMenu } from "@/hooks/use-command-menu";
import { useDashboardNav } from "@/hooks/useDashboardNav";

type DashboardSection = "overview" | "analytics" | "plugins";

export const Route = createFileRoute({
  component: Dashboard,
});

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const { isOpen, setIsOpen } = useCommandMenu();
  const { activeSection, setActiveSection } = useDashboardNav();

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const sections: Record<DashboardSection, React.ReactElement> = {
    overview: <WidgetDashboard />,
    analytics: <DataVisualization />,
    plugins: <PluginGallery />,
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        {sections[activeSection as DashboardSection]}
      </motion.div>
    </AnimatePresence>
  );
}
