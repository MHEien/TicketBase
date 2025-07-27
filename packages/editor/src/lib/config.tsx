import React, { useState } from 'react';
import { type Config } from '@measured/puck';
import '@measured/puck/puck.css';
import './fullscreen-puck.css';
import { Plus, X, Star } from 'lucide-react';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { Slider } from '@repo/ui/components/ui/slider';
import { Switch } from '@repo/ui/components/ui/switch';
import { ColorPickerField, SpacingField, TypographyField, BorderField, ResponsiveTypographyField, ResponsiveSpacingField } from '@/components/fields';

export const createAdvancedConfig = (): Config => ({
    root: {
      render: ({ children }: any) => {
        return (
          <div className="min-h-screen bg-background">
            {children}
          </div>
        );
      },
    },
    components: {
      // Layout Components
      Section: {
        fields: {
          backgroundType: {
            type: "select" as const,
            options: [
              { label: "None", value: "none" },
              { label: "Color", value: "color" },
              { label: "Gradient", value: "gradient" },
              { label: "Image", value: "image" },
            ],
          },
          backgroundColor: {
            type: "custom" as const,
            render: ({ value, onChange }) => (
              <ColorPickerField value={value} onChange={onChange} label="Background Color" />
            ),
          },
          padding: {
            type: "custom" as const,
            render: ({ value, onChange }) => (
              <SpacingField value={value} onChange={onChange} label="Padding" />
            ),
          },
          margin: {
            type: "custom" as const,
            render: ({ value, onChange }) => (
              <SpacingField value={value} onChange={onChange} label="Margin" />
            ),
          },
          fullWidth: {
            type: "custom" as const,
            render: ({ value, onChange }) => (
              <div className="flex items-center space-x-2">
                <Switch checked={value} onCheckedChange={onChange} />
                <Label>Full Width</Label>
              </div>
            ),
          },
        },
        defaultProps: {
          backgroundType: "none",
          backgroundColor: "#ffffff",
          padding: { top: 40, right: 20, bottom: 40, left: 20 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
          fullWidth: false,
        },
        render: ({ children, backgroundColor, padding, margin, fullWidth, backgroundType }: any) => {
          const sectionStyles = {
            padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
            margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
            backgroundColor: backgroundType === 'color' ? backgroundColor : 'transparent',
            width: fullWidth ? '100vw' : 'auto',
            marginLeft: fullWidth ? '50%' : 'auto',
            transform: fullWidth ? 'translateX(-50%)' : 'none',
          };
  
          return (
            <section style={sectionStyles} className="relative">
              {children}
            </section>
          );
        },
      },
  
      Container: {
        fields: {
          maxWidth: {
            type: "select" as const,
            options: [
              { label: "Small (640px)", value: "640" },
              { label: "Medium (768px)", value: "768" },
              { label: "Large (1024px)", value: "1024" },
              { label: "XL (1280px)", value: "1280" },
              { label: "2XL (1536px)", value: "1536" },
              { label: "Full", value: "full" },
            ],
          },
          alignment: {
            type: "select" as const,
            options: [
              { label: "Left", value: "left" },
              { label: "Center", value: "center" },
              { label: "Right", value: "right" },
            ],
          },
        },
        defaultProps: {
          maxWidth: "1280",
          alignment: "center",
        },
        render: ({ children, maxWidth, alignment }: any) => {
          const containerClasses = [
            "w-full",
            maxWidth !== "full" ? `max-w-${maxWidth === "640" ? "sm" : maxWidth === "768" ? "md" : maxWidth === "1024" ? "lg" : maxWidth === "1280" ? "xl" : "2xl"}` : "",
            alignment === "center" ? "mx-auto" : alignment === "right" ? "ml-auto" : "mr-auto",
            "px-4",
          ].filter(Boolean).join(" ");
  
          return (
            <div className={containerClasses}>
              {children}
            </div>
          );
        },
      },
  
      Columns: {
        fields: {
          columns: {
            type: "select" as const,
            options: [
              { label: "2 Columns", value: "2" },
              { label: "3 Columns", value: "3" },
              { label: "4 Columns", value: "4" },
            ],
          },
          gap: {
            type: "select" as const,
            options: [
              { label: "Small", value: "4" },
              { label: "Medium", value: "6" },
              { label: "Large", value: "8" },
            ],
          },
          verticalAlign: {
            type: "select" as const,
            options: [
              { label: "Top", value: "start" },
              { label: "Middle", value: "center" },
              { label: "Bottom", value: "end" },
            ],
          },
        },
        defaultProps: {
          columns: "2",
          gap: "6",
          verticalAlign: "start",
        },
        render: ({ children, columns, gap, verticalAlign }: any) => {
          const gridClasses = [
            "grid",
            `grid-cols-${columns}`,
            `gap-${gap}`,
            `items-${verticalAlign}`,
          ].join(" ");
  
          return (
            <div className={gridClasses}>
              {children}
            </div>
          );
        },
      },
  
      // Enhanced Content Components
      AdvancedHeading: {
        fields: {
          text: { type: "text" as const },
          tag: {
            type: "select" as const,
            options: [
              { label: "H1", value: "h1" },
              { label: "H2", value: "h2" },
              { label: "H3", value: "h3" },
              { label: "H4", value: "h4" },
              { label: "H5", value: "h5" },
              { label: "H6", value: "h6" },
            ],
          },
          typography: {
            type: "custom" as const,
            render: ({ value, onChange }) => (
              <TypographyField value={value} onChange={onChange} label="Typography" />
            ),
          },
          color: {
            type: "custom" as const,
            render: ({ value, onChange }) => (
              <ColorPickerField value={value} onChange={onChange} label="Text Color" />
            ),
          },
          alignment: {
            type: "select" as const,
            options: [
              { label: "Left", value: "left" },
              { label: "Center", value: "center" },
              { label: "Right", value: "right" },
            ],
          },
          margin: {
            type: "custom" as const,
            render: ({ value, onChange }) => (
              <SpacingField value={value} onChange={onChange} label="Margin" />
            ),
          },
        },
        defaultProps: {
          text: "Your Heading Here",
          tag: "h2",
          typography: {
            fontSize: 32,
            fontWeight: "600",
            lineHeight: 1.2,
            letterSpacing: 0,
            fontFamily: "inherit",
          },
          color: "#000000",
          alignment: "left",
          margin: { top: 0, right: 0, bottom: 20, left: 0 },
        },
               render: ({ text, tag, typography, color, alignment, margin }: any) => {
           const styles = {
             fontSize: `${typography.fontSize}px`,
             fontWeight: typography.fontWeight,
             lineHeight: typography.lineHeight,
             letterSpacing: `${typography.letterSpacing}px`,
             fontFamily: typography.fontFamily !== 'inherit' ? typography.fontFamily : undefined,
             color,
             textAlign: alignment as 'left' | 'center' | 'right',
             margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
           };
  
           return React.createElement(tag, { style: styles }, text);
         },
      },
  
      AdvancedText: {
        fields: {
          content: { type: "textarea" as const },
          typography: {
            type: "custom" as const,
            render: ({ value, onChange }) => (
              <TypographyField value={value} onChange={onChange} label="Typography" />
            ),
          },
          color: {
            type: "custom" as const,
            render: ({ value, onChange }) => (
              <ColorPickerField value={value} onChange={onChange} label="Text Color" />
            ),
          },
          alignment: {
            type: "select" as const,
            options: [
              { label: "Left", value: "left" },
              { label: "Center", value: "center" },
              { label: "Right", value: "right" },
              { label: "Justify", value: "justify" },
            ],
          },
          margin: {
            type: "custom" as const,
            render: ({ value, onChange }) => (
              <SpacingField value={value} onChange={onChange} label="Margin" />
            ),
          },
        },
        defaultProps: {
          content: "Add your text content here. You can format it with multiple lines and create engaging copy for your visitors.",
          typography: {
            fontSize: 16,
            fontWeight: "400",
            lineHeight: 1.6,
            letterSpacing: 0,
            fontFamily: "inherit",
          },
          color: "#666666",
          alignment: "left",
          margin: { top: 0, right: 0, bottom: 20, left: 0 },
        },
        render: ({ content, typography, color, alignment, margin }: any) => {
          const styles = {
            fontSize: `${typography.fontSize}px`,
            fontWeight: typography.fontWeight,
            lineHeight: typography.lineHeight,
            letterSpacing: `${typography.letterSpacing}px`,
            fontFamily: typography.fontFamily !== 'inherit' ? typography.fontFamily : undefined,
            color,
            textAlign: alignment,
            margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
            whiteSpace: 'pre-wrap' as const,
          };
  
          return <p style={styles}>{content}</p>;
        },
      },
  
      AdvancedButton: {
        fields: {
          text: { type: "text" as const },
          url: { type: "text" as const },
          size: {
            type: "select" as const,
            options: [
              { label: "Small", value: "sm" },
              { label: "Medium", value: "md" },
              { label: "Large", value: "lg" },
            ],
          },
          style: {
            type: "select" as const,
            options: [
              { label: "Filled", value: "filled" },
              { label: "Outline", value: "outline" },
              { label: "Ghost", value: "ghost" },
            ],
          },
          backgroundColor: {
            type: "custom" as const,
            render: ({ value, onChange }) => (
              <ColorPickerField value={value} onChange={onChange} label="Background Color" />
            ),
          },
          textColor: {
            type: "custom" as const,
            render: ({ value, onChange }) => (
              <ColorPickerField value={value} onChange={onChange} label="Text Color" />
            ),
          },
          border: {
            type: "custom" as const,
            render: ({ value, onChange }) => (
              <BorderField value={value} onChange={onChange} label="Border" />
            ),
          },
          padding: {
            type: "custom" as const,
            render: ({ value, onChange }) => (
              <SpacingField value={value} onChange={onChange} label="Padding" />
            ),
          },
          margin: {
            type: "custom" as const,
            render: ({ value, onChange }) => (
              <SpacingField value={value} onChange={onChange} label="Margin" />
            ),
          },
          alignment: {
            type: "select" as const,
            options: [
              { label: "Left", value: "left" },
              { label: "Center", value: "center" },
              { label: "Right", value: "right" },
            ],
          },
          openInNewTab: {
            type: "custom" as const,
            render: ({ value, onChange }) => (
              <div className="flex items-center space-x-2">
                <Switch checked={value} onCheckedChange={onChange} />
                <Label>Open in new tab</Label>
              </div>
            ),
          },
        },
        defaultProps: {
          text: "Click Me",
          url: "#",
          size: "md",
          style: "filled",
          backgroundColor: "#0070f3",
          textColor: "#ffffff",
          border: { width: 0, style: "solid", color: "#0070f3", radius: 6 },
          padding: { top: 12, right: 24, bottom: 12, left: 24 },
          margin: { top: 0, right: 0, bottom: 20, left: 0 },
          alignment: "left",
          openInNewTab: false,
        },
        render: ({ 
          text, 
          url, 
          size, 
          style, 
          backgroundColor, 
          textColor, 
          border, 
          padding, 
          margin, 
          alignment, 
          openInNewTab 
        }: any) => {
          const buttonStyles = {
            backgroundColor: style === 'filled' ? backgroundColor : 'transparent',
            color: style === 'filled' ? textColor : backgroundColor,
            border: `${border.width}px ${border.style} ${border.color}`,
            borderRadius: `${border.radius}px`,
            padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
            margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
            textDecoration: 'none',
            display: 'inline-block',
            fontSize: size === 'sm' ? '14px' : size === 'lg' ? '18px' : '16px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          };
  
          const containerStyles = {
            textAlign: alignment,
          };
  
          return (
            <div style={containerStyles}>
              <a
                href={url}
                target={openInNewTab ? "_blank" : "_self"}
                rel={openInNewTab ? "noopener noreferrer" : undefined}
                style={buttonStyles}
                className="hover:opacity-80"
              >
                {text}
              </a>
            </div>
          );
        },
      },
  
      // Image Component
      ImageBlock: {
        fields: {
          src: { type: "text" as const },
          alt: { type: "text" as const },
          width: {
            type: "select" as const,
            options: [
              { label: "25%", value: "25" },
              { label: "50%", value: "50" },
              { label: "75%", value: "75" },
              { label: "100%", value: "100" },
              { label: "Custom", value: "custom" },
            ],
          },
          customWidth: { type: "number" as const },
          alignment: {
            type: "select" as const,
            options: [
              { label: "Left", value: "left" },
              { label: "Center", value: "center" },
              { label: "Right", value: "right" },
            ],
          },
          border: {
            type: "custom" as const,
            render: ({ value, onChange }) => (
              <BorderField value={value} onChange={onChange} label="Border" />
            ),
          },
          margin: {
            type: "custom" as const,
            render: ({ value, onChange }) => (
              <SpacingField value={value} onChange={onChange} label="Margin" />
            ),
          },
        },
        defaultProps: {
          src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          alt: "Placeholder image",
          width: "100",
          customWidth: 400,
          alignment: "center",
          border: { width: 0, style: "solid", color: "#e5e5e5", radius: 8 },
          margin: { top: 0, right: 0, bottom: 20, left: 0 },
        },
        render: ({ src, alt, width, customWidth, alignment, border, margin }: any) => {
          const imageStyles = {
            width: width === "custom" ? `${customWidth}px` : `${width}%`,
            border: `${border.width}px ${border.style} ${border.color}`,
            borderRadius: `${border.radius}px`,
            margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
          };
  
          const containerStyles = {
            textAlign: alignment,
          };
  
          return (
            <div style={containerStyles}>
              <img src={src} alt={alt} style={imageStyles} />
            </div>
          );
        },
      },
  
      // Spacer Component
      Spacer: {
        fields: {
          height: {
            type: "custom" as const,
            render: ({ value, onChange }) => (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Height: {value}px</Label>
                <Slider
                  value={[value]}
                  onValueChange={([val]) => onChange(val)}
                  max={200}
                  min={10}
                  step={5}
                  className="w-full"
                />
              </div>
            ),
          },
          showOnDesktop: {
            type: "custom" as const,
            render: ({ value, onChange }) => (
              <div className="flex items-center space-x-2">
                <Switch checked={value} onCheckedChange={onChange} />
                <Label>Show on Desktop</Label>
              </div>
            ),
          },
          showOnTablet: {
            type: "custom" as const,
            render: ({ value, onChange }) => (
              <div className="flex items-center space-x-2">
                <Switch checked={value} onCheckedChange={onChange} />
                <Label>Show on Tablet</Label>
              </div>
            ),
          },
          showOnMobile: {
            type: "custom" as const,
            render: ({ value, onChange }) => (
              <div className="flex items-center space-x-2">
                <Switch checked={value} onCheckedChange={onChange} />
                <Label>Show on Mobile</Label>
              </div>
            ),
          },
        },
        defaultProps: {
          height: 40,
          showOnDesktop: true,
          showOnTablet: true,
          showOnMobile: true,
        },
        render: ({ height, showOnDesktop, showOnTablet, showOnMobile }: any) => {
          const responsiveClasses = [
            showOnDesktop ? 'block' : 'hidden',
            'lg:' + (showOnDesktop ? 'block' : 'hidden'),
            'md:' + (showOnTablet ? 'block' : 'hidden'),
            'sm:' + (showOnMobile ? 'block' : 'hidden'),
          ].join(' ');
  
          return (
            <div 
              className={responsiveClasses}
              style={{ height: `${height}px` }}
            />
          );
        },
      },
  
      // Contact Form
      ContactForm: {
        fields: {
          title: { type: "text" as const },
          showTitle: {
            type: "custom" as const,
            render: ({ value, onChange }) => (
              <div className="flex items-center space-x-2">
                <Switch checked={value} onCheckedChange={onChange} />
                <Label>Show Title</Label>
              </div>
            ),
          },
          fields: {
            type: "custom" as const,
            render: ({ value, onChange }) => (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Form Fields</Label>
                {value.map((field: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    <Input
                      value={field.label}
                      onChange={(e) => {
                        const newFields = [...value];
                        newFields[index] = { ...field, label: e.target.value };
                        onChange(newFields);
                      }}
                      placeholder="Field label"
                      className="flex-1"
                    />
                    <Select
                      value={field.type}
                      onValueChange={(type) => {
                        const newFields = [...value];
                        newFields[index] = { ...field, type };
                        onChange(newFields);
                      }}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="textarea">Textarea</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newFields = value.filter((_: any, i: number) => i !== index);
                        onChange(newFields);
                      }}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onChange([...value, { label: "New Field", type: "text", required: false }]);
                  }}
                >
                  <Plus size={14} className="mr-1" />
                  Add Field
                </Button>
              </div>
            ),
          },
          submitText: { type: "text" as const },
          successMessage: { type: "text" as const },
        },
        defaultProps: {
          title: "Contact Us",
          showTitle: true,
          fields: [
            { label: "Name", type: "text", required: true },
            { label: "Email", type: "email", required: true },
            { label: "Message", type: "textarea", required: true },
          ],
          submitText: "Send Message",
          successMessage: "Thank you! Your message has been sent.",
        },
        render: ({ title, showTitle, fields, submitText, successMessage }: any) => {
          const [isSubmitted, setIsSubmitted] = useState(false);
  
          const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            setIsSubmitted(true);
            setTimeout(() => setIsSubmitted(false), 3000);
          };
  
          if (isSubmitted) {
            return (
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                <p className="text-green-800 font-medium">{successMessage}</p>
              </div>
            );
          }
  
          return (
            <div className="max-w-md mx-auto">
              {showTitle && (
                <h3 className="text-2xl font-bold text-center mb-6">{title}</h3>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map((field: any, index: number) => (
                  <div key={index}>
                    <Label htmlFor={`field-${index}`} className="block text-sm font-medium mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {field.type === "textarea" ? (
                      <Textarea
                        id={`field-${index}`}
                        required={field.required}
                        className="w-full"
                        rows={4}
                      />
                    ) : (
                      <Input
                        id={`field-${index}`}
                        type={field.type}
                        required={field.required}
                        className="w-full"
                      />
                    )}
                  </div>
                ))}
                <Button type="submit" className="w-full">
                  {submitText}
                </Button>
              </form>
            </div>
          );
        },
      },
  
      // Testimonial Component
      Testimonial: {
        fields: {
          quote: { type: "textarea" as const },
          author: { type: "text" as const },
          position: { type: "text" as const },
          company: { type: "text" as const },
          avatar: { type: "text" as const },
          rating: {
            type: "select" as const,
            options: [
              { label: "5 Stars", value: "5" },
              { label: "4 Stars", value: "4" },
              { label: "3 Stars", value: "3" },
              { label: "2 Stars", value: "2" },
              { label: "1 Star", value: "1" },
            ],
          },
          style: {
            type: "select" as const,
            options: [
              { label: "Card", value: "card" },
              { label: "Minimal", value: "minimal" },
              { label: "Centered", value: "centered" },
            ],
          },
        },
        defaultProps: {
          quote: "This product has completely transformed our workflow. Highly recommended!",
          author: "John Doe",
          position: "CEO",
          company: "Example Company",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
          rating: "5",
          style: "card",
        },
        render: ({ quote, author, position, company, avatar, rating, style }: any) => {
          const stars = Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={16}
              className={i < parseInt(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}
            />
          ));
  
          const content = (
            <>
              <div className="flex mb-3">{stars}</div>
              <blockquote className="text-lg italic mb-4">"{quote}"</blockquote>
              <div className="flex items-center gap-3">
                <img src={avatar} alt={author} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-semibold">{author}</p>
                  <p className="text-sm text-gray-600">{position} at {company}</p>
                </div>
              </div>
            </>
          );
  
          if (style === "card") {
            return (
              <div className="bg-white p-6 rounded-lg shadow-lg border max-w-md mx-auto">
                {content}
              </div>
            );
          }
  
          if (style === "centered") {
            return (
              <div className="text-center max-w-2xl mx-auto">
                <div className="flex justify-center mb-3">{stars}</div>
                <blockquote className="text-xl italic mb-6">"{quote}"</blockquote>
                <div className="flex justify-center items-center gap-3">
                  <img src={avatar} alt={author} className="w-16 h-16 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-lg">{author}</p>
                    <p className="text-gray-600">{position} at {company}</p>
                  </div>
                </div>
              </div>
            );
          }
  
          return <div className="max-w-md">{content}</div>;
        },
      },
  
           // Progress Bar
       ProgressBar: {
         fields: {
           label: { type: "text" as const },
           percentage: {
             type: "custom" as const,
             render: ({ value, onChange }) => (
               <div className="space-y-2">
                 <Label className="text-sm font-medium">Progress: {value}%</Label>
                 <Slider
                   value={[value]}
                   onValueChange={([val]) => onChange(val)}
                   max={100}
                   min={0}
                   step={1}
                   className="w-full"
                 />
               </div>
             ),
           },
           color: {
             type: "custom" as const,
             render: ({ value, onChange }) => (
               <ColorPickerField value={value} onChange={onChange} label="Progress Color" />
             ),
           },
           backgroundColor: {
             type: "custom" as const,
             render: ({ value, onChange }) => (
               <ColorPickerField value={value} onChange={onChange} label="Background Color" />
             ),
           },
           height: {
             type: "custom" as const,
             render: ({ value, onChange }) => (
               <div className="space-y-2">
                 <Label className="text-sm font-medium">Height: {value}px</Label>
                 <Slider
                   value={[value]}
                   onValueChange={([val]) => onChange(val)}
                   max={30}
                   min={4}
                   step={1}
                   className="w-full"
                 />
               </div>
             ),
           },
           showPercentage: {
             type: "custom" as const,
             render: ({ value, onChange }) => (
               <div className="flex items-center space-x-2">
                 <Switch checked={value} onCheckedChange={onChange} />
                 <Label>Show Percentage</Label>
               </div>
             ),
           },
         },
         defaultProps: {
           label: "Progress",
           percentage: 75,
           color: "#0070f3",
           backgroundColor: "#e5e5e5",
           height: 8,
           showPercentage: true,
         },
         render: ({ label, percentage, color, backgroundColor, height, showPercentage }: any) => {
           return (
             <div className="w-full">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-sm font-medium">{label}</span>
                 {showPercentage && <span className="text-sm text-gray-600">{percentage}%</span>}
               </div>
               <div
                 className="w-full rounded-full overflow-hidden"
                 style={{ backgroundColor, height: `${height}px` }}
               >
                 <div
                   className="h-full transition-all duration-500 ease-out"
                   style={{
                     width: `${percentage}%`,
                     backgroundColor: color,
                   }}
                 />
               </div>
             </div>
           );
         },
       },
  
       // Video Player
       VideoPlayer: {
         fields: {
           videoUrl: { type: "text" as const },
           poster: { type: "text" as const },
           autoplay: {
             type: "custom" as const,
             render: ({ value, onChange }) => (
               <div className="flex items-center space-x-2">
                 <Switch checked={value} onCheckedChange={onChange} />
                 <Label>Autoplay</Label>
               </div>
             ),
           },
           controls: {
             type: "custom" as const,
             render: ({ value, onChange }) => (
               <div className="flex items-center space-x-2">
                 <Switch checked={value} onCheckedChange={onChange} />
                 <Label>Show Controls</Label>
               </div>
             ),
           },
           loop: {
             type: "custom" as const,
             render: ({ value, onChange }) => (
               <div className="flex items-center space-x-2">
                 <Switch checked={value} onCheckedChange={onChange} />
                 <Label>Loop Video</Label>
               </div>
             ),
           },
           width: {
             type: "select" as const,
             options: [
               { label: "50%", value: "50" },
               { label: "75%", value: "75" },
               { label: "100%", value: "100" },
             ],
           },
           aspectRatio: {
             type: "select" as const,
             options: [
               { label: "16:9", value: "16/9" },
               { label: "4:3", value: "4/3" },
               { label: "1:1", value: "1/1" },
             ],
           },
           alignment: {
             type: "select" as const,
             options: [
               { label: "Left", value: "left" },
               { label: "Center", value: "center" },
               { label: "Right", value: "right" },
             ],
           },
         },
         defaultProps: {
           videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
           poster: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
           autoplay: false,
           controls: true,
           loop: false,
           width: "100",
           aspectRatio: "16/9",
           alignment: "center",
         },
         render: ({ videoUrl, poster, autoplay, controls, loop, width, aspectRatio, alignment }: any) => {
           const containerStyles = {
             textAlign: alignment,
             width: '100%',
           };
  
           const videoStyles = {
             width: `${width}%`,
             aspectRatio,
             maxWidth: '100%',
           };
  
           return (
             <div style={containerStyles}>
               <video
                 src={videoUrl}
                 poster={poster}
                 autoPlay={autoplay}
                 controls={controls}
                 loop={loop}
                 style={videoStyles}
                 className="rounded-lg shadow-lg"
               >
                 Your browser does not support the video tag.
               </video>
             </div>
           );
         },
       },
  
       // Image Gallery
       ImageGallery: {
         fields: {
           images: {
             type: "custom" as const,
             render: ({ value, onChange }) => (
               <div className="space-y-2">
                 <Label className="text-sm font-medium">Gallery Images</Label>
                 {value.map((image: any, index: number) => (
                   <div key={index} className="flex items-center gap-2 p-2 border rounded">
                     <Input
                       value={image.src}
                       onChange={(e) => {
                         const newImages = [...value];
                         newImages[index] = { ...image, src: e.target.value };
                         onChange(newImages);
                       }}
                       placeholder="Image URL"
                       className="flex-1"
                     />
                     <Input
                       value={image.alt}
                       onChange={(e) => {
                         const newImages = [...value];
                         newImages[index] = { ...image, alt: e.target.value };
                         onChange(newImages);
                       }}
                       placeholder="Alt text"
                       className="w-20"
                     />
                     <Button
                       variant="ghost"
                       size="sm"
                       onClick={() => {
                         const newImages = value.filter((_: any, i: number) => i !== index);
                         onChange(newImages);
                       }}
                     >
                       <X size={14} />
                     </Button>
                   </div>
                 ))}
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => {
                     onChange([...value, { src: "", alt: "Gallery image" }]);
                   }}
                 >
                   <Plus size={14} className="mr-1" />
                   Add Image
                 </Button>
               </div>
             ),
           },
           columns: {
             type: "select" as const,
             options: [
               { label: "2 Columns", value: "2" },
               { label: "3 Columns", value: "3" },
               { label: "4 Columns", value: "4" },
             ],
           },
           gap: {
             type: "select" as const,
             options: [
               { label: "Small", value: "2" },
               { label: "Medium", value: "4" },
               { label: "Large", value: "6" },
             ],
           },
           rounded: {
             type: "custom" as const,
             render: ({ value, onChange }) => (
               <div className="space-y-2">
                 <Label className="text-sm font-medium">Border Radius: {value}px</Label>
                 <Slider
                   value={[value]}
                   onValueChange={([val]) => onChange(val)}
                   max={20}
                   min={0}
                   step={1}
                   className="w-full"
                 />
               </div>
             ),
           },
           showLightbox: {
             type: "custom" as const,
             render: ({ value, onChange }) => (
               <div className="flex items-center space-x-2">
                 <Switch checked={value} onCheckedChange={onChange} />
                 <Label>Enable Lightbox</Label>
               </div>
             ),
           },
         },
         defaultProps: {
           images: [
             { src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", alt: "Gallery image 1" },
             { src: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", alt: "Gallery image 2" },
             { src: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", alt: "Gallery image 3" },
             { src: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", alt: "Gallery image 4" },
           ],
           columns: "3",
           gap: "4",
           rounded: 8,
           showLightbox: true,
         },
         render: ({ images, columns, gap, rounded, showLightbox }: any) => {
           const [lightboxOpen, setLightboxOpen] = useState(false);
           const [currentImage, setCurrentImage] = useState(0);
  
           const gridStyles = {
             display: 'grid',
             gridTemplateColumns: `repeat(${columns}, 1fr)`,
             gap: `${gap * 4}px`,
           };
  
           const imageStyles = {
             borderRadius: `${rounded}px`,
             width: '100%',
             height: '200px',
             objectFit: 'cover' as const,
             cursor: showLightbox ? 'pointer' : 'default',
             transition: 'transform 0.2s ease',
           };
  
           const handleImageClick = (index: number) => {
             if (showLightbox) {
               setCurrentImage(index);
               setLightboxOpen(true);
             }
           };
  
           return (
             <>
               <div style={gridStyles}>
                 {images.map((image: any, index: number) => (
                   <img
                     key={index}
                     src={image.src}
                     alt={image.alt}
                     style={imageStyles}
                     onClick={() => handleImageClick(index)}
                     className="hover:scale-105"
                   />
                 ))}
               </div>
               
               {/* Simple Lightbox */}
               {lightboxOpen && showLightbox && (
                 <div 
                   className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                   onClick={() => setLightboxOpen(false)}
                 >
                   <div className="relative max-w-4xl max-h-full p-4">
                     <img
                       src={images[currentImage]?.src}
                       alt={images[currentImage]?.alt}
                       className="max-w-full max-h-full object-contain"
                     />
                     <button
                       onClick={() => setLightboxOpen(false)}
                       className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
                     >
                       ×
                     </button>
                     <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                       {images.map((_: any, index: number) => (
                         <button
                           key={index}
                           onClick={(e) => {
                             e.stopPropagation();
                             setCurrentImage(index);
                           }}
                           className={`w-3 h-3 rounded-full ${
                             index === currentImage ? 'bg-white' : 'bg-white/50'
                           }`}
                         />
                       ))}
                     </div>
                   </div>
                 </div>
               )}
             </>
                    );
         },
       },
  
       // Hero Section
       HeroSection: {
         fields: {
           title: { type: "text" as const },
           subtitle: { type: "textarea" as const },
           backgroundImage: { type: "text" as const },
           overlayColor: {
             type: "custom" as const,
             render: ({ value, onChange }) => (
               <ColorPickerField value={value} onChange={onChange} label="Overlay Color" />
             ),
           },
           overlayOpacity: {
             type: "custom" as const,
             render: ({ value, onChange }) => (
               <div className="space-y-2">
                 <Label className="text-sm font-medium">Overlay Opacity: {value}%</Label>
                 <Slider
                   value={[value]}
                   onValueChange={([val]) => onChange(val)}
                   max={100}
                   min={0}
                   step={5}
                   className="w-full"
                 />
               </div>
             ),
           },
           typography: {
             type: "custom" as const,
             render: ({ value, onChange }) => (
               <ResponsiveTypographyField value={value} onChange={onChange} label="Title Typography" />
             ),
           },
           textColor: {
             type: "custom" as const,
             render: ({ value, onChange }) => (
               <ColorPickerField value={value} onChange={onChange} label="Text Color" />
             ),
           },
           buttonText: { type: "text" as const },
           buttonUrl: { type: "text" as const },
           buttonStyle: {
             type: "select" as const,
             options: [
               { label: "Primary", value: "primary" },
               { label: "Secondary", value: "secondary" },
               { label: "Outline", value: "outline" },
             ],
           },
           height: {
             type: "select" as const,
             options: [
               { label: "Small (400px)", value: "400" },
               { label: "Medium (600px)", value: "600" },
               { label: "Large (800px)", value: "800" },
               { label: "Full Screen", value: "100vh" },
             ],
           },
           alignment: {
             type: "select" as const,
             options: [
               { label: "Left", value: "left" },
               { label: "Center", value: "center" },
               { label: "Right", value: "right" },
             ],
           },
         },
         defaultProps: {
           title: "Welcome to Our Amazing Product",
           subtitle: "Discover the future of innovation with our cutting-edge solutions designed to transform your business.",
           backgroundImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
           overlayColor: "#000000",
           overlayOpacity: 40,
           typography: {
             mobile: { fontSize: 32, lineHeight: 1.2 },
             tablet: { fontSize: 48, lineHeight: 1.2 },
             desktop: { fontSize: 64, lineHeight: 1.1 },
             fontWeight: "700",
             letterSpacing: -1,
             fontFamily: "inherit",
           },
           textColor: "#ffffff",
           buttonText: "Get Started",
           buttonUrl: "#",
           buttonStyle: "primary",
           height: "600",
           alignment: "center",
         },
         render: ({ 
           title, 
           subtitle, 
           backgroundImage, 
           overlayColor, 
           overlayOpacity, 
           typography, 
           textColor, 
           buttonText, 
           buttonUrl, 
           buttonStyle,
           height,
           alignment 
         }: any) => {
           const getResponsiveFontSize = () => {
             return {
               fontSize: `clamp(${typography.mobile.fontSize}px, 4vw, ${typography.desktop.fontSize}px)`,
               lineHeight: typography.desktop.lineHeight,
             };
           };
  
           const heroStyles = {
             backgroundImage: `url(${backgroundImage})`,
             backgroundSize: 'cover',
             backgroundPosition: 'center',
             height: height === '100vh' ? '100vh' : `${height}px`,
             position: 'relative' as const,
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
           };
  
           const overlayStyles = {
             position: 'absolute' as const,
             top: 0,
             left: 0,
             right: 0,
             bottom: 0,
             backgroundColor: overlayColor,
             opacity: overlayOpacity / 100,
           };
  
           const contentStyles = {
             position: 'relative' as const,
             zIndex: 1,
             textAlign: alignment,
             maxWidth: '800px',
             padding: '0 20px',
           };
  
           const titleStyles = {
             ...getResponsiveFontSize(),
             fontWeight: typography.fontWeight,
             letterSpacing: `${typography.letterSpacing}px`,
             fontFamily: typography.fontFamily !== 'inherit' ? typography.fontFamily : undefined,
             color: textColor,
             marginBottom: '20px',
           };
  
           const buttonStyles = {
             display: 'inline-block',
             padding: '16px 32px',
             marginTop: '30px',
             borderRadius: '8px',
             textDecoration: 'none',
             fontWeight: '600',
             fontSize: '16px',
             transition: 'all 0.3s ease',
             backgroundColor: buttonStyle === 'primary' ? '#0070f3' : buttonStyle === 'secondary' ? '#666' : 'transparent',
             color: buttonStyle === 'outline' ? textColor : '#ffffff',
             border: buttonStyle === 'outline' ? `2px solid ${textColor}` : 'none',
           };
  
           return (
             <div style={heroStyles}>
               <div style={overlayStyles} />
               <div style={contentStyles}>
                 <h1 style={titleStyles}>{title}</h1>
                 <p style={{ color: textColor, fontSize: '18px', lineHeight: 1.6, marginBottom: '20px' }}>
                   {subtitle}
                 </p>
                 {buttonText && (
                   <a href={buttonUrl} style={buttonStyles} className="hover:opacity-90">
                     {buttonText}
                   </a>
                 )}
               </div>
             </div>
           );
         },
       },
  
       // Feature Grid
       FeatureGrid: {
         fields: {
           title: { type: "text" as const },
           subtitle: { type: "textarea" as const },
           features: {
             type: "custom" as const,
             render: ({ value, onChange }) => (
               <div className="space-y-2">
                 <Label className="text-sm font-medium">Features</Label>
                 {value.map((feature: any, index: number) => (
                   <div key={index} className="p-3 border rounded space-y-2">
                     <div className="flex items-center gap-2">
                       <Input
                         value={feature.icon}
                         onChange={(e) => {
                           const newFeatures = [...value];
                           newFeatures[index] = { ...feature, icon: e.target.value };
                           onChange(newFeatures);
                         }}
                         placeholder="Icon (emoji or text)"
                         className="w-20"
                       />
                       <Input
                         value={feature.title}
                         onChange={(e) => {
                           const newFeatures = [...value];
                           newFeatures[index] = { ...feature, title: e.target.value };
                           onChange(newFeatures);
                         }}
                         placeholder="Feature title"
                         className="flex-1"
                       />
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={() => {
                           const newFeatures = value.filter((_: any, i: number) => i !== index);
                           onChange(newFeatures);
                         }}
                       >
                         <X size={14} />
                       </Button>
                     </div>
                     <Textarea
                       value={feature.description}
                       onChange={(e) => {
                         const newFeatures = [...value];
                         newFeatures[index] = { ...feature, description: e.target.value };
                         onChange(newFeatures);
                       }}
                       placeholder="Feature description"
                       rows={2}
                     />
                   </div>
                 ))}
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => {
                     onChange([...value, { icon: "✨", title: "New Feature", description: "Feature description" }]);
                   }}
                 >
                   <Plus size={14} className="mr-1" />
                   Add Feature
                 </Button>
               </div>
             ),
           },
           columns: {
             type: "select" as const,
             options: [
               { label: "2 Columns", value: "2" },
               { label: "3 Columns", value: "3" },
               { label: "4 Columns", value: "4" },
             ],
           },
           cardStyle: {
             type: "select" as const,
             options: [
               { label: "Card", value: "card" },
               { label: "Minimal", value: "minimal" },
               { label: "Centered", value: "centered" },
             ],
           },
           padding: {
             type: "custom" as const,
             render: ({ value, onChange }) => (
               <ResponsiveSpacingField value={value} onChange={onChange} label="Section Padding" />
             ),
           },
         },
         defaultProps: {
           title: "Why Choose Us",
           subtitle: "Discover the key features that make our solution stand out from the competition.",
           features: [
             {
               icon: "🚀",
               title: "Fast Performance",
               description: "Lightning-fast loading times and optimized performance for the best user experience."
             },
             {
               icon: "🔒",
               title: "Secure & Reliable",
               description: "Enterprise-grade security with 99.9% uptime guarantee for peace of mind."
             },
             {
               icon: "📱",
               title: "Mobile First",
               description: "Fully responsive design that works perfectly on all devices and screen sizes."
             },
             {
               icon: "⚡",
               title: "Easy Integration",
               description: "Simple setup process with comprehensive documentation and support."
             },
           ],
           columns: "3",
           cardStyle: "card",
           padding: {
             mobile: { top: 40, right: 20, bottom: 40, left: 20 },
             tablet: { top: 60, right: 40, bottom: 60, left: 40 },
             desktop: { top: 80, right: 80, bottom: 80, left: 80 },
           },
         },
         render: ({ title, subtitle, features, columns, cardStyle, padding }: any) => {
           const getCurrentPadding = () => {
             // This is a simplified responsive implementation
             // In a real app, you'd use CSS media queries or a responsive system
             return `${padding.desktop.top}px ${padding.desktop.right}px ${padding.desktop.bottom}px ${padding.desktop.left}px`;
           };
  
           const sectionStyles = {
             padding: getCurrentPadding(),
             textAlign: 'center' as const,
           };
  
           const gridStyles = {
             display: 'grid',
             gridTemplateColumns: `repeat(${columns}, 1fr)`,
             gap: '30px',
             marginTop: '50px',
           };
  
           const getCardStyles = () => {
             switch (cardStyle) {
               case 'card':
                 return {
                   padding: '30px',
                   backgroundColor: '#ffffff',
                   borderRadius: '12px',
                   boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                   border: '1px solid #e5e5e5',
                 };
               case 'minimal':
                 return {
                   padding: '20px',
                 };
               case 'centered':
                 return {
                   padding: '30px',
                   textAlign: 'center' as const,
                 };
               default:
                 return {};
             }
           };
  
           return (
             <div style={sectionStyles}>
               <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '16px' }}>{title}</h2>
               <p style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                 {subtitle}
               </p>
               
               <div style={gridStyles}>
                 {features.map((feature: any, index: number) => (
                   <div key={index} style={getCardStyles()}>
                     <div style={{ fontSize: '48px', marginBottom: '20px' }}>{feature.icon}</div>
                     <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px' }}>
                       {feature.title}
                     </h3>
                     <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.6 }}>
                       {feature.description}
                     </p>
                   </div>
                 ))}
               </div>
             </div>
           );
         },
       },
  
       // Call to Action Block
       CTABlock: {
         fields: {
           title: { type: "text" as const },
           description: { type: "textarea" as const },
           primaryButtonText: { type: "text" as const },
           primaryButtonUrl: { type: "text" as const },
           secondaryButtonText: { type: "text" as const },
           secondaryButtonUrl: { type: "text" as const },
           showSecondaryButton: {
             type: "custom" as const,
             render: ({ value, onChange }) => (
               <div className="flex items-center space-x-2">
                 <Switch checked={value} onCheckedChange={onChange} />
                 <Label>Show Secondary Button</Label>
               </div>
             ),
           },
           backgroundColor: {
             type: "custom" as const,
             render: ({ value, onChange }) => (
               <ColorPickerField value={value} onChange={onChange} label="Background Color" />
             ),
           },
           textColor: {
             type: "custom" as const,
             render: ({ value, onChange }) => (
               <ColorPickerField value={value} onChange={onChange} label="Text Color" />
             ),
           },
           borderRadius: {
             type: "custom" as const,
             render: ({ value, onChange }) => (
               <div className="space-y-2">
                 <Label className="text-sm font-medium">Border Radius: {value}px</Label>
                 <Slider
                   value={[value]}
                   onValueChange={([val]) => onChange(val)}
                   max={50}
                   min={0}
                   step={1}
                   className="w-full"
                 />
               </div>
             ),
           },
           padding: {
             type: "custom" as const,
             render: ({ value, onChange }) => (
               <ResponsiveSpacingField value={value} onChange={onChange} label="Padding" />
             ),
           },
         },
         defaultProps: {
           title: "Ready to Get Started?",
           description: "Join thousands of satisfied customers who have transformed their business with our solution.",
           primaryButtonText: "Start Free Trial",
           primaryButtonUrl: "#",
           secondaryButtonText: "Learn More",
           secondaryButtonUrl: "#",
           showSecondaryButton: true,
           backgroundColor: "#0070f3",
           textColor: "#ffffff",
           borderRadius: 16,
           padding: {
             mobile: { top: 40, right: 20, bottom: 40, left: 20 },
             tablet: { top: 60, right: 40, bottom: 60, left: 40 },
             desktop: { top: 80, right: 80, bottom: 80, left: 80 },
           },
         },
         render: ({ 
           title, 
           description, 
           primaryButtonText, 
           primaryButtonUrl, 
           secondaryButtonText, 
           secondaryButtonUrl, 
           showSecondaryButton,
           backgroundColor,
           textColor,
           borderRadius,
           padding 
         }: any) => {
           const getCurrentPadding = () => {
             return `${padding.desktop.top}px ${padding.desktop.right}px ${padding.desktop.bottom}px ${padding.desktop.left}px`;
           };
  
           const ctaStyles = {
             backgroundColor,
             color: textColor,
             borderRadius: `${borderRadius}px`,
             padding: getCurrentPadding(),
             textAlign: 'center' as const,
             margin: '40px 0',
           };
  
           const primaryButtonStyles = {
             display: 'inline-block',
             padding: '16px 32px',
             margin: '20px 10px 0 0',
             borderRadius: '8px',
             textDecoration: 'none',
             fontWeight: '600',
             fontSize: '16px',
             backgroundColor: '#ffffff',
             color: backgroundColor,
             border: 'none',
             transition: 'all 0.3s ease',
           };
  
           const secondaryButtonStyles = {
             display: 'inline-block',
             padding: '16px 32px',
             margin: '20px 0 0 10px',
             borderRadius: '8px',
             textDecoration: 'none',
             fontWeight: '600',
             fontSize: '16px',
             backgroundColor: 'transparent',
             color: textColor,
             border: `2px solid ${textColor}`,
             transition: 'all 0.3s ease',
           };
  
           return (
             <div style={ctaStyles}>
               <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '16px' }}>{title}</h2>
               <p style={{ fontSize: '18px', opacity: 0.9, maxWidth: '600px', margin: '0 auto 20px' }}>
                 {description}
               </p>
               
               <div>
                 <a href={primaryButtonUrl} style={primaryButtonStyles} className="hover:opacity-90">
                   {primaryButtonText}
                 </a>
                 {showSecondaryButton && (
                   <a href={secondaryButtonUrl} style={secondaryButtonStyles} className="hover:opacity-80">
                     {secondaryButtonText}
                   </a>
                 )}
               </div>
             </div>
           );
         },
       },
     },
   });