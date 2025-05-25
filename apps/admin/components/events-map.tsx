"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function EventsMap() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Sample event locations
  const locations = [
    { id: 1, name: "New York", x: 75, y: 40, size: 18, attendees: 1245 },
    { id: 2, name: "Los Angeles", x: 20, y: 45, size: 16, attendees: 980 },
    { id: 3, name: "Chicago", x: 65, y: 38, size: 14, attendees: 750 },
    { id: 4, name: "Miami", x: 80, y: 60, size: 12, attendees: 620 },
    { id: 5, name: "Austin", x: 50, y: 55, size: 10, attendees: 480 },
    { id: 6, name: "Seattle", x: 18, y: 25, size: 9, attendees: 420 },
    { id: 7, name: "Boston", x: 85, y: 35, size: 8, attendees: 380 },
    { id: 8, name: "Denver", x: 40, y: 42, size: 7, attendees: 320 },
    { id: 9, name: "Nashville", x: 70, y: 48, size: 6, attendees: 280 },
    { id: 10, name: "Portland", x: 15, y: 30, size: 5, attendees: 220 },
  ];

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg bg-background">
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 100 70">
          <path
            d="M0,10 L100,10 L100,70 L0,70 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.1"
          />
          {/* US outline - simplified */}
          <path
            d="M10,20 C15,15 20,15 25,20 C30,25 35,25 40,20 C45,15 50,15 55,20 C60,25 65,25 70,20 C75,15 80,15 85,20 C90,25 95,25 100,20 L100,30 C95,35 90,35 85,30 C80,25 75,25 70,30 C65,35 60,35 55,30 C50,25 45,25 40,30 C35,35 30,35 25,30 C20,25 15,25 10,30 L10,20 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.2"
          />
          {/* Grid lines */}
          {[...Array(10)].map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={10 + i * 6}
              x2="100"
              y2={10 + i * 6}
              stroke="currentColor"
              strokeWidth="0.05"
            />
          ))}
          {[...Array(10)].map((_, i) => (
            <line
              key={`v-${i}`}
              x1={10 + i * 9}
              y1="10"
              x2={10 + i * 9}
              y2="70"
              stroke="currentColor"
              strokeWidth="0.05"
            />
          ))}
        </svg>
      </div>

      {loaded && (
        <>
          {locations.map((location) => (
            <motion.div
              key={location.id}
              className="absolute"
              style={{
                left: `${location.x}%`,
                top: `${location.y}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: location.id * 0.1 }}
            >
              <div className="relative">
                <motion.div
                  className="absolute -inset-1 rounded-full bg-primary/20"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                />
                <div
                  className="relative flex items-center justify-center rounded-full bg-primary text-primary-foreground"
                  style={{
                    width: `${location.size}px`,
                    height: `${location.size}px`,
                  }}
                >
                  <span className="sr-only">{location.name}</span>
                </div>
                <div className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap text-xs font-medium">
                  {location.name}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Connection lines */}
          <svg className="absolute inset-0 h-full w-full">
            {locations.map((location, i) => {
              if (i === locations.length - 1) return null;
              const nextLocation = locations[i + 1];
              return (
                <motion.line
                  key={`line-${i}`}
                  x1={`${location.x}%`}
                  y1={`${location.y}%`}
                  x2={`${nextLocation.x}%`}
                  y2={`${nextLocation.y}%`}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeDasharray="2 2"
                  className="opacity-20"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.2 }}
                  transition={{ duration: 1, delay: i * 0.2 }}
                />
              );
            })}
          </svg>
        </>
      )}
    </div>
  );
}
