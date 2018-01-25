// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const Merge = require('webpack-merge');
const BaseConfig = require('./webpack.config.base');

module.exports = Merge(BaseConfig, {
  output: {
    filename: '[name].js'
  },

  module: {
    rules: [
      // has to be inline style when using HotModuleReplacementPlugin
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devtool: 'source-map',
  devServer: {
    // contentBase: path.resolve(__dirname, 'dist'), //  alternative: 'HtmlWebpackPlugin'
    publicPath: '/',
    hot: true
    // hotOnly: true
  },

  plugins: [new webpack.HotModuleReplacementPlugin()]
});
