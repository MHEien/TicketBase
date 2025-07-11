# Development Multi-Tenant Setup Guide

This guide explains how to use the multi-tenant development system in the storefront application.

## Quick Start

1. **Environment Setup**

   ```bash
   # In apps/storefront/.env.local (create if it doesn't exist)
   VITE_API_URL=http://localhost:4000
   VITE_DEFAULT_ORG_SLUG=thunderstorm  # Optional: Set a default organization
   ```

2. **Start Development**

   ```bash
   cd apps/storefront
   npm run dev
   ```

3. **Switch Tenants**
   - Use the blue tenant switcher button (🏢) in the bottom-left corner
   - Or add `?org=slug` to your URL (e.g., `http://localhost:3000?org=thunderstorm`)

## Tenant Switching Methods

### 1. Development Tenant Switcher (Recommended)

- **Location**: Bottom-left corner of the screen (development only)
- **Features**:
  - Lists all available organizations
  - Shows domain status and verification
  - Persists selection in localStorage
  - Easy one-click switching

### 2. URL Parameters

```
http://localhost:3000?org=thunderstorm
http://localhost:3000?organization=test-events
```

### 3. Environment Variable Default

```bash
# In .env.local
VITE_DEFAULT_ORG_SLUG=thunderstorm
```

### 4. localStorage Persistence

Your selected organization is automatically saved in localStorage:

- **Key**: `dev_selected_org_slug`
- **Behavior**: Remembers selection across browser sessions

## Priority Order

The system selects organizations in this priority order:

1. **URL Parameters** (`?org=slug`) - Highest priority
2. **localStorage** (`dev_selected_org_slug`) - Persistent selection
3. **Environment Variable** (`VITE_DEFAULT_ORG_SLUG`) - Fallback default
4. **No Organization** - Default storefront view

## Debug Information

### Debug Panel

- **Location**: Bottom-left corner (expandable)
- **Shows**:
  - Current domain and organization
  - Custom domain status
  - API configuration
  - localStorage state
  - Environment mode

### Console Logging

Enable detailed logging by checking the browser console for:

- Organization detection process
- API calls and responses
- Cache hits/misses
- Error messages

## Creating Test Organizations

To create organizations for testing:

1. **Access Admin Panel**

   ```
   http://localhost:3001/admin
   ```

2. **Register New Organizations**

   - Use different email addresses for each org
   - Set unique organization names and slugs
   - Configure custom domains (optional)

3. **Recommended Test Organizations**
   ```
   thunderstorm     -> Thunderstorm Events (main demo)
   test-events      -> Test Events Co.
   sample-org       -> Sample Organization
   demo-tickets     -> Demo Tickets Inc.
   local-events     -> Local Events Hub
   ```

## Domain Configuration (Optional)

### Custom Domains in Development

While you can't use real custom domains in development, you can:

1. **Configure domains in admin** for production testing
2. **Verify domain setup** using the admin interface
3. **Test domain-specific branding** using the tenant switcher

### Production Domain Simulation

To test how custom domains would work:

1. Set up organization with custom domain in admin
2. Use tenant switcher to select that organization
3. The storefront will apply that organization's branding and settings

## API Endpoints

The system uses these public API endpoints:

```
GET /api/public/organizations/all           # List all orgs (dev only)
GET /api/public/organizations/by-slug       # Get org by slug
GET /api/public/organizations/by-domain     # Get org by domain
```

## Environment Variables

```bash
# Required
VITE_API_URL=http://localhost:4000

# Optional Development Configuration
VITE_DEFAULT_ORG_SLUG=thunderstorm          # Default organization
VITE_APP_URL=http://localhost:3000          # App base URL
VITE_APP_NAME="Events Platform"             # App display name

# Automatically set by Vite
NODE_ENV=development
```

## Troubleshooting

### Organization Not Loading

1. Check if organization exists in database
2. Verify API is running on port 4000
3. Check browser console for error messages
4. Try clearing localStorage: `localStorage.removeItem('dev_selected_org_slug')`

### Tenant Switcher Not Showing

1. Ensure you're in development mode (`NODE_ENV=development`)
2. Check that the component is imported in `__root.tsx`
3. Verify browser console for React errors

### API Connection Issues

1. Verify API server is running: `http://localhost:4000/api/health`
2. Check CORS configuration in API
3. Ensure `VITE_API_URL` is set correctly

### Styling Issues

1. Clear organization-specific styles by switching to "No Organization"
2. Check if organization has custom CSS that's conflicting
3. Verify Tailwind classes are loading properly

## Development Workflow

### Typical Development Session

1. Start API server (`npm run dev` in `apps/api`)
2. Start storefront (`npm run dev` in `apps/storefront`)
3. Use tenant switcher to select organization
4. Develop features specific to that organization
5. Switch to different organization to test multi-tenant behavior
6. Use debug panel to verify organization state

### Testing Different Scenarios

- **No Organization**: Default platform branding
- **Organization with Custom Domain**: Test domain-specific features
- **Organization with Custom Branding**: Test styling and theming
- **Organization with Plugins**: Test plugin functionality

## Production Considerations

This development system is automatically disabled in production:

- Tenant switcher only shows in development mode
- Organization listing API endpoint is disabled in production
- Debug information is hidden in production builds

The production system relies on actual domain-based routing as configured in the admin panel.
