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

### 高级特征

* `[x * x for x in range(1, 11) if x % 2 == 0]` 列表生成式
* `iterable` 和 `iterator`，凡是可以作用于for的都是iterable，能使用`next(*)`的为iterator，Iterator为惰性计算的序列，可以是无穷的，可以使用`iter(list|tuple|string)`等生成
* `map/reduce/filter`调用方法: `filter(f, iterable)`，使用reduce需要先从functools中导入
* `sorted`函数`sorted([], key=f, reverse=True)`自定义排序
* `lambda x: x*x` lambda匿名函数
* `@`装饰器 python使用的是pattern2

    // pattern 1 直接调用
    function logger (func, ...arg) {
        console.log(func.name + ' is executed by logger1 ...')
        return func.apply(null, arg)
    }

    // pattern 2 返回闭包
    function loggerWrapper (func) {
        return function (...arg) {
            console.log(func.name + ' is executed by logger2 ...')
            return func.apply(null, arg)
        }
    }

* 调用方式: `@log; def now(): print('hello');` `@log('fuck'); def now(): print('hi');`
* 定义方式:

    def log (text):
        def decorator (func):
            @functools.wraps(func) // 需要import functools，修正包装后的f.__name__
            def wrapper (*args, **kw):
                print('%s %s():' % (text, func.__name__))
                return func(*args, **kw)
            return wrapper
        return decorator