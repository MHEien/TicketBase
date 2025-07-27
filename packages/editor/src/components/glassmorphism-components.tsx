import React from 'react';
import { type Config } from '@measured/puck';
import { Sparkles, Heart, Star, Users, Zap, Shield, Globe, Rocket } from 'lucide-react';
import { ColorPickerField, SpacingField, BorderField, ShadowField, FilterField } from './fields';

// Glass Card Component
export const GlassCard = {
  fields: {
    title: { type: "text" as const },
    content: { type: "textarea" as const },
    icon: {
      type: "select" as const,
      options: [
        { label: "Sparkles", value: "Sparkles" },
        { label: "Heart", value: "Heart" },
        { label: "Star", value: "Star" },
        { label: "Users", value: "Users" },
        { label: "Zap", value: "Zap" },
        { label: "Shield", value: "Shield" },
        { label: "Globe", value: "Globe" },
        { label: "Rocket", value: "Rocket" },
      ],
    },
    blurIntensity: {
      type: "select" as const,
      options: [
        { label: "Light", value: "backdrop-blur-sm" },
        { label: "Medium", value: "backdrop-blur-md" },
        { label: "Heavy", value: "backdrop-blur-lg" },
        { label: "Ultra", value: "backdrop-blur-xl" },
      ],
    },
    glassOpacity: {
      type: "select" as const,
      options: [
        { label: "5%", value: "bg-white/5" },
        { label: "10%", value: "bg-white/10" },
        { label: "15%", value: "bg-white/15" },
        { label: "20%", value: "bg-white/20" },
        { label: "30%", value: "bg-white/30" },
      ],
    },
    borderGlow: {
      type: "select" as const,
      options: [
        { label: "None", value: "border-transparent" },
        { label: "White Subtle", value: "border-white/20" },
        { label: "White Strong", value: "border-white/40" },
        { label: "Blue Glow", value: "border-blue-400/30" },
        { label: "Purple Glow", value: "border-purple-400/30" },
        { label: "Pink Glow", value: "border-pink-400/30" },
      ],
    },
    padding: {
      type: "custom" as const,
      render: ({ value, onChange }) => (
        <SpacingField value={value} onChange={onChange} label="Padding" />
      ),
    },
    borderRadius: {
      type: "select" as const,
      options: [
        { label: "Small", value: "rounded-lg" },
        { label: "Medium", value: "rounded-xl" },
        { label: "Large", value: "rounded-2xl" },
        { label: "Extra Large", value: "rounded-3xl" },
      ],
    },
    glassEffect: {
      type: "custom" as const,
      render: ({ value, onChange }) => (
        <FilterField value={value} onChange={onChange} label="Glass Effects" />
      ),
    },
  },
  defaultProps: {
    title: "Glass Card",
    content: "Beautiful glassmorphism card with backdrop blur and subtle transparency effects.",
    icon: "Sparkles",
    blurIntensity: "backdrop-blur-md",
    glassOpacity: "bg-white/10",
    borderGlow: "border-white/20",
    padding: { top: 24, right: 24, bottom: 24, left: 24 },
    borderRadius: "rounded-xl",
    glassEffect: {
      blur: 0,
      brightness: 100,
      contrast: 100,
      saturate: 100,
      hue: 0,
      sepia: 0,
      grayscale: 0,
      invert: 0,
      opacity: 100,
    },
  },
  render: ({ title, content, icon, blurIntensity, glassOpacity, borderGlow, padding, borderRadius, glassEffect }: any) => {
    const IconComponent = {
      Sparkles, Heart, Star, Users, Zap, Shield, Globe, Rocket
    }[icon] || Sparkles;

    const filterString = Object.entries(glassEffect)
      .filter(([key, value]) => {
        if (key === 'blur' && value !== 0) return true;
        if (key === 'brightness' && value !== 100) return true;
        if (key === 'contrast' && value !== 100) return true;
        if (key === 'saturate' && value !== 100) return true;
        if (key === 'hue' && value !== 0) return true;
        if (key === 'sepia' && value !== 0) return true;
        if (key === 'grayscale' && value !== 0) return true;
        if (key === 'invert' && value !== 0) return true;
        if (key === 'opacity' && value !== 100) return true;
        return false;
      })
      .map(([key, value]) => {
        switch (key) {
          case 'blur': return `blur(${value}px)`;
          case 'brightness': return `brightness(${value}%)`;
          case 'contrast': return `contrast(${value}%)`;
          case 'saturate': return `saturate(${value}%)`;
          case 'hue': return `hue-rotate(${value}deg)`;
          case 'sepia': return `sepia(${value}%)`;
          case 'grayscale': return `grayscale(${value}%)`;
          case 'invert': return `invert(${value}%)`;
          case 'opacity': return `opacity(${value}%)`;
          default: return '';
        }
      })
      .join(' ');

    const paddingStyle = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;

    return (
      <div 
        className={`${glassOpacity} ${blurIntensity} ${borderGlow} ${borderRadius} border p-6 transition-all duration-300 hover:bg-white/15 hover:border-white/30 group`}
        style={{ 
          padding: paddingStyle,
          filter: filterString || 'none',
        }}
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
            <IconComponent size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-100 transition-colors">
              {title}
            </h3>
            <p className="text-white/80 leading-relaxed group-hover:text-white/90 transition-colors">
              {content}
            </p>
          </div>
        </div>
      </div>
    );
  },
};

// Glass Navigation Component
export const GlassNavigation = {
  fields: {
    items: {
      type: "custom" as const,
      render: ({ value, onChange }) => (
        <div className="space-y-2">
          <label className="text-sm font-medium">Navigation Items</label>
          {value.map((item: any, index: number) => (
            <div key={index} className="flex gap-2 p-2 border rounded">
              <input
                value={item.label}
                onChange={(e) => {
                  const newItems = [...value];
                  newItems[index] = { ...item, label: e.target.value };
                  onChange(newItems);
                }}
                placeholder="Label"
                className="flex-1 px-2 py-1 text-xs border rounded"
              />
              <input
                value={item.href}
                onChange={(e) => {
                  const newItems = [...value];
                  newItems[index] = { ...item, href: e.target.value };
                  onChange(newItems);
                }}
                placeholder="Link"
                className="flex-1 px-2 py-1 text-xs border rounded"
              />
              <button
                onClick={() => {
                  const newItems = value.filter((_: any, i: number) => i !== index);
                  onChange(newItems);
                }}
                className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={() => onChange([...value, { label: "New Item", href: "#" }])}
            className="w-full px-3 py-2 text-xs border border-dashed rounded hover:bg-gray-50"
          >
            + Add Item
          </button>
        </div>
      ),
    },
    logo: { type: "text" as const },
    blurIntensity: {
      type: "select" as const,
      options: [
        { label: "Light", value: "backdrop-blur-sm" },
        { label: "Medium", value: "backdrop-blur-md" },
        { label: "Heavy", value: "backdrop-blur-lg" },
      ],
    },
    glassOpacity: {
      type: "select" as const,
      options: [
        { label: "5%", value: "bg-white/5" },
        { label: "10%", value: "bg-white/10" },
        { label: "15%", value: "bg-white/15" },
        { label: "20%", value: "bg-white/20" },
      ],
    },
    position: {
      type: "select" as const,
      options: [
        { label: "Top", value: "top-0" },
        { label: "Fixed Top", value: "fixed top-0" },
        { label: "Sticky Top", value: "sticky top-0" },
      ],
    },
  },
  defaultProps: {
    logo: "YourLogo",
    items: [
      { label: "Home", href: "#" },
      { label: "About", href: "#about" },
      { label: "Services", href: "#services" },
      { label: "Contact", href: "#contact" },
    ],
    blurIntensity: "backdrop-blur-md",
    glassOpacity: "bg-white/10",
    position: "sticky top-0",
  },
  render: ({ logo, items, blurIntensity, glassOpacity, position }: any) => {
    return (
      <nav className={`${position} w-full z-50 ${glassOpacity} ${blurIntensity} border-b border-white/20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-white font-bold text-xl">
                {logo}
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {items.map((item: any, index: number) => (
                  <a
                    key={index}
                    href={item.href}
                    className="text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  },
};

// Glass Hero Section with Glassmorphism
export const GlassHero = {
  fields: {
    title: { type: "text" as const },
    subtitle: { type: "textarea" as const },
    buttonText: { type: "text" as const },
    buttonUrl: { type: "text" as const },
    backgroundImage: { type: "text" as const },
    overlayOpacity: {
      type: "select" as const,
      options: [
        { label: "20%", value: "bg-black/20" },
        { label: "30%", value: "bg-black/30" },
        { label: "40%", value: "bg-black/40" },
        { label: "50%", value: "bg-black/50" },
        { label: "60%", value: "bg-black/60" },
      ],
    },
    glassCardOpacity: {
      type: "select" as const,
      options: [
        { label: "10%", value: "bg-white/10" },
        { label: "15%", value: "bg-white/15" },
        { label: "20%", value: "bg-white/20" },
        { label: "25%", value: "bg-white/25" },
      ],
    },
    blurIntensity: {
      type: "select" as const,
      options: [
        { label: "Medium", value: "backdrop-blur-md" },
        { label: "Heavy", value: "backdrop-blur-lg" },
        { label: "Ultra", value: "backdrop-blur-xl" },
      ],
    },
  },
  defaultProps: {
    title: "Stunning Glassmorphism Design",
    subtitle: "Experience the beauty of modern glass effects with backdrop blur, transparency, and elegant animations.",
    buttonText: "Get Started",
    buttonUrl: "#",
    backgroundImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    overlayOpacity: "bg-black/40",
    glassCardOpacity: "bg-white/15",
    blurIntensity: "backdrop-blur-lg",
  },
  render: ({ title, subtitle, buttonText, buttonUrl, backgroundImage, overlayOpacity, glassCardOpacity, blurIntensity }: any) => {
    return (
      <div 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Background Overlay */}
        <div className={`absolute inset-0 ${overlayOpacity}`} />
        
        {/* Floating Glass Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 backdrop-blur-sm rounded-full animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-blue-400/10 backdrop-blur-sm rounded-full animate-bounce" />
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-purple-400/10 backdrop-blur-sm rounded-full" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className={`${glassCardOpacity} ${blurIntensity} border border-white/20 rounded-3xl p-12 shadow-2xl`}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              {subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={buttonUrl}
                className="inline-flex items-center px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl backdrop-blur-sm border border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                {buttonText}
              </a>
              <a
                href="#"
                className="inline-flex items-center px-8 py-4 bg-transparent hover:bg-white/10 text-white font-semibold rounded-xl border-2 border-white/40 transition-all duration-300 hover:border-white/60"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const glassmorphismComponents = {
  GlassCard,
  GlassNavigation,
  GlassHero,
};