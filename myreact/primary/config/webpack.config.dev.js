const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const resolve = (dir) => path.join(__dirname, '../', dir)

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    app: resolve('src/index.js')
  },
  output: {
    filename: '[name].js',
    path: resolve('dist')
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css']
  },
  module: {
    rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.s?css/,
        loaders: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              options: {},
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|ico)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]'
          }
        }]
      },
      {
        test: /\.svg/,
        use: [{
          loader: 'svg-inline-loader'
        }]
      }
    ]
  },
  devServer: {
    host: 'localhost',
    port: '8001',
    open: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: resolve('dist/index.html'),
      template: resolve("public/index.html")
    })
  ]
}
