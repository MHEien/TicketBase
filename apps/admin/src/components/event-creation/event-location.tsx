"use client";

import { motion } from "framer-motion";
import { Globe, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEventCreation } from "@/hooks/use-event-creation";

export function EventLocation() {
  const { eventData, updateEventData } = useEventCreation();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Event Location</CardTitle>
            <CardDescription>
              Choose where your event will take place.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={eventData.locationType}
              onValueChange={(value: "physical" | "virtual" | "hybrid") =>
                updateEventData({ locationType: value })
              }
              className="grid grid-cols-1 gap-4 md:grid-cols-3"
            >
              <div>
                <RadioGroupItem
                  value="physical"
                  id="physical"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="physical"
                  className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <MapPin className="mb-3 h-6 w-6" />
                  <div className="text-center">
                    <p className="font-medium">In-Person</p>
                    <p className="text-sm text-muted-foreground">
                      Physical venue
                    </p>
                  </div>
                </Label>
              </div>

              <div>
                <RadioGroupItem
                  value="virtual"
                  id="virtual"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="virtual"
                  className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Globe className="mb-3 h-6 w-6" />
                  <div className="text-center">
                    <p className="font-medium">Virtual</p>
                    <p className="text-sm text-muted-foreground">Online only</p>
                  </div>
                </Label>
              </div>

              <div>
                <RadioGroupItem
                  value="hybrid"
                  id="hybrid"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="hybrid"
                  className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="mb-3 flex">
                    <MapPin className="h-6 w-6" />
                    <Globe className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Hybrid</p>
                    <p className="text-sm text-muted-foreground">
                      In-person & online
                    </p>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            {(eventData.locationType === "physical" ||
              eventData.locationType === "hybrid") && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 rounded-md border p-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="venue-name">Venue Name</Label>
                  <Input
                    id="venue-name"
                    placeholder="e.g., Convention Center, Hotel Name"
                    value={eventData.venueName}
                    onChange={(e) =>
                      updateEventData({ venueName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    placeholder="Street address"
                    value={eventData.address}
                    onChange={(e) =>
                      updateEventData({ address: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={eventData.city}
                      onChange={(e) =>
                        updateEventData({ city: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      placeholder="State/Province"
                      value={eventData.state}
                      onChange={(e) =>
                        updateEventData({ state: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="zip">Postal/Zip Code</Label>
                    <Input
                      id="zip"
                      placeholder="Postal/Zip code"
                      value={eventData.zipCode}
                      onChange={(e) =>
                        updateEventData({ zipCode: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="Country"
                      value={eventData.country}
                      onChange={(e) =>
                        updateEventData({ country: e.target.value })
                      }
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {(eventData.locationType === "virtual" ||
              eventData.locationType === "hybrid") && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 rounded-md border p-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="virtual-url">Virtual Event URL</Label>
                  <Input
                    id="virtual-url"
                    placeholder="e.g., Zoom link, website URL"
                    value={eventData.virtualEventUrl}
                    onChange={(e) =>
                      updateEventData({ virtualEventUrl: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be shared with attendees after they register.
                  </p>
                </div>
              </motion.div>
            )}
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
            <CardTitle>Location Visibility</CardTitle>
            <CardDescription>
              Control how your event location is displayed to attendees.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                By default, your event location will be visible to all
                attendees. For private events, you can choose to share the exact
                location only with registered attendees.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
