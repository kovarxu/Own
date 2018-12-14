### 字符串与编码

* ``Unicode使用2字节表示1个字符，遇到生僻使用4字节；UTF-8使用1-6个字节表示1个字符，涵盖了ASCLL字符集
* Python3内存使用Unicode编码(`str`类型)
* Python3磁盘可以使用Utf8、GBK等格式(`bytes`类型)
* `\u4e2d\u6587 // 中文` 可以使用这种方式表示中文
* `b'\xe4\xb8\xad\xe6\x96\x87'.decode('utf-8', errors='ignore')` 将utf-8编码的bytes解码为str
* `len('中文'.encode('utf-8')) // 6` 将str编码为bytes

### 基本操作

* `if...elif...else...`
* `input()`返回的是str类型的数据，直接拿去做运算会出错的
* `for name in nameList:` `for x in range(10):` `while true:`
* dict 和 set是两种常用的数据结构，dict类似js里面的对象

