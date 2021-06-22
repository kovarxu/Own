## 异步模型

### callback

回调地狱
异常处理复杂
执行时机混乱

### promise

代码碎片化
逻辑混乱、可读性地

### co

generator 年代的产物
可以和promise结合
代码可读性高
非语义化

### async

主流，语义性好
兼容性问题（可转义）

### fiber

线程，有自己的调用栈
可读性高
无语义性问题
可嵌套
非原生支持，不能polyfill

## 多进程

node一个进程上只有一个js线程，通过cluster构建多个进程，parent process把socket的句柄发送给 child process 进行处理
