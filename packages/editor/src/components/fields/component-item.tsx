import '@measured/puck/puck.css';
import '../fullscreen-puck.css';
import { Sparkles, Type, Link, Move, Layout, Image as ImageIcon, Video, Grid, Columns, Mail, TrendingUp, Quote, Zap, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import type { ComponentItemProps } from '@repo/editor/lib/types';
export const CustomComponentItem = ({ name, children }: ComponentItemProps) => {
    const getComponentIcon = (componentName: string) => {
      switch (componentName) {
        case 'Section': return Layout;
        case 'Container': return Grid;
        case 'Columns': return Columns;
        case 'AdvancedHeading': return Type;
        case 'AdvancedText': return Type;
        case 'AdvancedButton': return Link;
        case 'ImageBlock': return ImageIcon;
        case 'VideoPlayer': return Video;
        case 'ImageGallery': return Grid;
        case 'Spacer': return Move;
        case 'ContactForm': return Mail;
        case 'Testimonial': return Quote;
        case 'ProgressBar': return TrendingUp;
        case 'HeroSection': return Target;
        case 'FeatureGrid': return Grid;
        case 'CTABlock': return Zap;
        default: return Sparkles;
      }
    };
  
    const getComponentDescription = (componentName: string) => {
      switch (componentName) {
        case 'Section': return 'Layout container with background options';
        case 'Container': return 'Content wrapper with max-width control';
        case 'Columns': return 'Multi-column layout grid';
        case 'AdvancedHeading': return 'Customizable heading with typography controls';
        case 'AdvancedText': return 'Rich text with styling options';
        case 'AdvancedButton': return 'Button with advanced styling';
        case 'ImageBlock': return 'Responsive image with borders';
        case 'VideoPlayer': return 'Responsive video player with controls';
        case 'ImageGallery': return 'Multi-image gallery with lightbox';
        case 'Spacer': return 'Adjustable spacing element';
        case 'ContactForm': return 'Customizable contact form';
        case 'Testimonial': return 'Customer testimonial with rating';
        case 'ProgressBar': return 'Animated progress indicator';
        case 'HeroSection': return 'Full-width hero banner with background';
        case 'FeatureGrid': return 'Grid layout for showcasing features';
        case 'CTABlock': return 'Call-to-action section with buttons';
        default: return 'Drag to add component';
      }
    };
  
    const Icon = getComponentIcon(name);
  
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", duration: 0.2 }}
      >
        <Card className="cursor-grab hover:shadow-md transition-all duration-200 border-border/50 hover:border-primary/20 active:cursor-grabbing">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-md bg-primary/10 text-primary">
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground text-sm">{name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{getComponentDescription(name)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };