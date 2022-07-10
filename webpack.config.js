const path = require('path');
// Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const PROD_ENV = 'production';
const DEV_ENV = 'development';

const NODE_ENV = process.env.NODE_ENV || DEV_ENV;
const PORT = process.env.PORT || 3003;
const IS_DEV = NODE_ENV === DEV_ENV;
const IS_PROD = NODE_ENV === PROD_ENV;

const HTML_MINIFY = {
  removeComments: true,
  removeTagWhitespace: true,
  collapseWhitespace: true,
};

const config = {
  mode: NODE_ENV,
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  }
};

config.plugins = [
  new HtmlWebpackPlugin({
    template: path.join(__dirname, 'src', 'index.html'),
    minify: IS_PROD && HTML_MINIFY,
  }),
  new MiniCssExtractPlugin({ filename: 'style.css' }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, 'src', 'assets', 'favicon.ico'),
        to: path.resolve(__dirname, 'dist', 'assets'),
      },
    ],
  }),
];

config.module = {
  rules: [
    {
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react', '@babel/typescript'],
        },
      },
    },
    {
      test: /\.(s[ac]ss|css)$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
    },
    {
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: 'asset/resource',
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
    },
  ],
};

if (IS_DEV) {
  config.mode = DEV_ENV;
  config.devtool = 'inline-source-map';
  config.devServer = { port: PORT };
}

if (IS_PROD) {
  config.optimization = {
    minimizer: [
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserWebpackPlugin(),
    ],
  };
}

module.exports = config;
