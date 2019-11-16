# trace

- build main system
- add loaders to handle css and image / what's the structure of packed files ?

- extract manifest / what's in manifest ?
- use optimization / what's split chunks and how to use it ?
- use postcss / what's postcss and how to use it ?
- use `mini-css-extract-plugin` instead of `extract-text-webpack-plugin`
- use postcss / see the ast formed by postcss
- css loader / explore into this loader


## what's the structure of the packed files ?

### concepts

* modules: module from pack
* `__webpack_require__`: a wrapped require method defined by webpack
* entry: `__webpack_require__(entry)`

### modules

key: `"./node_modules/_css-loader@3.2.0@css-loader/dist/cjs.js!./src/style.css":`

separated by `@` and `!`

value: `eval(exports = module.exports = ...)`

key: `"./src/mail.png"`

value: `eval(module.exports = { Image Base64 Infos })`

## how to form manifest ?

```javascript
optimization: {
  runtimeChunk: {
    name: 'manifest'
  }
},
```

## what's in manifest ?

- add `webpackJsonp`
- extract basic `__webpack_require__`

## what's split chunks and how to use it ?

we can use it to split some vendor trunks

there are two groups designed by splitChunksPlugin on default: default(priority: -20; minChunks: 2) and vendors(priority: -10)

```javascript
splitChunks: {
  name: true,
  chunks: 'all',
  minChunks: 1,
  minSize: 30000,
  cacheGroups: { // use this to specify groups
    jquery: {
      test: /[\\/]node_modules[\\/].*?jquery/,
      priority: -5,
      automaticNameDelimiter: '.'
    }
  }
},
```

## what's postcss and how to use it ?

<!-- npm install postcss-loader autoprefixer --save-dev -->

