# TicketBase Platform - Multi-Tenant SaaS Monorepo

## 🏗️ Architecture Overview

This is a sophisticated TypeScript monorepo for a **multi-tenant SaaS ticket sales platform** with a **dynamic plugin marketplace** and **custom page editor** system.

### Core Applications (4 apps)
- **apps/admin**: Admin dashboard for SaaS multi-tenant platform management (TanStack React Start + Vite)
- **apps/storefront**: Customer-facing events and ticket sales (TanStack React Start + Vite)
- **apps/api**: Primary NestJS backend server - all Admin/Storefront requests route here
- **apps/plugins**: NestJS plugin server - bundles JS/TS plugins, stores in MinIO, serves dynamically

### Essential Packages (CRITICAL FOR DEVELOPMENT)
- **packages/editor**: 🔥 **PRIMARY EDITOR PACKAGE** - Sophisticated Puck-based page editor with glassmorphism, animations, responsive design
- **packages/plugin-sdk**: 🔥 **PLUGIN DEVELOPMENT SDK** - TypeScript SDK for seamless plugin development with minimal configuration
- **packages/api**: TypeScript API client for React apps (recently extracted from admin)
- **packages/ui**: Shared shadcn component library for client apps

### Plugin System Architecture (CORE PLATFORM FEATURE)
- **Goal**: Zero 3rd party connections out-of-the-box - everything through flexible plugin marketplace
- **Flow**: Install from marketplace → Activate → Dynamically loads from MinIO storage
- **Storage**: Plugin bundles in MinIO, metadata in MongoDB
- **Extension Points**: Predefined locations where plugins can render components
- **Integration Challenge**: 🎯 **MERGE PLUGIN SYSTEM WITH PUCK EDITOR** - Make marketplace widgets instantly available in Puck when activated

## 🚀 Tech Stack
- **Build System**: Turborepo for monorepo orchestration
- **Frontend**: React 19, TypeScript 5.7, Vite 7, Tailwind CSS 4
- **Editor**: @measured/puck with custom glassmorphism components and animations
- **Plugin System**: Dynamic runtime loading, MinIO storage, TypeScript SDK
- **Backend**: NestJS (primary API), NestJS (plugin server)
- **Storage**: PostgreSQL (main), MongoDB (plugins), MinIO (plugin bundles)
- **UI**: Radix UI primitives with custom design system

## 📋 Critical Commands
- `bun install`: Install all dependencies
- `bun run dev`: Start all development servers
- `bun run build`: Build all applications and packages
- `bun run build:packages`: Build only packages (MUST run before apps)
- `bun run lint`: Lint entire codebase
- `bun run type-check`: TypeScript checking across monorepo

## 🎯 Development Priority Rules

### PACKAGE-FIRST DEVELOPMENT
**When working with editor functionality, ALWAYS work in `packages/editor` FIRST**
- The editor package is the most sophisticated part of this codebase
- Apps consume the editor via `@repo/editor` workspace dependency
- Changes in packages affect ALL consuming applications

### PLUGIN SYSTEM PRIORITY
**When working with plugin functionality, work in `packages/plugin-sdk` and `apps/plugins`**
- Plugin SDK provides TypeScript support for plugin developers
- Plugin server handles bundling, storage, and serving
- Admin app provides plugin marketplace and installation UI

### INTEGRATION FOCUS
**🔥 KEY PROJECT GOAL: Plugin-Puck Integration**
- Plugin widgets should be instantly available in Puck editor when activated
- Plugin components need to be compatible with Puck's component system  
- Extension points system needs to merge with Puck's config-based components

## 🏗️ Package Development Workflow
1. Make changes in `packages/` directory
2. Run `bun run build:packages` after modifications
3. Test changes in consuming apps (`apps/admin`, `apps/storefront`)
4. Verify TypeScript compilation across monorepo

## 🔌 Plugin System Understanding
- **plugin.json**: Contains plugin metadata and configuration
- **Extension Points**: Predefined locations in apps where plugins render (admin-settings, payment-methods, etc.)
- **Dynamic Loading**: Plugins bundled to JS, stored in MinIO, loaded at runtime
- **TypeScript SDK**: Full type safety for plugin developers with minimal config

## 🎨 Code Style & Conventions
- ES modules (import/export) syntax everywhere
- Arrow functions for React components
- TypeScript strict mode enabled
- Tailwind CSS v4 for styling
- Component co-location pattern
- Workspace dependencies using `@repo/` and `@ticketbase/` namespaces

## 🚫 DO NOT
- Work directly in app code when functionality belongs in a package
- Ignore the plugin system when adding 3rd party integrations
- Modify files in `node_modules/`
- Commit without running type checks
- Add 3rd party connections directly to apps (use plugin system instead)

## 🎯 Current Focus Areas
1. **Plugin-Puck Integration**: Make marketplace widgets available in page editor
2. **Editor Enhancement**: Expand glassmorphism and animation components
3. **Plugin SDK Evolution**: Improve developer experience and TypeScript support
4. **Multi-tenant Features**: Enhance tenant isolation and customization

This platform represents a sophisticated approach to SaaS development with extensibility as a core principle.