// lib/editor/index.tsx
import React, { type JSX } from "react";
import type { Config, Data } from "@measured/puck";
import { motion } from "framer-motion";
import {
  Play,
  Users,
  TrendingUp,
  Clock,
  Globe,
} from "lucide-react";
import type { AnimationConfig, AnimationType, FeatureGridProps, GlassCardProps, HeroSectionProps, StatsSectionProps } from "./types";
// Type definitions for component props


const animations: Record<AnimationType, AnimationConfig> = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8 },
  },
  slideUp: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.8 },
  },
  scale: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.8 },
  },
  bounce: {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { type: "spring", bounce: 0.4, duration: 0.8 },
  },
  none: {
    initial: {},
    animate: {},
    transition: {},
  },
};

// Advanced component configuration with your design aesthetic
export const config: Config = {
  components: {
    // Hero Section Component
    HeroSection: {
      label: "Hero Section",
      defaultProps: {
        title: "Welcome to the Future",
        subtitle: "Build amazing experiences with our advanced editor",
        backgroundType: "gradient" as const,
        gradientFrom: "#667eea",
        gradientTo: "#764ba2",
        buttonText: "Get Started",
        buttonStyle: "primary" as const,
        animation: "fadeIn" as const,
        overlay: "medium" as const,
        height: "screen" as const,
      },
      fields: {
        title: {
          type: "text",
          label: "Hero Title",
        },
        subtitle: {
          type: "textarea",
          label: "Subtitle",
        },
        backgroundType: {
          type: "select",
          label: "Background Type",
          options: [
            { label: "Gradient", value: "gradient" },
            { label: "Image", value: "image" },
            { label: "Video", value: "video" },
            { label: "Solid Color", value: "solid" },
          ],
        },
        gradientFrom: {
          type: "text",
          label: "Gradient Start Color",
        },
        gradientTo: {
          type: "text",
          label: "Gradient End Color",
        },
        solidColor: {
          type: "text",
          label: "Solid Background Color",
        },
        backgroundImage: {
          type: "text",
          label: "Background Image URL",
        },
        buttonText: {
          type: "text",
          label: "Button Text",
        },
        buttonStyle: {
          type: "select",
          label: "Button Style",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
            { label: "Outline", value: "outline" },
            { label: "Ghost", value: "ghost" },
          ],
        },
        animation: {
          type: "select",
          label: "Animation",
          options: [
            { label: "Fade In", value: "fadeIn" },
            { label: "Slide Up", value: "slideUp" },
            { label: "Scale", value: "scale" },
            { label: "Bounce", value: "bounce" },
            { label: "None", value: "none" },
          ],
        },
        overlay: {
          type: "select",
          label: "Dark Overlay",
          options: [
            { label: "None", value: false },
            { label: "Light", value: "light" },
            { label: "Medium", value: "medium" },
            { label: "Heavy", value: "heavy" },
          ],
        },
        height: {
          type: "select",
          label: "Section Height",
          options: [
            { label: "Full Screen", value: "screen" },
            { label: "3/4 Screen", value: "3/4" },
            { label: "1/2 Screen", value: "1/2" },
            { label: "Auto", value: "auto" },
          ],
        },
      },
      render: (props: any) => {
        const {
          title,
          subtitle,
          backgroundType,
          gradientFrom,
          gradientTo,
          solidColor,
          backgroundImage,
          buttonText,
          buttonStyle,
          animation,
          overlay,
          height,
        } = props as HeroSectionProps;

        const heightClasses: Record<string, string> = {
          screen: "min-h-screen",
          "3/4": "min-h-[75vh]",
          "1/2": "min-h-[50vh]",
          auto: "min-h-[400px]",
        };

        const overlayClasses: Record<string, string> = {
          light: "bg-black/20",
          medium: "bg-black/40",
          heavy: "bg-black/60",
          false: "",
        };

        let bgStyle: React.CSSProperties = {};
        if (backgroundType === "gradient") {
          bgStyle = {
            background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
          };
        } else if (backgroundType === "solid" && solidColor) {
          bgStyle = { backgroundColor: solidColor };
        } else if (backgroundType === "image" && backgroundImage) {
          bgStyle = {
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          };
        }

        const animationProps = animations[animation];

        return (
          <motion.section
            className={`${heightClasses[height]} flex items-center justify-center relative overflow-hidden`}
            style={bgStyle}
            {...animationProps}
          >
            {overlay && (
              <div
                className={`absolute inset-0 ${overlayClasses[overlay]}`}
              ></div>
            )}
            <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
              <motion.h1
                className="text-4xl md:text-6xl lg:text-8xl font-bold text-white mb-6 leading-tight"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {title}
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {subtitle}
              </motion.p>
              <motion.button
                className={`px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 inline-flex items-center gap-2 ${
                  buttonStyle === "primary"
                    ? "bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                    : buttonStyle === "secondary"
                      ? "bg-gray-900 text-white hover:bg-gray-800 shadow-lg"
                      : buttonStyle === "outline"
                        ? "border-2 border-white text-white hover:bg-white hover:text-gray-900 backdrop-blur-sm"
                        : "text-white hover:bg-white/10 backdrop-blur-sm"
                }`}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {buttonText}
                <Play size={16} className="ml-1" />
              </motion.button>
            </div>
          </motion.section>
        );
      },
    },

    // Glassmorphism Card Component
    GlassCard: {
      label: "Glass Card",
      defaultProps: {
        title: "Glass Card",
        content: "Beautiful glassmorphism effect with backdrop blur",
        icon: "✨",
        blur: "backdrop-blur-md" as const,
        opacity: "bg-white/20" as const,
        borderStyle: "border-white/20" as const,
        padding: "p-6",
        rounded: "rounded-2xl",
      },
      fields: {
        title: { type: "text", label: "Card Title" },
        content: { type: "textarea", label: "Card Content" },
        icon: { type: "text", label: "Icon (Emoji or Text)" },
        blur: {
          type: "select",
          label: "Blur Intensity",
          options: [
            { label: "Light", value: "backdrop-blur-sm" },
            { label: "Medium", value: "backdrop-blur-md" },
            { label: "Heavy", value: "backdrop-blur-lg" },
            { label: "Extra Heavy", value: "backdrop-blur-xl" },
          ],
        },
        opacity: {
          type: "select",
          label: "Background Opacity",
          options: [
            { label: "5%", value: "bg-white/5" },
            { label: "10%", value: "bg-white/10" },
            { label: "20%", value: "bg-white/20" },
            { label: "30%", value: "bg-white/30" },
            { label: "Dark 10%", value: "bg-black/10" },
            { label: "Dark 20%", value: "bg-black/20" },
          ],
        },
        borderStyle: {
          type: "select",
          label: "Border Style",
          options: [
            { label: "Light White", value: "border-white/20" },
            { label: "Medium White", value: "border-white/40" },
            { label: "Light Gray", value: "border-gray-300/20" },
            { label: "None", value: "border-transparent" },
          ],
        },
      },
      render: (props: any) => {
        const {
          title,
          content,
          icon,
          blur,
          opacity,
          borderStyle,
          padding,
          rounded,
        } = props as GlassCardProps;

        return (
          <motion.div
            className={`${padding} ${rounded} border ${borderStyle} ${opacity} ${blur} shadow-xl hover:shadow-2xl transition-all duration-300`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-4xl mb-4 select-none">{icon}</div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-white/80 leading-relaxed">{content}</p>
          </motion.div>
        );
      },
    },

    // Advanced Feature Grid
    FeatureGrid: {
      label: "Feature Grid",
      defaultProps: {
        title: "Amazing Features",
        subtitle: "Everything you need to succeed",
        columns: "grid-cols-3" as const,
        gap: "gap-6" as const,
        features: [
          {
            icon: "🚀",
            title: "Fast Performance",
            description: "Lightning fast loading times",
          },
          {
            icon: "🔒",
            title: "Secure",
            description: "Enterprise-grade security",
          },
          {
            icon: "📱",
            title: "Responsive",
            description: "Works on all devices",
          },
          {
            icon: "⚡",
            title: "Powerful",
            description: "Advanced capabilities",
          },
          { icon: "🎨", title: "Beautiful", description: "Stunning design" },
          {
            icon: "🛠️",
            title: "Customizable",
            description: "Tailor to your needs",
          },
        ],
      },
      fields: {
        title: { type: "text", label: "Section Title" },
        subtitle: { type: "text", label: "Section Subtitle" },
        columns: {
          type: "select",
          label: "Columns",
          options: [
            { label: "1 Column", value: "grid-cols-1" },
            { label: "2 Columns", value: "grid-cols-2" },
            { label: "3 Columns", value: "grid-cols-3" },
            { label: "4 Columns", value: "grid-cols-4" },
            { label: "Auto Fit", value: "grid-cols-auto-fit" },
          ],
        },
        gap: {
          type: "select",
          label: "Gap Size",
          options: [
            { label: "Small", value: "gap-4" },
            { label: "Medium", value: "gap-6" },
            { label: "Large", value: "gap-8" },
            { label: "Extra Large", value: "gap-12" },
          ],
        },
      },
      render: (props: any) => {
        const { title, subtitle, columns, gap, features } =
          props as FeatureGridProps;

        return (
          <motion.section
            className="py-16 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-7xl mx-auto">
              <motion.div
                className="text-center mb-12"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {title}
                </h2>
                <p className="text-xl text-white/70 max-w-2xl mx-auto">
                  {subtitle}
                </p>
              </motion.div>

              <div className={`grid ${columns} ${gap}`}>
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="p-6 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-white/70">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        );
      },
    },

    // Stats Section
    StatsSection: {
      label: "Stats Section",
      defaultProps: {
        title: "Trusted by thousands",
        backgroundColor: "transparent" as const,
        stats: [
          { number: "10K+", label: "Happy Customers", icon: Users },
          { number: "99.9%", label: "Uptime", icon: TrendingUp },
          { number: "24/7", label: "Support", icon: Clock },
          { number: "50+", label: "Countries", icon: Globe },
        ],
      },
      fields: {
        title: { type: "text", label: "Section Title" },
        backgroundColor: {
          type: "select",
          label: "Background",
          options: [
            { label: "Transparent", value: "transparent" },
            { label: "Dark Glass", value: "dark-glass" },
            { label: "Light Glass", value: "light-glass" },
          ],
        },
      },
      render: (props: any) => {
        const { title, stats, backgroundColor } = props as StatsSectionProps;

        const bgClasses: Record<string, string> = {
          transparent: "",
          "dark-glass": "bg-black/20 backdrop-blur-md",
          "light-glass": "bg-white/10 backdrop-blur-md",
        };

        return (
          <motion.section
            className={`py-16 px-6 ${bgClasses[backgroundColor]}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="max-w-6xl mx-auto">
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-center text-white mb-12"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                {title}
              </motion.h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 * index, type: "spring" }}
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                      {React.createElement(stat.icon, {
                        size: 24,
                        className: "text-white",
                      })}
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-white/70">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        );
      },
    },

    // Advanced Heading Component
    AdvancedHeading: {
      label: "Advanced Heading",
      defaultProps: {
        tag: "h2" as const,
        text: "Your Heading Here",
        color: "#000000",
        margin: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 20,
        },
        alignment: "left" as const,
        typography: {
          fontSize: 32,
          fontFamily: "inherit",
          fontWeight: "600",
          lineHeight: 1.2,
          letterSpacing: 0,
        },
      },
      fields: {
        tag: {
          type: "select",
          label: "Heading Tag",
          options: [
            { label: "H1", value: "h1" },
            { label: "H2", value: "h2" },
            { label: "H3", value: "h3" },
            { label: "H4", value: "h4" },
            { label: "H5", value: "h5" },
            { label: "H6", value: "h6" },
          ],
        },
        text: {
          type: "text",
          label: "Heading Text",
        },
        color: {
          type: "text",
          label: "Text Color",
        },
        alignment: {
          type: "select",
          label: "Text Alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
      },
      render: (props: any) => {
        const { tag, text, color, margin, alignment, typography } = props;
        
        const HeadingTag = tag as keyof JSX.IntrinsicElements;
        
        const style: React.CSSProperties = {
          color,
          marginTop: margin?.top || 0,
          marginLeft: margin?.left || 0,
          marginRight: margin?.right || 0,
          marginBottom: margin?.bottom || 20,
          textAlign: alignment,
          fontSize: typography?.fontSize || 32,
          fontFamily: typography?.fontFamily || "inherit",
          fontWeight: typography?.fontWeight || "600",
          lineHeight: typography?.lineHeight || 1.2,
          letterSpacing: typography?.letterSpacing || 0,
        };
        
        return React.createElement(HeadingTag, { style }, text);
      },
    },
  },
};

// Initial data
export const initialData: Data = {
  content: [
    {
      type: "HeroSection",
      props: {
        id: "hero-1",
        title: "Welcome to Advanced Editor",
        subtitle: "Build stunning pages with our powerful visual editor",
      },
    },
  ],
  root: {
    props: {
      title: "My Amazing Page",
    },
  },
};

// Save function
export const save = async (data: Data): Promise<Data> => {
  try {
    console.log("Saving page data:", data);

    // Here you would typically save to your database
    // const response = await fetch('/api/pages', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });

    // Show success notification
    // toast.success("Page saved successfully!");

    return data;
  } catch (error) {
    console.error("Error saving page:", error);
    // toast.error("Failed to save page");
    throw error;
  }
};
