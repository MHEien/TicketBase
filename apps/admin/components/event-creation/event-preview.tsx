"use client"

import { motion } from "framer-motion"
import { format } from "date-fns"
import { Calendar, Clock, Globe, MapPin, Share2, Ticket, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEventCreation } from "@/hooks/use-event-creation"

export function EventPreview() {
  const { eventData } = useEventCreation()

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Event Preview</CardTitle>
            <CardDescription>Review how your event will appear to attendees.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="desktop" className="w-full">
              <div className="border-b px-4">
                <TabsList className="w-full justify-start rounded-none border-b-0 p-0">
                  <TabsTrigger
                    value="desktop"
                    className="rounded-t-lg data-[state=active]:border-b-2 data-[state=active]:border-primary"
                  >
                    Desktop
                  </TabsTrigger>
                  <TabsTrigger
                    value="mobile"
                    className="rounded-t-lg data-[state=active]:border-b-2 data-[state=active]:border-primary"
                  >
                    Mobile
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="desktop" className="m-0">
                <div className="overflow-hidden rounded-b-lg border-t-0">
                  <div className="relative h-64 w-full bg-muted">
                    {eventData.featuredImage ? (
                      <img
                        src={eventData.featuredImage || "/placeholder.svg"}
                        alt={eventData.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <p className="text-muted-foreground">No featured image selected</p>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

                    <div className="absolute bottom-4 left-4">
                      <Badge className="mb-2">{eventData.category || "Category"}</Badge>
                      <h1 className="text-2xl font-bold text-white drop-shadow-sm">
                        {eventData.title || "Event Title"}
                      </h1>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 p-6">
                    <div className="col-span-2 space-y-6">
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{eventData.startDate ? format(eventData.startDate, "MMM d, yyyy") : "Date TBD"}</span>
                        </div>

                        <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>
                            {eventData.startTime ? eventData.startTime : "Time TBD"}
                            {eventData.endTime ? ` - ${eventData.endTime}` : ""}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
                          {eventData.locationType === "virtual" ? (
                            <>
                              <Globe className="h-4 w-4 text-primary" />
                              <span>Virtual Event</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="h-4 w-4 text-primary" />
                              <span>
                                {eventData.venueName ? `${eventData.venueName}, ${eventData.city}` : "Location TBD"}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-lg font-medium">About This Event</h2>
                        <p className="text-muted-foreground">{eventData.description || "No description provided."}</p>
                      </div>

                      {eventData.galleryImages.length > 0 && (
                        <div className="space-y-2">
                          <h2 className="text-lg font-medium">Event Gallery</h2>
                          <div className="grid grid-cols-3 gap-2">
                            {eventData.galleryImages.slice(0, 3).map((image, index) => (
                              <img
                                key={index}
                                src={image || "/placeholder.svg"}
                                alt={`Event gallery ${index + 1}`}
                                className="aspect-square rounded-md object-cover"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Tickets</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {eventData.ticketTypes.length > 0 ? (
                            eventData.ticketTypes.map((ticket, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{ticket.name || "Unnamed Ticket"}</p>
                                  <p className="text-sm text-muted-foreground">{ticket.quantity} available</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold">
                                    {ticket.price > 0 ? `$${ticket.price.toFixed(2)}` : "Free"}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No tickets available</p>
                          )}

                          <Button className="mt-2 w-full gap-2">
                            <Ticket className="h-4 w-4" />
                            <span>Get Tickets</span>
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Share</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Button variant="outline" className="w-full gap-2">
                            <Share2 className="h-4 w-4" />
                            <span>Share Event</span>
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Organizer</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Your Organization</p>
                            <p className="text-sm text-muted-foreground">Event Organizer</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="mobile" className="m-0">
                <div className="mx-auto max-w-sm overflow-hidden rounded-b-lg border-t-0">
                  <div className="relative h-48 w-full bg-muted">
                    {eventData.featuredImage ? (
                      <img
                        src={eventData.featuredImage || "/placeholder.svg"}
                        alt={eventData.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <p className="text-muted-foreground">No featured image selected</p>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

                    <div className="absolute bottom-4 left-4">
                      <Badge className="mb-2">{eventData.category || "Category"}</Badge>
                      <h1 className="text-xl font-bold text-white drop-shadow-sm">
                        {eventData.title || "Event Title"}
                      </h1>
                    </div>
                  </div>

                  <div className="space-y-4 p-4">
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs">
                        <Calendar className="h-3 w-3 text-primary" />
                        <span>{eventData.startDate ? format(eventData.startDate, "MMM d, yyyy") : "Date TBD"}</span>
                      </div>

                      <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs">
                        {eventData.locationType === "virtual" ? (
                          <>
                            <Globe className="h-3 w-3 text-primary" />
                            <span>Virtual Event</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="h-3 w-3 text-primary" />
                            <span>{eventData.venueName ? `${eventData.venueName}` : "Location TBD"}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Tickets</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {eventData.ticketTypes.length > 0 ? (
                          eventData.ticketTypes.slice(0, 2).map((ticket, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium">{ticket.name || "Unnamed Ticket"}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold">
                                  {ticket.price > 0 ? `$${ticket.price.toFixed(2)}` : "Free"}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground">No tickets available</p>
                        )}

                        <Button className="mt-2 w-full gap-2" size="sm">
                          <Ticket className="h-3 w-3" />
                          <span>Get Tickets</span>
                        </Button>
                      </CardContent>
                    </Card>

                    <div className="space-y-2">
                      <h2 className="text-base font-medium">About This Event</h2>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {eventData.description || "No description provided."}
                      </p>
                      <Button variant="link" className="h-auto p-0 text-xs">
                        Read more
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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
            <CardTitle>Publishing Options</CardTitle>
            <CardDescription>Choose how to publish your event.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card className="border-primary bg-primary/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Publish Now</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Make your event visible to the public immediately after saving.
                  </p>
                  <Button className="mt-4 w-full">Publish Event</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Save as Draft</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Save your event as a draft to publish later.</p>
                  <Button variant="outline" className="mt-4 w-full">
                    Save as Draft
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                You can edit your event details at any time after publishing. Attendees will be notified of any
                significant changes.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
