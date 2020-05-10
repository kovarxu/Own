const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const AddAssetHTMLWebpackPlugin = require('add-asset-html-webpack-plugin')

const contexts = fs.readdirSync(path.resolve(__dirname, '../dll'))
const plugins = [
  new HTMLWebpackPlugin({
    template: './src/index.html',
    filename: 'index.html',
    excludeChunks: ['detail']
  }),
  new HTMLWebpackPlugin({
    template: './src/index.html',
    filename: 'detail.html',
    excludeChunks: ['index']
  }),
  new CleanWebpackPlugin({
    root: '../'
  })
]

contexts.forEach(file => {
  if (file.endsWith('.js')) {
    plugins.push(
      new AddAssetHTMLWebpackPlugin({
        filepath: path.resolve(__dirname, `../dll/${file}`)
      }),  
    )
  }
  else if (file.endsWith('.json')) {
    plugins.push(
      // 使用dll之前：740ms；时候dll之后：600ms，提速很明显
      new webpack.DllReferencePlugin({
        manifest: path.resolve(__dirname, `../dll/${file}`)
      })
    )
  }
})

module.exports = {
  entry: {
    index: './src/index.js', // 入口文件，路径相对于package.json
    detail: './src/detail.js' // 多入口打包，需要新的入口
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
  plugins
}
