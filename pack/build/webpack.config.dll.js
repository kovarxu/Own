const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry: {
    library: ['lodash']
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, '../dll'),
    library: '[name]' // 把库以一个全局变量名暴露出去，如果导入页面，则library是一个函数
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      path: path.resolve(__dirname, '../dll/[name].manifest.json')
    })
  ]
}
