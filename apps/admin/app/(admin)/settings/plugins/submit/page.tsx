"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, UploadCloud, ChevronRight, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SubmitPluginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bundleFile, setBundleFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    version: "1.0.0",
    bundleUrl: "",
    repositoryUrl: "",
    authorName: "",
    authorEmail: "",
    termsAgreed: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Validate file type
      if (!file.name.endsWith(".js") && !file.name.endsWith(".mjs")) {
        setUploadError("Please upload a JavaScript file (.js or .mjs)");
        setBundleFile(null);
        return;
      }
      setBundleFile(file);
      setUploadError(null);
    }
  };

  const uploadBundle = async (): Promise<string> => {
    if (!bundleFile) {
      throw new Error("No file selected");
    }

    // Create FormData object
    const formData = new FormData();
    formData.append("file", bundleFile);

    try {
      // Reset progress and error
      setUploadProgress(0);
      setUploadError(null);

      // Create XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();

      // Create a promise to wait for upload completion
      const uploadPromise = new Promise<string>((resolve, reject) => {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        });

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response.bundleUrl);
            } catch (error) {
              reject(new Error("Invalid response from server"));
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          reject(new Error("Network error occurred during upload"));
        };
      });

      // Configure and send the request
      xhr.open("POST", "/api/plugins/upload", true);
      xhr.send(formData);

      // Wait for upload to complete
      const bundleUrl = await uploadPromise;
      return bundleUrl;
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
      throw error;
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const clearSelectedFile = () => {
    setBundleFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.termsAgreed) {
      toast({
        title: "Agreement Required",
        description:
          "You must agree to the terms and conditions to submit a plugin.",
        variant: "destructive",
      });
      return;
    }

    // Validate that we have either a file or a bundle URL
    if (!bundleFile && !formData.bundleUrl) {
      toast({
        title: "Bundle Required",
        description:
          "Please provide either a bundle URL or upload a plugin file.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // If a file was selected, upload it first
      let finalBundleUrl = formData.bundleUrl;
      if (bundleFile) {
        finalBundleUrl = await uploadBundle();
      }

      // Prepare data for API submission
      const pluginData = {
        ...formData,
        bundleUrl: finalBundleUrl,
      };

      // Submit the plugin to the API
      const response = await fetch("/api/plugins/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pluginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit plugin");
      }

      toast({
        title: "Plugin Submitted",
        description:
          "Your plugin has been submitted for review. We'll notify you when it's approved.",
      });

      router.push("/settings/plugins");
    } catch (error) {
      toast({
        title: "Submission Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit plugin. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Submit a Plugin</h1>
          <p className="text-muted-foreground">
            Share your plugin with other event organizers.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/settings/plugins")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Plugins
        </Button>
      </div>

      <Separator />

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Plugin Information</CardTitle>
            <CardDescription>
              Basic information about your plugin.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Plugin Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. Stripe Payments"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="version">Version *</Label>
                <Input
                  id="version"
                  name="version"
                  placeholder="e.g. 1.0.0"
                  value={formData.version}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe what your plugin does and why it's useful..."
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payments">Payment</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="ticketing">Ticketing</SelectItem>
                  <SelectItem value="layout">Layout</SelectItem>
                  <SelectItem value="seating">Seating</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Select the primary category that best describes your plugin.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Components</Label>
              <p className="text-sm text-muted-foreground">
                Your plugin will be automatically configured with basic
                component settings. If you need custom component configuration,
                please include it in your plugin bundle.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plugin Code</CardTitle>
            <CardDescription>
              Provide a URL to your plugin bundle or upload a file.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bundleUrl">Bundle URL</Label>
              <Input
                id="bundleUrl"
                name="bundleUrl"
                placeholder="https://your-domain.com/plugins/your-plugin.js"
                value={formData.bundleUrl}
                onChange={handleChange}
                disabled={bundleFile !== null}
              />
              <p className="text-sm text-muted-foreground">
                URL to the JavaScript bundle of your plugin. This should be a
                publicly accessible URL.
              </p>
            </div>

            <Separator className="my-4" />

            <div className="text-center">
              <Label className="mb-2 block">Or upload your plugin bundle</Label>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".js,.mjs"
              className="hidden"
            />

            {bundleFile ? (
              <div className="border-2 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <UploadCloud className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{bundleFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(bundleFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearSelectedFile}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="space-y-1">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-xs text-right text-muted-foreground">
                      {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div
                className="flex items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-primary/5 transition-colors"
                onClick={handleFileUploadClick}
              >
                <div className="text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold">
                    Upload plugin bundle
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Click to select your .js or .mjs plugin file
                  </p>
                </div>
              </div>
            )}

            {uploadError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="repositoryUrl">Repository URL</Label>
              <Input
                id="repositoryUrl"
                name="repositoryUrl"
                placeholder="https://github.com/your-username/your-plugin"
                value={formData.repositoryUrl}
                onChange={handleChange}
              />
              <p className="text-sm text-muted-foreground">
                Optional. Link to your public repository containing the plugin
                source code.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Developer Information</CardTitle>
            <CardDescription>
              Tell us about yourself or your organization.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="authorName">Developer Name *</Label>
                <Input
                  id="authorName"
                  name="authorName"
                  placeholder="Your name or organization"
                  value={formData.authorName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="authorEmail">Developer Email *</Label>
                <Input
                  id="authorEmail"
                  name="authorEmail"
                  type="email"
                  placeholder="contact@your-domain.com"
                  value={formData.authorEmail}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Terms and Conditions</CardTitle>
            <CardDescription>
              Please review our plugin submission guidelines.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">
                By submitting this plugin, you agree to the following:
              </p>
              <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
                <li>Your plugin does not contain malicious code</li>
                <li>Your plugin respects user privacy and data security</li>
                <li>
                  You have the right to distribute all code and assets in your
                  plugin
                </li>
                <li>
                  You will provide support and maintenance for your plugin
                </li>
                <li>
                  We reserve the right to reject or remove any plugin at our
                  discretion
                </li>
              </ul>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="termsAgreed"
                checked={formData.termsAgreed}
                onCheckedChange={(checked) =>
                  handleSwitchChange("termsAgreed", checked)
                }
              />
              <Label htmlFor="termsAgreed">
                I agree to the terms and conditions
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/settings/plugins")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Plugin <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
