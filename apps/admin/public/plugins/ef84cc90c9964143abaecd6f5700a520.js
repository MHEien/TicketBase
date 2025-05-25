// Simple bundling script for development
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

try {
  // Create a dist directory if it doesn't exist
  const distDir = path.join(__dirname, "dist");
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }

  // Use esbuild for bundling (install it if needed)
  try {
    console.log("Checking if esbuild is installed...");
    execSync("npx esbuild --version", { stdio: "inherit" });
  } catch (error) {
    console.log("Installing esbuild...");
    execSync("npm install esbuild --no-save", { stdio: "inherit" });
  }

  // Bundle the plugin
  console.log("Bundling the plugin...");
  execSync(
    "npx esbuild index.tsx --bundle --format=esm --outfile=dist/stripe-plugin.js --external:react --external:react-dom --target=es2020",
    { stdio: "inherit", cwd: __dirname },
  );

  console.log("Plugin bundled successfully!");
  console.log(`Bundle location: ${path.join(distDir, "stripe-plugin.js")}`);
  console.log("You can now upload this file using the plugin submit form.");
} catch (error) {
  console.error("Error bundling the plugin:", error);
  process.exit(1);
}
