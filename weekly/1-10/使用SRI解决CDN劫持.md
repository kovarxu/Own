
### 全文要点总结

#### 名词解释
SRI 全称 Subresource Integrity - 子资源完整性，是指浏览器通过验证资源的完整性（通常从 CDN 获取）来判断其是否被篡改的安全特性。

可以给link和script标签加上integrity属性开启SRI功能

eg: `<link rel="stylesheet" href="www.xxx.com/css/x-ab43e3gd.css" crossorigin="anonymous" integrity="sha256-xyz sha384-wkj" />`

#### 使用

webpack配置plugin注入integrity属性

`new SriPlugin({ hasFuncNames: ['sha256', 'sha384'], enabled: process.env.NODE_ENV === 'production' })`

#### 错误处理

如果加载失败，可以在script上注入onerror事件，执行回源加载（坏处是onerror事件不知道到底是网络、资源不存在还是CDN劫持导致的，但是如果无统计需求，无差别对待问题不大）

方法：使用ScriptExtHtmlWebpackPlugin

`new ScriptExtHtmlWebpackPlugin({ custom: {test: ..., attribute: 'onerror', value: 'loadScriptError.call(this, event)'} })`

然后在header部分注入loadScriptError的inline代码即可

#### 如何检测是否被劫持了

load两次资源，比较前面一些字节的差异（因为攻击者往往直接把代码注入开头或结尾，注入中间需要解析AST）
