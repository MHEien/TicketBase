/**
 * Plugin Build Configuration Template
 * 
 * This is a template for plugin developers to bundle their plugins
 * correctly for our platform's dynamic import system.
 */

const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.tsx', // Your plugin's main entry point
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'plugin.js',
    library: {
      type: 'module',
    },
    // Clean the output directory before emit
    clean: true,
  },
  
  experiments: {
    outputModule: true,
  },
  
  externals: {
    // Externalize React and our plugin SDK - these will be provided by the host
    'react': 'react',
    'react-dom': 'react-dom',
    '@/lib/plugin-sdk': '@/lib/plugin-sdk',
  },
  
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
            plugins: [
              ['@babel/plugin-transform-runtime', { regenerator: true }],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
  
  plugins: [
    // Define environment variables if needed
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
};

/**
 * Example package.json scripts:
 * 
 * "scripts": {
 *   "build": "webpack --config webpack.config.js",
 *   "dev": "webpack --config webpack.config.js --watch --mode=development"
 * }
 */ 