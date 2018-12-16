// 使用绝对路径防止错误
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const isDev = process.env.NODE_ENV === 'development'
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ExtractPlugin = require('extract-text-webpack-plugin')

const config = {
  // 编译目标--web平台
  target: 'web',
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: ['vue-loader']
      }, {
        test: /\.jsx$/,
        loader: ['babel-loader']
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }, {
        test: /\.(jpg|png|gif|jpeg|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              name: '[name].[ext]'
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    // ** 区分开发环境 **
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
    new HTMLPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
}

// 开发环境代码devserver配置
if (isDev) {
  // 开发环境stylus文件无需单独打包
  config.module.rules.push({
    test: /\.styl(us)?$/,
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true
        }
      },
      'stylus-loader'
    ]
  })
  // 设置devtool的模式
  config.devtool = '#cheap-module-eval-source-map'
  config.devServer = {
    port: 8000,
    host: '127.0.0.1',
    // 出错直接显示在网页上
    overlay: {
      errors: true
    },
    // 每次更新配置自动打开一个页面
    open: true,
    // 打开入口
    // historyFallback: {
      
    // },
    // 热加载,不需要每次全部更新页面
    hot: true
  }
} else {
  // 生产环境配置
  config.entry = {
    // 单独打包类库文件
    app: path.join(__dirname, 'src/index.js'),
    vendor: ['vue']
  }
  config.output.filename = '[name].[hash:8].js'
  config.module.rules.push({
    test: /\.styl(us)?$/,
    // style-loader用于将css文件转化为js形式插入到html中，此处将它回退
    use: ExtractPlugin.extract({
      fallback: 'style-loader',
      use: [
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true
          }
        },
        'stylus-loader'
      ]
    })
  })

  config.plugins.push(
    new ExtractPlugin('styles.[hash:8].css'),
  )

  config.optimization = {
    splitChunks: {
      cacheGroups: {
        vendor: {name: 'vendor'}
      }
    }
  }
}

module.exports = config
