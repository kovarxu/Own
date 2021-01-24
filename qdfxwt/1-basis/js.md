问题集合：

1. performance API与测速
2. 前端优化方案
3. GC相关内容
4. 跨域的途径有哪几种
5. 前端安全，xss、csrf是如何防御的
6. 模块化，module和cmd的区别
7. service worker是什么？怎么用的？
8. 原型链的东西
9. webpack的hot-reload机制是啥？
10. 点击穿透和300ms延迟是什么？
11. 宏任务微任务？
12. 节流和防抖，实现和使用场景？
13. 各种实现，bind, new, call, apply, 科里化, 深拷贝，EventEmitter，async(generator + co)
14. canvas和svg相关
15. 各种图片格式的区别，用什么好？
16. 组件库相关的东西，选型，开发和维护
17. webpack插件相关的东西，loader的总结
18. Vue3.0的改进
19. 怎么避免自己的页面被iframe嵌套
20. Vue组件通信方式
21. Vue-router原理和history API
22. Vuex原理
23. instanceof, typeof, getPrototypeOf
24. webpack优化方案
25. async, defer
26. js对象属性遍历
27. 重绘回流相关

问题解答：

#### performance API与测速

1. performance.now 与 Date.now 前者是高精度方法，可以达到微妙精确度，后者只能达到毫秒级别
performance.timing.navigationStart + performance.now() 约等于 Date.now()

2. 测速流程

mark1 --- mark2 --- measure(name, mark1, mark2) --- entries = getEntriedByName(name) --- 取entries[0].duration --- clearMarks() --- clearMeasures()

3. 首屏时间检测

`performance.getEntriesByType('paint')`可检测`first paint` 和 `first contentful paint`

4. 几个点

* performance.timing.navigationStart // 导航开始，作为起点
* performance.timing.domainLookupEnd // 域名解析结束，DNS查询
* performance.timing.connectEnd // 建立连接
* performance.timing.domInteractive // 可交互，主文档解析器解析完毕
* 在页面开头打一个点 // 解析第一行页面的时间

#### 前端优化方案

1. 体积优化

* 使用小图片，但是http2后不是必要了
* CSS的覆盖率测试
* 组件的按需加载，使用babel-plugin-transform-runtime

2. 首屏优化

* 直接往#app节点里面写点东西
* 使用HTMLWebpackPlugin嵌入一点东西
* 使用prerender-spa-plugin预渲染出首屏
* 除去外链css（css+js应该是作为模块维度来维护的，而非文件维度）
* 使用骨架屏（placeholder）

3. 打包优化

* 配置webpack externals将依赖库外置，置于CDN上
* 配置webpack dllplugin打包静态库文件，使用happypack启动多线程打包
* webpack，tree-shaking（正确使用，需要联合sideEffect配置避免摇树去掉了lodash这种库；需要设置babel.presets.env.modules = false 关闭babel默认的模块转义），optimization里面有splitChunks配置，提取公共代码
* 使用webpack-bundle-analyser分析打包后的文件


4. 加速优化

* 使用CDN加速，HTTP层面使用并发连接、域名分片加速，或者升级到http2
* 使用缓存
* 使用动态PolyFill，一般使用的polyfill来自babel，可以外链`cdn.polyfill.io`这种链接减少polyfill数量从而对高端客户端打开更快速
* 动态加载，`import().then, () => import, require.ensure`
* 懒加载：图片额外添加data-src属性。原理是监听 window 对象或者父级对象的 scroll 事件，触发 load；或者使用 Intersection Observer API 来获取元素的可见性。

5. 使用工具
performance面板、performance API、lightHouse测试

#### GC相关

垃圾回收的原理：标记清除法，类似一种联通图算法

从global作用域出发，对失去标记的对象来一次全盘清理（优化方式）

此外还有引用计数法，现已抛弃不用（因为需要重复操作，并且有额外空间，而且对于循环引用问题无法很好地解决）

#### 跨域的途径有哪几种

1. JSONP

2. CORS

一般解决：`Access-Control-Allow-Origin: '*'`

什么是简单请求，什么不是？（写过一篇文章）

* 请求方法只能为`GET POST HEAD`
* 请求头不能有特殊的
* 请求头的`Content-Type`，其值仅为`application/x-www-form-urlencoded, multipart/form-data, text/plain`其中之一

发预检请求：

客户端发送一个`OPTIONS`请求到服务器，携带`Access-Control-Request-Headers`和`Access-Control-Request-Methods`头部，服务端返回一个带有`Access-Control-Allow-Methods`和`Access-Control-Allow-Headers`的预检响应，可能携带`Access-Control-Max-Age`表明预检结果的缓存时间。

发Cookie怎么办？

域名A给B发送ajax请求，如果A没有设置`xmlhttpInstance.withCredentials = true`，则B无法为它自己的域名设置Cookie

客户端需要配置`Access-Control-Allow-Credentials: true`才可以正常实现该功能

3. Nginx设置反向代理 注意cookies的域名转换问题

4. window.name 跨域

5. postMessage + onmessage事件组合，适用于iframe的跨域

#### 前端安全，xss、csrf是如何防御的

需要前后端协作才能有效预防

xss: 跨站脚本攻击，页面可以执行攻击者的js代码，获取用户cookie等敏感数据，使用敏感字符转义可以消除

csrf: 跨站请求伪造，多通过`诱导点击`隐藏风险

GET方式的csrf：
受害者C在A网站发生交易，受害者C访问了某站点B，B的评论区有攻击者D留下的图片（访问了某个链接），C被攻击
受害者C在A网站发生交易，C被吸引点击了攻击者D的链接，C被攻击
攻击预防措施：尽量少用GET请求提交敏感信息，使用浏览器安全策略进行评论区xss预防

POST方式的csrf：
受害者C在A网站发生交易，受害者C访问了某站点B，B网站被xss攻击植入了一个form，自动向A站点提交了交易，C被攻击
受害者C在A网站发生交易，受害者C被吸引点击了攻击者D的站点B，B里面有一个form，自动向A站点提交了交易，C被攻击
攻击预防措施：使用Referer头字段，服务端增加csrf_token，保存在Session中，用户端从cookie获取token，每次提交时携带它

问题：
* 评论区img、video、audio等有发请求权限的元素怎么处理的？

### 怎么避免自己的页面被iframe嵌套

* 添加响应头 `X-Frame-Options`, 设置值是`SAMEORIGIN`表示同域名可以嵌套，`SAMEORIGIN / DENY`同域名也不能嵌套，`ALLOW-FROM http://www.xxx.com`允许指定的域名进行嵌套
* 或者在html的header部分加入meta
  `<meta http-equiv="X-Frame-Options" content="SAMEORIGIN" />`
* javascript的处理方法
  `window.top.location !== window.self.location`时即为被嵌套

### CSP是什么？

内容安全策略，`Content Security Policy`，预防XSS攻击
* 服务端返回`Content-Security-Policy: default-src 'self'; img-src https://*; child-src 'none';`
* 客户端设置`<meta http-equiv="" content="default-src 'self' 'unsafe-inline'; script-src sslstatic.xiaoyusan.com; img-src sslstatic.xiaoyusan.com" />`

只向某个url报告而不禁止`Content-Security-Policy-Report-Only: default-src 'self'; report-uri /xys/abc`

#### module和cmd的区别

* require是cmd引入方式，import是ES6的语法规范
* require是运行时调用，可以置于任何部分；import是编译时调用，有提升效果，建议放到头部
* CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
* ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。换句话说，ES6 的import有点像 Unix 系统的“符号连接”，原始值变了，import加载的值也会跟着变。因此，ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。

#### service worker是什么？怎么用的？

饶了我吧

#### 原型链

* 组合继承：子构造函数中调用父构造函数，sub.prototype = new super()
* 原型式：a = Object.create(b), a可以调用b的方法和属性
* 寄生组合式：子构造函数中调用父构造函数，inheritPrototype(subType, SuperType)

#### 点击穿透和300ms延迟是什么？

桌面触发顺序(mousedown -- mousemove -- mouseup -- click)

移动端点击事件分为touch(touchstart -- touchmove -- touchend)和click，由于双击的原因，click的触发会滞后300ms

点击穿透是指浮层绑定了touchend，浮层隐藏，但是click 300ms之后才派发，此时浮层没了，下层元素被点击了。

处理方法：

1. jq在up事件中使用了setTimeout(0)模拟了tap事件，用这个作为代替

2. 延迟浮层的消失时间

3. 使用fastclick.js 原理也是模拟并派发了一个事件到事件源，然后使用`event.stopImmediatePropogation()`阻止原方法继续执行。

#### 宏任务微任务

宏任务：事件、Timer（setTimeout, setInterval, setImmediate(IE支持)）、Message Channel、RAF

微任务：MutationObserver、Promise

顺序：单个宏任务结束阶段，在其之内注册的微任务执行，接着事件发生冒泡

setTimeout(0) 早于 Message Channel执行

RAF与浏览器渲染相关，是浏览器自己的东西，比setTimeout流畅，但是限于浏览器GC过程，在游戏或动画中容易掉帧，使用与帧率相关的动画控制技术可以减轻影响。

#### 节流和防抖

节流：一定时间内只加载一次
节流的场景：拖拽加载、鼠标滚动响应（canvas等）

防抖：连续触发刷新任务，直到触发间隔小于n ms事件得以执行
防抖的场景：搜索框输入字符、表单验证、按钮提交、resize响应

#### 各种图片格式的区别，用什么好？

1. gif 索引色，有透明度，适合动图
2. jpeg 有损压缩，无透明度，可选择质量
3. bmp 无损原图
4. png 支持有损或无损，有透明度，一般比jpeg大
5. webp 谷歌自己家支持，有损比jpeg小，无损比png小
6. svg 矢量图，无损，体积小

#### 组件库相关的东西，选型，开发和维护

cube-ui createApi

#### webpack的hot-reload机制是啥？

1. 文件发生变化，webpack-dev-middleware将output打包到内存中，webpack-dev-server的server端通过websocket将文件hash传给client
2. client的webpack-dev-server部分接收到了这个hash值，然后决策是刷新浏览器还是通知HMR模块热更新
3. client的HMR模块收到信息，通过ajax请求询问服务器是否有需要更新的文件
4. server的HMR模块告知client需要更新
5. client的HMR模块通过jsonp获得更新后的文件
6. client端进行旧模块的卸载，新模块的安装，如果此过程失败则回退到刷新浏览器的方案上

#### webpack插件相关的东西，loader的总结

webpack结构

entry, output, alias, module.rules, plugins,

compiler 编译程序,有时构架一个子编译程序
compilation
module 模块，一个模块就是一个文件
chunk 一个块，可以用splitchunks去定制
template 输出文件配置
loader 把非js文件转化为js文件

插件

webpack工作的各个阶段均可使用钩子，钩子还能定制

写一个插件：

略

loader

* 初始化ruleset，处理inlineloader和webpack配置的loader (import 'style-loader!css-loader!stylus-loader?a=b!../../common.styl'这种就叫做inline loader)
* 几个属性，loader.normal, loader.pitch, loader.raw
* pitch顺序执行，可以是异步方法，只需要使用`let callback = this.async()`然后在callback中调用`callback(null, result)即可`,pitch函数返回一个值，之后的loader不会执行；如果同步想传递多个参数：`this.callback(null, content, argA, argB)`
* normal逆序执行

#### vue3.0的改进

<!-- * 懒watch，加速渲染
* 采用TS
* 监听部分使用了更加契合新语言标准的Proxy -->

#### Vue组件通信方式

* props和data-on监听
* vuex实现属性的统一管理
* event bus
* provide / inject依赖注入

#### Vue-router初始化

* Vue-router全局注入了包含`beforeCreated`生命周期钩子的`mixin`，指定vm实例的`_routerRoot`，并且在router-view的子元素上执行register，进而在路由匹配的record的instances属性中加入自身。
* 创建matcher，matcher内部有以path和name为依据的record集合，每个record包含`path, regex, components, instances, name, parent, matchAs, redirect, beforeEnter, mate, props`等诸多属性。注意在这里发生路由递归创建过程。
* component和components的区别：component会被解析为`{default: xxx}`，在没有name的routerView组件中可用，但是在命名routerView内只能使用components。

#### transitionTo和路由钩子执行

1. 通过`this.router.match`获取对应的route，每个route含有若干个父子结构的record
2. 收集将要`updated, deactivated, activated`的record
3. 收集并依次执行leave和init钩子：【
  `deactivated.beforeRouteLeave`，
  `router.beforeEach`,
  `updated.beforeRouteUpdate`,
  `route.beforeEnter`(可以根据每个route定义不同的beforeEnter）,
  解析异步activated组件的钩子】
4. 收集并执行enter钩子：【
  `activated.beforeRouteEnter`（在此阶段收集postEnterCbs）,
  `router.beforeResolve`】
5. 执行onComplete
  更新当前route，执行`history.listen`定义的回调，执行【`router.afterEach`】回调
  执行`transitionTo(fn)`定义的fn回调, 这里如果是`$router.push`或`$router.replace`，则fn包含`history.pushState`的执行；如果是popstate事件间接执行的transitionTo，则只进行scroll逻辑的处理
  `ensureURL`，保证history.current中的路由和页面路由一致，不一致则调用replace替换之
6. 执行`postEnterCbs`（注意这里的cbs是在beforeRouteEnter钩子函数内部收集的，即
  `beforeRouteEnter (to, from, (vm => // do something))）`这种形式，也只有这个钩子支持vm引用。而且要注意这个函数是通过`poll（setTimeout）`监听instances是否包含指定vm而执行的，可能在时序上会相比vue内部的一些事件有些出入。

#### history和hash模式的区别：

* history是html5的API，包含`onpopstate`事件的监听和`history.pushState(obj, '', location), history.replaceState(obj, '', location)`。用于新建/取代一条当前页面的历史记录，但是这两中操作均会在全局创建一条历史记录。
在A页面使用history.pushState(info, '', locationB)不会立即加载B页面。如果此时访问另一个不同域名的网站C，则点击浏览器后退按钮时，会加载B页面，但window.popstate不触发，可以访问history.state得到前文设置的info对象；再次点击后退按钮时，window.popstate触发，此时e.state为null；再次点击前进按钮时，window.popstate触发，此时e.state为info对象。
* 浏览器的hash发生变化时触发onhashchange事件，使用`location.hash = xxx; location.replace(xxx)`可以触发这个事件。

vue中两种mode的区别

* history模式在History对象创建时绑定`onpopstate`事件，hash模式在初始化`transitionTo`执行后才绑定，原因是hash模式会把`#a/b/c`形式的链接变成`#/a/b/c`,这样hash就发生了一次变化
* history模式要求浏览器必须支持HTML5 history API，hash模式优先使用history API, 可以自动回退到hash事件绑定上去
* history模式可使用route.base指定一段公共路径，如果浏览器不支持history模式，vue-router自动回退到hash模式，此时base指定一段pathname，例如`www.a.com/feature/app?name=lily` --> `www.a.com/feature/#/app?name=lily`(如果指定了base为`/feature`)
* history模式后端需要做配置来兼容

#### router-view

本质是一个函数式组件，它在render过程中要做几件事：

* 确定路由深度，找到对应的record
* 添加data.registerRouteInstance方法，子组件创建时在beforeCreate中调用之，将其自身添加至匹配record的instance属性中
* keep-alive的适配和边界条件
* 合并configProps并调用$createElement创建record对应的子组件

#### webpack优化方案

* uglifyJSPlugin: compress, parralle
* commonChunksPlugin: 分包，但是不会自动对异步模块打包
* optimize: splitchunks: 可以对异步模块打包，但是不能抽离manifest
* optimize: runtimechunk: 用于抽离webpack manifest文件
* dllPlugin: 需要一个额外的配置文件，抽离静态的第三方库
* dllReferencePlugin: 配合dllPlugin使用，context需要保持一致；发布需要copyWebpackPlugin用于把dll文件复制到dist目录

#### 错误上报平台

* Vue.config 设置errorHandler方法
* 绑定window.onload和window.unhandledRejection错误处理回调
* 使用TraceKit库定位发生错误的行数（但是对于那种压缩后的代码无效）
* sourceMap

#### vuex总结

初始化
* beforeCreate钩子里绑定了一个生命周期事件，往vm上挂在了$store属性表示vue实例。

创建Store
* 核心概念：Module，ModuleCollection
Module：一个模块，包含_children, state等
* ModuleCollection：根据new Store(options)通过options创建出来的模块集合，其中对Module的父子关系进行了构建
* Namespace：对于namespaced=true的module，会获得一个全新的作用域，否则与其父亲共同作用域，两者的各种方法、状态都放在一起。

核心操作：
* installModule：首先收集context，然后收集getters，mutations，actions等并循环安装其子模块
* resetStoreVM：第一步是构建了Vue实例store._vm，把getters绑成computed上去，把state绑到data.$$state上去；第二步根据是否strict模式，开启禁止外部修改state；第三步删除oldVm。

API操作：
* store.watch(cb), 因为store._watchVM也是一个vm实例，所以可以使用$watch去监听一些状态的变化，这个API监视的是state和getters的变化，执行cb
* store.subscribe(fn)，这个函数在所有commit改变state之后运行，参数是{ type: type, payload: payload }, state
* store.subscribeAction(fn), fn可以是一个函数，也可以是{ before: fn, after: fn }这种类型，分别在actions的Promise完成前和完成后执行。
这些API执行的返回值也是一个函数，调用这个函数可以解除监听。

* mapState(namespace, states), namespace经过标准化后以/结尾，它根据namespace找到module，然后输出一个{key: fn}形式的对象;
* mapGetters, mapMutations, mapActions均为类似操作
* getters，可以接收local.state, local.getters, store.state, store.getters作为参数
* mutations，可以接收local.state和payload作为参数
* actions，可以接收{ dispatch: local.dispatch, commit: local.commit, getters: local.getters, state: local.state, rootGetters: store.getters, rootState: store.state }作为参数

经典问题：
* 如何防止外部篡改？通过定义一个_committing的标，在commit之前设置它为true，在commit之后关闭它，如果外部篡改，这个标为false，则报警告

### Vue-loader原理

1. vue-loader处理`A.vue`文件，生成几个新的request: `A.vue?vue&type=template`, `A.vue?vue&type=css`, `A.vue?vue&type=js`
2. VueLoaderPlugin发生作用，对`query`包含`vue`的资源指定`pitcher-loader`, 上面三个request均符合条件，`pitcher-loader`根据type构建三个request，移除自身和`es-lint-loader`，此时由于`pitcher-loader`的`pitch`函数返回了值，后续loader不执行
3. 接上面一步，经过处理的`A.vue?vue&type=template`指明了`type`类型，`vue-loader`创建一个`A.vue.html`类型的资源，`type=css`和`type=js`的`request`同理
4. 后续这三个文件分别用自己的`loader`进行处理，跟`vue-loader`没关系了

#### webpack-plugin总结

#### async和defer

async：即时加载，阻塞无序执行，DCL之前

defer：即时加载，末尾有序执行，可能DCL之后

defer与async的区别是：defer要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），才会执行；async一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。一句话，defer是“渲染完再执行”，async是“下载完就执行”。另外，如果有多个defer脚本，会按照它们在页面出现的顺序加载，而多个async脚本是不能保证加载顺序的。

#### 异步加载方式

* `() => import(/* chunkName=foo */ bar.vue)` import提案，内部promise
* `require.ensure(['dependencies'], function(require) {require('bar.vue')}, function(err) {}, 'chunkname')`
内部也是用的promise

### js对象属性遍历

* for ... in ...  适合原型链上所有可枚举属性
* Object.keys()  适合自身所有可枚举属性
* Object.getOwnPropertyNames()  适合自身所有非Symbol属性
* Object.getOwnPropertySymbols()  适合自身所有Symbol属性
* Object.ownKeys()  上述两者的合集

### 重绘回流相关

参考`https://mp.weixin.qq.com/s/g8MBJx1yG1duN1P-qth9NQ`

访问这些表示元素尺寸和位置的属性时，发生回流
offsetTop、offsetLeft、offsetWidth、offsetHeight
scrollTop、scrollLeft、scrollWidth、scrollHeight
clientTop、clientLeft、clientWidth、clientHeight
getComputedStyle()、getBoundingClientRect

以上属性和方法都需要返回最新的布局信息，因此浏览器不得不清空队列，触发回流重绘来返回正确的值。因此，我们在修改样式的时候，最好避免使用上面列出的属性，他们都会刷新渲染队列。如果要使用它们，最好将值缓存起来。

优化途径：
* 将对`el.style.padding, el.style.borderLeft`这种操作使用`class`操作代替
* 批量修改DOM 1. display: none使元素脱离文档流；2. 使用documentFragment；3. 拷贝到内存，操作完再怼回去
* 使用绝对定位让动画元素脱离文档流
* 开启GPU加速（但是layer太多反而耗性能，而且字体会抗锯齿失效）
