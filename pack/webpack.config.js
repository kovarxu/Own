const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    product: path.resolve(__dirname, 'src/product.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              fallback: 'file-loader?name=[name].[ext]&outputPath=img/'
            },
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/')
    }
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'all',
      minChunks: 1,
      minSize: 30000
    },
    runtimeChunk: {
      name: 'manifest'
    }
  },
  plugins: [
    new HTMLWebpackPlugin({
      filename: 'product.html',
      template: path.resolve(__dirname, './src/product.html')
    }),
    new CleanWebpackPlugin()
  ],
}