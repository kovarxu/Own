## 学习koa和nodejs的记录

### nodejs与koa

nodejs提供的接口都很底层很基础，所以需要第三方提供一个应用的上层设施。

Koa整合了nodejs的api，形成了一个基本的请求-应答模型。

Koa搭配第三方插件使用，达到定制化的目的。

### nodejs核心模块

- fs 文件操作
- path 路径操作
- url 路径解析
- net TCP服务器
- http HTTP相关
- zlib 解压/压缩gzip文件
- child_process 子进程管理

Buffer、process 全局模块

### koa核心

四个模块：app、ctx、request、response 程序内部通过 Object.create 实现继承

request模块包含
