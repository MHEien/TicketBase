# @repo/editor Package - Advanced Puck-Based Page Editor

## 🎯 Purpose
Sophisticated page editor package built on @measured/puck with advanced glassmorphism components, animations, responsive design, and dynamic plugin integration capability.

## 🏗️ Architecture
- **Core Config**: `src/lib/index.tsx` - Main @measured/puck configuration with advanced components
- **Enhanced Config**: `src/lib/enhanced-config.tsx` - Extended configuration with additional features
- **Field Components**: `src/components/fields.tsx` - Advanced form controls and responsive editors
- **Type System**: `src/lib/types.tsx` - Comprehensive TypeScript definitions
- **Export Hub**: `src/index.tsx` - Clean package exports

## 🎨 Design System
### Glassmorphism Components
- Advanced blur effects with `backdrop-blur-*` utilities
- Layered opacity with `bg-white/5` to `bg-white/30` variants
- Dynamic border styles with `border-white/20` patterns
- Sophisticated glass card implementations

### Animation System
- **Framer Motion Integration**: Smooth animations and interactions
- **Animation Types**: fadeIn, slideUp, scale, bounce, none
- **Responsive Animations**: Different animations per breakpoint
- **Performance Optimized**: GPU-accelerated transforms

### Responsive Design
- **Breakpoint System**: Desktop, tablet, mobile with custom breakpoint management
- **Responsive Typography**: Per-breakpoint font sizing and spacing
- **Adaptive Layouts**: Grid systems that adapt to screen size
- **Touch-Friendly**: Mobile-optimized interaction patterns

## 🧩 Advanced Components

### Hero Section
- Multiple background types: gradient, image, video, solid
- Advanced overlay system with opacity controls
- Responsive height management
- Animation integration with Framer Motion
- Typography controls with breakpoint-specific settings

### Glass Card Components
- Dynamic blur and opacity controls
- Configurable border styles and radii
- Padding and spacing management
- Icon integration with Lucide React
- Content overflow handling

### Feature Grids
- Responsive column layouts (1-4 cols + auto-fit)
- Dynamic gap management
- Icon and content integration
- Animation orchestration for grid items

### Statistics Sections
- Real-time number formatting
- Icon integration with component library
- Background variants (transparent, dark-glass, light-glass)
- Animated counting effects

## 🔧 Field Components Architecture

### ResponsiveTypographyField
- Breakpoint-specific typography controls
- Font family, size, weight, line height management
- Letter spacing and text transform controls
- Real-time preview integration

### ColorPickerField
- Gradient picker with multiple stops
- Solid color selection with palette
- Real-time preview updates
- Accessibility-compliant color contrast

### SpacingField
- Margin and padding controls
- Per-side spacing management (top, right, bottom, left)
- Responsive spacing with breakpoint controls
- Visual spacing preview

### BorderField
- Border width, style, and color controls
- Corner radius management
- Border image support for advanced effects
- Responsive border configurations

## 🔌 Plugin Integration (CRITICAL GOAL)

### Current Challenge
The platform has a sophisticated plugin system with dynamic extension points, but these need to integrate with Puck's component configuration system.

### Integration Requirements
1. **Dynamic Component Registration**: Plugin widgets should appear in Puck's component library when activated
2. **Type Safety**: Plugin components must integrate with our TypeScript definitions
3. **Design Consistency**: Plugin widgets should follow our glassmorphism and animation patterns
4. **Real-time Availability**: When tenant activates a plugin, it should be immediately available in the editor

### Plugin-Compatible Component Structure
Plugin components for Puck integration need:
- Puck-compatible field definitions
- Default props following our patterns
- Render functions that accept our standard prop types
- Integration with our responsive and animation systems

## 📦 Dependencies
- **@measured/puck**: Core page building framework (v0.19.3)
- **@repo/ui**: Shared component library
- **Framer Motion**: Animation and interaction library
- **Radix UI**: Primitive component foundation
- **Tailwind CSS**: Styling system (v4)
- **Lucide React**: Icon library
- **React Hook Form**: Form management
- **Zod**: Runtime type validation

## 🛠️ Development Guidelines

### Component Development
1. Follow patterns established in `src/lib/index.tsx`
2. Use TypeScript interfaces from `src/lib/types.tsx`
3. Implement responsive design with our breakpoint system
4. Apply glassmorphism patterns consistently
5. Add Framer Motion animations using established patterns
6. Include proper default props and field definitions

### Field Development
1. Create reusable field components in `src/components/fields.tsx`
2. Support responsive configurations where applicable
3. Include real-time preview capabilities
4. Follow our design system tokens
5. Implement proper TypeScript typing

### Testing Requirements
- Components must work within @measured/puck editor interface
- Test responsive behavior across all breakpoints
- Verify glassmorphism effects render correctly in different browsers
- Ensure animations perform smoothly (60fps target)
- Validate TypeScript compilation

## 🚀 Export Pattern
All new components must be:
1. Added to the main config in `src/lib/index.tsx` or enhanced config
2. Exported from `src/index.tsx` for package consumption
3. Include proper TypeScript interfaces in `src/lib/types.tsx`
4. Follow established naming conventions (PascalCase for components)
5. Include JSDoc comments for better developer experience

## 🎯 Current Focus Areas
1. **Plugin Integration**: Develop system for dynamic plugin component registration
2. **Enhanced Animations**: Expand animation library with more sophisticated effects
3. **Advanced Layouts**: More complex responsive grid and flexbox systems
4. **Performance**: Optimize for large page configurations
5. **Accessibility**: Ensure all components meet WCAG 2.1 AA standards

## 🔄 Build Process
- Source TypeScript files compiled to JavaScript
- CSS processed through Tailwind with custom configuration
- Exports optimized for tree shaking
- Type definitions generated for consuming packages

This editor package represents the visual foundation of the TicketBase platform, enabling tenants to create sophisticated, animated, responsive pages with an intuitive interface.