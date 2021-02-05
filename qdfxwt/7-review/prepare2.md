问题总结整合：

1. 真实的首屏时间计算
2. 如何监控卡顿
3. 框架原理和架构分析
4. 监控需要注意点有哪些
5. 专利细化

### 首屏计算

1. 用户打点，用户最了解自己的页面，但是在sdk中不利
2. 改进，弄一个dom元素在页面中，通过 MutationObserver 检测它的尺寸变化的时间
3. lighthouse-ci 分析 trace.json 文件，工作量较大，可以在上线前检查这一步做
4. 利用 MutationObserver，监听document的变化，检测dom最多的元素和尺寸较大元素的元素作为首屏时间，还需要兼顾image
5. 最终方案，直接用 web-vitals 来分析了

基于1，2点考虑，保留一个固定的class，让用户可以自己指定首屏完成的元素

- 兼顾图片: 也需要兼顾背景图片，需手动标记元素
- 拿到image图片: performance.getEntriesByType('resource')
- 判断是否在首屏中: 根据 getBoundingClientRect() 的结果和 window.innerHeight 来判断

### 卡顿监控

1. requestAnimationFrame
2. requestIdleCallback
3. longtask
4. 心跳包机制

### 监控的技术细化

错误监控的核心：监控`error`和`unhandledrejection`; 利用performance的Entry监控资源加载错误; 利用劫持XHR获取XHR加载超时或者失败

1. 接口测速，hack xhr和fetch，可配置接口的ret返回字段和错误枚举，方便上报
2. 资源测速，包括但不限于image元素，如果支持 PerformanceObserverInstance.observe({ entryTypes: ['resource'] }) 则使用它进行监控，否则使用 performance.getEntriesByType('resource') 然后每隔3s执行一次
3. 监控设备信息、内核版本、网络制式
4. 网页报错监听，主要是监听 error 和 unhandledrejection
5. 异步加载的组件，更多能力（卡顿监控、离线日志、录制回放）可以自由选择是否接入

### createAPI

cube-ui 使用的模式，通过 createAPI 函数在 Vue 原型上注册一些方法，可以快速创建组件实例，其原理是用 new Vue 创建一个Vue实例，然后取组件对象的第一个children作为组件对象。
