# Production Setup Guide

This guide will help you set up the events page with real API integration for production use.

## Prerequisites

1. **API Backend**: Ensure the NestJS API backend is running (apps/api)
2. **Database**: PostgreSQL database with proper migrations
3. **Authentication**: NextAuth.js configured for user authentication

## Environment Configuration

### Admin App (.env.local)

Create a `.env.local` file in `apps/admin/` with the following variables:

```env
# Next.js Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000
API_URL=http://localhost:4000

# Development Configuration
NODE_ENV=development
```

### API Backend (.env)

Create a `.env` file in `apps/api/` with the following variables:

```env
# Server Configuration
PORT=4000

# Database Configuration
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ticketing

# JWT Configuration
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=900
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=604800

# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## Database Setup

1. **Install PostgreSQL** if not already installed
2. **Create Database**:
   ```sql
   CREATE DATABASE ticketing;
   ```
3. **Run Migrations**: The API will automatically run migrations on startup

## API Features Implemented

The events page now includes the following production-ready features:

### ✅ Real API Integration

- Fetches events from the NestJS API backend
- Proper error handling and loading states
- Real-time data updates

### ✅ CRUD Operations

- **Create**: Navigate to event creation (route ready)
- **Read**: Display all events with filtering and sorting
- **Update**: Edit events (route ready)
- **Delete**: Delete events with confirmation
- **Publish**: Publish draft events
- **Cancel**: Cancel published events

### ✅ Advanced Features

- **Search**: Real-time search through event titles and descriptions
- **Filtering**: Filter by event category
- **Sorting**: Sort by date, title, or sales revenue
- **View Modes**: Grid and list view options
- **Status Management**: Separate tabs for active, draft, and past events

### ✅ User Experience

- Loading skeletons for better perceived performance
- Error states with retry functionality
- Confirmation dialogs for destructive actions
- Toast notifications for user feedback
- Responsive design for all screen sizes

## API Endpoints Used

The events page integrates with the following API endpoints:

- `GET /api/events` - Fetch all events with optional query parameters
- `GET /api/events/:id` - Fetch single event
- `POST /api/events` - Create new event
- `PATCH /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/publish` - Publish event
- `POST /api/events/:id/cancel` - Cancel event

## Query Parameters Supported

- `status`: Filter by event status (draft, published, cancelled, completed)
- `category`: Filter by event category
- `search`: Search in title and description
- `startDate`: Filter events starting after this date
- `endDate`: Filter events ending before this date

## Data Types

The events page uses TypeScript interfaces that match the backend entities:

```typescript
interface Event {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  category: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  timeZone: string;
  locationType: "physical" | "virtual" | "hybrid";
  venueName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  virtualEventUrl?: string;
  featuredImage?: string;
  galleryImages?: string[];
  status: "draft" | "published" | "cancelled" | "completed";
  visibility: "public" | "private" | "unlisted";
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  ticketTypes: TicketType[];
  salesStartDate?: Date;
  salesEndDate?: Date;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  totalTicketsSold: number;
  totalRevenue: number;
  capacity: number;
}
```

## Security Features

- **Authentication Required**: All API calls require valid JWT tokens
- **Organization Isolation**: Users can only see events from their organization
- **Role-based Access**: Proper permission checks on the backend
- **CSRF Protection**: Built-in with NextAuth.js
- **Input Validation**: Server-side validation with class-validator

## Performance Optimizations

- **Memoized Filtering**: Uses React.useMemo for expensive operations
- **Optimistic Updates**: UI updates immediately for better UX
- **Loading States**: Skeleton components prevent layout shifts
- **Error Boundaries**: Graceful error handling
- **Debounced Search**: Prevents excessive API calls

## Next Steps

To complete the production setup:

1. **Event Creation/Editing**: Implement the event form pages
2. **Image Upload**: Add image upload functionality for event images
3. **Bulk Operations**: Add bulk delete/publish functionality
4. **Export Features**: Add CSV/PDF export for events
5. **Analytics**: Integrate with the analytics module
6. **Notifications**: Add real-time notifications for event updates

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `FRONTEND_URL` is set correctly in API .env
2. **Authentication Errors**: Verify JWT secrets match between apps
3. **Database Connection**: Check PostgreSQL is running and credentials are correct
4. **API Not Found**: Ensure `NEXT_PUBLIC_API_URL` points to the correct API server

### Development Commands

```bash
# Start the API backend
cd apps/api
npm run dev

# Start the admin app
cd apps/admin
npm run dev

# Run database migrations
cd apps/api
npm run migration:run
```

## Production Deployment

For production deployment:

1. **Environment Variables**: Update all URLs to production domains
2. **Database**: Use a production PostgreSQL instance
3. **SSL**: Enable HTTPS for all services
4. **Monitoring**: Add logging and monitoring
5. **Backup**: Set up automated database backups
6. **CDN**: Use a CDN for static assets and images

The events page is now production-ready with real API integration, proper error handling, and a great user experience!
