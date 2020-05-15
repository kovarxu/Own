const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const AddAssetHTMLWebpackPlugin = require('add-asset-html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [
          /node_modules/
        ]
      }
    ]
  },
  optimization: {
    runtimeChunk: {
      name: 'manifest'
    }
  },
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    contentBase: './dist',
    open: true,
    port: 8008,
    clientLogLevel: 'error',
    // hot: true,
    // hotOnly: true
  },
  plugins: [
    new HTMLWebpackPlugin({
      title: 'PIXI practice'
    }),
    new CleanWebpackPlugin(),
    new AddAssetHTMLWebpackPlugin({
      filepath: path.resolve(__dirname, `./dll/pixi.dll.js`)
    }),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, `./dll/pixi.manifest.json`)
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}
