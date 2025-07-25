import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return date.toLocaleDateString();
};

export const createDefaultPageData = () => ({
  content: [
    {
      type: "Hero",
      props: {
        id: "hero-1",
      },
    },
  ],
  root: { props: { pageTitle: "New Event Page" } },
});

export const createNewPageSettings = () => ({
  title: "Untitled Page",
  slug: `page-${Date.now()}`,
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  isHomepage: false,
});

export const getAutoSaveStatusConfig = (status: string) => {
  const configs = {
    saved: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      message: "All changes saved",
    },
    saving: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
      message: "Auto-saving...",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      message: "Save failed",
    },
    unsaved: {
      bg: "bg-slate-50",
      border: "border-slate-200",
      text: "text-slate-800",
      message: "Unsaved changes",
    },
  };

  return configs[status as keyof typeof configs] || configs.unsaved;
};
