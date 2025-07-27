// Enhanced Puck Configuration with Advanced Features
import React from "react";
import { type Config, type Data, FieldLabel } from "@measured/puck";
import { motion } from "framer-motion";
import { enhancedLayoutComponents } from './enhanced-layout-components';
import { createAdvancedConfig } from './config';
import {
  Type,
  Image,
  Square,
  Layout,
  Zap,
  Grid,
  Star,
  TrendingUp,
  Shield,
  Globe,
  Sparkles,
  Wand2,
  Heart,
  MessageCircle,
  Video,
  Camera,
  Music,
  BarChart,
  PieChart,
  Mail,
  Phone,
  Settings, 
  CreditCard,
  ShoppingCart,
  Gift,
  Crown,
  Lock,
  Unlock,
  ChevronDown,
  Send,
  DollarSign,
  Activity,
  Home,
  Building,
  MapPin,
} from "lucide-react";
import '@/components/fullscreen-puck.css';

// Import UI components
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Slider } from "@repo/ui/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";

// Enhanced field types
const ColorPickerField = ({ onChange, value, field }: any) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const colors = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#eab308",
    "#84cc16",
    "#22c55e",
    "#10b981",
    "#14b8a6",
    "#06b6d4",
    "#0ea5e9",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#ec4899",
    "#f43f5e",
  ];

  return (
    <FieldLabel label={field.label}>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <div
            className="w-8 h-8 rounded-lg border-2 border-gray-300 cursor-pointer shadow-sm"
            style={{ backgroundColor: value || "#3b82f6" }}
            onClick={() => setIsOpen(!isOpen)}
          />
          <Input
            type="text"
            value={value || "#3b82f6"}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#3b82f6"
            className="flex-1"
          />
        </div>
        {isOpen && (
          <motion.div
            className="grid grid-cols-6 gap-2 p-3 bg-gray-50 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {colors.map((color) => (
              <div
                key={color}
                className="w-8 h-8 rounded-lg cursor-pointer border-2 border-transparent hover:border-gray-400 transition-colors"
                style={{ backgroundColor: color }}
                onClick={() => {
                  onChange(color);
                  setIsOpen(false);
                }}
              />
            ))}
          </motion.div>
        )}
      </div>
    </FieldLabel>
  );
};

const IconPickerField = ({ onChange, value, field }: any) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const iconOptions = [
    { name: "Heart", icon: Heart, category: "general" },
    { name: "Star", icon: Star, category: "general" },
    { name: "Zap", icon: Zap, category: "general" },
    { name: "Crown", icon: Crown, category: "general" },
    { name: "Shield", icon: Shield, category: "security" },
    { name: "Lock", icon: Lock, category: "security" },
    { name: "Unlock", icon: Unlock, category: "security" },
    { name: "Mail", icon: Mail, category: "communication" },
    { name: "Phone", icon: Phone, category: "communication" },
    { name: "MessageCircle", icon: MessageCircle, category: "communication" },
    { name: "Send", icon: Send, category: "communication" },
    { name: "Home", icon: Home, category: "places" },
    { name: "Building", icon: Building, category: "places" },
    { name: "MapPin", icon: MapPin, category: "places" },
    { name: "Globe", icon: Globe, category: "places" },
    { name: "TrendingUp", icon: TrendingUp, category: "charts" },
    { name: "BarChart", icon: BarChart, category: "charts" },
    { name: "PieChart", icon: PieChart, category: "charts" },
    { name: "Activity", icon: Activity, category: "charts" },
    { name: "ShoppingCart", icon: ShoppingCart, category: "commerce" },
    { name: "CreditCard", icon: CreditCard, category: "commerce" },
    { name: "Gift", icon: Gift, category: "commerce" },
    { name: "DollarSign", icon: DollarSign, category: "commerce" },
    { name: "Camera", icon: Camera, category: "media" },
    { name: "Video", icon: Video, category: "media" },
    { name: "Music", icon: Music, category: "media" },
    { name: "Image", icon: Image, category: "media" },
  ];

  const filteredIcons = iconOptions.filter((icon) =>
    icon.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const SelectedIcon =
    iconOptions.find((icon) => icon.name === value)?.icon || Heart;

  return (
    <FieldLabel label={field.label}>
      <div className="space-y-3">
        <div
          className="flex items-center space-x-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          <SelectedIcon className="w-5 h-5 text-gray-600" />
          <span className="flex-1 text-sm">{value || "Select icon"}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>

        {isOpen && (
          <motion.div
            className="border rounded-lg p-3 bg-white shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Input
              placeholder="Search icons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-3"
            />
            <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
              {filteredIcons.map((icon) => (
                <TooltipProvider key={icon.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="p-2 rounded-lg cursor-pointer hover:bg-gray-100 flex items-center justify-center"
                        onClick={() => {
                          onChange(icon.name);
                          setIsOpen(false);
                        }}
                      >
                        <icon.icon className="w-5 h-5 text-gray-600" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{icon.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </FieldLabel>
  );
};

const SpacingField = ({ onChange, value, field }: any) => {
  const [mode, setMode] = React.useState<"all" | "individual">("all");
  const spacing = value || { top: 16, right: 16, bottom: 16, left: 16 };

  const handleChange = (newSpacing: any) => {
    onChange(newSpacing);
  };

  return (
    <FieldLabel label={field.label}>
      <div className="space-y-3">
        <Tabs
          value={mode}
          onValueChange={(value) => setMode(value as "all" | "individual")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Sides</TabsTrigger>
            <TabsTrigger value="individual">Individual</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            <div>
              <Label className="text-sm text-gray-600">
                Spacing: {spacing.top}px
              </Label>
              <Slider
                value={[spacing.top]}
                onValueChange={([value]) =>
                  handleChange({
                    top: value,
                    right: value,
                    bottom: value,
                    left: value,
                  })
                }
                max={100}
                step={4}
                className="mt-2"
              />
            </div>
          </TabsContent>

          <TabsContent value="individual" className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm text-gray-600">
                  Top: {spacing.top}px
                </Label>
                <Slider
                  value={[spacing.top]}
                  onValueChange={([value]) =>
                    handleChange({ ...spacing, top: value })
                  }
                  max={100}
                  step={4}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-600">
                  Right: {spacing.right}px
                </Label>
                <Slider
                  value={[spacing.right]}
                  onValueChange={([value]) =>
                    handleChange({ ...spacing, right: value })
                  }
                  max={100}
                  step={4}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-600">
                  Bottom: {spacing.bottom}px
                </Label>
                <Slider
                  value={[spacing.bottom]}
                  onValueChange={([value]) =>
                    handleChange({ ...spacing, bottom: value })
                  }
                  max={100}
                  step={4}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-600">
                  Left: {spacing.left}px
                </Label>
                <Slider
                  value={[spacing.left]}
                  onValueChange={([value]) =>
                    handleChange({ ...spacing, left: value })
                  }
                  max={100}
                  step={4}
                  className="mt-1"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </FieldLabel>
  );
};

const AnimationField = ({ onChange, value, field }: any) => {
  const animations = [
    { name: "None", value: "none", description: "No animation" },
    {
      name: "Fade In",
      value: "fadeIn",
      description: "Fade in from transparent",
    },
    { name: "Slide Up", value: "slideUp", description: "Slide up from bottom" },
    {
      name: "Slide Down",
      value: "slideDown",
      description: "Slide down from top",
    },
    {
      name: "Slide Left",
      value: "slideLeft",
      description: "Slide in from right",
    },
    {
      name: "Slide Right",
      value: "slideRight",
      description: "Slide in from left",
    },
    { name: "Scale", value: "scale", description: "Scale up from small" },
    { name: "Bounce", value: "bounce", description: "Bounce in effect" },
    { name: "Flip", value: "flip", description: "Flip animation" },
    { name: "Wobble", value: "wobble", description: "Wobble effect" },
  ];

  const [duration, setDuration] = React.useState(value?.duration || 0.8);
  const [delay, setDelay] = React.useState(value?.delay || 0);

  const handleChange = (updates: any) => {
    const newValue = {
      type: value?.type || "fadeIn",
      duration,
      delay,
      ...updates,
    };
    onChange(newValue);
  };

  return (
    <FieldLabel label={field.label}>
      <div className="space-y-4">
        <div>
          <Label className="text-sm text-gray-600 mb-2 block">
            Animation Type
          </Label>
          <Select
            value={value?.type || "fadeIn"}
            onValueChange={(type) => handleChange({ type })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select animation" />
            </SelectTrigger>
            <SelectContent>
              {animations.map((anim) => (
                <SelectItem key={anim.value} value={anim.value}>
                  <div>
                    <div className="font-medium">{anim.name}</div>
                    <div className="text-sm text-gray-500">
                      {anim.description}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm text-gray-600">Duration: {duration}s</Label>
          <Slider
            value={[duration]}
            onValueChange={([newDuration]) => {
              setDuration(newDuration);
              handleChange({ duration: newDuration });
            }}
            min={0.1}
            max={3}
            step={0.1}
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-sm text-gray-600">Delay: {delay}s</Label>
          <Slider
            value={[delay]}
            onValueChange={([newDelay]) => {
              setDelay(newDelay);
              handleChange({ delay: newDelay });
            }}
            min={0}
            max={2}
            step={0.1}
            className="mt-2"
          />
        </div>

        {value?.type !== "none" && (
          <motion.div
            className="p-3 bg-blue-50 rounded-lg border-2 border-blue-200"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: duration, delay: delay }}
            key={`${value?.type}-${duration}-${delay}`}
          >
            <div className="text-sm text-blue-800 font-medium">Preview</div>
            <div className="text-sm text-blue-600">
              Animation: {animations.find((a) => a.value === value?.type)?.name}
            </div>
          </motion.div>
        )}
      </div>
    </FieldLabel>
  );
};

const AIContentField = ({ onChange, value, field }: any) => {
  const [prompt, setPrompt] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      // Simulate AI generation - in a real app, you'd call your AI API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const generatedContent = `Generated content based on: "${prompt}"\n\nThis is where AI would generate relevant content for your component. The AI would understand the context and create appropriate text, headings, or descriptions.`;

      onChange(generatedContent);
      setSuggestions([
        "Make it more professional",
        "Add call-to-action language",
        "Make it shorter and punchier",
        "Include emotional appeal",
      ]);
    } catch (error) {
      console.error("Failed to generate content:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <FieldLabel label={field.label}>
      <div className="space-y-3">
        <Textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your content or use AI to generate..."
          className="min-h-24"
        />

        <div className="border-t pt-3">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <Label className="text-sm font-medium text-purple-700">
              AI Assistant
            </Label>
          </div>

          <div className="flex space-x-2">
            <Input
              placeholder="Describe what you want..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isGenerating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Wand2 className="w-4 h-4" />
                </motion.div>
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
            </Button>
          </div>

          {suggestions.length > 0 && (
            <div className="mt-3">
              <Label className="text-xs text-gray-500 mb-2 block">
                Quick suggestions:
              </Label>
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs h-8"
                    onClick={() => setPrompt(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </FieldLabel>
  );
};


// Create static config instance
const staticConfig = createAdvancedConfig();

// Enhanced Puck configuration
export const enhancedConfig: Config = {
  components: {
    // Include enhanced layout components
    ...enhancedLayoutComponents,
    
    // Include original components from static config for backward compatibility
    GlassCard: staticConfig.components?.GlassCard,
    FeatureGrid: staticConfig.components?.FeatureGrid, 
    StatsSection: staticConfig.components?.StatsSection,
    AdvancedHeading: staticConfig.components?.AdvancedHeading,
    HeroSection: {
      label: "Hero Section",
      fields: {
        title: {
          type: "custom",
          render: AIContentField,
          label: "Main Title",
        },
        subtitle: {
          type: "custom",
          render: AIContentField,
          label: "Subtitle",
        },
        backgroundType: {
          type: "radio",
          options: [
            { label: "Gradient", value: "gradient" },
            { label: "Image", value: "image" },
            { label: "Video", value: "video" },
            { label: "Solid Color", value: "solid" },
          ],
          label: "Background Type",
        },
        backgroundColor: {
          type: "custom",
          render: ColorPickerField,
          label: "Background Color",
        },
        backgroundGradient: {
          type: "object",
          objectFields: {
            from: {
              type: "custom",
              render: ColorPickerField,
              label: "From Color",
            },
            to: {
              type: "custom",
              render: ColorPickerField,
              label: "To Color",
            },
            direction: {
              type: "select",
              options: [
                { label: "To Right", value: "to-r" },
                { label: "To Bottom", value: "to-b" },
                { label: "To Bottom Right", value: "to-br" },
                { label: "To Top Right", value: "to-tr" },
              ],
            },
          },
          label: "Gradient Settings",
        },
        backgroundImage: {
          type: "text",
          label: "Background Image URL",
        },
        overlay: {
          type: "object",
          objectFields: {
            enabled: {
              type: "radio",
              options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
              ],
            },
            color: {
              type: "custom",
              render: ColorPickerField,
              label: "Overlay Color",
            },
            opacity: {
              type: "number",
              min: 0,
              max: 100,
              label: "Opacity (%)",
            },
          },
          label: "Overlay Settings",
        },
        textColor: {
          type: "custom",
          render: ColorPickerField,
          label: "Text Color",
        },
        buttonText: {
          type: "text",
          label: "Button Text",
        },
        buttonStyle: {
          type: "select",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
            { label: "Outline", value: "outline" },
            { label: "Ghost", value: "ghost" },
            { label: "Link", value: "link" },
          ],
          label: "Button Style",
        },
        buttonColor: {
          type: "custom",
          render: ColorPickerField,
          label: "Button Color",
        },
        animation: {
          type: "custom",
          render: AnimationField,
          label: "Animation",
        },
        spacing: {
          type: "custom",
          render: SpacingField,
          label: "Spacing",
        },
        height: {
          type: "select",
          options: [
            { label: "Full Screen", value: "screen" },
            { label: "3/4 Screen", value: "3/4" },
            { label: "1/2 Screen", value: "1/2" },
            { label: "Auto", value: "auto" },
          ],
          label: "Section Height",
        },
        alignment: {
          type: "radio",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
          label: "Text Alignment",
        },
      },
      defaultProps: {
        title: "Welcome to Our Amazing Platform",
        subtitle:
          "Discover the future of digital experiences with our cutting-edge solutions",
        backgroundType: "gradient",
        backgroundColor: "#3b82f6",
        backgroundGradient: {
          from: "#3b82f6",
          to: "#8b5cf6",
          direction: "to-r",
        },
        backgroundImage: "",
        overlay: {
          enabled: false,
          color: "#000000",
          opacity: 50,
        },
        textColor: "#ffffff",
        buttonText: "Get Started",
        buttonStyle: "primary",
        buttonColor: "#ffffff",
        animation: {
          type: "fadeIn",
          duration: 0.8,
          delay: 0,
        },
        spacing: {
          top: 32,
          bottom: 32,
          left: 16,
          right: 16,
        },
        height: "screen",
        alignment: "center",
      },
      // Dynamic field resolution based on background type
      resolveFields: (data) => {
        const fields: any = {
          title: {
            type: "custom",
            render: AIContentField,
            label: "Main Title",
          },
          subtitle: {
            type: "custom",
            render: AIContentField,
            label: "Subtitle",
          },
          backgroundType: {
            type: "radio",
            options: [
              { label: "Gradient", value: "gradient" },
              { label: "Image", value: "image" },
              { label: "Video", value: "video" },
              { label: "Solid Color", value: "solid" },
            ],
            label: "Background Type",
          },
        };

        // Conditionally show fields based on background type
        if (data.props.backgroundType === "gradient") {
          fields.backgroundGradient = {
            type: "object",
            objectFields: {
              from: {
                type: "custom",
                render: ColorPickerField,
                label: "From Color",
              },
              to: {
                type: "custom",
                render: ColorPickerField,
                label: "To Color",
              },
              direction: {
                type: "select",
                options: [
                  { label: "To Right", value: "to-r" },
                  { label: "To Bottom", value: "to-b" },
                  { label: "To Bottom Right", value: "to-br" },
                  { label: "To Top Right", value: "to-tr" },
                ],
              },
            },
            label: "Gradient Settings",
          };
        } else if (data.props.backgroundType === "solid") {
          fields.backgroundColor = {
            type: "custom",
            render: ColorPickerField,
            label: "Background Color",
          };
        } else if (data.props.backgroundType === "image") {
          fields.backgroundImage = {
            type: "text",
            label: "Background Image URL",
          };
          fields.overlay = {
            type: "object",
            objectFields: {
              enabled: {
                type: "radio",
                options: [
                  { label: "Yes", value: true },
                  { label: "No", value: false },
                ],
              },
              color: {
                type: "custom",
                render: ColorPickerField,
                label: "Overlay Color",
              },
              opacity: {
                type: "number",
                min: 0,
                max: 100,
                label: "Opacity (%)",
              },
            },
            label: "Overlay Settings",
          };
        }

        // Always show these fields
        fields.textColor = {
          type: "custom",
          render: ColorPickerField,
          label: "Text Color",
        };
        fields.buttonText = {
          type: "text",
          label: "Button Text",
        };
        fields.buttonStyle = {
          type: "select",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
            { label: "Outline", value: "outline" },
            { label: "Ghost", value: "ghost" },
          ],
          label: "Button Style",
        };
        fields.animation = {
          type: "custom",
          render: AnimationField,
          label: "Animation",
        };
        fields.spacing = {
          type: "custom",
          render: SpacingField,
          label: "Spacing",
        };

        return fields;
      },
      render: ({
        title,
        subtitle,
        backgroundType,
        backgroundColor,
        backgroundGradient,
        backgroundImage,
        overlay,
        textColor,
        buttonText,
        buttonStyle,
        buttonColor,
        animation,
        spacing,
        height,
        alignment,
        puck,
      }: any) => {
        const getBackgroundStyle = () => {
          switch (backgroundType) {
            case "gradient":
              return {
                background: `linear-gradient(${backgroundGradient?.direction || "to-r"}, ${backgroundGradient?.from || "#3b82f6"}, ${backgroundGradient?.to || "#8b5cf6"})`,
              };
            case "image":
              return {
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              };
            case "solid":
              return {
                backgroundColor: backgroundColor || "#3b82f6",
              };
            default:
              return {};
          }
        };

        const getAnimationProps = () => {
          if (!animation || animation.type === "none") return {};

          const animationMap: Record<string, any> = {
            fadeIn: { initial: { opacity: 0 }, animate: { opacity: 1 } },
            slideUp: {
              initial: { y: 50, opacity: 0 },
              animate: { y: 0, opacity: 1 },
            },
            slideDown: {
              initial: { y: -50, opacity: 0 },
              animate: { y: 0, opacity: 1 },
            },
            slideLeft: {
              initial: { x: 50, opacity: 0 },
              animate: { x: 0, opacity: 1 },
            },
            slideRight: {
              initial: { x: -50, opacity: 0 },
              animate: { x: 0, opacity: 1 },
            },
            scale: {
              initial: { scale: 0.8, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
            },
            bounce: {
              initial: { scale: 0.3, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
            },
          };

          return {
            ...animationMap[animation.type],
            transition: {
              duration: animation.duration || 0.8,
              delay: animation.delay || 0,
            },
          };
        };

        const heightClass =
          height === "screen"
            ? "min-h-screen"
            : height === "3/4"
              ? "min-h-[75vh]"
              : height === "1/2"
                ? "min-h-[50vh]"
                : "min-h-max";

        const alignmentClass =
          alignment === "center"
            ? "text-center"
            : alignment === "right"
              ? "text-right"
              : "text-left";

        const spacingStyle = spacing
          ? {
              paddingTop: `${spacing.top}px`,
              paddingBottom: `${spacing.bottom}px`,
              paddingLeft: `${spacing.left}px`,
              paddingRight: `${spacing.right}px`,
            }
          : {};

        return (
          <motion.section
            className={`relative ${heightClass} flex items-center justify-center overflow-hidden`}
            style={{ ...getBackgroundStyle(), ...spacingStyle }}
            {...getAnimationProps()}
          >
            {/* Overlay */}
            {backgroundType === "image" && overlay?.enabled && (
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: overlay.color || "#000000",
                  opacity: (overlay.opacity || 50) / 100,
                }}
              />
            )}

            {/* Content */}
            <div
              className={`relative z-10 max-w-4xl mx-auto px-4 ${alignmentClass}`}
            >
              <motion.h1
                className="text-4xl md:text-6xl font-bold mb-6"
                style={{ color: textColor || "#ffffff" }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: (animation?.delay || 0) + 0.2 }}
              >
                {title || "Welcome to Our Platform"}
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl mb-8 opacity-90"
                style={{ color: textColor || "#ffffff" }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: (animation?.delay || 0) + 0.4 }}
              >
                {subtitle || "Discover amazing possibilities"}
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: (animation?.delay || 0) + 0.6 }}
              >
                <Button
                  size="lg"
                  variant={(buttonStyle as any) || "default"}
                  className={`text-lg px-8 py-6 ${buttonStyle === "primary" ? "text-gray-900" : ""}`}
                  style={
                    buttonStyle === "primary"
                      ? { backgroundColor: buttonColor || "#ffffff" }
                      : {}
                  }
                >
                  {buttonText || "Get Started"}
                </Button>
              </motion.div>
            </div>

            {/* Decorative elements for editing mode */}
            {puck?.isEditing && (
              <div className="absolute top-4 left-4 z-20">
                <Badge
                  variant="secondary"
                  className="bg-black/20 text-white border-white/20"
                >
                  <Layout className="w-3 h-3 mr-1" />
                  Hero Section
                </Badge>
              </div>
            )}
          </motion.section>
        );
      },
    },

    // Add more enhanced components here...
    SmartCard: {
      label: "Smart Card",
      fields: {
        icon: {
          type: "custom",
          render: IconPickerField,
          label: "Icon",
        },
        title: {
          type: "custom",
          render: AIContentField,
          label: "Title",
        },
        content: {
          type: "custom",
          render: AIContentField,
          label: "Content",
        },
        cardStyle: {
          type: "select",
          options: [
            { label: "Glass", value: "glass" },
            { label: "Solid", value: "solid" },
            { label: "Outline", value: "outline" },
            { label: "Gradient", value: "gradient" },
          ],
          label: "Card Style",
        },
        primaryColor: {
          type: "custom",
          render: ColorPickerField,
          label: "Primary Color",
        },
        animation: {
          type: "custom",
          render: AnimationField,
          label: "Animation",
        },
      },
      defaultProps: {
        icon: "Star",
        title: "Amazing Feature",
        content:
          "This is a smart card component with AI-powered content generation and beautiful animations.",
        cardStyle: "glass",
        primaryColor: "#3b82f6",
        animation: {
          type: "slideUp",
          duration: 0.6,
          delay: 0,
        },
      },
      render: ({
        icon,
        title,
        content,
        cardStyle,
        primaryColor,
        animation,
        puck,
      }: any) => {
        const getCardStyles = () => {
          switch (cardStyle) {
            case "glass":
              return "bg-white/10 backdrop-blur-md border border-white/20";
            case "solid":
              return "bg-white border border-gray-200 shadow-lg";
            case "outline":
              return "bg-transparent border-2 border-gray-300";
            case "gradient":
              return `bg-gradient-to-br from-${primaryColor}/10 to-${primaryColor}/30 border border-${primaryColor}/20`;
            default:
              return "bg-white border border-gray-200 shadow-lg";
          }
        };

        const iconOptions: Record<string, any> = {
          Star,
          Heart,
          Zap,
          Crown,
          Shield,
          Lock,
          Mail,
          Phone,
          MessageCircle,
          Home,
          Building,
          MapPin,
          Globe,
          TrendingUp,
          BarChart,
          ShoppingCart,
          Camera,
          Video,
          Music,
          Image,
          Type,
          Layout,
          Grid,
          Settings,
        };

        const IconComponent = iconOptions[icon] || Star;

        const getAnimationProps = () => {
          if (!animation || animation.type === "none") return {};

          const animationMap: Record<string, any> = {
            fadeIn: { initial: { opacity: 0 }, animate: { opacity: 1 } },
            slideUp: {
              initial: { y: 50, opacity: 0 },
              animate: { y: 0, opacity: 1 },
            },
            slideDown: {
              initial: { y: -50, opacity: 0 },
              animate: { y: 0, opacity: 1 },
            },
            scale: {
              initial: { scale: 0.8, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
            },
          };

          return {
            ...animationMap[animation.type],
            transition: {
              duration: animation.duration || 0.6,
              delay: animation.delay || 0,
            },
          };
        };

        return (
          <motion.div
            className={`relative p-6 rounded-xl hover:shadow-xl transition-all duration-300 ${getCardStyles()}`}
            {...getAnimationProps()}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="flex items-start space-x-4">
              <div
                className="p-3 rounded-lg"
                style={{
                  backgroundColor: primaryColor + "20",
                  color: primaryColor,
                }}
              >
                <IconComponent className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  {title}
                </h3>
                <p className="text-gray-600">{content}</p>
              </div>
            </div>

            {puck?.isEditing && (
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-black/10">
                  <Square className="w-3 h-3 mr-1" />
                  Smart Card
                </Badge>
              </div>
            )}
          </motion.div>
        );
      },
    },
  },

  // Enhanced categories with better organization
  categories: {
    layout: {
      title: "Layout & Structure", 
      components: ["HeroSection", "GridLayout", "FlexboxLayout", "SlotContainer"],
    },
    content: {
      title: "Content & Media",
      components: ["SmartCard", "CardGrid", "GlassCard", "FeatureGrid"],
    },
    advanced: {
      title: "Advanced Components",
      components: ["AdvancedHeading", "StatsSection"],
    },
  },

  // Root configuration for global page settings
  root: {
    fields: {
      seoTitle: {
        type: "text",
        label: "SEO Title",
      },
      seoDescription: {
        type: "textarea",
        label: "SEO Description",
      },
      favicon: {
        type: "text",
        label: "Favicon URL",
      },
      customCSS: {
        type: "textarea",
        label: "Custom CSS",
      },
      bodyClass: {
        type: "text",
        label: "Body Class",
      },
    },
    defaultProps: {
      seoTitle: "Amazing Page",
      seoDescription: "Create amazing pages with our visual editor",
    },
    render: ({ children, seoTitle, seoDescription }: any) => (
      <div>
        <head>
          <title>{seoTitle}</title>
          <meta name="description" content={seoDescription} />
        </head>
        {children}
      </div>
    ),
  },
};

// Export initial data
export const enhancedInitialData: Data = {
  content: [],
  root: {},
};

// Export save function (implement with your API)
export const enhancedSave = async (data: Data) => {
  try {
    // Here you would call your API to save the data
    console.log("Saving enhanced Puck data:", data);

    // Example API call:
    // const response = await fetch('/api/pages/save', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });

    return { success: true };
  } catch (error) {
    console.error("Failed to save:", error);
    throw error;
  }
};
