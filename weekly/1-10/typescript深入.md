## 深入理解typescript

本文是《深入理解typescript》这本书的学习笔记

### 项目

#### tsconfig.json

运行tsc，ts会在当前目录及父目录寻找这个配置文件

[配置项](https://jkchao.github.io/typescript-book-chinese/project/compilationContext.html#typescript-%E7%BC%96%E8%AF%91)见官网

### 类型系统

#### @types

各种库自己的type定义，如`npm install -S @types/jquery`

在`tsconfig.json`文件中引入配置项：

```json
{
  "compilerOptions": {
    "types" : [
      "jquery"
    ]
  }
}
```

#### 环境声明

声明文件的定义：`xxx.d.ts`文件，如果一个文件有扩展名 .d.ts，这意味着每个根级别的声明都必须以 declare 关键字作为前缀。

意义：
* 环境声明就好像你与编译器之间的一个约定，如果在编译时它们不存在，但是你却使用了它们，程序将会在没有警告的情况下中断。
* 环境声明就好像是一个文档。如果源文件更新了，你应该同步更新。所以，当你在运行时有新的行为时，如果没有去更新环境声明，编译器将会报错。

#### 接口

接口一种标准用法是在`x.d.ts`中定义用得到的属性，接口是可以扩展的

类可以实现接口`class Apple implements Fruits { }`

#### 泛型


