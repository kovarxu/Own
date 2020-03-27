问题集合：

1. performance API与测速
2. 前端优化方案
3. GC相关内容
4. 跨域的途径有哪几种
5. 前端安全，xss、csrf是如何防御的
6. 模块化，cmd和amd的区别
7. service worker是什么？怎么用的？
8. 原型链的东西
9. webpack的hot-reload机制是啥？
10. 点击穿透和300ms延迟是什么？
11. 宏任务微任务？
12. 节流和防抖，实现和使用场景？
13. 各种实现，bind, new, call, apply, 科里化, 深拷贝，EventEmitter
14. canvas和svg相关（看下自己做的那个东西）


问题解答：

#### performance API与测速

1. performance.now 与 Date.now 前者是高精度方法，可以达到微妙精确度，后者只能达到毫秒级别
performance.timing.navigationStart + performance.now() 约等于 Date.now()

2. 测速流程

mark1 --- mark2 --- measure(name, mark1, mark2) --- entries = getEntriedByName(name) --- 取entries[0].duration --- clearMarks() --- clearMeasures()

3. 首屏时间检测

`performance.getEntriesByType('paint')`可检测`first paint` 和 `first contentful paint`

4. Performance面板、lighthouse的使用

#### 前端优化方案

1. 体积优化

使用小图片，但是http2后不是必要了
CSS的覆盖率测试
组件的按需加载，使用babel-plugin-transform-runtime

2. 首屏优化

使用骨架屏

3. 打包优化

配置webpack dllplugin打包静态库文件，使用happypack启动多线程打包
webpack，tree-shaking，optimization里面有splitChunks配置，提取公共代码
使用webpack-analyser分析打包后的文件

4. 加速优化

使用CDN加速，HTTP层面使用域名分片加速

#### GC相关

垃圾回收的原理：标记清除法，类似一种联通图算法

从global作用域出发，对失去标记的对象来一次全盘清理（优化方式）

此外还有引用计数法，现已抛弃不用（因为需要重复操作，并且有额外空间，而且对于循环引用问题无法很好地解决）

#### 跨域的途径有哪几种

1. JSONP

2. CORS

什么是简单请求，什么不是？（写过一篇文章）

发Cookie怎么办？

3. Nginx设置反向代理 注意cookies的域名转换问题

4. window.name 跨域

5. postMessage + onmessage事件组合，适用于iframe的跨域

#### 前端安全，xss、csrf是如何防御的

需要前后端协作才能有效预防

xss: 跨站脚本攻击，页面可以执行攻击者的js代码，获取用户cookie等敏感数据，使用敏感字符转义可以消除

csrf: 跨站请求伪造，多通过`诱导点击`隐藏风险

过程：A转账 --- B骗A点链接 --- A点击链接，此时A的信息未过期，转账发生，但此链接可能是B精心设计过的链接，钱转给了B

防御措施：

1. 使用Referer头字段
2. csrf_token，后端在setCookie时写入csrf_token,或者在form列表中加入一个不可见的input元素，设置其值为csrf_token

#### 模块化，cmd和amd的区别

我不知道

#### 点击穿透和300ms延迟是什么？

桌面触发顺序(mousedown -- mousemove -- mouseup -- click)

移动端点击事件分为touch(touchstart -- touchmove -- touchend)和click，由于双击的原因，click的触发会滞后300ms

点击穿透是指浮层绑定了touchend，浮层隐藏，但是click 300ms之后才派发，此时浮层没了，下层元素被点击了。

处理方法：

1. jq在up事件中使用了setTimeout(0)模拟了tap事件，用这个作为代替

2. 延迟浮层的消失时间

3. 使用fastclick.js 原理也是模拟并派发了一个事件到事件源，然后使用`event.stopImmediatePropogation`方法阻止原方法继续执行。

#### 宏任务微任务

宏任务：事件、Timer（setTimeout, setInterval, setImmediate(IE支持)）、Message Channel、RAF

微任务：MutationObserver、Promise

顺序：单个宏任务结束阶段，在其之内注册的微任务执行，接着事件发生冒泡

setTimeout(0) 早于 Message Channel执行

RAF与浏览器渲染相关，是浏览器自己的东西

#### 节流和防抖

节流：一定时间内只加载一次
节流的场景：拖拽加载、鼠标滚动响应（canvas等）

防抖：连续触发刷新任务，直到触发间隔小于n ms事件得以执行
防抖的场景：搜索框输入字符、表单验证、按钮提交、resize响应
