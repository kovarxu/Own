
### 全文要点总结

#### CORB的产生

在满足跨域标签（如：`<script>， <img>`）请求的响应内容的 MIME type 是 `HTML MIME type` 、 `XML MIME type`、 `JSON MIME type` 和 `text/plain` 时，以下三个条件任何一个满足，就享受 CORB 保护。（ `image/svg+xml` 不在内，属图片类型）

* 响应头包含 `X-Content-Type-Options:nosniff`
* 响应结果状态码是 `206 Partial Content`
* 浏览器嗅探响应内容的 `MIME` 类型结果就是 `json/xml/html`

主要是四方面作用的结果：

* 标签名，比如script，它默认接收的mime-type是text/javascript
* 响应头的Content-Type
* 返回资源的类型
* 浏览器嗅探(默认是开启状态的) `'X-Content-Type-Options': 'nosniff'`

eg:

* `<img src="xxx.json" />` 触发CORB，浏览器嗅探到文件内容不匹配
* `<script src="main.js" />` 服务端返回`Content-type: text/javascript`, 正常
* `<script src="main.js" />` 服务端返回`Content-type: application/json`, 正常, 这里的原因是浏览器嗅探到了文件类型，且该类型可以被script标签接受
* `<script src="main.js" />` 服务端返回`Content-type: application/json; X-Content-Type-Options: 'nosniff'`, 触发CORB，该资源无法加载，因为关闭了浏览器嗅探，就完犊子了。
