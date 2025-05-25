"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data for the chart
const data = [
  { date: "May 10", revenue: 1200, tickets: 45 },
  { date: "May 11", revenue: 1800, tickets: 67 },
  { date: "May 12", revenue: 1400, tickets: 53 },
  { date: "May 13", revenue: 2200, tickets: 81 },
  { date: "May 14", revenue: 1900, tickets: 70 },
  { date: "May 15", revenue: 2400, tickets: 88 },
  { date: "May 16", revenue: 2100, tickets: 77 },
  { date: "May 17", revenue: 2800, tickets: 103 },
  { date: "May 18", revenue: 2300, tickets: 85 },
  { date: "May 19", revenue: 2900, tickets: 107 },
  { date: "May 20", revenue: 2700, tickets: 99 },
  { date: "May 21", revenue: 3100, tickets: 114 },
  { date: "May 22", revenue: 3400, tickets: 125 },
  { date: "May 23", revenue: 3200, tickets: 118 },
]

export function SalesChart() {
  return (
    <ChartContainer
      config={{
        revenue: {
          label: "Revenue",
          color: "hsl(var(--chart-1))",
        },
        tickets: {
          label: "Tickets",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-tickets)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-tickets)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickMargin={10} />
          <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickMargin={10} />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="revenue"
            yAxisId="left"
            stroke="var(--color-revenue)"
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
          <Area
            type="monotone"
            dataKey="tickets"
            yAxisId="right"
            stroke="var(--color-tickets)"
            fillOpacity={1}
            fill="url(#colorTickets)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
