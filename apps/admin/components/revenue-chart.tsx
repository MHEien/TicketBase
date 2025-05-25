"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Sample data for the chart
const data = [
  { name: "Week 1", revenue: 4000, projected: 4200 },
  { name: "Week 2", revenue: 5000, projected: 5100 },
  { name: "Week 3", revenue: 6000, projected: 5800 },
  { name: "Week 4", revenue: 7000, projected: 6900 },
  { name: "Week 5", revenue: 8000, projected: 8200 },
  { name: "Week 6", revenue: 9500, projected: 9000 },
  { name: "Week 7", revenue: 11000, projected: 10500 },
  { name: "Week 8", revenue: 12500, projected: 12000 },
];

export function RevenueChart() {
  return (
    <ChartContainer
      config={{
        revenue: {
          label: "Actual Revenue",
          color: "hsl(var(--chart-1))",
        },
        projected: {
          label: "Projected Revenue",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickMargin={10}
            tickFormatter={(value) => `$${value}`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="revenue"
            fill="var(--color-revenue)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="projected"
            fill="var(--color-projected)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
