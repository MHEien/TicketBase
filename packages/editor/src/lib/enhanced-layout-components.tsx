import React from 'react';
import { Layout, Move } from 'lucide-react';
import { Label } from '@repo/ui/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { Slider } from '@repo/ui/components/ui/slider';
import { Switch } from '@repo/ui/components/ui/switch';

// Advanced CSS Grid Layout Component
export const GridLayout = {
  fields: {
    gridTemplate: {
      type: "select" as const,
      options: [
        { label: "Auto Fit (Responsive)", value: "auto-fit" },
        { label: "2 Columns", value: "2" },
        { label: "3 Columns", value: "3" },
        { label: "4 Columns", value: "4" },
        { label: "5 Columns", value: "5" },
        { label: "6 Columns", value: "6" },
        { label: "Custom", value: "custom" },
      ],
    },
    customTemplate: {
      type: "text" as const,
      description: "CSS Grid template (e.g., '1fr 2fr 1fr' or 'repeat(auto-fit, minmax(300px, 1fr))')",
    },
    gridRows: {
      type: "select" as const,
      options: [
        { label: "Auto", value: "auto" },
        { label: "2 Rows", value: "2" },
        { label: "3 Rows", value: "3" },
        { label: "4 Rows", value: "4" },
        { label: "Custom", value: "custom" },
      ],
    },
    customRows: {
      type: "text" as const,
      description: "CSS Grid rows (e.g., 'auto 1fr auto')",
    },
    gap: {
      type: "custom" as const,
      render: ({ value, onChange }: { value: number; onChange: (value: number) => void }) => (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Gap: {value}px</Label>
          <Slider
            value={[value]}
            onValueChange={([val]) => onChange(val)}
            max={80}
            min={0}
            step={4}
            className="w-full"
          />
        </div>
      ),
    },
    alignItems: {
      type: "select" as const,
      options: [
        { label: "Start", value: "start" },
        { label: "Center", value: "center" },
        { label: "End", value: "end" },
        { label: "Stretch", value: "stretch" },
      ],
    },
    justifyItems: {
      type: "select" as const,
      options: [
        { label: "Start", value: "start" },
        { label: "Center", value: "center" },
        { label: "End", value: "end" },
        { label: "Stretch", value: "stretch" },
      ],
    },
    minColumnWidth: {
      type: "custom" as const,
      render: ({ value, onChange }: { value: number; onChange: (value: number) => void }) => (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Min Column Width: {value}px</Label>
          <Slider
            value={[value]}
            onValueChange={([val]) => onChange(val)}
            max={500}
            min={200}
            step={10}
            className="w-full"
          />
        </div>
      ),
    },
    backgroundColor: {
      type: "text" as const,
      label: "Background Color",
    },
    content: {
      type: "slot" as const,
      label: "Grid Items",
    },
  },
  defaultProps: {
    gridTemplate: "auto-fit",
    customTemplate: "repeat(auto-fit, minmax(300px, 1fr))",
    gridRows: "auto",
    customRows: "auto",
    gap: 24,
    alignItems: "stretch",
    justifyItems: "stretch",
    minColumnWidth: 300,
    backgroundColor: "transparent",
  },
  render: ({ 
    children, 
    gridTemplate, 
    customTemplate, 
    gridRows, 
    customRows, 
    gap, 
    alignItems, 
    justifyItems, 
    minColumnWidth,
    backgroundColor
  }: any) => {
    const getGridTemplate = () => {
      if (gridTemplate === "custom") return customTemplate;
      if (gridTemplate === "auto-fit") return `repeat(auto-fit, minmax(${minColumnWidth}px, 1fr))`;
      return `repeat(${gridTemplate}, 1fr)`;
    };

    const getGridRows = () => {
      if (gridRows === "custom") return customRows;
      if (gridRows === "auto") return "auto";
      return `repeat(${gridRows}, auto)`;
    };

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: getGridTemplate(),
          gridTemplateRows: getGridRows(),
          gap: `${gap}px`,
          alignItems,
          justifyItems,
          backgroundColor: backgroundColor || 'transparent',
          padding: '20px',
        }}
        className="w-full"
      >
        {children}
      </div>
    );
  },
};

// Advanced Flexbox Layout Component
export const FlexboxLayout = {
  fields: {
    direction: {
      type: "select" as const,
      options: [
        { label: "Row", value: "row" },
        { label: "Column", value: "column" },
        { label: "Row Reverse", value: "row-reverse" },
        { label: "Column Reverse", value: "column-reverse" },
      ],
    },
    wrap: {
      type: "select" as const,
      options: [
        { label: "No Wrap", value: "nowrap" },
        { label: "Wrap", value: "wrap" },
        { label: "Wrap Reverse", value: "wrap-reverse" },
      ],
    },
    justifyContent: {
      type: "select" as const,
      options: [
        { label: "Start", value: "flex-start" },
        { label: "Center", value: "center" },
        { label: "End", value: "flex-end" },
        { label: "Space Between", value: "space-between" },
        { label: "Space Around", value: "space-around" },
        { label: "Space Evenly", value: "space-evenly" },
      ],
    },
    alignItems: {
      type: "select" as const,
      options: [
        { label: "Start", value: "flex-start" },
        { label: "Center", value: "center" },
        { label: "End", value: "flex-end" },
        { label: "Stretch", value: "stretch" },
        { label: "Baseline", value: "baseline" },
      ],
    },
    gap: {
      type: "custom" as const,
      render: ({ value, onChange }: { value: number; onChange: (value: number) => void }) => (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Gap: {value}px</Label>
          <Slider
            value={[value]}
            onValueChange={([val]) => onChange(val)}
            max={80}
            min={0}
            step={4}
            className="w-full"
          />
        </div>
      ),
    },
    responsiveDirection: {
      type: "custom" as const,
      render: ({ value, onChange }: { value: any; onChange: (value: any) => void }) => (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Responsive Direction</Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs">Mobile</Label>
              <Select
                value={value.mobile}
                onValueChange={(mobile) => onChange({ ...value, mobile })}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="column">Column</SelectItem>
                  <SelectItem value="row">Row</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Tablet</Label>
              <Select
                value={value.tablet}
                onValueChange={(tablet) => onChange({ ...value, tablet })}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="column">Column</SelectItem>
                  <SelectItem value="row">Row</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Desktop</Label>
              <Select
                value={value.desktop}
                onValueChange={(desktop) => onChange({ ...value, desktop })}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="column">Column</SelectItem>
                  <SelectItem value="row">Row</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ),
    },
    backgroundColor: {
      type: "text" as const,
      label: "Background Color",
    },
  },
  defaultProps: {
    direction: "row",
    wrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "stretch",
    gap: 16,
    responsiveDirection: {
      mobile: "column",
      tablet: "row",
      desktop: "row",
    },
    backgroundColor: "transparent",
  },
  render: ({ 
    children, 
    direction, 
    wrap, 
    justifyContent, 
    alignItems, 
    gap, 
    backgroundColor
  }: any) => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: direction,
          flexWrap: wrap,
          justifyContent,
          alignItems,
          gap: `${gap}px`,
          padding: '20px',
          backgroundColor: backgroundColor || 'transparent',
        }}
        className="w-full"
      >
        {children}
      </div>
    );
  },
};

// Slot Container for Advanced Nesting (Puck 0.19 Feature)
export const SlotContainer = {
  fields: {
    slotName: {
      type: "text" as const,
      description: "Unique name for this slot area",
    },
    minHeight: {
      type: "custom" as const,
      render: ({ value, onChange }: { value: number; onChange: (value: number) => void }) => (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Min Height: {value}px</Label>
          <Slider
            value={[value]}
            onValueChange={([val]) => onChange(val)}
            max={800}
            min={100}
            step={50}
            className="w-full"
          />
        </div>
      ),
    },
    placeholder: {
      type: "text" as const,
      description: "Placeholder text when slot is empty",
    },
    borderStyle: {
      type: "select" as const,
      options: [
        { label: "None", value: "none" },
        { label: "Dashed", value: "dashed" },
        { label: "Solid", value: "solid" },
        { label: "Dotted", value: "dotted" },
      ],
    },
    showDropIndicator: {
      type: "custom" as const,
      render: ({ value, onChange }: { value: boolean; onChange: (value: boolean) => void }) => (
        <div className="flex items-center space-x-2">
          <Switch checked={value} onCheckedChange={onChange} />
          <Label>Show Drop Indicator</Label>
        </div>
      ),
    },
  },
  defaultProps: {
    slotName: "content-slot",
    minHeight: 200,
    placeholder: "Drop components here",
    borderStyle: "dashed",
    showDropIndicator: true,
  },
  render: ({ 
    children, 
    slotName, 
    minHeight, 
    placeholder, 
    borderStyle, 
    showDropIndicator
  }: any) => {
    const borderClass = borderStyle !== "none" ? `border-2 border-${borderStyle} border-gray-300` : "";
    const hasContent = children && React.Children.count(children) > 0;

    return (
      <div
        style={{
          minHeight: `${minHeight}px`,
          padding: '20px',
        }}
        className={`relative w-full ${borderClass} ${!hasContent ? 'flex items-center justify-center' : ''} transition-all duration-200 hover:border-blue-400`}
        data-slot={slotName}
      >
        {hasContent ? (
          children
        ) : (
          <div className="text-center text-gray-500 py-8">
            <Layout className="mx-auto mb-2 h-8 w-8 opacity-50" />
            <p className="text-sm">{placeholder}</p>
          </div>
        )}
        
        {showDropIndicator && !hasContent && (
          <div className="absolute inset-0 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg opacity-0 transition-opacity duration-200 pointer-events-none hover:opacity-100">
            <div className="flex items-center justify-center h-full">
              <div className="text-blue-600 text-center">
                <Move className="mx-auto mb-2 h-6 w-6" />
                <span className="text-sm font-medium">Drop Zone</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
};

// Responsive Card Grid with Advanced Controls
export const CardGrid = {
  fields: {
    cards: {
      type: "array" as const,
      arrayFields: {
        title: { type: "text" as const },
        content: { type: "textarea" as const },
        image: { type: "text" as const },
        link: { type: "text" as const },
        buttonText: { type: "text" as const },
      },
      getItemSummary: (item: any) => item.title || "Untitled Card",
    },
    columns: {
      type: "custom" as const,
      render: ({ value, onChange }: { value: any; onChange: (value: any) => void }) => (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Responsive Columns</Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs">Mobile</Label>
              <Select
                value={value.mobile.toString()}
                onValueChange={(mobile) => onChange({ ...value, mobile: parseInt(mobile) })}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Tablet</Label>
              <Select
                value={value.tablet.toString()}
                onValueChange={(tablet) => onChange({ ...value, tablet: parseInt(tablet) })}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Desktop</Label>
              <Select
                value={value.desktop.toString()}
                onValueChange={(desktop) => onChange({ ...value, desktop: parseInt(desktop) })}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ),
    },
    cardStyle: {
      type: "select" as const,
      options: [
        { label: "Modern Card", value: "modern" },
        { label: "Glass Card", value: "glass" },
        { label: "Minimal", value: "minimal" },
        { label: "Elevated", value: "elevated" },
      ],
    },
    gap: {
      type: "custom" as const,
      render: ({ value, onChange }: { value: number; onChange: (value: number) => void }) => (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Gap: {value}px</Label>
          <Slider
            value={[value]}
            onValueChange={([val]) => onChange(val)}
            max={60}
            min={8}
            step={4}
            className="w-full"
          />
        </div>
      ),
    },
  },
  defaultProps: {
    cards: [
      {
        title: "Feature One",
        content: "Description of your first amazing feature.",
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400",
        link: "#",
        buttonText: "Learn More",
      },
      {
        title: "Feature Two", 
        content: "Description of your second amazing feature.",
        image: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400",
        link: "#",
        buttonText: "Learn More",
      },
      {
        title: "Feature Three",
        content: "Description of your third amazing feature.",
        image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400",
        link: "#",
        buttonText: "Learn More",
      },
    ],
    columns: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
    },
    cardStyle: "modern",
    gap: 24,
  },
  render: ({ cards, columns, cardStyle, gap }: any) => {
    const getCardClassName = () => {
      switch (cardStyle) {
        case "glass":
          return "bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20";
        case "minimal":
          return "bg-transparent border border-gray-200 hover:border-gray-300";
        case "elevated":
          return "bg-white shadow-xl hover:shadow-2xl border-0";
        default:
          return "bg-white border border-gray-200 shadow-md hover:shadow-lg";
      }
    };

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns.desktop}, 1fr)`,
          gap: `${gap}px`,
        }}
        className="w-full"
      >
        {cards.map((card: any, index: number) => (
          <div
            key={index}
            className={`${getCardClassName()} rounded-xl overflow-hidden transition-all duration-300 group`}
          >
            {card.image && (
              <div className="aspect-video overflow-hidden">
                <img 
                  src={card.image} 
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
                {card.title}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {card.content}
              </p>
              {card.buttonText && card.link && (
                <a
                  href={card.link}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  {card.buttonText}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  },
};

export const enhancedLayoutComponents = {
  GridLayout,
  FlexboxLayout,
  SlotContainer,
  CardGrid,
};