"use client";

import React, { useState, useCallback } from "react";
import { uploadPluginBuild, type PluginBuildResult } from "@ticketbase/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Github,
  FileCode,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Clock,
  HardDrive,
} from "lucide-react";

// Use the type from the API client package
type BuildResult = PluginBuildResult;

export default function PluginUploadInterface() {
  const [activeTab, setActiveTab] = useState("source");
  const [uploading, setUploading] = useState(false);
  const [buildResult, setBuildResult] = useState<BuildResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Source upload state
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // GitHub integration state
  const [githubRepo, setGithubRepo] = useState("");
  const [githubBranch, setGithubBranch] = useState("main");
  const [githubPath, setGithubPath] = useState("");

  // File drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const zipFile = files.find((file) => file.name.endsWith(".zip"));

    if (zipFile) {
      setSourceFile(zipFile);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  // Upload handlers
  const uploadSourceCode = async () => {
    if (!sourceFile) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("plugin", sourceFile);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const result = await uploadPluginBuild(sourceFile);

      clearInterval(progressInterval);
      setUploadProgress(100);
      setBuildResult(result);
    } catch (error) {
      setBuildResult({
        bundleUrl: "",
        warnings: [],
        metadata: {},
        pluginId: "",
        version: "",
        success: false,
        errors: [
          "Upload failed: " +
            (error instanceof Error ? error.message : "Unknown error"),
        ],
        buildTime: 0,
        bundleSize: 0,
      });
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  const setupGitHubIntegration = async () => {
    if (!githubRepo) return;

    setUploading(true);

    try {
      const response = await fetch("/api/plugins/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repository: githubRepo,
          branch: githubBranch || "main",
          path: githubPath || undefined,
        }),
      });

      const result: BuildResult = await response.json();
      setBuildResult(result);
    } catch (error) {
      setBuildResult({
        success: false,
        bundleUrl: "",
        warnings: [],
        metadata: {},
        pluginId: "",
        version: "",

        errors: [
          "GitHub setup failed: " +
            (error instanceof Error ? error.message : "Unknown error"),
        ],
        buildTime: 0,
        bundleSize: 0,
      });
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatBuildTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Upload Plugin</h1>
        <p className="text-muted-foreground">
          Upload your plugin source code and let our platform handle the build
          process
        </p>
      </div>

      {/* Upload Methods */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="source" className="flex items-center gap-2">
            <FileCode className="h-4 w-4" />
            Source Code
            <Badge variant="secondary" className="text-xs">
              Recommended
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="github" className="flex items-center gap-2">
            <Github className="h-4 w-4" />
            GitHub
          </TabsTrigger>
          <TabsTrigger value="built" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Pre-built
          </TabsTrigger>
        </TabsList>

        {/* Source Code Upload */}
        <TabsContent value="source">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5" />
                Upload TypeScript Source Code
              </CardTitle>
              <CardDescription>
                Upload a ZIP file containing your plugin source code with
                TypeScript. Our platform will compile, bundle, and optimize it
                automatically.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Requirements */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Required files:</strong> plugin.json (manifest),
                  src/index.tsx (entry point), package.json (optional)
                  <br />
                  <strong>Benefits:</strong> Full TypeScript support, automatic
                  optimization, type checking, dependency resolution
                </AlertDescription>
              </Alert>

              {/* File Drop Zone */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">
                    {sourceFile
                      ? sourceFile.name
                      : "Drop your plugin ZIP file here"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse files
                  </p>
                  <Input
                    type="file"
                    accept=".zip"
                    onChange={(e) => setSourceFile(e.target.files?.[0] || null)}
                    className="max-w-xs mx-auto"
                  />
                </div>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Building plugin...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              {/* Upload Button */}
              <Button
                onClick={uploadSourceCode}
                disabled={!sourceFile || uploading}
                className="w-full"
                size="lg"
              >
                {uploading ? "Building..." : "Upload & Build Plugin"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GitHub Integration */}
        <TabsContent value="github">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                GitHub Integration
              </CardTitle>
              <CardDescription>
                Connect your GitHub repository for automatic builds on every
                push. Perfect for CI/CD workflows and collaborative development.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  <strong>Auto-deploy:</strong> Every push to your repository
                  will trigger a new build and deployment. Webhooks will be
                  configured automatically.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="repo">Repository URL</Label>
                  <Input
                    id="repo"
                    placeholder="https://github.com/user/plugin-repo"
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch</Label>
                  <Input
                    id="branch"
                    placeholder="main"
                    value={githubBranch}
                    onChange={(e) => setGithubBranch(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="path">Plugin Path (optional)</Label>
                <Input
                  id="path"
                  placeholder="plugins/my-plugin (if plugin is in a subdirectory)"
                  value={githubPath}
                  onChange={(e) => setGithubPath(e.target.value)}
                />
              </div>

              <Button
                onClick={setupGitHubIntegration}
                disabled={!githubRepo || uploading}
                className="w-full"
                size="lg"
              >
                {uploading ? "Setting up..." : "Setup GitHub Integration"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pre-built Upload */}
        <TabsContent value="built">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Pre-built Bundle
              </CardTitle>
              <CardDescription>
                Upload a pre-compiled JavaScript bundle. Use this if you have
                your own build process.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Not recommended:</strong> Pre-built bundles may have
                  compatibility issues. Source code uploads provide better
                  optimization and type safety.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label>JavaScript Bundle</Label>
                <Input type="file" accept=".js" />
              </div>

              <div className="space-y-2">
                <Label>Plugin Manifest (plugin.json)</Label>
                <Input type="file" accept=".json" />
              </div>

              <Button disabled className="w-full" size="lg">
                Upload Pre-built Bundle
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Build Results */}
      {buildResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {buildResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              Build {buildResult.success ? "Successful" : "Failed"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Build Stats */}
            {buildResult.success && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Build time: {formatBuildTime(buildResult.buildTime)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Bundle size: {formatFileSize(buildResult.bundleSize)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Ready to deploy</span>
                </div>
              </div>
            )}

            {/* Success Message */}
            {buildResult.success && buildResult.bundleUrl && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Your plugin has been built and deployed successfully! Bundle
                  URL: <code className="text-sm">{buildResult.bundleUrl}</code>
                </AlertDescription>
              </Alert>
            )}

            {/* Warnings */}
            {buildResult.warnings && buildResult.warnings.length > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Warnings:</strong>
                  <ul className="list-disc list-inside mt-2">
                    {buildResult.warnings.map((warning, i) => (
                      <li key={i} className="text-sm">
                        {warning}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Errors */}
            {buildResult.errors && buildResult.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Errors:</strong>
                  <ul className="list-disc list-inside mt-2">
                    {buildResult.errors.map((error, i) => (
                      <li key={i} className="text-sm">
                        {error}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
