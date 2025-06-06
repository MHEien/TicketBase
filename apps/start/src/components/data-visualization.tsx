"use client";

import { useState } from "react";
import {
  BarChart3,
  Calendar,
  ChevronDown,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { SalesChart } from "@/components/sales-chart";
import { RevenueChart } from "@/components/revenue-chart";
import { EventsMap } from "@/components/events-map";
import { AudienceChart } from "@/components/audience-chart";

export function DataVisualization() {
  const [timeRange, setTimeRange] = useState("30d");

  return (
    <div className="h-full space-y-6 overflow-y-auto">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Detailed insights into your ticket sales and events.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span>May 9 - June 9, 2025</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Total Revenue",
                value: "$124,521",
                change: "+12.5%",
                icon: BarChart3,
              },
              {
                title: "Tickets Sold",
                value: "3,856",
                change: "+24.3%",
                icon: Calendar,
              },
              {
                title: "Conversion Rate",
                value: "24.8%",
                change: "+2.4%",
                icon: BarChart3,
              },
              {
                title: "Avg. Order Value",
                value: "$85.50",
                change: "+$4.30",
                icon: BarChart3,
              },
            ].map((metric, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {metric.title}
                      </p>
                      <h3 className="mt-1 text-2xl font-bold">
                        {metric.value}
                      </h3>
                      <p className="mt-1 text-xs text-emerald-500">
                        {metric.change} vs last period
                      </p>
                    </div>
                    <div className="rounded-full border border-primary/10 bg-primary/5 p-2">
                      <metric.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>
                  Daily revenue from ticket sales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <RevenueChart />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>
                  Where your attendees are coming from
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <EventsMap />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audience Demographics</CardTitle>
                <CardDescription>
                  Age and interests of your attendees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <AudienceChart />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Performance</CardTitle>
              <CardDescription>
                Detailed breakdown of ticket sales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <SalesChart />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Locations</CardTitle>
              <CardDescription>
                Geographic distribution of your events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <EventsMap />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audience Insights</CardTitle>
              <CardDescription>
                Demographics and behavior of your attendees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <AudienceChart />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
