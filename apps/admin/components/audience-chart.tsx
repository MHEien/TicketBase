"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from "recharts"
import { useState } from "react"

// Sample data for the chart
const data = [
  { name: "18-24", value: 25, color: "hsl(var(--chart-1))" },
  { name: "25-34", value: 35, color: "hsl(var(--chart-2))" },
  { name: "35-44", value: 20, color: "hsl(var(--chart-3))" },
  { name: "45-54", value: 12, color: "hsl(var(--chart-4))" },
  { name: "55+", value: 8, color: "hsl(var(--chart-5))" },
]

const interestData = [
  { name: "Music", value: 40, color: "hsl(var(--chart-1))" },
  { name: "Technology", value: 25, color: "hsl(var(--chart-2))" },
  { name: "Arts", value: 15, color: "hsl(var(--chart-3))" },
  { name: "Sports", value: 12, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 8, color: "hsl(var(--chart-5))" },
]

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 5}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  )
}

export function AudienceChart() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeChart, setActiveChart] = useState<"age" | "interests">("age")

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  return (
    <div className="h-full">
      <div className="mb-4 flex items-center justify-center gap-4">
        <button
          className={`rounded-full px-4 py-1 text-sm font-medium ${activeChart === "age" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          onClick={() => setActiveChart("age")}
        >
          Age Groups
        </button>
        <button
          className={`rounded-full px-4 py-1 text-sm font-medium ${activeChart === "interests" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          onClick={() => setActiveChart("interests")}
        >
          Interests
        </button>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={activeChart === "age" ? data : interestData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            onMouseEnter={onPieEnter}
          >
            {(activeChart === "age" ? data : interestData).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: payload[0].payload.color }} />
                        <span className="text-sm font-medium">{payload[0].name}</span>
                      </div>
                      <div className="text-right text-sm font-medium">{payload[0].value}%</div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            formatter={(value, entry, index) => <span className="text-xs">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
