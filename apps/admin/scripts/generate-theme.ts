#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import prettier from 'prettier';

const OUTPUT_PATH = './src/components/editor/theme.ts';

// In TailwindCSS v4, theme values are available as CSS variables
// We can create a theme object that references these variables directly
const themeConfig = {
  colors: {
    // TailwindCSS v4 exposes colors as --color-{name}-{shade}
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    // Default colors are available as --color-{color}-{shade}
    red: {
      50: 'var(--color-red-50)',
      100: 'var(--color-red-100)',
      200: 'var(--color-red-200)',
      300: 'var(--color-red-300)',
      400: 'var(--color-red-400)',
      500: 'var(--color-red-500)',
      600: 'var(--color-red-600)',
      700: 'var(--color-red-700)',
      800: 'var(--color-red-800)',
      900: 'var(--color-red-900)',
      950: 'var(--color-red-950)',
    },
    blue: {
      50: 'var(--color-blue-50)',
      100: 'var(--color-blue-100)',
      200: 'var(--color-blue-200)',
      300: 'var(--color-blue-300)',
      400: 'var(--color-blue-400)',
      500: 'var(--color-blue-500)',
      600: 'var(--color-blue-600)',
      700: 'var(--color-blue-700)',
      800: 'var(--color-blue-800)',
      900: 'var(--color-blue-900)',
      950: 'var(--color-blue-950)',
    },
    gray: {
      50: 'var(--color-gray-50)',
      100: 'var(--color-gray-100)',
      200: 'var(--color-gray-200)',
      300: 'var(--color-gray-300)',
      400: 'var(--color-gray-400)',
      500: 'var(--color-gray-500)',
      600: 'var(--color-gray-600)',
      700: 'var(--color-gray-700)',
      800: 'var(--color-gray-800)',
      900: 'var(--color-gray-900)',
      950: 'var(--color-gray-950)',
    },
    // Add more colors as needed
  },
  spacing: {
    // Spacing values are available as --spacing-{value}
    0: 'var(--spacing-0)',
    1: 'var(--spacing-1)',
    2: 'var(--spacing-2)',
    3: 'var(--spacing-3)',
    4: 'var(--spacing-4)',
    5: 'var(--spacing-5)',
    6: 'var(--spacing-6)',
    8: 'var(--spacing-8)',
    10: 'var(--spacing-10)',
    12: 'var(--spacing-12)',
    16: 'var(--spacing-16)',
    20: 'var(--spacing-20)',
    24: 'var(--spacing-24)',
    32: 'var(--spacing-32)',
    40: 'var(--spacing-40)',
    48: 'var(--spacing-48)',
    56: 'var(--spacing-56)',
    64: 'var(--spacing-64)',
    // Add more spacing values as needed
  },
  fontSize: {
    // Font sizes are available as --text-{size}
    xs: 'var(--text-xs)',
    sm: 'var(--text-sm)',
    base: 'var(--text-base)',
    lg: 'var(--text-lg)',
    xl: 'var(--text-xl)',
    '2xl': 'var(--text-2xl)',
    '3xl': 'var(--text-3xl)',
    '4xl': 'var(--text-4xl)',
    '5xl': 'var(--text-5xl)',
    '6xl': 'var(--text-6xl)',
    '7xl': 'var(--text-7xl)',
    '8xl': 'var(--text-8xl)',
    '9xl': 'var(--text-9xl)',
  },
  fontFamily: {
    // Font families are available as --font-{family}
    sans: 'var(--font-sans)',
    serif: 'var(--font-serif)',
    mono: 'var(--font-mono)',
  },
  screens: {
    // Breakpoints are available as --breakpoint-{size}
    sm: 'var(--breakpoint-sm)',
    md: 'var(--breakpoint-md)',
    lg: 'var(--breakpoint-lg)',
    xl: 'var(--breakpoint-xl)',
    '2xl': 'var(--breakpoint-2xl)',
  },
  borderRadius: {
    // Border radius values are available as --radius-{size}
    none: 'var(--radius-none)',
    sm: 'var(--radius-sm)',
    DEFAULT: 'var(--radius-DEFAULT)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
    '2xl': 'var(--radius-2xl)',
    '3xl': 'var(--radius-3xl)',
    full: 'var(--radius-full)',
  },
  // Custom width values for editor layout
  width: {
    'editor-left-sidebar': 280,
    'editor-right-sidebar-ui': 320,
    'editor-right-sidebar-code': 400,
  },
};

async function generateTheme() {
  let code = `
    const theme = ${JSON.stringify(themeConfig, null, 2)}
    export default theme
  `;

  try {
    code = await prettier.format(code, {
      parser: 'babel-ts',
      singleQuote: true,
    });
  } catch (error) {
    console.warn('Failed to format with Prettier:', error);
  }

  const dir = path.dirname(OUTPUT_PATH);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, code);
  console.log('Theme file generated successfully at:', OUTPUT_PATH);
}

generateTheme().catch(console.error);