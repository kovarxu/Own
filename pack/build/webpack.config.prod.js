const webpack = require('webpack')
const merge = require('webpack-merge')
const commonConfig = require('./webpack.config.common')
const CDN = 'sheep.cdn.com'

const prodConfig = {
  mode: 'production',
  output: {
    filename: '[name].js',
    sourceMapFilename: 'source.map',
    publicPath: `http:${CDN}/static`
  },
  optimization: {
    splitChunks: {
      name: true, // 可以命名
      chunks: 'all',
      minChunks: 1,
      minSize: 10000,
      maxAsyncRequests: 6,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          filename: 'verdor.js'
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: {
      name: 'manifest'
    }
  },
  plugins: [
    new webpack.ProvidePlugin({ _: 'lodash' })
  ]
}

module.exports = merge(commonConfig, prodConfig)

// debug on this site:
// chrome://inspect/#devices
