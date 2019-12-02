const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.js',
    async: './src/async.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'), 
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(jpg|png|jpeg|gif)/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: "[name].[ext]",
            fallback: 'file-loader'
          }
        }]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.resolve('src'),
      'jsPlumb': path.resolve('./src/depend/jsplumb.min.js'),
      'proParser': path.resolve('./src/depend/proParser.js')
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    new HTMLWebpackPlugin({
      filename: 'app.html',
      template: './src/index.html'
    }),
    new CleanWebpackPlugin()
  ]
}
