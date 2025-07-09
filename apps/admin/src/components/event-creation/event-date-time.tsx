"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/src/lib/utils";
import { useEventCreation } from "@/hooks/use-event-creation";

export function EventDateTime() {
  const { eventData, updateEventData } = useEventCreation();
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const timeZones = [
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "America/Anchorage", label: "Alaska Time (AKT)" },
    { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
    { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
    { value: "Europe/Paris", label: "Central European Time (CET)" },
    { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
    { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Date & Time</CardTitle>
            <CardDescription>
              Set when your event will take place.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <button
                      id="start-date"
                      className={cn(
                        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        !eventData.startDate && "text-muted-foreground",
                      )}
                    >
                      {eventData.startDate
                        ? format(eventData.startDate, "PPP")
                        : "Select date"}
                      <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={eventData.startDate || undefined}
                      onSelect={(date) => {
                        updateEventData({ startDate: date });
                        setStartDateOpen(false);

                        // If end date is before start date, update it
                        if (
                          eventData.endDate &&
                          date &&
                          eventData.endDate < date
                        ) {
                          updateEventData({ endDate: date });
                        }
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                  <PopoverTrigger asChild>
                    <button
                      id="end-date"
                      className={cn(
                        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        !eventData.endDate && "text-muted-foreground",
                      )}
                      disabled={!eventData.startDate}
                    >
                      {eventData.endDate
                        ? format(eventData.endDate, "PPP")
                        : "Select date"}
                      <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={eventData.endDate || undefined}
                      onSelect={(date) => {
                        updateEventData({ endDate: date });
                        setEndDateOpen(false);
                      }}
                      disabled={(date) =>
                        date < new Date() ||
                        (eventData.startDate
                          ? date < eventData.startDate
                          : false)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="start-time"
                    type="time"
                    className="pl-10"
                    value={eventData.startTime}
                    onChange={(e) =>
                      updateEventData({ startTime: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="end-time"
                    type="time"
                    className="pl-10"
                    value={eventData.endTime}
                    onChange={(e) =>
                      updateEventData({ endTime: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Time Zone</Label>
              <Select
                value={eventData.timeZone}
                onValueChange={(value) => updateEventData({ timeZone: value })}
              >
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select time zone" />
                </SelectTrigger>
                <SelectContent>
                  {timeZones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Duration & Schedule</CardTitle>
            <CardDescription>
              Add additional schedule information for your event.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                For multi-day events or events with complex schedules, you can
                add a detailed agenda in the event description or create a
                custom schedule after saving the event.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
