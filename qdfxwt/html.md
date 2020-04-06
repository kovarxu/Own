问题集合：

1. 301 302 303 307 308有何不同
2. http2的知识点
3. https的知识点
4. 常见状态码
5. 大文件传输、分块传输
6. 缓存控制
7. Cookie选项
8. websocket
9. TCP握手挥手描述
10. DNS查询过程
11. Cookie和Session和Token
12. CDN劫持，CDN相关总结
13. 签名与证书

#### http2

1. 头部压缩  报文头携带大量信息，有时多达几百上千字节，而且冗余度极高。使用HPACK算法，在客户端和服务端建立“字典”，采用哈弗曼编码压缩整数和字符串，达到50%-90%的高压缩率
2. 二进制格式  它把 TCP 协议的部分特性挪到了应用层，把原来的“Header+Body”的消息“打散”为数个小片的二进制“帧”（Frame），用“HEADERS”帧存放头数据、“DATA”帧存放实体数据。
3. 流  它是二进制帧的双向传输序列，同一个消息往返的帧会分配一个唯一的流 ID。因为“流”是虚拟的，实际上并不存在，所以 HTTP/2 就可以在一个 TCP 连接上用“流”同时发送多个“碎片化”的消息，这就是常说的“多路复用”（ Multiplexing）——多个往返通信都复用一个连接来处理。多个请求 / 响应之间没有了顺序关系，不需要排队等待，也就不会再出现“队头阻塞”问题，降低了延迟，大幅度提高了连接的利用率。

#### websocket

1. 全双工，解决了通信————应答的通信模式带来的问题，这就导致 HTTP 难以应用在动态页面、即时消息、网络游戏等要求“实时通信”的领域。
2. 采用二进制帧结构，语法和语义与HTTP不兼容。
3. ws:// wss: // ,端口分别80和443
4. 握手方式：(C) Connection: Upgrade; Upgrade: websocket + 安全验证 --> (S) 101 Switching Protocols + 安全验证

#### 请求方法

GET查看 HEAD查找有没有 POST修改 PUT新增 DELETE删除，基本没用 OPTIONS预检 CONNECT TRACE

#### 常用状态码

101 Swithcing Protocol 切换协议
200 OK 成功返回
204 No Content 一般HEAD请求会发这个
206 Partial Content 一般范围请求会发这个
301 Moved Permanently 永久重定向
302 Found 暂时重定向（301-302浏览器有定向优化）
303 See Other 类似302，但重定向后使用GET请求，避免PUT/POST重复提交
304 Not Modified 用户缓存控制，表明协商缓存成功
307 Temporary Redirect 类似302，但重定向后请求里的方法和实体不允许变动，含义比302更明确
308 PermanentPermanent Redirect 类似 307，不允许重定向后的请求变动，但它是301“永久重定向”的含义。
401 Unauthorized 未授权，用户不能通过身份认证
404 Not Found 资源不存在
405 Method Not Allowed 禁止使用请求中的方法
406 Not Acceptable 没有找到符合内容协商要求的资源
409 Conflict 服务器冲突了，可能有I/O冲突
416 range not satisfiable 范围请求无效
500 internal server error 服务器错误
501 Not Implemented 服务器未实现该功能
502 bad gateway 错误网关
503 service unavailable 服务器不可用
504 gateway timeout 服务器或网关超时
505 http version not supported 不支持的协议版本

#### 常用头部

客户端相关：`User-Agent, Referer, Host, Origin`

内容相关：`Accept-Encoding, Accept, Accept-Language`, `Content-Length, Content-Type, Content-Encoding, Vary`(关联406状态码) `Content-Disposition: attachment; filename=pic.jpg`下载文件

大文件请求相关：`Transfer-Encoding: chunked`, `Accept-Ranges: bytes; Content-Range: bytes x-y/length`
(关联206状态码)

缓存相关：`Cache-Control, If-Modified-Since, If-None-Match, Pragma`(关联304装态码)

代理相关：`Via, X-Real-IP, X-Forwarded-For`

重定向相关：`Location, Refresh`

Cookie相关：`Set-Cookie, Cookie`

安全, 跨域：`balabala`

#### Cookie选项

`Cookie: a=b;c=d`
`Set-Cookie: a=b;HttpOnly;SameSite=Strict;Domain=.xxx.com;Max-Age=805520;Expires=22222;Path=/;Secure `

#### 大文件传输

1. 一般传输: `Content-Length: 11112`
2. 分块传输: `Transfer-Encoding: chunked`, 文件长度可能变化，比如flv视频直播文件
3. 范围请求：服务端通过`Accept-Ranges: bytes`告知客户端可以进行范围请求 --> 
            客户端通过`Range: bytes=x-y`进行范围请求 -->
            服务端发送`Content-Range: bytes x-y/length`, 状态码`206 Partial Content`
            支持多段传输，服务端返回的`Content-Type`变为`multipart/byteranges`

#### 三次握手和四次挥手

1. TCP分段结构

Sport + Dport + Sequence Number + Acknowledge Number + Header Length + 标志位（URG, FIN，SYN，ACK，PSH，RST） + Window Size + 校验和 + Urgent Pointer + Options + 数据体

2. 握手过程
Host1 SYN=1（是否正在同步）, ACK=0（是否确认）, seq=x （我自己的序列号）
Host2 SYN=1, ACK=1, seq=y, ack=x+1 （我接收到的序列号+1）
Host1 SYN=0, ACK=1, seq=x+1, ack=y+1

3. 挥手过程
Host1 FIN=1
Host2 ACK=1
Host1收到后释放连接
Host2 FIN=1
Host1 ACK=1
Host2收到后释放连接
为了避免两军对垒问题，挥手需要四次
TCP协议是全双工的

#### TCP与UDP

* TCP
可靠的传输方式
可让应用程序简单化，程序员不必进行错误检查、修正工作

* UDP
降低对计算机资源的需求
本身提供了数据完整性的检测
传递的并非关键性数据
一对多方式，必须使用UDP

#### DNS查询

本机hosts文件 --- 操作系统缓存 --- 浏览器缓存 --- 非权威DNS服务器（比如各大运营商平台的服务器） --- 

根域名服务器 --- 顶级域名服务器 --- 权威域名服务器

#### Cookie、Session、Token

* Cookie在浏览器端存储，Session在服务端
* Session的运行依赖Session-Id，这个Id一般存储在Cookie中；如果浏览器禁用了Cookie，Session也随之失效（当然也可以通过url携带Session-Id
* Session可以放在文件、内存、数据库里
* 用户验证这一场合一般使用Session或Token
* Token的生成：A用户提供{user: A, password: ****}登入 --- 服务器使用一个算法生成加密A的用户名得到token --- 服务器返回token给客户端 --- 客户端再次访问时携带token --- 服务器通过加密算法解析token得到用户名 --- 进行操作
  token是无状态的，更加方便，省去了Session的开销

### 签名、证书、指纹、公钥、私钥

证书：
1. 包含主体、发布者、发布时间、有效止期、公钥（这所有的内容设为A）
2. 对A使用指纹算法求指纹（指纹算法和指纹加一起为B）
3. 使用**证书发布者**的私钥对B进行加密，得到C
4. 把A和C放在一起，形成最终的证书

### CDN相关问题


