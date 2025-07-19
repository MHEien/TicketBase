# TicketBase Documentation

Welcome to the official documentation for TicketBase, a comprehensive, enterprise-grade event ticketing platform.

This documentation provides a complete guide for developers, administrators, and contributors. It covers everything from high-level architecture to detailed API specifications.

## Table of Contents

- [Architecture](./ARCHITECTURE.md)
- [Development Guide](./DEVELOPMENT.md)
- [API Reference](./API.md)
-   **[Deployment Guide](./DEPLOYMENT.md)**: Instructions for deploying the platform.
-   **[Plugin SDK Reference](./PLUGIN-SDK.md)**: A guide for developers on how to build plugins for the platform.
-   **[UI Component Library](./UI.md)**: A guide to the shared UI components.

## Quick Start

*Instructions for setting up and running the project will be added here.*

## Project Structure

TicketBase is a monorepo managed with Turborepo. The project is organized into two main directories: `apps` and `packages`.

### `apps`

This directory contains the main applications of the platform:

- **`admin`**: The administration dashboard for managing events, users, and system settings.
- **`api`**: The main backend API server (NestJS) that handles core business logic.
- **`plugins`**: The plugin server (NestJS) responsible for managing and communicating with third-party plugins.
- **`storefront`**: The customer-facing web application (Tanstack React Start) where users can browse and purchase tickets.

### `packages`

This directory contains shared packages used across the different applications:

- **`eslint-config`**: Shared ESLint configuration for consistent code style.
- **`plugin-sdk`**: The Software Development Kit (SDK) for creating new plugins.
- **`tailwind`**: Shared Tailwind CSS configuration and styles.
- **`typescript-config`**: Shared TypeScript configurations.
- **`ui`**: A library of shared React components used in the frontend applications.

## Project Overview

TicketBase is built with a modern technology stack using a microservices architecture. It is designed to be scalable, extensible, and maintainable.

### Key Technologies

- **Frontend**: Tanstack React Start, TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeScript
- **Databases**: PostgreSQL, MongoDB
- **Infrastructure**: Docker, Redis, MinIO
- **Build System**: Turborepo, Bun
