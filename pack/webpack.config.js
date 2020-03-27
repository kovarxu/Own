const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MyPlugin = require('./testplugin')

module.exports = {
  mode: 'development',
  entry: {
    product: path.resolve('src/product.js')
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
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/')
    }
  },
  optimization: {
    // splitChunks: {
    //   name: true,
    //   chunks: 'all',
    //   minChunks: 1,
    //   minSize: 30000,
    //   cacheGroups: {
    //     jquery: {
    //       test: /[\\/]node_modules[\\/].*?jquery/,
    //       priority: -5,
    //       automaticNameDelimiter: '.'
    //     }
    //   }
    // },
    // runtimeChunk: {
    //   name: 'manifest'
    // }
  },
  plugins: [
    new HTMLWebpackPlugin({
      filename: 'product.html',
      template: path.resolve(__dirname, './src/product.html')
    }),
    new CleanWebpackPlugin(),
    new MyPlugin()
  ],
}

// debug on this site:
// chrome://inspect/#devices
