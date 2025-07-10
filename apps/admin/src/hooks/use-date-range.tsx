"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";

interface DateRangeContextType {
  /** Current selected date range */
  dateRange: DateRange;
  /** Update the date range */
  setDateRange: (range: DateRange) => void;
  /** Check if a custom range is selected */
  isCustomRange: boolean;
  /** Get the current range label */
  getCurrentRangeLabel: () => string;
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(
  undefined,
);

// Default to last 30 days
const defaultDateRange: DateRange = {
  from: addDays(new Date(), -29),
  to: new Date(),
};

// Preset configurations for easy comparison
const presets = [
  {
    label: "Last 7 days",
    value: {
      from: addDays(new Date(), -6),
      to: new Date(),
    },
  },
  {
    label: "Last 30 days",
    value: {
      from: addDays(new Date(), -29),
      to: new Date(),
    },
  },
  {
    label: "Last 90 days",
    value: {
      from: addDays(new Date(), -89),
      to: new Date(),
    },
  },
  {
    label: "Last 6 months",
    value: {
      from: addDays(new Date(), -180),
      to: new Date(),
    },
  },
  {
    label: "Last year",
    value: {
      from: addDays(new Date(), -365),
      to: new Date(),
    },
  },
];

interface DateRangeProviderProps {
  children: ReactNode;
}

export function DateRangeProvider({ children }: DateRangeProviderProps) {
  const [dateRange, setDateRangeState] = useState<DateRange>(defaultDateRange);

  const setDateRange = useCallback((range: DateRange) => {
    setDateRangeState(range);
  }, []);

  const getCurrentRangeLabel = useCallback(() => {
    if (!dateRange.from || !dateRange.to) return "No range selected";

    // Check if current range matches a preset
    const matchingPreset = presets.find((preset) => {
      const presetFrom = new Date(
        preset.value.from!.getFullYear(),
        preset.value.from!.getMonth(),
        preset.value.from!.getDate(),
      );
      const presetTo = new Date(
        preset.value.to!.getFullYear(),
        preset.value.to!.getMonth(),
        preset.value.to!.getDate(),
      );
      const rangeFrom = new Date(
        dateRange.from!.getFullYear(),
        dateRange.from!.getMonth(),
        dateRange.from!.getDate(),
      );
      const rangeTo = new Date(
        dateRange.to!.getFullYear(),
        dateRange.to!.getMonth(),
        dateRange.to!.getDate(),
      );

      return (
        presetFrom.getTime() === rangeFrom.getTime() &&
        presetTo.getTime() === rangeTo.getTime()
      );
    });

    return matchingPreset?.label || "Custom range";
  }, [dateRange]);

  const isCustomRange = getCurrentRangeLabel() === "Custom range";

  const value: DateRangeContextType = {
    dateRange,
    setDateRange,
    isCustomRange,
    getCurrentRangeLabel,
  };

  return (
    <DateRangeContext.Provider value={value}>
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange(): DateRangeContextType {
  const context = useContext(DateRangeContext);
  if (context === undefined) {
    throw new Error("useDateRange must be used within a DateRangeProvider");
  }
  return context;
}
