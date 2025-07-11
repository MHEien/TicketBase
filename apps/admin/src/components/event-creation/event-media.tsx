"use client";

import type React from "react";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ImageIcon, Upload, X, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEventCreation } from "@/hooks/use-event-creation";
import { uploadEventImage } from "@/lib/api/events-api";
import { useToast } from "@/hooks/use-toast";

export function EventMedia() {
  const { eventData, updateEventData } = useEventCreation();
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [placeholderUploading, setPlaceholderUploading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // For demo purposes, we'll use placeholder images
  const placeholderImages = [
    "/vibrant-music-festival.png",
    "/conference-event.png",
    "/art-exhibition.png",
    "/vibrant-sports-event.png",
    "/networking-event.png",
    "/workshop-event.png",
  ];

  const uploadPlaceholderImage = async (imagePath: string, isGallery: boolean = false) => {
    try {
      setPlaceholderUploading(imagePath);
      
      // Fetch the placeholder image
      const response = await fetch(imagePath);
      if (!response.ok) {
        throw new Error('Failed to fetch placeholder image');
      }
      
      const blob = await response.blob();
      const filename = imagePath.split('/').pop() || 'placeholder.png';
      const file = new File([blob], filename, { type: blob.type });
      
      // Upload to MinIO
      const tempEventId = "draft-" + Date.now();
      const uploadResponse = await uploadEventImage(tempEventId, file);
      
      if (isGallery) {
        updateEventData({ 
          galleryImages: [...eventData.galleryImages, uploadResponse.imageUrl] 
        });
      } else {
        updateEventData({ featuredImage: uploadResponse.imageUrl });
      }

      toast({
        title: "Image selected",
        description: "Placeholder image has been uploaded successfully.",
      });
      
      return uploadResponse.imageUrl;
    } catch (error) {
      console.error('Placeholder upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload placeholder image",
        variant: "destructive",
      });
    } finally {
      setPlaceholderUploading(null);
    }
  };

  const handleFeaturedImageSelect = async (image: string) => {
    await uploadPlaceholderImage(image, false);
  };

  const handleGalleryImageSelect = async (image: string) => {
    if (!eventData.galleryImages.includes(image)) {
      await uploadPlaceholderImage(image, true);
    }
  };

  const handleGalleryImageRemove = (image: string) => {
    updateEventData({
      galleryImages: eventData.galleryImages.filter((img) => img !== image),
    });
  };

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith("image/")) {
      return "Please select an image file (JPG, PNG, GIF, etc.)";
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return "Image must be smaller than 5MB";
    }

    return null;
  };

  const uploadImage = async (file: File, isGallery: boolean = false) => {
    const validation = validateFile(file);
    if (validation) {
      toast({
        title: "Invalid file",
        description: validation,
        variant: "destructive",
      });
      return;
    }

    try {
      if (isGallery) {
        setGalleryUploading(true);
      } else {
        setUploading(true);
      }

      // For now, we'll create a temporary event ID to upload images
      // In a real scenario, you might want to create the event first or use a draft system
      const tempEventId = "draft-" + Date.now();

      const response = await uploadEventImage(tempEventId, file);

      if (isGallery) {
        updateEventData({
          galleryImages: [...eventData.galleryImages, response.imageUrl],
        });
      } else {
        updateEventData({ featuredImage: response.imageUrl });
      }

      toast({
        title: "Upload successful",
        description: "Image has been uploaded successfully.",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      if (isGallery) {
        setGalleryUploading(false);
      } else {
        setUploading(false);
      }
    }
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]) {
      uploadImage(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
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
                  onLoad={() => console.log("✅ Image loaded successfully:", eventData.featuredImage)}
                  onError={(e) => console.error("❌ Image failed to load:", eventData.featuredImage, e)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                  onClick={() => updateEventData({ featuredImage: "" })}
                  disabled={uploading}
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
                } ${uploading ? "opacity-50" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  {uploading ? (
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-primary" />
                  )}
                </div>
                <p className="mb-2 text-lg font-medium">
                  {uploading ? "Uploading..." : "Drag & drop your image here"}
                </p>
                <p className="mb-4 text-sm text-muted-foreground">
                  Supports JPG, PNG, GIF (max 5MB)
                </p>
                <Button
                  variant="outline"
                  className="gap-2 rounded-full"
                  onClick={handleUploadClick}
                  disabled={uploading}
                >
                  <Upload className="h-4 w-4" />
                  <span>{uploading ? "Uploading..." : "Upload Image"}</span>
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Suggested Images</Label>
              <div className="grid grid-cols-3 gap-2">
                {placeholderImages.slice(0, 3).map((image, index) => {
                  const isUploading = placeholderUploading === image;
                  const isSelected = eventData.featuredImage?.includes(image.split('/').pop() || '');
                  
                  return (
                    <div
                      key={index}
                      className={`relative cursor-pointer overflow-hidden rounded-md border transition-all hover:opacity-90 ${
                        isSelected
                          ? "ring-2 ring-primary ring-offset-2"
                          : ""
                      } ${isUploading ? "opacity-50" : ""}`}
                      onClick={() => {
                        if (!isUploading && !placeholderUploading) {
                          handleFeaturedImageSelect(image);
                        }
                      }}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Suggested image ${index + 1}`}
                        className="aspect-video w-full object-cover"
                      />
                      {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <Loader2 className="h-6 w-6 text-white animate-spin" />
                        </div>
                      )}
                      {isSelected && !isUploading && (
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
                  );
                })}
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
                  className={`flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border border-dashed transition-colors hover:border-primary hover:bg-primary/5 ${
                    galleryUploading || placeholderUploading ? "opacity-50" : ""
                  }`}
                  onClick={() => {
                    if (!galleryUploading && !placeholderUploading) {
                      // For demo, add a random placeholder image that's not already in the gallery
                      const availableImages = placeholderImages.filter(
                        (img) => {
                          const filename = img.split('/').pop() || '';
                          return !eventData.galleryImages.some(galleryImg => 
                            galleryImg.includes(filename)
                          );
                        }
                      );
                      if (availableImages.length > 0) {
                        const randomIndex = Math.floor(
                          Math.random() * availableImages.length,
                        );
                        handleGalleryImageSelect(availableImages[randomIndex]);
                      }
                    }
                  }}
                >
                  <div className="rounded-full bg-muted p-2">
                    {galleryUploading || placeholderUploading ? (
                      <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                    ) : (
                      <Plus className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <span className="mt-2 text-xs text-muted-foreground">
                    {galleryUploading || placeholderUploading ? "Uploading..." : "Add Image"}
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
