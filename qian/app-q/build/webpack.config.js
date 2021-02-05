const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { VueLoaderPlugin } = require("vue-loader");

module.exports = () => {
  return {
    mode: 'development',
    entry: './src/index.ts',
    output: {
      filename: '[name].js',
      sourceMapFilename: 'source.map'
    },
    devtool: 'eval-cheap-module-source-map',
    // devtool: 'source-map', // for map testing
    devServer: {
      contentBase: './dist',
      port: 8008,
      hot: true, // 开启热更新
      hotOnly: true, // 即便热更新失败，也不重新刷新
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
          use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
        },
        {
          test: /.vue$/,
          use: 'vue-loader',
        },
        {
          test: /.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                appendTsSuffixTo: [/.vue$/],
              },
            },
          ],
        },
      ],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/')
      }
    },
    plugins: [
      new HtmlPlugin(),
      new CleanWebpackPlugin({
        root: 'dist'
      }),
      new VueLoaderPlugin()
    ],
  }
}
