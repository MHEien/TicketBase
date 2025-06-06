"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Tag } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEventCreation } from "@/hooks/use-event-creation";

export function EventBasicDetails() {
  const { eventData, updateEventData } = useEventCreation();
  const [characterCount, setCharacterCount] = useState(
    eventData.description.length,
  );

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setCharacterCount(e.target.value.length);
    updateEventData({ description: e.target.value });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>
              Provide the basic information about your event.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                placeholder="Enter a descriptive title for your event"
                value={eventData.title}
                onChange={(e) => updateEventData({ title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Event Description</Label>
                <span
                  className={`text-xs ${characterCount > 500 ? "text-destructive" : "text-muted-foreground"}`}
                >
                  {characterCount}/1000
                </span>
              </div>
              <Textarea
                id="description"
                placeholder="Describe your event, including what attendees can expect"
                className="min-h-[150px]"
                value={eventData.description}
                onChange={handleDescriptionChange}
                maxLength={1000}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Event Category</Label>
              <Select
                value={eventData.category}
                onValueChange={(value) => updateEventData({ category: value })}
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conference">Conference</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="concert">Concert</SelectItem>
                  <SelectItem value="festival">Festival</SelectItem>
                  <SelectItem value="networking">Networking</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="exhibition">Exhibition</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
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
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
      >
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Date Selection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              In the next step, you'll select the date and time for your event.
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-primary" />
              <span>Time Selection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You'll be able to set the start and end times, as well as the time
              zone.
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Tag className="h-4 w-4 text-primary" />
              <span>Ticket Types</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Later, you'll create different ticket types with custom pricing.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
