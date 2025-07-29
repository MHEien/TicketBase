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
    // Remove hardcoded publicPath - we'll set it dynamically
    publicPath: '',
  },
  externals: {
    // Don't bundle these, they'll be provided by the host
    react: 'react',
    'react-dom': 'react-dom',
  },
};