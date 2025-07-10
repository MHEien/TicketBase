"use client";

import { useState, useCallback } from "react";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { addDays, format, isAfter, isBefore, startOfDay } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface DateRangePickerProps {
  /** The selected date range */
  value?: DateRange;
  /** Callback when the date range changes */
  onValueChange?: (range: DateRange | undefined) => void;
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** CSS class name */
  className?: string;
  /** Whether to show preset options */
  showPresets?: boolean;
  /** Custom preset options */
  presets?: Array<{
    label: string;
    value: DateRange;
  }>;
}

// Default preset options
const defaultPresets = [
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

export function DateRangePicker({
  value,
  onValueChange,
  disabled = false,
  placeholder = "Select date range",
  className,
  showPresets = true,
  presets = defaultPresets,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>("");

  // Check if current value matches a preset
  const getCurrentPreset = useCallback(() => {
    if (!value?.from || !value?.to) return "";
    
    const matchingPreset = presets.find(preset => {
      const presetFrom = startOfDay(preset.value.from!);
      const presetTo = startOfDay(preset.value.to!);
      const valueFrom = startOfDay(value.from!);
      const valueTo = startOfDay(value.to!);
      
      return presetFrom.getTime() === valueFrom.getTime() && 
             presetTo.getTime() === valueTo.getTime();
    });
    
    return matchingPreset?.label || "Custom range";
  }, [value, presets]);

  const handlePresetSelect = (presetLabel: string) => {
    const preset = presets.find(p => p.label === presetLabel);
    if (preset) {
      setSelectedPreset(presetLabel);
      onValueChange?.(preset.value);
    }
  };

  const handleCalendarSelect = (range: DateRange | undefined) => {
    onValueChange?.(range);
    setSelectedPreset(""); // Clear preset selection when using calendar
    if (range?.from && range?.to) {
      setIsOpen(false);
    }
  };

  const formatDateRange = () => {
    if (!value?.from) {
      return placeholder;
    }

    if (value.from && !value.to) {
      return format(value.from, "LLL dd, y");
    }

    if (value.from && value.to) {
      return `${format(value.from, "LLL dd")} - ${format(value.to, "LLL dd, y")}`;
    }

    return placeholder;
  };

  const currentPreset = getCurrentPreset();

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date-range-picker"
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !value && "text-muted-foreground",
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {currentPreset !== "Custom range" ? currentPreset : formatDateRange()}
            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col sm:flex-row">
            {showPresets && (
              <div className="border-b sm:border-b-0 sm:border-r">
                <div className="p-3">
                  <h4 className="text-sm font-medium mb-3">Quick select</h4>
                  <div className="grid gap-1">
                    {presets.map((preset) => (
                      <Button
                        key={preset.label}
                        variant="ghost"
                        className="justify-start h-auto p-2 text-sm font-normal"
                        onClick={() => handlePresetSelect(preset.label)}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="p-3">
              <h4 className="text-sm font-medium mb-3">Custom range</h4>
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={value?.from}
                selected={value}
                onSelect={handleCalendarSelect}
                numberOfMonths={2}
                disabled={(date) =>
                  isAfter(date, new Date()) || isBefore(date, new Date("1900-01-01"))
                }
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
} 