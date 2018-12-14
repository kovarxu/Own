ES6入门

### let和const命令

* 如果存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭性的作用于，凡是在声明之前就使用这些命令就会报错
* 在let声明之前该变量都不可用，形成暂时性死区
* const一旦声明就必须初始化，不能留到以后赋值
* ES5只有两种声明变量的方法：var和function(均为全局)，ES6增加了let和const,另外还有import,class(不属于全局)

### 解构赋值
* `let [x, , y] = [1, 2, 3]`
* `let [hear, ...tail] = [1, 2, 3, 4]`
* `let [x, y, ...z] = ['a']` // x = 'a', y = undefined, z = []
* 具有Iterator接口的数据结构均可使用解构赋值，如`let [x, y, x] = new Set(['a', 'b', 'c'])`
* `let {bar, foo} = {foo: 1, bar: 2}`
* `let {bar: baz} = {bar: 2}`// baz = 2, 对象解构的内部机制是先找到同名的属性，然后赋值给对应的变量
* `let {toString: s} = 123` // 如果对象解构的右值不是对象，会先转化为对象
* `var x; {x} = {x: 1} // 出错`
* `var x; ({x} = {x: 1}) // 可以`
* 将一个已经声明的变量用于解构赋值，容易出错
* `const {log, sin, cos} = Math` // 比较方便的方法
* `function add([x, y]) {return x + y;}` 函数参数的解构
* Map对象相较Object多了Iterator属性，可以用于获取键名和键值`for (let [key, value] of map) {do something...}`
* 应用场景：交换变量值、从函数返回多个值、提取JSON数据、函数参数的默认值
* 解构赋值与对象扩展运算符: 三点符号用于右值：`let b = {...a, x: 1, y: 2}`是对a进行扩展操作

### 解构赋值的默认值

* `var [x = 1] = [undefined]` // x = 1, 只有严格等于undefined才会启用**惰性求值**的默认值
* `function add({a = 123, b = 'abc', c = true})`只有函数的形参可以用`=`,在函数调用的时候用就错了
* `function move({x = 0, y = 0} = {}) {return [x, y]}`这样也可以, 后面{}中的代表实际的赋值
* `function move({x, y} = {x: 0, y: 0}) {return [x, y]}`这样达不到效果

### Number和Math的扩展

* `Number.isFinite(), Number.isNaN()`检测`Infinity 和 NaN`,传统的isFinite和isNaN方法会先转化为数值，这两函数对非数值均返回false
* `Number.parseInt(), Number.parseFloat()`与全局方法相同
* `Number.EPSILON` // 约等于2.22e-16,极小常数，浮点数计算的误差范围
* `Number.isInteger()`判定整数
* `Number.isSafeInteger()` // JS表示的整数范围在-2^53 - 2^53之间
* `Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER`表示安全常数的上下限
* `Math.trunc()`去除一个数的小数部分
* `Math.hypot()`计算所有参数的平方和的平方根
* `Math.log2, Math.log10, **`等等

### 对象扩展

* `let obj = {[propKey]: true, ['a' + 'bc']: 123}`
* `Object.assign()`可以为函数指定默认值
* `__proto__`属性值，在浏览器环境不一定支持，使用`Object.setPrototypeOf()`等API代替操作

### 枚举

* `for...in` 自身 + 继承 (可枚举，无Symbol)
* `Object.keys()` 自身 (可枚举，无Symbol)
* `Object.getOwnPropertyNames()` 自身 (无Symbol)
* `Object.getOwnPropertySymbols()` 自身 (only Symbol)
* `Reflect.ownKeys()` 自身()
* `Reflect.enumerate(obj)` 返回Iterator对象，自身 + 继承 (可枚举，无Symbol)
* 遍历次序：先所有属性值为数值，然后为字符串，最后是Symbol，后二者按照生成时间排序

### Symbol

* ES5