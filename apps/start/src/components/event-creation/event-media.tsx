"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { ImageIcon, Upload, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Label } from "@repo/ui/label";
import { Button } from "@repo/ui/button";
import { useEventCreation } from "@/hooks/use-event-creation";

export function EventMedia() {
  const { eventData, updateEventData } = useEventCreation();
  const [dragActive, setDragActive] = useState(false);

  // For demo purposes, we'll use placeholder images
  const placeholderImages = [
    "/vibrant-music-festival.png",
    "/conference-event.png",
    "/art-exhibition.png",
    "/vibrant-sports-event.png",
    "/networking-event.png",
    "/workshop-event.png",
  ];

  const handleFeaturedImageSelect = (image: string) => {
    updateEventData({ featuredImage: image });
  };

  const handleGalleryImageSelect = (image: string) => {
    if (!eventData.galleryImages.includes(image)) {
      updateEventData({ galleryImages: [...eventData.galleryImages, image] });
    }
  };

  const handleGalleryImageRemove = (image: string) => {
    updateEventData({
      galleryImages: eventData.galleryImages.filter((img) => img !== image),
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Featured Image</CardTitle>
            <CardDescription>
              Select a main image that represents your event.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {eventData.featuredImage ? (
              <div className="relative overflow-hidden rounded-lg border">
                <img
                  src={eventData.featuredImage || "/placeholder.svg"}
                  alt="Featured event image"
                  className="aspect-video w-full object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                  onClick={() => updateEventData({ featuredImage: "" })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className={`flex flex-col items-center justify-center rounded-lg border border-dashed p-12 transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/20"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
              >
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <ImageIcon className="h-8 w-8 text-primary" />
                </div>
                <p className="mb-2 text-lg font-medium">
                  Drag & drop your image here
                </p>
                <p className="mb-4 text-sm text-muted-foreground">
                  Supports JPG, PNG, GIF (max 5MB)
                </p>
                <Button variant="outline" className="gap-2 rounded-full">
                  <Upload className="h-4 w-4" />
                  <span>Upload Image</span>
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <Label>Suggested Images</Label>
              <div className="grid grid-cols-3 gap-2">
                {placeholderImages.slice(0, 3).map((image, index) => (
                  <div
                    key={index}
                    className={`relative cursor-pointer overflow-hidden rounded-md border transition-all hover:opacity-90 ${
                      eventData.featuredImage === image
                        ? "ring-2 ring-primary ring-offset-2"
                        : ""
                    }`}
                    onClick={() => handleFeaturedImageSelect(image)}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Suggested image ${index + 1}`}
                      className="aspect-video w-full object-cover"
                    />
                    {eventData.featuredImage === image && (
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                        <div className="rounded-full bg-primary p-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-primary-foreground"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
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
            <CardTitle>Gallery Images</CardTitle>
            <CardDescription>
              Add additional images to showcase your event.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {eventData.galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-md border"
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Gallery image ${index + 1}`}
                    className="aspect-square w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                      onClick={() => handleGalleryImageRemove(image)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {eventData.galleryImages.length < 8 && (
                <div
                  className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border border-dashed transition-colors hover:border-primary hover:bg-primary/5"
                  onClick={() => {
                    // For demo, add a random placeholder image that's not already in the gallery
                    const availableImages = placeholderImages.filter(
                      (img) => !eventData.galleryImages.includes(img),
                    );
                    if (availableImages.length > 0) {
                      const randomIndex = Math.floor(
                        Math.random() * availableImages.length,
                      );
                      if (availableImages[randomIndex]) {
                        handleGalleryImageSelect(availableImages[randomIndex]);
                      }
                    }
                  }}
                >
                  <div className="rounded-full bg-muted p-2">
                    <Plus className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="mt-2 text-xs text-muted-foreground">
                    Add Image
                  </span>
                </div>
              )}
            </div>

            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                Gallery images will be displayed on your event page to give
                attendees a better idea of what to expect.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
