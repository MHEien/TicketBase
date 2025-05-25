"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  BarChart3,
  Calendar,
  Clock,
  DollarSign,
  Layers,
  Ticket,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SalesChart } from "@/components/sales-chart"

export function WidgetDashboard() {
  const [activeWidget, setActiveWidget] = useState<string | null>(null)

  const handleWidgetClick = (widgetId: string) => {
    setActiveWidget(activeWidget === widgetId ? null : widgetId)
  }

  return (
    <div className="h-full space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your events.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span>May 9 - June 9, 2025</span>
          </Button>
        </div>
      </div>

      {/* Fluid Widget Layout */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Key Metrics */}
        {[
          { id: "revenue", title: "Total Revenue", value: "$124,521", change: "+12.5%", icon: DollarSign, trend: "up" },
          { id: "tickets", title: "Tickets Sold", value: "3,856", change: "+24.3%", icon: Ticket, trend: "up" },
          { id: "events", title: "Active Events", value: "12", change: "-2.1%", icon: Calendar, trend: "down" },
          { id: "users", title: "New Users", value: "856", change: "+18.7%", icon: Users, trend: "up" },
        ].map((metric) => (
          <motion.div key={metric.id} whileHover={{ y: -5, transition: { duration: 0.2 } }} className="group">
            <Card className="border-transparent bg-background/60 transition-all duration-300 hover:border-primary/20 hover:bg-background/80 hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                    <h3 className="mt-1 text-2xl font-bold">{metric.value}</h3>
                    <div className="mt-1 flex items-center gap-1">
                      {metric.trend === "up" ? (
                        <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-rose-500" />
                      )}
                      <span className={metric.trend === "up" ? "text-xs text-emerald-500" : "text-xs text-rose-500"}>
                        {metric.change}
                      </span>
                      <span className="text-xs text-muted-foreground">vs last month</span>
                    </div>
                  </div>
                  <div className="rounded-full border border-primary/10 bg-background p-2 shadow-sm">
                    <metric.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Widgets */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Sales Chart Widget - Spans 2 columns */}
        <motion.div className="lg:col-span-2" layoutId="sales-chart" onClick={() => handleWidgetClick("sales-chart")}>
          <Card
            className={`cursor-pointer border-transparent transition-all duration-300 hover:border-primary/20 hover:shadow-md ${activeWidget === "sales-chart" ? "border-primary/20 shadow-md" : ""}`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Daily ticket sales and revenue</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-full">
                  Last 30 days
                </Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <SalesChart />
            </CardContent>
            <CardFooter className="flex items-center justify-between pt-0">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-primary"></div>
                  <span className="text-xs text-muted-foreground">Revenue</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-primary/30"></div>
                  <span className="text-xs text-muted-foreground">Tickets</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                <span>View Details</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div layoutId="upcoming-events" onClick={() => handleWidgetClick("upcoming-events")}>
          <Card
            className={`h-full cursor-pointer border-transparent transition-all duration-300 hover:border-primary/20 hover:shadow-md ${activeWidget === "upcoming-events" ? "border-primary/20 shadow-md" : ""}`}
          >
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Your next 3 scheduled events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Summer Music Festival", date: "Jun 15, 2025", tickets: 1245, sold: 876 },
                { name: "Tech Conference 2025", date: "Jun 22, 2025", tickets: 500, sold: 342 },
                { name: "Art Exhibition", date: "Jul 05, 2025", tickets: 300, sold: 89 },
              ].map((event, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{event.name}</h4>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{event.date}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tickets Sold</span>
                      <span className="font-medium">
                        {event.sold}/{event.tickets}
                      </span>
                    </div>
                    <Progress value={(event.sold / event.tickets) * 100} className="h-2" />
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full gap-1">
                <Calendar className="h-4 w-4" />
                <span>View All Events</span>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row Widgets */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activity */}
        <motion.div layoutId="recent-activity" onClick={() => handleWidgetClick("recent-activity")}>
          <Card
            className={`cursor-pointer border-transparent transition-all duration-300 hover:border-primary/20 hover:shadow-md ${activeWidget === "recent-activity" ? "border-primary/20 shadow-md" : ""}`}
          >
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions on your platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  user: "Sarah Johnson",
                  action: "purchased 2 tickets",
                  time: "5 minutes ago",
                  avatar: "/abstract-geometric-shapes.png",
                },
                {
                  user: "Michael Chen",
                  action: "created a new event",
                  time: "2 hours ago",
                  avatar: "/number-two-graphic.png",
                },
                {
                  user: "Emma Williams",
                  action: "installed a new plugin",
                  time: "Yesterday",
                  avatar: "/abstract-geometric-shapes.png",
                },
                {
                  user: "James Wilson",
                  action: "updated event details",
                  time: "2 days ago",
                  avatar: "/abstract-geometric-shapes.png",
                },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user} />
                    <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full">
                View All Activity
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Popular Plugins */}
        <motion.div layoutId="popular-plugins" onClick={() => handleWidgetClick("popular-plugins")}>
          <Card
            className={`cursor-pointer border-transparent transition-all duration-300 hover:border-primary/20 hover:shadow-md ${activeWidget === "popular-plugins" ? "border-primary/20 shadow-md" : ""}`}
          >
            <CardHeader>
              <CardTitle>Popular Plugins</CardTitle>
              <CardDescription>Most installed extensions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Payment Gateway", installs: "2.4k", icon: DollarSign },
                { name: "Analytics Suite", installs: "1.8k", icon: BarChart3 },
                { name: "Social Sharing", installs: "1.2k", icon: Users },
                { name: "Event Templates", installs: "950", icon: Layers },
              ].map((plugin, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <plugin.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{plugin.name}</p>
                      <p className="text-xs text-muted-foreground">{plugin.installs} installs</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 rounded-full">
                    Install
                  </Button>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full gap-1">
                <Layers className="h-4 w-4" />
                <span>Browse Plugin Gallery</span>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div layoutId="performance-metrics" onClick={() => handleWidgetClick("performance-metrics")}>
          <Card
            className={`cursor-pointer border-transparent transition-all duration-300 hover:border-primary/20 hover:shadow-md ${activeWidget === "performance-metrics" ? "border-primary/20 shadow-md" : ""}`}
          >
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Key indicators for your platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Conversion Rate", value: "24.8%", change: "+2.4%", icon: TrendingUp },
                { name: "Avg. Ticket Price", value: "$85.50", change: "+$4.30", icon: Ticket },
                { name: "User Retention", value: "68.2%", change: "+5.1%", icon: Users },
                { name: "Plugin Usage", value: "12 active", change: "+3", icon: Layers },
              ].map((metric, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <metric.icon className="h-4 w-4 text-primary" />
                      <span className="font-medium">{metric.name}</span>
                    </div>
                    <Badge variant="outline" className="gap-1 rounded-full">
                      <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                      <span className="text-xs text-emerald-500">{metric.change}</span>
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full gap-1">
                <BarChart3 className="h-4 w-4" />
                <span>View Detailed Analytics</span>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
