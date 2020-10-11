## awk

awk是强大的文本处理软件，甚至是一门编程语言

在文件中执行awk: 
```sh
#!/bin/awk -f
BEGIN {print 'begin'}
{print $0, "\t", $3}
END {print 'end'}
```

`print a b` vs `print a, b` 前者打印`ab`组合，后者先打印`a`，然后打印`OFS`，再打印`b`

```sh
awk 'print $2' # 自动附加行间隔符
awk '{printf("%d\n", $2)}' # 格式化
```

* 格式化方式

`% + fill-direction + separator + [,decimal] + size + type`

eg: `awk '{printf("%-010.4f", $2)}'` 打印出 2000.0000

* 支持的运算符号

`+ - * / % <space>` space可以用于连接字符串

`++ -- += == != =` 类似C语言

`~ !~` 是否匹配正则表达式

`&& || !` 逻辑运算符

`print printf` 打印内容，后者可以指定格式打印

* 内置变量

    * $0: 改行的值
    * $1-9 列的值，默认空格或制表符分割
    * FS: separator 间隔符
    * OFS: 输出的间隔符
    * NF: number of fileds 该行列的数量
    * NR: number of records 当前行(记录)号
    * RS: record separator 记录分割符, 默认为换行符
    * ORS: 输出记录分隔符
    * FILENAME: 文件名称

* 内置数学函数

`cos, exp, rand, srand, atan2, sin, log, int...`

产生随机数：先运行`srand(), 再执行rand(), 默认产生 0-1 之间的随机数`

* 内置字符串函数

`index(str, index), length(string), split(string, array, separator), substr(string, position, length)`

split返回切分的段数，结果放在array中

`sub(reg, replacement, string), gsub(reg, replacement, string), match(reg, string)`

sub和gsub返回发生作用的位置

sub实例: `echo 'abcdefg' | awk '{line=$0;sub(/a/, "bbb", line);print line}'`

* 关联数组

直接使用`user["name"]` 就可以, 初始值是0

* `exit` 退出程序 `next` 此行结束，开始处理下一行

* 自定义函数

```sh
function foo(message) {
  # do something
} 
```

* system执行bash命令，返回程序exit的值

* getline读取行，可以利用 `while (l = getline < filename) {}` 这种写法持续读取新的行
