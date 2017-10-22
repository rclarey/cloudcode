const webpack = require('webpack');
const path = require('path');

module.exports = {
  cache: true,
  entry: {
    app: './src/client/app.jsx',
    anon: './src/client/anon.jsx',
  },
  resolve: {
    modules: [
      path.resolve('./src/client'),
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
  devtool: 'sourcemap',
  performance: {
    hints: 'warning',
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'react-router': 'ReactRouter',
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
