const path = require('path')

module.exports = {
  mode: 'development',
  entry: './sourceMap/index.js',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'cheap-module-source-map'
}
