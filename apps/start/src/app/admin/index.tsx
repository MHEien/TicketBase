"use client";
import React from "react";
import { usePlugins } from "@/lib/plugins/plugin-context";
import { Suspense } from "react";
import type {
  ExtensionPointContext,
  PlatformSDK,
} from "ticketsplatform-plugin-sdk";

interface DashboardWidgetContext extends ExtensionPointContext {
  timeRange: "today" | "week" | "month" | "year" | "custom";
  startDate?: string;
  endDate?: string;
  filters: {
    eventIds?: string[];
    ticketTypes?: string[];
    paymentMethods?: string[];
  };
  onFilterChange: (filters: DashboardWidgetContext["filters"]) => void;
  onTimeRangeChange: (
    range: DashboardWidgetContext["timeRange"],
    start?: string,
    end?: string,
  ) => void;
}

export default function AdminDashboard() {
  const { getExtensionPoint } = usePlugins();
  const [timeRange, setTimeRange] =
    React.useState<DashboardWidgetContext["timeRange"]>("week");
  const [startDate, setStartDate] = React.useState<string>();
  const [endDate, setEndDate] = React.useState<string>();
  const [filters, setFilters] = React.useState<
    DashboardWidgetContext["filters"]
  >({});
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterValue, setFilterValue] = React.useState("");

  // Get all dashboard widget components from plugins
  const dashboardWidgets = getExtensionPoint("dashboard-widget");

  // Handle time range changes
  const handleTimeRangeChange = (
    range: DashboardWidgetContext["timeRange"],
    start?: string,
    end?: string,
  ) => {
    setTimeRange(range);
    setStartDate(start);
    setEndDate(end);
  };

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Time Range Selector */}
      <div className="mb-8">
        <div className="flex gap-4">
          {["today", "week", "month", "year"].map((range) => (
            <button
              key={range}
              onClick={() =>
                handleTimeRangeChange(
                  range as DashboardWidgetContext["timeRange"],
                )
              }
              className={`px-4 py-2 rounded ${
                timeRange === range
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
          <button
            onClick={() => handleTimeRangeChange("custom")}
            className={`px-4 py-2 rounded ${
              timeRange === "custom"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Custom Range
          </button>
        </div>

        {/* Custom date range inputs */}
        {timeRange === "custom" && (
          <div className="flex gap-4 mt-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                handleTimeRangeChange("custom", e.target.value, endDate)
              }
              className="px-4 py-2 border rounded"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                handleTimeRangeChange("custom", startDate, e.target.value)
              }
              className="px-4 py-2 border rounded"
            />
          </div>
        )}
      </div>

      {/* Plugin Dashboard Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardWidgets.map((Widget, index) => (
          <Suspense
            key={index}
            fallback={
              <div className="border rounded-lg p-6 bg-white shadow-sm animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
              </div>
            }
          >
            <div className="border rounded-lg p-6 bg-white shadow-sm">
              <Widget
                context={{
                  timeRange,
                  startDate,
                  endDate,
                  filters,
                  onFilterChange: handleFilterChange,
                  onTimeRangeChange: handleTimeRangeChange,
                }}
                sdk={window.PluginSDK as unknown as PlatformSDK}
              />
            </div>
          </Suspense>
        ))}
      </div>
    </div>
  );
}
