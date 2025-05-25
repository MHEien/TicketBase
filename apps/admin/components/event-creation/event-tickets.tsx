"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DollarSign, Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useEventCreation } from "@/hooks/use-event-creation"

export function EventTickets() {
  const { eventData, updateTicketType, addTicketType, removeTicketType } = useEventCreation()
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null)

  const toggleTicketExpand = (id: string) => {
    setExpandedTicket(expandedTicket === id ? null : id)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Ticket Types</CardTitle>
                <CardDescription>Create different ticket options for your event.</CardDescription>
              </div>
              <Button onClick={addTicketType} variant="outline" size="sm" className="gap-1 rounded-full">
                <Plus className="h-4 w-4" />
                <span>Add Ticket</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatePresence>
              {eventData.ticketTypes.map((ticket, index) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                  transition={{ duration: 0.3 }}
                  className="rounded-lg border"
                >
                  <div className="flex items-center justify-between border-b p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium">{ticket.name || "Unnamed Ticket"}</h3>
                        <p className="text-sm text-muted-foreground">
                          {ticket.price > 0 ? `$${ticket.price.toFixed(2)}` : "Free"} • {ticket.quantity} available
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTicketExpand(ticket.id)}
                        className="rounded-full"
                      >
                        {expandedTicket === ticket.id ? "Collapse" : "Edit"}
                      </Button>
                      {eventData.ticketTypes.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTicketType(ticket.id)}
                          className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedTicket === ticket.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 p-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor={`ticket-name-${ticket.id}`}>Ticket Name</Label>
                          <Input
                            id={`ticket-name-${ticket.id}`}
                            placeholder="e.g., General Admission, VIP, Early Bird"
                            value={ticket.name}
                            onChange={(e) => updateTicketType(ticket.id, { name: e.target.value })}
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`ticket-price-${ticket.id}`}>Price</Label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                id={`ticket-price-${ticket.id}`}
                                type="number"
                                min="0"
                                step="0.01"
                                className="pl-10"
                                value={ticket.price}
                                onChange={(e) =>
                                  updateTicketType(ticket.id, { price: Number.parseFloat(e.target.value) || 0 })
                                }
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`ticket-quantity-${ticket.id}`}>Quantity Available</Label>
                            <Input
                              id={`ticket-quantity-${ticket.id}`}
                              type="number"
                              min="1"
                              value={ticket.quantity}
                              onChange={(e) =>
                                updateTicketType(ticket.id, { quantity: Number.parseInt(e.target.value) || 0 })
                              }
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`ticket-description-${ticket.id}`}>Description (Optional)</Label>
                          <Textarea
                            id={`ticket-description-${ticket.id}`}
                            placeholder="Describe what's included with this ticket type"
                            value={ticket.description}
                            onChange={(e) => updateTicketType(ticket.id, { description: e.target.value })}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>

            {eventData.ticketTypes.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
                <p className="mb-4 text-center text-muted-foreground">
                  No ticket types added yet. Add your first ticket type to continue.
                </p>
                <Button onClick={addTicketType} variant="outline" className="gap-1 rounded-full">
                  <Plus className="h-4 w-4" />
                  <span>Add Ticket Type</span>
                </Button>
              </div>
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
            <CardTitle>Advanced Ticket Settings</CardTitle>
            <CardDescription>Configure additional options for your tickets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="promo-codes">Promotional Codes</Label>
                <p className="text-sm text-muted-foreground">Allow attendees to use discount codes</p>
              </div>
              <Switch id="promo-codes" />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="ticket-transfer">Ticket Transfers</Label>
                <p className="text-sm text-muted-foreground">Allow attendees to transfer tickets to others</p>
              </div>
              <Switch id="ticket-transfer" />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="waitlist">Waitlist</Label>
                <p className="text-sm text-muted-foreground">Enable waitlist when tickets are sold out</p>
              </div>
              <Switch id="waitlist" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
