// webpack.config.js

const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    app: './src/app.jsx',
    anon: './src/anon.jsx',
  },
  resolve: {
    modules: [
      path.resolve('./src'),
      'node_modules',
    ],
  },
  output: {
    path: `${__dirname}/build/assets`,
    filename: '[name].js',
  },
  module: {
    rules: [
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
    new webpack.LoaderOptionsPlugin({ minimize: true }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }, sourceMap: true }),
  ],
};
