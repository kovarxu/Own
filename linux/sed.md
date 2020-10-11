## sed

sed善于处理文件的行

基本形式：

`sed <option> <address> <command>`

### 基本用法

* s 替换

`sed s/good/bad/g < old > new` 不加g则每行只匹配第一次

`echo /usr/bin/kf | sed s:/usr:/var:` 节省转义，间隔可以是`:, _, |`等

* & 匹配的子串

`echo '123 abc' | sed s/[0-9]*/& &` -> `123 123 abc`

* 扩展的正则

linux 使用 -r, Mac OS 使用 -E

* `/<n>` 和 `\<n>`

`echo 'some new hours' | sed -r 's/([a-z])([a-z]*) /\2 /'` \n 表示引用某处的字符，注意源串其他部分会被删除

`echo 'some new letters' | sed -r 's/[a-z]*/abcdcba/2'` 2表示处理匹配的第2处，它也可以和`g`连用，表示处理从第2处开始的所有匹配

* \n 和 /p

\n 不打印原来文档中有的行，/p 将发生变化的行打印出来

`sed -n /PATTERN/&/p` 可以部分代替grep的功能

* /I

无视大小写，这和grep不同，特别注意sed中的`-i`指的是原位修改文件

* -e multiple commands

`echo 'Apple Pear' | sed -e 's/A/a/' -e 's/P/p/'`

* -f read command from file

`echo -f somefile <inputfile` somefile中的每一行都自动被识别为 -e 连接

* address

`sed '<start>,<end> <regexp>'` start，end可以是数字或者正则表达式，end可以没有

* 操作符

`sed '11,$ d'` 相当于 `head 10`, d代表删除

`sed '1,10 !d` 跟上面一样，!代表反操作

`sed '11 q'` 也和上面一样，q代表程序运行到此处就退出了

`sed -e '/am/n' -e '/.*/p'` 如果没有-n, 则n代表立即把目前模式空间的内容写到output，然后读取下一行 (有点continue的意思)

* w r 写文件和附加文件

`sed '/abc/ r file' < file2` 在file2中所有包含abc的行下方均加入file的内容

```sh
`sed '/begin/, /end/ {
  /begin/n # 跳过包含begin的
  s/old/new/
}'`
```

pattern space: d 命令操作的是模式空间，r s命令直接读文件到output

```sh
`sed '/^#INCLUDE/' {
  r file
  d # 这条命令可以执行，在INCLUDE处插入文件，然后删除INCLUDE; 但是和上面一句换位置之后就不行了，因为pattern space里面的行被删除了，r命令找不到插入的位置
}`
```

* a i c 操作符用于在后方/前方新增一行，或者修改某一行

添加多行可以以`\`结尾，如果在行头加空格可以在行头加`\`，然后输入空格

`sed '/start/, /end/ a, i, c, q'` 是错误的用法，因为这几个命令都不能作用于范围

`sed '/start/, /end/ { a, i, c }` 这样是可以的，它将作用于匹配的每一行

* l y 前者打印模式空间的内容用于调试，后者改换大小写

`echo 'abcAbBCD' | sed 'y/ABC/abc/'`

* D P N 多行操作

N -- 往pattern里放入该行      n -- 输出pattern中的内容并读入一行

D -- 删除pattern中的一行      d -- 删除pattern中的所有内容  （d操作都终止该步之后的操作）

P -- 打印pattern中的一行      p -- 打印pattern中的所有内容  （均不改变pattern）

* g G h H x 空间操作

两个空间：pattern space 和 hold space

h -- 拷贝P替换H              H -- 拷贝P放在H下方

g -- 拷贝H替换P              G -- 拷贝H放在P下方

x -- 交换P和H

快捷操作：`;`

`sed -n '1!G;h;$p'` 反向打印文件的行

* 新行和\n, 搜查行结尾的时候可以在正则里面写`\n`, 但是替换的时候, 替换部分不能写`\n`, 只能以引号新加一行

* `: <tag>, b <tag> 和 t <tag>` 相当于goto，b是匹配后跳转，t是替换后跳转
