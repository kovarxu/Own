## JS模块化总结

### 模块化难题

需要考虑的场景：

1. 多模块加载，使用IIFE并不是万能的
2. 加载顺序，互相依赖，比较头疼
3. node端和浏览器端不同，node支持同步加载，浏览器必须考虑异步加载

### commonjs

nodejs通用的模块加载器，关键词`module, module.exports, exports.foo`

CommonJS模块的加载机制是，输入的是被输出的值的**拷贝**。也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。

在浏览器端可以使用打包后的文件

### AMD

适用于浏览器端的异步模块加载方案，使用`require.js`

使用：`define(['m1', 'm2'], function(m1, m2) {...return 模块}`; `require(['m1', 'm2'], function(m1, m2) {...使用模块})`

### UMD

整合了commonjs和AMD，它检测如果存在node执行环境（require）就用commonjs，如果是浏览器环境就用AMD

```js
(function (global, factory) {
    if (typeof exports === 'object' && typeof module !== undefined) { //检查CommonJS是否可用
        module.exports = factory(require('jquery'));
    } else if (typeof define === 'function' && define.amd) {      //检查AMD是否可用
        define('toggler', ['jquery', factory])
    } else {       //两种都不能用，把模块添加到JavaScript的全局命名空间中。
        global.toggler = factory(global, global.jQuery);
    }
})(this, function ($) {
    function init() {

    }
    return {
        init: init
    }
})
```

### ES6模块化

关键词`import, export`

适用于浏览器和nodejs，但是两者目前的支持性都不佳，需要经过babel转义

ES6 模块与 CommonJS 模块的差异  
它们有两个重大差异：

* CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
* CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。


### CMD*

国内提出，仅限国内

CMD适用于浏览器端，可以同步也可以异步加载模块，使用`sea.js`

```js
//定义有依赖的模块
define(function(require, exports, module){
  //引入依赖模块(同步)
  var module2 = require('./module2')
  //引入依赖模块(异步)
    require.async('./module3', function (m3) {
    })
  //暴露模块
  exports.xxx = value
})

// 引入使用的模块
define(function (require) {
  var m1 = require('./module1')
  var m4 = require('./module4')
  m1.show()
  m4.show()
})
```



