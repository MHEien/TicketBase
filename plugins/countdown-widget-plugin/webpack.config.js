const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.container.ModuleFederationPlugin({
      name: 'countdownWidgetPlugin',
      filename: 'remoteEntry.js',
      exposes: {
        './plugin': './src/index.tsx',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^19.0.0',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^19.0.0',
        },
        'ticketsplatform-plugin-sdk': {
          singleton: true,
        },
        'framer-motion': {
          singleton: true,
        },
      },
    }),
  ],
  devtool: 'source-map',
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    // CRITICAL FIX: Use 'auto' instead of empty string for Vite compatibility
    publicPath: 'auto',
    // Add these for better Module Federation support with Vite hosts
    uniqueName: 'countdownWidget',
    chunkLoadingGlobal: 'webpackChunkCountdownWidget',
  },
  // Remove externals - let Module Federation handle shared dependencies
  // externals: {
  //   react: 'react',
  //   'react-dom': 'react-dom',
  // },
  
  // Add optimization for better chunk handling
  optimization: {
    splitChunks: false, // Let Module Federation handle code splitting
  },
};