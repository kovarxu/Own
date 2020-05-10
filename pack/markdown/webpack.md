
### ToDo

1. 读文档 `Concepts -- Modules` 和 `API -- Modules`部分
2. 读文档 `Loader -- url-loader, file-loader`部分
3. 读文档 `Loader -- css-loader, sass-loader, style-loader`部分
4. sourceMap原理探索
5. 读文档`API -- Command Line Interface, API -- Node.js API`
6. 读文档`Guide -- HMR, Concepts -- HMR` 了解实现原理
7. 读文档`splitChunksPlugin` 了解配置和原理
8. 读文档`css extract`相关
9. 读文档``相关
10. 统计：常用的Plugins及其基本用法，并深入一两种
11. 读文档`webpackDevServer`
12. 了解`library, libraryTarget`等库打包的内容
13. 多进程打包了解

### webpack基础
Notes：

```js
module.exports = {
  mode: 'development', // 模式
  entry: './index.js', // 入口文件，路径相对于package.json
  entry: {  // 与上面的写法等价
    main: './index.js'
  },
  output: {
    filename: 'bundle.js' 或者 '[name].js', // 输出文件名
    path: path.resolve(__dirname, './bundle'), // 本地输出目录，必须是绝对路径 __dirname: 本文件所在位置；argv[1]: 执行入口所在位置（包含文件名）,
    publicPath: 'http://cdn.com.cm/static' // 上线的cdn路径配置 
  },
  module: {
    rules: [
      {
        test: /\.jpg$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]', // loader支持额外的options参数表示配置
            outputPath: 'images/', // 输出文件夹，相对于绝对输出目录 output.path
            limit: 10000,
            fallback: 'file-loader' // 回退，可以不设置，url-loader内部自己有了
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'] // css-loader 使用了postcss的css AST生成无import的css代码，style-loader 将css挂到style标签上去
      },
      {
        test: /\.(eot|ttf|svg)$/, // 打包字体文件
        use: 'file-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ],
  devtool: 'inline-source-map', // 见下方sourceMap
  devServer: {
    contentBase: './dist',
    open: true, // 打开一个新窗口
    port: 8090,
    proxy: {
      '/api': 'http://dev.go.cc'
    },
    hot: true, // 开启热更新
    hotOnly: true, // 即便热更新失败，也不重新刷新
    // 需要添加webpack.HotModuleReplacementPlugin
  }
}
```

package.json 中的 scripts 优先用的是 npx

postcss-loader --- postcss.config.js --- 添加插件 autoprefixer

#### css-loader配置项

```js
[
  'style-loader',
  {
    loader: 'css-loader',
    options: {
      importLoaders: 2, // 从index.scss中导入avatar.scss时后者不走下面2个loader，为了防止出问题这里可以配置成2将这2个loader包含进来
      cssModules: true // css modules, 代码中写 import style from './index.css'; img.classList.add(style.avatar)
    }
  },
  'sass-loader',
  'postcss-loader'
]
```

#### sourceMap

从打包后的代码映射回源代码的方式，比如打包后的代码第1000行出错，根据sourceMap读出源代码在第210行，直接读取即可。

* inline 把map直接写在js中
* cheap 只映射行性能更好
* module 兼顾第三方模块的报错
* eval 使用eval执行代码，将外链放在注释里面 eval("console.log('abc');\n\n//# sourceURL=webpack:///./src/index.js"), 使用eval自动打包为inline，但是重新打包快速，用于开发环境

开发环境：`eval-cheap-module-source-map`
生产环境：`cheap-module-source-map`

#### webpack-dev-server

自己去写server:

```js
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleWare = require('webpack-dev-middleware')
const config = require('./webpack.config.js')
// 在nodejs中使用webpack
const compiler = webpack(config)

const app = new express()

app.use(webpackDevMiddleWare(compiler, {
  publicPath: config.output.publicPath
}))

app.listen(3003)
```

#### HMR 热更新

需要注意的是，loader一般帮我们处理了hot的细节，但是如果有自己的文件，需要自己写hot逻辑

```js
if (module.hot) {
  module.hot.accept('./number', () => {
    someIssue()
  })
}
```

#### babel转义

* babel-loader (本身不做转义，让插件做)
* @babel/core @babel/preset-env (只做了语法翻译，没有垫片)
* @babel/polyfill (垫片，会污染全局)

垫片体积优化:

`presets: [['preset-env', { target: { chrome: '67' }, useBultins: 'usage' }]]`

* 开发组件不想污染全局：@babel/plugin-transform-runtime

### webpack高级概念

#### tree shaking

* 只支持ES module的配置

* 开发环境

在webpack配置文件中增加`optimization: { usedExports: true }`

在package.json中增加 "sideEffects": false，表明不需要处理额外的模块，如果要解决`import "@babel/poly-fill"`这种则把`"sideEffects"`设置为一个数组`[ '@babel/poly-fill', '*.css' ]`这样

虽然配置了，但是开发环境的源码还是保留有未shake的代码

* 生产环境

需要设置sideEffects，webpack4已经自动做了

#### 开发环境和生产环境分包

新建build文件夹，使用插件：webpack-merge

公用的：
* entry
* module (大量)
* plugins(一些)

需要定制的：
* output (publicPath)
* mode
* devtool
* devServer
* optimization
* plugins

#### code-splitting

1. 同步代码借助配置

```js
optimization: {
  splitChunks: {
    chunks: 'all'
  }
}

```

2. 异步代码自动分包

`import(/* webpackChunkName:"lodash" */ 'lodash').then(({ default: _ }) => // do something)`

3. splitChunks 参数

4. 拆分css

MiniCssExtractPlugin, MiniCssPlugin

#### 打包分析，preloading，prefetching

在线分析：

1. 输出stats.json：webpack --profile --json > stats.json
2. 上传json文件：http://webpack.github.com/analyse

preloading/prefetching：

* coverage与性能
* preloading在网络空闲可以自动加载，可以用于模态框的加载 用法：`/* webpackPrefetch: true */`

#### 缓存相关

* `output.chunkFileName`是chunk的名称，反映到打包后的文件名上面，但是与入口相关的文件，走的是`filename`属性
* `output.filename = [name].[contenthash].js` 这样配置之后有利于浏览器进行缓存控制
* 对于一些版本的webpack，就算未修改文件，打包后的contenthash也发生了变化，这种情况下应抽离manifest

```js
optimization: {
  runtimeChunk: {
    name: 'manifest'
  }
}
```

#### shimming

垫片，因为有的库直接使用了某些其他库文件，但是webpack不知道，使用 webpack.ProvidePlugin({ $: 'jquery' }) 如果项目使用了$则自动引入

### 实战分析

#### 库打包

注意output配置，library和libraryTarget是配合使用的

```js
output: {
  path: ...
  filename: ...
  library: 'Lib', // script引入之后全局叫做Lib
  libraryTarget: 'umd' // umd: 通用打包目标; this: 挂载全局this上; global / window: 对应的场景
}

```

重复引用，库不打包依赖，把依赖库放到项目目录里去加载

```
externals: {
  lodash: 'lodash'
}
```

发布：

* 指定main入口
* 指定lisence
* 到npm去注册账号
* npm adduser, 输入用户名和密码
* npm publish, 发布项目

#### serviceWorker

使用workbox-webpack-plugin

#### Typescript的打包配置

* 安装ts-loader, typescript解析ts和tsx文件
* 配置tsconfig.json
* 安装库的type文件 @types/lodash, 然后 import * as _ from 'lodash'

#### webpackDevServer请求转发

devServer设置proxy: `{ '/react/api': 'http://www.foo.com'}`, 这样就能把写在`get('/react/api/1111')`的请求发送到`get('http://www.foo.com/react/api/1111')`

或者：
```js
proxy: {
  'react/api': {
    target: 'https://www.foo.com',
    secure: false,
    pathRewrite: { // 为了调试方便，这里不需要改源代码，直接改webpack配置就可以了
      'header.json': 'demo.json'
    }
  }
}
```

#### webpackDevServer + 单页应用 + BrowserRouter

`historyApiFallback: true` 解决后端没配置时的转发问题

#### 提升打包速度

* node版本尽可能新
* dev可以不压缩
* loader指定include或者exclude
* plugin尽可能少地使用，保证性能
* resolve参数配置 `resolve: { extensions: ['.js', '.jsx', '.vue'], alias: { @: 'src/' } }`
* dev上使用dllPlugin，把第三方库都打包到一起

##### dllPlugin的使用

目的：抽离不经常变更的第三方库文件，打包到一起，提升打包性能和加载性能，必须要学会的东西
手段：几个Plugins配合使用的结果
步骤：
1. 新建dllconfig文件，配置将库文件打包到dll目录，使用webpack.DllPlugin生成manifest.json文件
2. 使用add-asset-html-webpack-plugin将打包后生成的dll文件引入到项目（生成的index.html就会包含这个文件了）
3. 配置webpack.DllReferencePlugin将manifest文件映射到项目

##### node多进程打包

thread-loader, parallel-webpack 多页面打包, happypack

##### 使用合理的sourceMap类型

##### stats.json分析

#### 多页面打包配置

1. 配置多个entry
2. 包含对应个数的HTMLwebpackPlugin，指定每个Plugin的chunks参数包含对应的chunk

