var fs = require('fs')
var path = require('path')
var MyPlugin = require('./pg')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    tp: './src/index.js',
    product: './src/product.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader?name=[name].[ext]&outputPath=img/'
        ]
      }
    ]
  },
  devServer: {
    port: 7098
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/tp.html',
      filename: 'tp.html',
      chunks: ['tp'],
      mixins: {
        header: fs.readFileSync('./src/mixin.html', { encoding: 'utf-8' })
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/product.html',
      filename: 'product.html',
      chunks: ['product']
    }),
    new MyPlugin({ options: '' })
  ],
}