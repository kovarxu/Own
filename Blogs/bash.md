### bash基础语法

* `yourName=mark`定义变量，不能有空格
* `unset yourName`删除变量
* `readonly yourName`只读变量
* `echo $yourName`引用
* `echo ${#yourName}`字串长度
* `echo \`expr length "${yourName}"\``长度
* `${yourName:1:2}`从第1位置开始取2个字符
* `${yourName:0-1}`从倒数第1位置取到结束
* `echo \`expr index "${yourName} rj"\`` 获取第一个r或j的位置
* `blit=(1 2 5)`定义数组
* `echo ${blit[@]}`打印数组
* `echo ${#blit[@]}`打印数组长度
* `echo "Hello"$yourName"world"`拼接字符串
* ""和''的区别：后者不会对其中的变量作出赋值操作，也不会转义字符
* `#`, `:<<EOF ... EOF`添加注释
* `read -p "input an integer: " a`从键盘获取整数a
* `echo \`date\``显示命令执行值
* `echo "${yourName}" > file`输出到文件
* `grep "hello" test.c hello.sh`查找文件包含行
* `sed '1s/hi/hello/g' file`文件行批处理，有众多参数

### 外部传参

* `$0, $1, $2, ..`分别表示文件名，各个参数
* `$#, $* $@`分别表示参数个数，参数合并字符串和参数列表
* ``

### 运算符

* `[]`计算其中的值，运算符需要使用`-xx`类型的东西 `$[ 1 + 2 ]`得到3
* `[[]]`计算其中的值，运算符使用类似高级语言的运算符
* `-z`长度为0返回true, `-n`反之
* `-d file, -f file, -e file, -w file, -x file, -s file`分别对应是否目录？文件？存在？可写？可执行？为空？
* 条件操作
```sh
if [ $var = "aaa" ] 
then
  echo "$var"
elif [ $var = 'bbb' ]
  echo "hello${var}bug"
else
  echo "not eq"
fi
```
* 循环操作
```sh
for (( i=0;i<5;i++ )) do
  echo $i
done

for i in 1 2 3 4 5 do
  echo $i
done

index=1
while (( index<6 )) do
  echo $index
  let index++
done

```

### 函数
* 先定义才能用
* 引用直接给名字即可
* 直接在后面跟东西传值
* 函数内使用`$1 $2 $3 ... ${10}...`获取参数值
* 使用`$?`获取函数返回的值，return的值范围`0-255`
```sh
foo(){
  read -p "give your first name: " firstName
  read -p "give your second name: " secondName
  if [ ${firstName} = "Jack" ]
  then
    echo "forbid first name: "${firstName}
    return 4
  else
    echo "your full name is: "${firstName}${secondName}
    # 可不写 return 0;
  fi
}

foo
echo "return: $?"
```

### 重定向

* `command/n > file`内容或文件录入文件
* `command/n >> file`追加
* `command/n < file`输入重定向
* `n >& m`输出文件n和m合并
* `n <& m`输入文件n和m合并
* `0, 1, 2分别表示stdin, stdout, stderr`
* `. ./one.sh`包含一个sh脚本
