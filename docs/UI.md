# UI Component Library

This document provides an overview of the core UI components used in the TicketBase platform. The library is built with `shadcn/ui`, providing a consistent, accessible, and themeable set of components.

These components are located in `apps/admin/src/components/ui`.

## Available Components

Below is a list of the available components in the UI library. For detailed API and usage examples, please refer to the [shadcn/ui documentation](https://ui.shadcn.com/docs/components).

- Accordion
- Alert
- Alert Dialog
- Aspect Ratio
- Avatar
- Badge
- Breadcrumb
- Button
- Calendar
- Card
- Carousel
- Chart
- Checkbox
- Collapsible
- Command
- Context Menu
- Date Range Picker
- Dialog
- Drawer
- Dropdown Menu
- Form
- Hover Card
- Input
- Input OTP
- Label
- Menubar
- Navigation Menu
- Pagination
- Popover
- Progress
- Radio Group
- Resizable
- Scroll Area
- Select
- Separator
- Sheet
- Skeleton
- Slider
- Sonner (Toasts)
- Switch
- Table
- Tabs
- Textarea
- Toast
- Toggle
- Toggle Group
- Tooltip

## Custom Components

In addition to the standard `shadcn/ui` components, the library also includes custom components tailored for the platform:

- `auth-error-handler`: A component to handle and display authentication errors.
- `auth-status`: Displays the current authentication status.
- `loading-skeleton`: A custom loading skeleton component.
- `sidebar`: The main sidebar navigation component.

## Hooks

- `use-toast`: A hook for displaying toasts, used by the Sonner component.
- `use-mobile`: A hook to detect if the user is on a mobile device.
