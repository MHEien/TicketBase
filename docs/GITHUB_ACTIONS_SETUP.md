# GitHub Actions Plugin Build Setup

This document explains how to set up the GitHub Actions integration for building plugins.

## Overview

The plugin build system now uses GitHub Actions to build plugins in an isolated environment. This approach:

- **Solves dependency issues**: No need to install packages on the plugin server
- **Handles complex dependencies**: GitHub Actions can install any npm packages
- **Scales better**: Builds happen in the cloud, not on your server
- **More reliable**: Standardized build environment

## Setup Steps

### 1. GitHub Repository Setup

1. Ensure your repository has the GitHub Actions workflow file: `.github/workflows/plugin-build.yml`
2. The workflow is triggered manually with inputs for plugin source code and package.json

### 2. Environment Variables

Add these environment variables to your plugin server:

```bash
# GitHub API token with repo permissions
GITHUB_TOKEN=ghp_your_github_token_here

# GitHub repository details
GITHUB_OWNER=your-username
GITHUB_REPO=ticketsmonorepo

# Plugin server URL for callbacks
APP_URL=http://localhost:4000

# Secret token for GitHub Actions callbacks
PLUGIN_BUILD_TOKEN=your_secret_token_here
```

### 3. GitHub Token Setup

1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Create a new token with these permissions:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)

### 4. GitHub Repository Secrets

Add this secret to your GitHub repository:

1. Go to your repository Settings > Secrets and variables > Actions
2. Add a new repository secret:
   - Name: `PLUGIN_BUILD_TOKEN`
   - Value: Same as the `PLUGIN_BUILD_TOKEN` environment variable

## How It Works

### Plugin Upload Flow

1. **User uploads ZIP**: Plugin developer uploads a ZIP file containing:
   - `src/index.tsx` (or other entry point)
   - `package.json` (with dependencies)
   - `plugin.json` (metadata)

2. **Plugin server extracts**: Server extracts the ZIP and analyzes the contents

3. **GitHub Actions triggered**: Server sends source code and package.json to GitHub Actions

4. **GitHub Actions builds**: 
   - Installs dependencies from package.json
   - Builds the plugin using the plugin's build script or fallback
   - Returns the bundle via callback

5. **Bundle stored**: Plugin server receives the bundle and stores it in MinIO

### Build Process

The GitHub Actions workflow:

1. **Sets up environment**: Node.js 18 + Bun
2. **Creates plugin directory**: Extracts source code and package.json
3. **Installs dependencies**: Runs `bun install` with the plugin's package.json
4. **Builds plugin**: 
   - Tries the plugin's own build script first
   - Falls back to standard `bun build` command
5. **Returns bundle**: Sends the built bundle back to the plugin server

## API Endpoints

### Build Trigger
- **POST** `/plugins/build` - Upload plugin ZIP and trigger build

### Build Callback
- **POST** `/github-build/callback` - Receives build results from GitHub Actions

## Error Handling

- **Build failures**: GitHub Actions sends error details back to the plugin server
- **Network issues**: Plugin server logs build trigger failures
- **Authentication**: Callbacks are verified using the `PLUGIN_BUILD_TOKEN`

## Security

- **Authentication**: GitHub Actions callbacks are authenticated with a secret token
- **Isolation**: Each build runs in a clean GitHub Actions environment
- **No persistent storage**: Build artifacts are cleaned up after each run

## Troubleshooting

### Common Issues

1. **GitHub token permissions**: Ensure the token has `repo` and `workflow` permissions
2. **Repository secrets**: Verify `PLUGIN_BUILD_TOKEN` is set in GitHub repository secrets
3. **Callback URL**: Ensure `APP_URL` is accessible from GitHub Actions
4. **Package.json format**: Verify the plugin's package.json is valid JSON

### Debugging

- Check GitHub Actions logs in your repository
- Monitor plugin server logs for build trigger and callback events
- Verify environment variables are set correctly

## Future Enhancements

- **Build caching**: Cache dependencies between builds
- **Parallel builds**: Support multiple concurrent plugin builds
- **Build status API**: Endpoint to check build status
- **Webhook integration**: Real-time build status updates 