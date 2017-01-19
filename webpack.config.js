// webpack.config.js

const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: [
    './src/index.jsx',
  ],
  resolve: {
    root: [
      path.resolve('./src')
    ]
  },
  output: {
    path: `${__dirname}/build/assets`,
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react'],
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
  ],
};
