
### 缓存控制
------------------

Cache-Control

#### 响应头
|字段|说明|
|:--:|:--:|
|max-age|在本地缓存多久|
|s-maxage|在代理缓存多久|
|private|仅在客户端能缓存，代理不可以缓存|
|public|代理也可以缓存文件|
|must-revalidate|过期后必须回源服务器验证|
|no-store|不允许缓存|
|no-cache|可以缓存文件，但是要验证后才能用|
|proxy-revalidate|只要求代理的缓存过期后必须验证，客户端不必回源|
|no-transform|不对缓存数据做优化|

#### 请求头
|字段|说明|
|:--:|:--:|
|max-age|要求缓存时间在x秒内|
|max-stale|可以允许缓存过期x秒|
|min-fresh|要求缓存x秒内不能过期|
|no-store|不允许使用缓存|
|no-cache|验证后可以返回缓存的文件|
|no-transform|不对缓存数据做优化|
|only-if-cached|只使用缓存内的数据|

#### 头字段

1. Vary, 内容协商结果, 用于缓存识别
2. Age, 报文在缓存中呆了多久
3. Etag & Last-Modified / If-None-Match & If-Modified-Since


### 代理
------------------

代理既是客户端，也是服务器

#### 作用

1. 健康检查：使用“心跳”等机制监控后端服务器，发现有故障就及时“踢出”集群，保证服务高可用；
2. 安全防护：保护被代理的后端服务器，限制 IP 地址或流量，抵御网络攻击和过载；
3. 加密卸载：对外网使用 SSL/TLS 加密通信认证，而在安全的内网不加密，消除加解密成本；
4. 数据过滤：拦截上下行的数据，任意指定策略修改请求或者响应；
5. 内容缓存：暂存、复用服务器响应；
6. 负载均衡（随机轮询、一致性hash、最近最少使用、链接最少...）

#### 头字段

1. Via, 经过的代理**域名**
2. X-Forwarded-For, 经过的代理**IP**, 注意这种方式每经过一层代理就修改一次header, 效率非常低下
3. X-Real-IP, 客户端IP
（**这些头在代理中都能随意改，不可信**）

#### 代理协议

v1版本在HTTP请求之前加了一行ACSII字符，如：`PROXY TCP4 1.1.1.1 2.2.2.2 55555 80\r\n`表明从客户端`1.1.1.1:55555`发往客户端`2.2.2.2:80`一个请求

代理协议并不支持 X-Forwarded-For 头

### Cookie机制
------------------

#### 头字段

1. Set-Cookie: key=value 响应头设置cookie, 有多条
2. Cookie: a=b;c=d 请求头发cookie, 只有一条

#### 属性

|属性|说明|
|:--:|:--:|
|Max-Age|相对时间，单位是秒|
|Expires|过期时间，用的是绝对时间点，可以理解为“截止日期”|
|Domain|发送cookie的域名|
|Path|cookie适用的路径范围，一般为/|
|HttpOnly|浏览器的JS引擎禁用document.cookie等一切相关的API，可以防止XSS攻击|
|SameSite=Strict|严格限定Cookie不能随着跳转链接跨站发送|
|Secure|这个Cookie仅能用HTTPS协议加密传输，明文的HTTP协议会禁止发送|

### 重定向
------------------

#### 状态码

301 Moved Permanently 永久重定向
302 Found 暂时重定向（301-302浏览器有定向优化）
303 See Other 类似302，但重定向后使用GET请求，避免PUT/POST重复提交
307 Temporary Redirect 类似302，但重定向后请求里的方法和实体不允许变动，含义比302更明确
308 PermanentPermanent Redirect 类似 307，不允许重定向后的请求变动，但它是301“永久重定向”的含义。

#### 响应头

1. Location, 要跳转的URL，可以为相对或绝对地址
2. Refresh: 5s, url=xxx, n秒后跳转
3. Referer / Referer-Policy: 来源，避免盗链（CSRF攻击）

### 持久连接
------------------

HTTP1.1默认开启持久连接

#### 头部字段

1. Connection: keep-alive 服务器告诉浏览器支持持久连接
2. Connection: close; 服务器/客户端告诉对方关闭持久连接

服务器端可以设置多长时间或者多少个请求之后关闭持久连接

如 Nginx 设置 keepalive_timeout & keepalive_requests

#### 队头阻塞

一收一发容易造成这种问题，一个阻塞造成全部之后发的请求停滞

使用**并发连接**可以解决此类问题，因为它多开了几个线程用于请求，但是浏览器针对一个域名最多允许6-8个请求，于是有了**域名分片**技术，多开几个域名以量取胜

### 传输大文件
------------------

#### 数据压缩

##### 头部

1. Accept-Encoding: gzip, deflate, braccept
2. Content-Encoding: xxx

#### 分块传输

服务器不直接发送`Content-Length`，因为这个文件的长度可能是变动的（比如直播的flv文件）

服务器发送的报文格式是：

长度\r\n + 数据块\r\n + 长度\r\n + 数据块\r\n + ... + 0\r\n + \r\n

使用 `Transfer-Encoding: chunked` 来表明这是一个分块传输，所以这个头与`Content-Length`互斥


#### 范围请求

适用于超大文件的传输

服务器使用`Accept-Ranges: bytes`告知客户端可以使用范围请求

客户端发送`Range: bytes=x-y` 进行范围请求

服务器根据客户端发送的范围来进行：

1. 如果客户端发送的`Range`超限，返回`416 `，表明请求范围有误
2. 发送`206 Partial Content`表明是原始数据的一部分；发送`Content-Range: bytes x-y/length`

有了范围请求之后，`HTTP` 处理大文件就更加轻松了，看视频时可以根据时间点计算出文件的 `Range`，不用下载整个文件，直接精确获取片段所在的数据内容。

不仅看视频的拖拽进度需要范围请求，常用的下载工具里的多段下载、断点续传也是基于它实现的，要点是：

- 先发个 `HEAD`，看服务器是否支持范围请求，同时获取文件的大小；
- 开 N 个线程，每个线程使用 `Range` 字段划分出各自负责下载的片段，发请求传输数据；
- 下载意外中断也不怕，不必重头再来一遍，只要根据上次的下载记录，用 `Range` 请求剩下的那一部分就可以了。

##### 多段数据

Range支持多段数据一起请求，例如`Range: bytes=0-10, 26-36`，注意这个范围应该是原文件的字节范围而不是压缩后的文件的范围

此时服务端返回的mime类型应变为`multipart/byteranges`, 且应该给出一个数据分隔符字段boundary，例如：

返回的报文格式是：

--boundary\r\n + 报文1（包含头和数据体） + --boundary\r\n + 报文2 + ... + --boundary\r\n（结束）

### 实体字段
------------------

内容协商中逗号的优先级高于分号（q是协商优先级）

* mime类型

Accept: text/html,application/xml,image/webp,image/png,*/*;q=0.8

Content-Type: text/html

* 编码类型

Accept-Encoding: gzip, deflate, br

Content-Encoding: xxx

* 语言

Accept-Language: zh-CN,zh;q=0.9,en;q=0.8

Content-Language: **一般不发，因为使用的语言完全可以由字符集推断出来**

* 字符集

Accept-Charset: 一般不发，因为现代浏览器对字符集的支持比较全

Content-Type: text/html; charset=utf-8

* 协商结果

Vary: Accept-Encoding,User-Agent,Accept

表示服务器依据了Accept-Encoding、User-Agent和Accept这三个头字段，然后决定了发回的响应报文。这个字段在缓存中也有用处，缓存根据url和Vary的md5值返回相应的缓存数据。

服务器如果不接受此类请求格式，可以返回`406 Not Acceptable`响应

* 内容处理类型

服务端返回 Content-Disposition: attachment; filename=pic.jpg 表示客户端应该下载此文件而不是打开

客户端 form 的 enctype 属性如果选择了 multipart/form-data（要上传文件），则此时POST body里面的格式是：

--{delimiter}\r\n
Content-Disposition: form-data; name={form-item-name}\r\n
\r\n
{form-item-value}
...
--{delimiter}\r\n

此时 Content-Type: multipart/form-data; boundary={delimiter}


### 浏览器和代理添加字段
------------------

`Upgrade-Insecure-Requests: 1` 浏览器可更换到https

`Proxy-Connection`: 这是fiddler代理了浏览器请求后，浏览器为了健壮性发出的。对于中间结点不能理解 Connection: keep-alive 的设备，盲目转发这条header将使得浏览器和服务器挂起。浏览器发出 Proxy-Connection 时对于理解这个的中间结点，处理后将 Connection 发给服务器，而对于不能理解的节点也是直接转发 Proxy-Connection，这时服务器不理解这个就不会创建持久连接 。其实仅对（C-old P-S）这种模型有用。

## HTTPS

HTTPS = HTTP over SSL/TLS

SSL 即安全套接层（Secure Sockets Layer），在 OSI 模型中处于第 5 层（会话层）

密码套件基本的形式是“密钥交换算法 + 签名算法 + 对称加密算法 + 摘要算法”

如“ECDHE-RSA-AES256-GCM-SHA384”，握手时使用 ECDHE 算法进行密钥交换，用 RSA 签名和身份认证，握手后的通信使用 AES 对称算法，密钥长度 256 位，分组模式是 GCM，摘要算法 SHA384 用于消息认证和产生随机数。

OpenSSL 是著名的开源密码学工具包，是 SSL/TLS 的具体实现。

实现安全的要素：机密性、完整性、身份认证、不可否认（不能抵赖）

### 对称加密和非对称加密

对称加密的加解密密钥相同，常用AES（Advanced Encryption Standard）和ChaCha20

对称加密有分组模式

非对称加密有两个密钥，一个叫“公钥”（public key），一个叫“私钥”（private key）。两个密钥是不同的，“不对称”，公钥可以公开给任何人使用，而私钥必须严格保密。

RSA非对称加密基于整数分解的数学难题，现在认为2048位才安全

ECC（ECDHE，ECDSA）基于椭圆曲线离散对数的数学难题，急需要几百位即可保证安全

混合加密：
1. 先用随机数产生算法生成会话密钥(session key)，用公钥加密后传到服务器，服务器用私钥解密得到会话密钥
2. 双方通过该秘钥使用对称加密通信

### 签名和证书

加密满足了机密性，但是信息的完整性、身份认证、不可否认还没有实现

摘要算法（digest algorithm）即散列/哈希算法实现了完整性，有MD5、SHA1、SHA2等；在通信中使用“明文+摘要”的传输模式

数字签名同时实现“身份认证”和“不可否认”。数字签名的原理其实很简单，就是把公钥私钥的用法反过来，之前是公钥加密、私钥解密，现在是私钥加密、公钥解密。

### TLS1.2握手的过程

1. C-S，SYN 
2. S-C，SYN + ACK（seq=1表示回复对方希望接收的序列号为1，ack=233表示自己希望接收的序列号为233）
3. C-S，ACK
4. Client Hello 客户端发送 TLS版本号、密码套件列表、随机数及扩展列表
5. S-C，ACK
6. Server Hello 服务端发送 随机数、TLS版本号和选择的密码套件
7. 服务端发送 使用的证书
8. 秘钥交换算法参数，并签名认证
9. 服务器Hello完成
10. C-S，ACK
11. 客户端秘钥交换参数
12. 客户端和服务端都通过算法算得pre-master，然后通过交换的随机数和 pre-master 算得 master secret，然后通过函数得到客户端和服务端发送信息分别用的会话秘钥（对称加密使用）
12. 客户端发送 Change Cipher Spec，今后通信使用会话秘钥加密，并发送握手摘要
13. S-C，ACK
14. 服务端发送 Change Cipher Spec，今后通信使用会话秘钥加密，并发送握手摘要

第一个往返：TCP握手两次
第二个往返：客户端确认TCP握手，并完成密码套件的选择，TLS版本、随机数的交换
第三个往返：交换ECC算法参数，完成握手

第`10`步的认证很重要：首先检验服务器发来的证书的合法性，然后通过公钥解锁从第`8`步取到的签名，得到并验证服务端ECC参数

### 签名、证书、指纹、公钥、私钥

证书：
1. 包含主体、发布者、发布时间、有效止期、公钥（这所有的内容设为A）
2. 对A使用指纹算法求指纹（指纹算法和指纹加一起为B）
3. 使用**证书发布者**的私钥对B进行加密，得到C
4. 把A和C放在一起，形成最终的证书
