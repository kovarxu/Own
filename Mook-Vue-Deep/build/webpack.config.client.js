const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require('webpack')
const ExtractPlugin = require('extract-text-webpack-plugin')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base.js')

const isDev = process.env.NODE_ENV === 'development'

const defaultPlugins = [
  new VueLoaderPlugin(),
  // ** 区分开发环境 **
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: isDev ? '"development"' : '"production"'
    }
  }),
  new HTMLPlugin()
]

let config

if (isDev) {
  config = merge(baseConfig, {
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.styl/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
              }
            },
            'stylus-loader'
          ]
        }
      ]
    },
    devtool: '#cheap-module-eval-source-map',
    devServer: {
      port: 8000,
      host: '0.0.0.0',
      overlay: {
        errors: true,
      },
      hot: true
    },
    plugins: defaultPlugins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ])
  })
} else {
  config = merge(baseConfig, {
    mode: 'production',
    entry: {
      app: path.join(__dirname, '../src/index.js'),
      vendor: ['vue']
    },
    output: {
      filename: '[name].[chunkhash:8].js'
    },
    module: {
      rules: [
        {
          test: /\.styl/,
          use: ExtractPlugin.extract({
            fallback: 'style-loader',
            use: [
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true,
                }
              },
              'stylus-loader'
            ]
          })
        },
      ]
    },
    plugins: defaultPlugins.concat([
      new ExtractPlugin('styles.[contentHash:8].css'),
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: 'vendor'
      // }),
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: 'runtime'
      // })
    ]),
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {name: 'vendor'}
        }
      }
    }
  })
}

console.log(config)
module.exports = config
