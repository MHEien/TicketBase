#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import prettier from 'prettier';

const OUTPUT_PATH = './constants/theme.ts';
const CSS_OUTPUT_PATH = './temp-tailwind.css';

async function generateTheme() {
  try {
    // Create a temporary CSS file to extract variables from
    const tempCssInput = `
      @import "tailwindcss";
      
      /* This will generate all the CSS variables */
      @layer utilities {
        .temp-class {
          color: var(--color-red-500);
        }
      }
    `;
    
    const tempInputPath = './temp-input.css';
    fs.writeFileSync(tempInputPath, tempCssInput);

    // Build CSS using TailwindCSS CLI to get the variables
    try {
      execSync(`npx @tailwindcss/cli -i ${tempInputPath} -o ${CSS_OUTPUT_PATH}`, { 
        stdio: 'pipe' 
      });
    } catch (error) {
      console.error('Failed to build CSS with TailwindCSS CLI. Make sure @tailwindcss/cli is installed.');
      process.exit(1);
    }

    // Read the generated CSS
    const generatedCSS = fs.readFileSync(CSS_OUTPUT_PATH, 'utf8');
    
    // Extract CSS variables from the :root rule
    const cssVariables = extractCSSVariables(generatedCSS);
    
    // Convert to JavaScript object
    const themeObject = convertCSSVariablesToTheme(cssVariables);

    let code = `
      const theme = ${JSON.stringify(themeObject, null, 2)}
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

    // Cleanup
    if (fs.existsSync(tempInputPath)) fs.unlinkSync(tempInputPath);
    if (fs.existsSync(CSS_OUTPUT_PATH)) fs.unlinkSync(CSS_OUTPUT_PATH);

  } catch (error) {
    console.error('Error generating theme:', error);
    process.exit(1);
  }
}

function extractCSSVariables(css: string): Record<string, string> {
  const variables: Record<string, string> = {};
  
  // Match :root block and extract CSS variables
  const rootMatch = css.match(/:root\s*{([^}]*)}/);
  if (!rootMatch) return variables;

  const rootContent = rootMatch[1];
  
  // Extract CSS variables (--variable-name: value;)
  const variableRegex = /--([^:]+):\s*([^;]+);/g;
  let match;
  
  while ((match = variableRegex.exec(rootContent)) !== null) {
    const [, name, value] = match;
    variables[name.trim()] = value.trim();
  }
  
  return variables;
}

function convertCSSVariablesToTheme(variables: Record<string, string>): any {
  const theme: any = {
    colors: {},
    spacing: {},
    fontSize: {},
    fontFamily: {},
    screens: {},
    borderRadius: {},
  };

  for (const [name, value] of Object.entries(variables)) {
    if (name.startsWith('color-')) {
      const colorPath = name.replace('color-', '').split('-');
      let current = theme.colors;
      
      for (let i = 0; i < colorPath.length - 1; i++) {
        if (!current[colorPath[i]]) current[colorPath[i]] = {};
        current = current[colorPath[i]];
      }
      
      current[colorPath[colorPath.length - 1]] = value;
    }
    
    else if (name.startsWith('spacing-')) {
      const key = name.replace('spacing-', '');
      theme.spacing[key] = value;
    }
    
    else if (name.startsWith('text-')) {
      const key = name.replace('text-', '');
      theme.fontSize[key] = value;
    }
    
    else if (name.startsWith('font-')) {
      const key = name.replace('font-', '');
      theme.fontFamily[key] = value;
    }
    
    else if (name.startsWith('breakpoint-')) {
      const key = name.replace('breakpoint-', '');
      theme.screens[key] = value;
    }
    
    else if (name.startsWith('radius-')) {
      const key = name.replace('radius-', '');
      theme.borderRadius[key] = value;
    }
  }

  return theme;
}

generateTheme().catch(console.error); 