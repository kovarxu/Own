##浏览器缓存
----------------

### 缓存类型

#### 无缓存

不命中任何缓存
`Cache-Control: no-store;`

#### 内存缓存
忽略html头设定，优先被命中，不返回状态码
`Cache-Control: public, max-age: 20000;`

#### 硬盘缓存

* 强缓存
使用`Cache-Control (HTTP1.1), Expires, Pragma: no-cache (HTTP1.0)`
`Cache-Control`有选项`max-age, must-revalidate(过期后请求服务器验证), no-cache(缓存但不使用), no-store(无缓存), private(仅客户端缓存), public(代理服务器也缓存) 等`
`Cache-Control: max-age=20000;`
状态码200, 一般设定`Cache-Control: max-age: 0`不使用强缓存

* 协商缓存
使用两组标签：

|request|response|
|:--:|:--:|
|If-Modified-Since|Last-Modified|
|If-None-Match|Etag|

Etag优先级更高，更适用于变更迅速的文件

使用`Cache-Control: max-age=600, must-revalidate`：静态资源和页面的推送时间不同，造成混乱。例如静态资源是590s时推送到服务器的，那么下一次revalidate会下载新的资源；页面片是610s时推送的，那么这次revalidate不会检查到变更，会继续使用老的页面片，造成混乱。

### 使用hash

* 页面片中给静态资源加上hash值，例如`...src="http://cdn.xxx.xxx/static/h5/js/jadmin.js?v=19011301"`
* 上线新内容时，优先发布静态资源
* 推送页面片覆盖老的页面片，`注意修改hash值以匹配最新的变更`

### 代理

* 正向代理：使用VPN，隐藏客户端的信息
* 反向代理：使用CDN，内容分发网络，将静态资源发送到静态资源服务器，提高响应速度并减小主服务器的压力
* 负载均衡服务器，平衡分配网络服务器资源

