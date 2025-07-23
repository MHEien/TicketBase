import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Puck, usePuck, type Config, createUsePuck } from '@measured/puck'
import '@measured/puck/puck.css'
import { pagesApi, type Page } from '../../../../lib/api/pages'
import { Button } from '@repo/ui/components/ui/button'
import { Input } from '@repo/ui/components/ui/input'
import { Label } from '@repo/ui/components/ui/label'
import { Textarea } from '@repo/ui/components/ui/textarea'
import { Switch } from '@repo/ui/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/ui/card'
import { Badge } from '@repo/ui/components/ui/badge'
import { Separator } from '@repo/ui/components/ui/separator'
import { Progress } from '@repo/ui/components/ui/progress'
import { 
  Save, 
  Eye, 
  Settings, 
  ArrowLeft, 
  Globe, 
  Monitor, 
  Smartphone, 
  Tablet,
  Undo2,
  Redo2,
  Layers3,
  Grid3X3,
  Palette,
  Code,
  Share2,
  Download,
  Upload,
  Sparkles,
  Zap,
  Clock,
  Users,
  Check,
  X,
  MoreHorizontal,
  Command,
  Calendar,
  MapPin,
  Star,
  DollarSign,
  Music,
  Camera,
  Heart,
  Ticket,
  Play,
  Image as ImageIcon,
  Type,
  Square,
  Layout,
  Columns,
  Database,
  Wifi,
  Smartphone as Phone,
  Mail,
  Search,
  Filter,
  ChevronDown,
  Plus,
  Minus,
  RotateCcw,
  Maximize2,
  Minimize2,
  Paintbrush
} from 'lucide-react'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@repo/ui/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from '@repo/ui/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/components/ui/tooltip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select'
import { cn } from '@/lib/utils'

// Advanced Puck Configuration with Professional Components
const advancedPuckConfig: Config = {
  // Component Categories for Professional Organization
  categories: {
    layout: {
      title: "Layout & Structure",
      components: ["Hero", "Section", "Container", "Columns", "Spacer"],
      defaultExpanded: true,
    },
    content: {
      title: "Content & Media", 
      components: ["Heading", "TextBlock", "ImageBlock", "VideoBlock", "Gallery"],
      defaultExpanded: true,
    },
    events: {
      title: "Event Components",
      components: ["EventCard", "EventGrid", "TicketCard", "CountdownTimer", "EventSchedule"],
      defaultExpanded: true,
    },
    interactive: {
      title: "Interactive Elements",
      components: ["ButtonBlock", "FormBlock", "SearchBar", "FilterBar", "PricingTable"],
      defaultExpanded: false,
    },
    navigation: {
      title: "Navigation & Menu",
      components: ["Navbar", "Breadcrumb", "Pagination", "TabGroup"],
      defaultExpanded: false,
    },
    advanced: {
      title: "Advanced Components",
      components: ["CodeBlock", "EmbedBlock", "MapBlock", "SocialFeed"],
      defaultExpanded: false,
    },
  },

  components: {
    // ============ LAYOUT COMPONENTS ============
    Hero: {
      label: "Hero Section",
      fields: {
        backgroundType: {
          type: "radio",
          options: [
            { label: "Gradient", value: "gradient" },
            { label: "Image", value: "image" },
            { label: "Video", value: "video" },
          ],
        },
        backgroundImage: { 
          type: "text", 
          label: "Background Image URL" 
        },
        backgroundVideo: { 
          type: "text", 
          label: "Background Video URL" 
        },
        gradientFrom: { type: "text", label: "Gradient From Color" },
        gradientTo: { type: "text", label: "Gradient To Color" },
        overlay: { type: "number", label: "Overlay Opacity (0-100)" },
        content: { type: "slot" },
        height: {
          type: "select",
          options: [
            { label: "Small (50vh)", value: "50vh" },
            { label: "Medium (75vh)", value: "75vh" },
            { label: "Large (100vh)", value: "100vh" },
          ],
        },
        alignment: {
          type: "radio",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
      },
      defaultProps: {
        backgroundType: "gradient",
        gradientFrom: "#667eea",
        gradientTo: "#764ba2",
        overlay: 40,
        height: "100vh",
        alignment: "center",
      },
      resolveData: async ({ props }) => {
        // Simulate dynamic background loading
        return {
          props: {
            ...props,
            resolvedBackground: props.backgroundType === 'gradient' 
              ? `linear-gradient(135deg, ${props.gradientFrom} 0%, ${props.gradientTo} 100%)`
              : props.backgroundImage ? `url(${props.backgroundImage})` : null
          }
        }
      },
      render: ({ content: Content, height, alignment, resolvedBackground, overlay }) => (
        <section 
          className="relative overflow-hidden flex items-center"
          style={{
            height,
            background: resolvedBackground,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div 
            className="absolute inset-0 bg-black"
            style={{ opacity: overlay / 100 }}
          />
          <div className={cn(
            "relative z-10 w-full px-6 py-20",
            alignment === 'center' && "text-center",
            alignment === 'right' && "text-right"
          )}>
            <Content />
          </div>
        </section>
      ),
    },

    Section: {
      label: "Content Section",
      fields: {
        backgroundColor: { type: "text", label: "Background Color" },
        paddingY: {
          type: "select",
          options: [
            { label: "None", value: "py-0" },
            { label: "Small", value: "py-8" },
            { label: "Medium", value: "py-16" },
            { label: "Large", value: "py-24" },
            { label: "Extra Large", value: "py-32" },
          ],
        },
        maxWidth: {
          type: "select",
          options: [
            { label: "Small", value: "max-w-2xl" },
            { label: "Medium", value: "max-w-4xl" },
            { label: "Large", value: "max-w-6xl" },
            { label: "Full Width", value: "max-w-full" },
          ],
        },
        content: { type: "slot" },
      },
      defaultProps: {
        backgroundColor: "transparent",
        paddingY: "py-16",
        maxWidth: "max-w-6xl",
      },
      render: ({ content: Content, backgroundColor, paddingY, maxWidth }) => (
        <section 
          className={cn("w-full", paddingY)}
          style={{ backgroundColor }}
        >
          <div className={cn("mx-auto px-6", maxWidth)}>
            <Content />
          </div>
        </section>
      ),
    },

    Columns: {
      label: "Multi-Column Layout",
      fields: {
        columns: {
          type: "select",
          options: [
            { label: "2 Columns", value: "2" },
            { label: "3 Columns", value: "3" },
            { label: "4 Columns", value: "4" },
          ],
        },
        gap: {
          type: "select",
          options: [
            { label: "Small", value: "gap-4" },
            { label: "Medium", value: "gap-8" },
            { label: "Large", value: "gap-12" },
          ],
        },
        responsive: { type: "switch", label: "Mobile Stack" },
        column1: { type: "slot" },
        column2: { type: "slot" },
        column3: { type: "slot" },
        column4: { type: "slot" },
      },
      defaultProps: {
        columns: "2",
        gap: "gap-8",
        responsive: true,
      },
      render: ({ columns, gap, responsive, column1: Column1, column2: Column2, column3: Column3, column4: Column4 }) => {
        const gridCols = {
          "2": responsive ? "grid-cols-1 md:grid-cols-2" : "grid-cols-2",
          "3": responsive ? "grid-cols-1 md:grid-cols-3" : "grid-cols-3", 
          "4": responsive ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-4",
        };
        
        return (
          <div className={cn("grid", gridCols[columns], gap)}>
            <div><Column1 /></div>
            <div><Column2 /></div>
            {columns !== "2" && <div><Column3 /></div>}
            {columns === "4" && <div><Column4 /></div>}
          </div>
        );
      },
    },

    Container: {
      label: "Container",
      fields: {
        maxWidth: {
          type: "select",
          options: [
            { label: "Small", value: "max-w-2xl" },
            { label: "Medium", value: "max-w-4xl" },
            { label: "Large", value: "max-w-6xl" },
            { label: "Extra Large", value: "max-w-7xl" },
            { label: "Full", value: "max-w-full" },
          ],
        },
        padding: {
          type: "select",
          options: [
            { label: "None", value: "p-0" },
            { label: "Small", value: "p-4" },
            { label: "Medium", value: "p-8" },
            { label: "Large", value: "p-12" },
          ],
        },
        content: { type: "slot" },
      },
      defaultProps: {
        maxWidth: "max-w-6xl",
        padding: "p-6",
      },
      render: ({ maxWidth, padding, content: Content }) => (
        <div className={cn("mx-auto", maxWidth, padding)}>
          <Content />
        </div>
      ),
    },

    Spacer: {
      label: "Spacer",
      fields: {
        height: {
          type: "select",
          options: [
            { label: "Small (20px)", value: "h-5" },
            { label: "Medium (40px)", value: "h-10" },
            { label: "Large (80px)", value: "h-20" },
            { label: "Extra Large (160px)", value: "h-40" },
          ],
        },
      },
      defaultProps: {
        height: "h-10",
      },
      render: ({ height }) => <div className={height} />,
    },

    // ============ CONTENT COMPONENTS ============
    Heading: {
      label: "Heading",
      fields: {
        text: { type: "text" },
        level: {
          type: "select",
          options: [
            { label: "H1", value: "h1" },
            { label: "H2", value: "h2" },
            { label: "H3", value: "h3" },
            { label: "H4", value: "h4" },
            { label: "H5", value: "h5" },
            { label: "H6", value: "h6" },
          ],
        },
        style: {
          type: "select",
          options: [
            { label: "Default", value: "default" },
            { label: "Gradient", value: "gradient" },
            { label: "Outline", value: "outline" },
          ],
        },
        alignment: {
          type: "radio",
          options: [
            { label: "Left", value: "text-left" },
            { label: "Center", value: "text-center" },
            { label: "Right", value: "text-right" },
          ],
        },
        color: { type: "text", label: "Text Color" },
      },
      defaultProps: {
        text: "Your Heading Here",
        level: "h2",
        style: "default",
        alignment: "text-left",
        color: "#1f2937",
      },
      render: ({ text, level, style, alignment, color }) => {
        const Tag = level as keyof JSX.IntrinsicElements;
        const sizeClasses = {
          h1: "text-5xl md:text-6xl font-bold",
          h2: "text-4xl md:text-5xl font-bold",
          h3: "text-3xl md:text-4xl font-semibold",
          h4: "text-2xl md:text-3xl font-semibold",
          h5: "text-xl md:text-2xl font-medium",
          h6: "text-lg md:text-xl font-medium",
        };

        const styleClasses = {
          default: "",
          gradient: "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent",
          outline: "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow-md",
        };
        
        return (
          <Tag 
            className={cn(sizeClasses[level], styleClasses[style], alignment, "mb-4")}
            style={style === "default" ? { color } : {}}
          >
            {text}
          </Tag>
        );
      },
    },

    TextBlock: {
      label: "Text Content",
      fields: {
        text: { type: "textarea", label: "Content" },
        size: {
          type: "select",
          options: [
            { label: "Small", value: "text-sm" },
            { label: "Base", value: "text-base" },
            { label: "Large", value: "text-lg" },
            { label: "Extra Large", value: "text-xl" },
          ],
        },
        alignment: {
          type: "radio",
          options: [
            { label: "Left", value: "text-left" },
            { label: "Center", value: "text-center" },
            { label: "Right", value: "text-right" },
            { label: "Justify", value: "text-justify" },
          ],
        },
        color: { type: "text", label: "Text Color" },
        lineHeight: {
          type: "select",
          options: [
            { label: "Tight", value: "leading-tight" },
            { label: "Normal", value: "leading-normal" },
            { label: "Relaxed", value: "leading-relaxed" },
            { label: "Loose", value: "leading-loose" },
          ],
        },
      },
      defaultProps: {
        text: "Add your text content here. This is a paragraph that can contain multiple sentences and will wrap nicely.",
        size: "text-base",
        alignment: "text-left",
        color: "#374151",
        lineHeight: "leading-relaxed",
      },
      render: ({ text, size, alignment, color, lineHeight }) => (
        <div 
          className={cn(size, alignment, lineHeight, "mb-4")}
          style={{ color }}
        >
          {text.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      ),
    },

    ImageBlock: {
      label: "Image",
      fields: {
        src: { 
          type: "external",
          placeholder: "Select or upload image",
          fetchList: async () => {
            // Simulate image library
            return [
              { id: 1, title: "Event Photo 1", url: "https://picsum.photos/800/600?random=1" },
              { id: 2, title: "Event Photo 2", url: "https://picsum.photos/800/600?random=2" },
              { id: 3, title: "Event Photo 3", url: "https://picsum.photos/800/600?random=3" },
            ];
          },
        },
        alt: { type: "text", label: "Alt Text" },
        caption: { type: "text", label: "Caption" },
        aspectRatio: {
          type: "select",
          options: [
            { label: "Auto", value: "auto" },
            { label: "Square (1:1)", value: "aspect-square" },
            { label: "Video (16:9)", value: "aspect-video" },
            { label: "Portrait (3:4)", value: "aspect-[3/4]" },
          ],
        },
        borderRadius: {
          type: "select",
          options: [
            { label: "None", value: "rounded-none" },
            { label: "Small", value: "rounded" },
            { label: "Medium", value: "rounded-lg" },
            { label: "Large", value: "rounded-xl" },
            { label: "Full", value: "rounded-full" },
          ],
        },
      },
      defaultProps: {
        src: { url: "https://picsum.photos/800/600?random=1" },
        alt: "Beautiful image",
        caption: "",
        aspectRatio: "auto",
        borderRadius: "rounded-lg",
      },
      resolveData: async ({ props }) => {
        if (props.src?.url) {
          return {
            props: {
              ...props,
              resolvedSrc: props.src.url,
            }
          };
        }
        return { props };
      },
      render: ({ resolvedSrc, alt, caption, aspectRatio, borderRadius }) => (
        <figure className="mb-4">
          <img 
            src={resolvedSrc || "https://via.placeholder.com/800x600/f3f4f6/9ca3af?text=Select+Image"}
            alt={alt} 
            className={cn(
              "w-full h-auto object-cover shadow-md",
              aspectRatio !== "auto" && aspectRatio,
              borderRadius
            )}
          />
          {caption && (
            <figcaption className="text-sm text-gray-600 mt-2 text-center italic">
              {caption}
            </figcaption>
          )}
        </figure>
      ),
    },

    // ============ EVENT COMPONENTS ============
    EventCard: {
      label: "Event Card",
      fields: {
        eventData: {
          type: "external",
          placeholder: "Select event from database",
          fetchList: async () => {
            // Simulate event API
            return [
              { 
                id: 1, 
                title: "Summer Music Festival", 
                date: "2025-07-15",
                location: "Central Park, NY",
                price: 59,
                image: "https://picsum.photos/400/300?random=10"
              },
              { 
                id: 2, 
                title: "Tech Conference 2025", 
                date: "2025-08-20",
                location: "Convention Center",
                price: 199,
                image: "https://picsum.photos/400/300?random=11"
              },
            ];
          },
        },
        layout: {
          type: "radio",
          options: [
            { label: "Vertical", value: "vertical" },
            { label: "Horizontal", value: "horizontal" },
          ],
        },
        showPrice: { type: "switch", label: "Show Price" },
        showLocation: { type: "switch", label: "Show Location" },
        buttonText: { type: "text", label: "Button Text" },
      },
      defaultProps: {
        layout: "vertical",
        showPrice: true,
        showLocation: true,
        buttonText: "Get Tickets",
      },
      resolveData: async ({ props }) => {
        if (props.eventData) {
          return {
            props: {
              ...props,
              event: props.eventData,
            }
          };
        }
        return { props };
      },
      render: ({ event, layout, showPrice, showLocation, buttonText }) => {
        if (!event) {
          return (
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Select an event to display</p>
            </div>
          );
        }

        return (
          <div className={cn(
            "bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1",
            layout === "horizontal" && "md:flex"
          )}>
            <div className={cn(
              layout === "horizontal" && "md:w-1/3"
            )}>
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-48 object-cover"
              />
            </div>
            <div className={cn(
              "p-6",
              layout === "horizontal" && "md:w-2/3"
            )}>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{event.title}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
                </div>
                {showLocation && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-red-500" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                {showPrice && (
                  <span className="text-2xl font-bold text-blue-600">
                    ${event.price}
                  </span>
                )}
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  {buttonText}
                </Button>
              </div>
            </div>
          </div>
        );
      },
    },

    CountdownTimer: {
      label: "Countdown Timer",
      fields: {
        targetDate: { type: "text", label: "Target Date (YYYY-MM-DD)" },
        title: { type: "text", label: "Timer Title" },
        style: {
          type: "select",
          options: [
            { label: "Modern", value: "modern" },
            { label: "Classic", value: "classic" },
            { label: "Minimal", value: "minimal" },
          ],
        },
      },
      defaultProps: {
        targetDate: "2025-12-31",
        title: "Event Starts In",
        style: "modern",
      },
      render: ({ targetDate, title, style }) => {
        // This would use React state/effect in real implementation
        const timeLeft = { days: 45, hours: 12, minutes: 30, seconds: 15 };
        
        const styleClasses = {
          modern: "bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl",
          classic: "bg-white border-2 border-gray-200 text-gray-900 rounded-lg",
          minimal: "bg-transparent text-gray-900",
        };

        return (
          <div className={cn("p-8 text-center", styleClasses[style])}>
            <h3 className="text-2xl font-bold mb-6">{title}</h3>
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="text-center">
                  <div className={cn(
                    "text-3xl font-bold mb-1",
                    style === "modern" ? "text-white" : "text-gray-900"
                  )}>
                    {value}
                  </div>
                  <div className={cn(
                    "text-sm uppercase tracking-wider",
                    style === "modern" ? "text-blue-100" : "text-gray-500"
                  )}>
                    {unit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      },
    },

    // ============ INTERACTIVE COMPONENTS ============
    ButtonBlock: {
      label: "Button",
      fields: {
        text: { type: "text" },
        link: { type: "text", label: "Link URL" },
        variant: {
          type: "select",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
            { label: "Outline", value: "outline" },
            { label: "Ghost", value: "ghost" },
            { label: "Gradient", value: "gradient" },
          ],
        },
        size: {
          type: "select",
          options: [
            { label: "Small", value: "sm" },
            { label: "Default", value: "default" },
            { label: "Large", value: "lg" },
            { label: "Extra Large", value: "xl" },
          ],
        },
        fullWidth: { type: "switch", label: "Full Width" },
        icon: {
          type: "select",
          options: [
            { label: "None", value: "none" },
            { label: "Arrow Right", value: "arrow-right" },
            { label: "Download", value: "download" },
            { label: "Play", value: "play" },
            { label: "Heart", value: "heart" },
          ],
        },
      },
      defaultProps: {
        text: "Click Me",
        link: "#",
        variant: "primary",
        size: "default",
        fullWidth: false,
        icon: "none",
      },
      render: ({ text, link, variant, size, fullWidth, icon }) => {
        const icons = {
          "arrow-right": <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />,
          "download": <Download className="w-4 h-4 ml-2" />,
          "play": <Play className="w-4 h-4 ml-2" />,
          "heart": <Heart className="w-4 h-4 ml-2" />,
        };

        const variantClasses = {
          primary: "bg-blue-600 hover:bg-blue-700 text-white",
          secondary: "bg-gray-600 hover:bg-gray-700 text-white",
          outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
          ghost: "text-blue-600 hover:bg-blue-50",
          gradient: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white",
        };

        const sizeClasses = {
          sm: "px-3 py-1.5 text-sm",
          default: "px-4 py-2",
          lg: "px-6 py-3 text-lg",
          xl: "px-8 py-4 text-xl",
        };

        return (
          <a href={link} className={fullWidth ? "block" : "inline-block"}>
            <button 
              className={cn(
                "font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center",
                variantClasses[variant],
                sizeClasses[size],
                fullWidth && "w-full"
              )}
            >
              {text}
              {icon !== "none" && icons[icon]}
            </button>
          </a>
        );
      },
    },
  },

  // Root configuration for page-level settings
  root: {
    fields: {
      pageTitle: { type: "text", label: "Page Title" },
      metaDescription: { type: "textarea", label: "Meta Description" },
    },
    render: ({ children, pageTitle }) => (
      <div data-page-title={pageTitle}>
        {children}
      </div>
    ),
  },
};

// Enhanced viewport configuration
const viewports = [
  {
    width: 1920,
    height: "auto",
    label: "Desktop Large",
    icon: <Monitor className="w-4 h-4" />,
  },
  {
    width: 1440,
    height: "auto", 
    label: "Desktop",
    icon: <Monitor className="w-4 h-4" />,
  },
  {
    width: 768,
    height: "auto",
    label: "Tablet",
    icon: <Tablet className="w-4 h-4" />,
  },
  {
    width: 375,
    height: "auto",
    label: "Mobile",
    icon: <Phone className="w-4 h-4" />,
  },
];

export const Route = createFileRoute('/admin/pages/editor/$pageId')({
  component: PageEditor,
})

// Enhanced viewport types for responsive preview
type ViewportType = 'desktop' | 'tablet' | 'mobile'
type AutoSaveStatus = 'saved' | 'saving' | 'error' | 'unsaved'
type CollaborationUser = {
  id: string
  name: string
  avatar: string
  color: string
  isActive: boolean
}

function PageEditor() {
  const { pageId } = useParams({ from: '/admin/pages/editor/$pageId' })
  const navigate = useNavigate()
  
  // Core state
  const [page, setPage] = useState<Page | null>(null)
  const [puckData, setPuckData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Enhanced UI state
  const [showSettings, setShowSettings] = useState(false)
  const [currentViewport, setCurrentViewport] = useState(viewports[1])
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>('saved')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [showOutline, setShowOutline] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Collaboration state (simulated)
  const [collaborators] = useState<CollaborationUser[]>([
    { id: '1', name: 'Sarah Chen', avatar: 'SC', color: 'bg-blue-500', isActive: true },
    { id: '2', name: 'Marcus Johnson', avatar: 'MJ', color: 'bg-green-500', isActive: false },
    { id: '3', name: 'Elena Rodriguez', avatar: 'ER', color: 'bg-purple-500', isActive: true },
  ])
  
  // Page settings state
  const [pageSettings, setPageSettings] = useState({
    title: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    isHomepage: false,
  })

  // Auto-save functionality
  const autoSave = useCallback(async (data: any) => {
    if (pageId === 'new') return
    
    setAutoSaveStatus('saving')
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAutoSaveStatus('saved')
      setLastSaved(new Date())
    } catch (error) {
      setAutoSaveStatus('error')
    }
  }, [pageId])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        handleSave(puckData)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault()
        setIsPreviewMode(prev => !prev)
      }
      if (e.key === 'Escape') {
        setShowSettings(false)
        setShowKeyboardShortcuts(false)
        setIsFullscreen(false)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault()
        setIsFullscreen(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [puckData])

  useEffect(() => {
    loadPage()
  }, [pageId])

  const loadPage = async () => {
    try {
      if (pageId === 'new') {
        const newPage = {
          title: 'Untitled Page',
          slug: `page-${Date.now()}`,
          content: {
            content: [
              {
                type: "Hero",
                props: {
                  id: "hero-1",
                }
              }
            ],
            root: { props: { pageTitle: "New Event Page" } }
          },
          status: 'draft' as const,
          isHomepage: false,
        }
        setPageSettings({
          title: newPage.title,
          slug: newPage.slug,
          metaTitle: '',
          metaDescription: '',
          metaKeywords: '',
          isHomepage: newPage.isHomepage,
        })
        setPuckData(newPage.content)
      } else {
        const response = await pagesApi.getPage(pageId)
        setPage(response)
        setPageSettings({
          title: response.title,
          slug: response.slug,
          metaTitle: response.metaTitle || '',
          metaDescription: response.metaDescription || '',
          metaKeywords: response.metaKeywords || '',
          isHomepage: response.isHomepage,
        })
        setPuckData(response.content || {
          content: [
            {
              type: "Hero",
              props: { id: "hero-1" }
            }
          ],
          root: { props: { pageTitle: response.title } }
        })
      }
    } catch (error) {
      console.error('Failed to load page:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (data: any) => {
    setSaving(true)
    setAutoSaveStatus('saving')
    
    try {
      const pageData = {
        title: pageSettings.title,
        slug: pageSettings.slug,
        content: data,
        metaTitle: pageSettings.metaTitle,
        metaDescription: pageSettings.metaDescription,
        metaKeywords: pageSettings.metaKeywords,
        isHomepage: pageSettings.isHomepage,
        status: page?.status || 'draft' as const,
      }

      let savedPage
      if (pageId === 'new') {
        savedPage = await pagesApi.createPage(pageData)
        navigate({ to: `/admin/pages/editor/${savedPage.id}` })
      } else {
        savedPage = await pagesApi.updatePage(pageId, pageData)
        setPage(savedPage)
      }
      
      setPuckData(data)
      setAutoSaveStatus('saved')
      setLastSaved(new Date())
    } catch (error) {
      console.error('Failed to save page:', error)
      setAutoSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!page) return
    try {
      await pagesApi.publishPage(page.id)
      await loadPage()
    } catch (error) {
      console.error('Failed to publish page:', error)
    }
  }

  const handleUnpublish = async () => {
    if (!page) return
    try {
      await pagesApi.unpublishPage(page.id)
      await loadPage()
    } catch (error) {
      console.error('Failed to unpublish page:', error)
    }
  }

  const handlePreview = () => {
    if (page) {
      window.open(`/pages/${page.slug}`, '_blank')
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-purple-400 animate-pulse mx-auto"></div>
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Loading Advanced Editor
            </h3>
            <p className="text-slate-600">
              Initializing professional page builder with AI-powered components...
            </p>
          </div>
          <Progress value={78} className="w-64 mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className={cn(
        "h-screen flex flex-col bg-slate-50",
        isFullscreen && "fixed inset-0 z-50"
      )}>
        {/* Ultra-Modern Header */}
        <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 px-6 py-3 relative">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-6">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate({ to: '/admin/pages' })}
                    className="text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Back to Pages</TooltipContent>
              </Tooltip>
              
              <Separator orientation="vertical" className="h-6" />
              
              <div className="flex items-center space-x-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                      {pageSettings.title}
                    </h1>
                    
                    {page && (
                      <Badge 
                        variant={page.status === 'published' ? 'default' : 'secondary'}
                        className={cn(
                          "text-xs font-medium",
                          page.status === 'published' && "bg-green-100 text-green-800 border-green-200"
                        )}
                      >
                        {page.status}
                      </Badge>
                    )}
                    
                    {pageSettings.isHomepage && (
                      <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-800">
                        <Globe className="w-3 h-3 mr-1" />
                        Homepage
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <div className="flex items-center space-x-1.5">
                      <div className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        autoSaveStatus === 'saved' && "bg-green-500",
                        autoSaveStatus === 'saving' && "bg-yellow-500 animate-pulse",
                        autoSaveStatus === 'error' && "bg-red-500",
                        autoSaveStatus === 'unsaved' && "bg-slate-400"
                      )} />
                      <span className="font-medium">
                        {autoSaveStatus === 'saved' && lastSaved && `Saved ${formatTimeAgo(lastSaved)}`}
                        {autoSaveStatus === 'saving' && 'Auto-saving...'}
                        {autoSaveStatus === 'error' && 'Save failed'}
                        {autoSaveStatus === 'unsaved' && 'Unsaved changes'}
                      </span>
                    </div>
                    
                    <Separator orientation="vertical" className="h-3" />
                    
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3 h-3" />
                      <span>Modified 2h ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Section - Advanced Viewport Controls */}
            <div className="flex items-center space-x-2 bg-slate-100 rounded-xl p-1.5 border border-slate-200">
              {viewports.map((viewport) => (
                <Tooltip key={viewport.width}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={currentViewport.width === viewport.width ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setCurrentViewport(viewport)}
                      className={cn(
                        "px-3 py-2 transition-all",
                        currentViewport.width === viewport.width 
                          ? "bg-white shadow-sm border border-slate-200" 
                          : "hover:bg-slate-50"
                      )}
                    >
                      {viewport.icon}
                      <span className="ml-2 text-xs font-medium">
                        {viewport.width}px
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{viewport.label}</TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* Right Section - Action Hub */}
            <div className="flex items-center space-x-3">
              {/* Collaboration Hub */}
              <div className="flex items-center space-x-3">
                <div className="flex -space-x-2">
                  {collaborators.map((user) => (
                    <Tooltip key={user.id}>
                      <TooltipTrigger asChild>
                        <div className={cn(
                          "w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-white cursor-pointer transition-all hover:scale-110 hover:z-10",
                          user.color,
                          user.isActive && "ring-2 ring-green-400 ring-offset-2"
                        )}>
                          {user.avatar}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {user.name} {user.isActive && '(online)'}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
                
                <Button variant="ghost" size="sm" className="w-8 h-8 rounded-full border-2 border-dashed border-slate-300 hover:border-blue-400 transition-colors">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <Separator orientation="vertical" className="h-6" />
              
              {/* Quick Actions */}
              <div className="flex items-center space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowOutline(!showOutline)}
                      className={showOutline ? "bg-blue-50 text-blue-600" : ""}
                    >
                      <Layers3 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Toggle Outline</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                    >
                      {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</TooltipContent>
                </Tooltip>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>Advanced Tools</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setShowKeyboardShortcuts(true)}>
                      <Command className="w-4 h-4 mr-2" />
                      Keyboard Shortcuts
                      <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Code className="w-4 h-4 mr-2" />
                      Export Code
                      <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Database className="w-4 h-4 mr-2" />
                      Data Sources
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Preview Link
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="w-4 h-4 mr-2" />
                      Export Template
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Dialog open={showSettings} onOpenChange={setShowSettings}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-white/50 border-slate-200 hover:bg-white hover:border-blue-300">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        <span>Page Configuration</span>
                      </DialogTitle>
                      <DialogDescription>
                        Advanced page settings, SEO optimization, and performance configuration
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-8 mt-6">
                      {/* Basic Settings */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-slate-900 flex items-center">
                          <Type className="w-5 h-5 mr-2 text-blue-500" />
                          Basic Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-medium">Page Title</Label>
                            <Input
                              id="title"
                              value={pageSettings.title}
                              onChange={(e) => setPageSettings(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="Enter page title"
                              className="transition-all focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="slug" className="text-sm font-medium">URL Slug</Label>
                            <Input
                              id="slug"
                              value={pageSettings.slug}
                              onChange={(e) => setPageSettings(prev => ({ ...prev, slug: e.target.value }))}
                              placeholder="page-url-slug"
                              className="transition-all focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* SEO Settings */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-slate-900 flex items-center">
                          <Search className="w-5 h-5 mr-2 text-green-500" />
                          SEO & Metadata
                        </h4>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="metaTitle" className="text-sm font-medium">Meta Title</Label>
                            <Input
                              id="metaTitle"
                              value={pageSettings.metaTitle}
                              onChange={(e) => setPageSettings(prev => ({ ...prev, metaTitle: e.target.value }))}
                              placeholder="SEO-optimized title for search engines"
                              className="transition-all focus:ring-2 focus:ring-green-500/20"
                            />
                            <p className="text-xs text-slate-500">Recommended: 50-60 characters</p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="metaDescription" className="text-sm font-medium">Meta Description</Label>
                            <Textarea
                              id="metaDescription"
                              value={pageSettings.metaDescription}
                              onChange={(e) => setPageSettings(prev => ({ ...prev, metaDescription: e.target.value }))}
                              placeholder="Compelling description that appears in search results"
                              rows={3}
                              className="transition-all focus:ring-2 focus:ring-green-500/20"
                            />
                            <p className="text-xs text-slate-500">Recommended: 150-160 characters</p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="metaKeywords" className="text-sm font-medium">Focus Keywords</Label>
                            <Input
                              id="metaKeywords"
                              value={pageSettings.metaKeywords}
                              onChange={(e) => setPageSettings(prev => ({ ...prev, metaKeywords: e.target.value }))}
                              placeholder="events, tickets, concerts, festivals"
                              className="transition-all focus:ring-2 focus:ring-green-500/20"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Advanced Settings */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-slate-900 flex items-center">
                          <Settings className="w-5 h-5 mr-2 text-purple-500" />
                          Advanced Configuration
                        </h4>
                        
                        <div className="grid grid-cols-1 gap-4">
                          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                            <div className="space-y-1">
                              <Label htmlFor="isHomepage" className="text-sm font-medium">Set as Homepage</Label>
                              <p className="text-xs text-slate-600">Make this the default landing page for your event platform</p>
                            </div>
                            <Switch
                              id="isHomepage"
                              checked={pageSettings.isHomepage}
                              onCheckedChange={(checked) => setPageSettings(prev => ({ ...prev, isHomepage: checked }))}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
                      <Button variant="outline" onClick={() => setShowSettings(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setShowSettings(false)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <Check className="w-4 h-4 mr-2" />
                        Save Configuration
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {page && (
                  <Button variant="outline" size="sm" onClick={handlePreview} className="bg-white/50 border-slate-200 hover:bg-white hover:border-blue-300">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                )}

                {page && (
                  page.status === 'published' ? (
                    <Button variant="outline" size="sm" onClick={handleUnpublish} className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100">
                      <X className="w-4 h-4 mr-2" />
                      Unpublish
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={handlePublish}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Publish Live
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Advanced Puck Editor with Custom Interface */}
        <div className="flex-1 overflow-hidden relative bg-slate-50">
          {puckData && (
            <Puck
              config={advancedPuckConfig}
              data={puckData}
              onPublish={handleSave}
              onChange={autoSave}
              viewports={viewports}
              iframe={{
                enabled: true,
                waitForStyles: true,
              }}
              ui={{
                leftSideBarVisible: !isPreviewMode,
                rightSideBarVisible: !isPreviewMode,
              }}
              // Advanced overrides for custom branding
              overrides={{
                // Custom component item styling
                componentItem: ({ name, children }) => (
                  <div className="group bg-white rounded-lg border border-slate-200 p-3 mb-2 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing hover:scale-[1.02]">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Square className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                        {name}
                      </span>
                    </div>
                  </div>
                ),
                
                // Custom header actions
                headerActions: ({ appState, dispatch }) => (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dispatch({ type: "setData", data: { content: [], root: {} } })}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Clear All
                    </Button>
                    
                    <Button
                      variant={isPreviewMode ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setIsPreviewMode(!isPreviewMode)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {isPreviewMode ? 'Edit' : 'Preview'}
                    </Button>
                  </div>
                ),
              }}
            >
              {/* Custom interface using Puck's compositional API */}
              <div className="h-full flex">
                {/* Enhanced Sidebar */}
                {!isPreviewMode && (
                  <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-purple-600">
                      <h3 className="font-semibold text-white flex items-center">
                        <Layout className="w-5 h-5 mr-2" />
                        Components
                      </h3>
                      <p className="text-blue-100 text-sm mt-1">Drag to build your page</p>
                    </div>
                    
                    {/* Component Library */}
                    <div className="component-library-container p-4 scroll">
                      <Puck.Components />
                    </div>
                  </div>
                )}

                {/* Main Editor Area */}
                <div className="flex-1 flex flex-col">
                  {/* Preview Container */}
                  <div className="flex-1 bg-slate-100 p-4 overflow-auto">
                    <div 
                      className="mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
                      style={{
                        width: currentViewport.width,
                        maxWidth: '100%',
                        transition: 'width 0.3s ease'
                      }}
                    >
                      <Puck.Preview />
                    </div>
                  </div>
                </div>

                {/* Properties Panel */}
                {!isPreviewMode && (
                  <div className="w-80 bg-white border-l border-slate-200 flex flex-col">
                    {/* Properties Header */}
                    <div className="p-4 border-b border-slate-200">
                      <h3 className="font-semibold text-slate-900 flex items-center">
                        <Paintbrush className="w-5 h-5 mr-2 text-purple-500" />
                        Properties
                      </h3>
                      <p className="text-slate-500 text-sm mt-1">Customize selected element</p>
                    </div>
                    
                    {/* Fields */}
                    <div className="properties-panel-container p-4">
                      <Puck.Fields />
                    </div>

                    {/* Outline Panel */}
                    {showOutline && (
                      <>
                        <div className="border-t border-slate-200 p-4 max-h-64 overflow-y-auto">
                          <h4 className="font-semibold text-slate-900 flex items-center mb-3">
                            <Layers3 className="w-4 h-4 mr-2 text-blue-500" />
                            Page Outline
                          </h4>
                          <div className="max-h-48 overflow-y-auto">
                            <Puck.Outline />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </Puck>
          )}

          {/* Floating Save Indicator */}
          <div className="absolute bottom-6 right-6 z-50">
            <div className={cn(
              "px-4 py-2 rounded-full shadow-lg border transition-all duration-300",
              autoSaveStatus === 'saved' && "bg-green-50 border-green-200 text-green-800",
              autoSaveStatus === 'saving' && "bg-yellow-50 border-yellow-200 text-yellow-800",
              autoSaveStatus === 'error' && "bg-red-50 border-red-200 text-red-800"
            )}>
              <div className="flex items-center space-x-2 text-sm font-medium">
                {autoSaveStatus === 'saving' && (
                  <div className="w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                )}
                {autoSaveStatus === 'saved' && <Check className="w-3 h-3" />}
                {autoSaveStatus === 'error' && <X className="w-3 h-3" />}
                <span>
                  {autoSaveStatus === 'saved' && 'All changes saved'}
                  {autoSaveStatus === 'saving' && 'Auto-saving...'}
                  {autoSaveStatus === 'error' && 'Save failed'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Modal */}
        <Dialog open={showKeyboardShortcuts} onOpenChange={setShowKeyboardShortcuts}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Command className="w-5 h-5 text-blue-500" />
                <span>Keyboard Shortcuts</span>
              </DialogTitle>
              <DialogDescription>
                Boost your productivity with these powerful shortcuts
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-900 bg-slate-50 px-3 py-1 rounded">General</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Save Page</span>
                    <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">⌘S</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Toggle Preview</span>
                    <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">⌘I</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Fullscreen</span>
                    <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">⌘F</kbd>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-900 bg-slate-50 px-3 py-1 rounded">Navigation</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Close Dialog</span>
                    <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">Esc</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Quick Search</span>
                    <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">⌘K</kbd>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-900 bg-slate-50 px-3 py-1 rounded">Editing</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Undo</span>
                    <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">⌘Z</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Redo</span>
                    <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">⌘⇧Z</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Duplicate</span>
                    <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">⌘D</kbd>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}