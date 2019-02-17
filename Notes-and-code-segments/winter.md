# 重学前端笔记

05 | JavaScript类型：关于类型，有哪些你不知道的细节？ 

* 一些编程规范要求使用void 0 替代undefined：因为undefined是一个变量（设计缺陷）
* 字符串的操作 charAt、charCodeAt、length 等方法针对的都是 UTF16 编码
* 浮点数大小判断：0.1 + 0.2 == 0.3 返回false，使用Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON来判断

    * parseInt(string, radix) / Number.parseInt
    以radix进制解析string，返回十进制数或NaN
    * Number.prototype.toString(radix)
    返回radix进制的Number

* Symbol.iterator: 这类型的属性构成了语言的一类接口形式
