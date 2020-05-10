const webpack = require('webpack')
const merge = require('webpack-merge')
const commonConfig = require('./webpack.config.common')

const devConfig = {
  mode: 'development',
  output: {
    filename: '[name].js',
    sourceMapFilename: 'source.map'
  },
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    contentBase: './dist',
    port: 8008,
    hot: true, // 开启热更新
    hotOnly: true, // 即便热更新失败，也不重新刷新
  },
  optimization: {
    usedExports: true, // dev环境下的tree-shaking配置
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
        share: {
          test (module, chunks) {
            return module.type === 'javascript/auto';
          },
          priority: -11,
          minChunks: 2,
          filename: 'share.js'
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({ _: 'lodash' })
  ]
}

module.exports = merge(commonConfig, devConfig)

// debug on this site:
// chrome://inspect/#devices
