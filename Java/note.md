# 浙大 面向对象程序设计课的笔记
https://www.icourse163.org/learn/ZJU-1001542001?tid=1458169441#/learn/content

## 一、类与对象

用 new 运算符创建对象，用 class 关键字定义类

成员变量和成员函数：

%%%%%%%%%%%%%%%%
%   Fraction   %
%%%%%%%%%%%%%%%%
%   private a  % 
%   private b  %
%%%%%%%%%%%%%%%%
%     add      % 
%    minus     % 
%    multy     % 
%     div      % 
%%%%%%%%%%%%%%%%

类的初始化方法和重载：

```java
public class Fraction {
  int a;
  int b;

  Fraction () {
    this.b = 1;
  }

  Fraction (int a, int b) {
    this.a = a;
    this.b = b;
  }
}
```

## 二、对象交互

### 访问属性

private: 类内部可以访问，类的 main 方法里面可访问，类方法如果参数也是该类型的实例，可访问该实例的 private 属性

public: 公开访问权限

不加(friendly): package内可访问

### package

Java中一个目录对应一个包，如 `import java.util.Scanner` 表示 `Scanner` 这个类位于 `util` 目录之下

一个.java文件叫做一个编译单元，一个编译单元中最多只能有一个 public class, 但是可以有多个class，如果存在 public class，则文件的名称必须是 `[classname].java`

### 类变量和类方法

用`static`标明的是类上具有的属性和方法，可以通过`Instance.xxx`或者`Klass.xxx`来访问，在 main 方法中可以直接使用类方法

## 三、对象容器

顺序容器：`ArrayList`, 一般使用`ArrayList<String> a = new ArrayList<String>()`

集合容器：`HashSet`

散列表：`HashMap`注意HashMap内部只能形成 对象 -- 对象 的映射关系，如果用基本类型做 key，则默认会自动转化成对应的包装类型。

```java
public class Some {
  HashMap<Integer, String> h = new HashMap<Integer, String>();
  public static void main(String[] args) {
    Some s = new Some();
    s.h.put(1, "kkk");
    s.h.put(2, "jjj");
    System.out.println(s.h);
  }
}
```

*类定义 `public String toString` 方法可以在输出等场景转化为字符串时自动调用

## 四、继承与多态

继承使用关键字`extends`, 子类中可以使用`super`指代父类，子类的构造器中需要在第一行调用`super`

多态：Item类型的变量可以赋值为DVD和CD等类型的数据而不报错，因为它们是Item的子类，这种行为叫做向上造型

向上造型一直是正确的，但是向下造型并不总是正确的

`@Override` 重写，子类可以重写父类的方法

所有对象的继承基类是`Object`, 它提供了`equals、toString`等方法

## 五、设计原则

消除代码复制：提取公共函数

封装：数据可见性控制

可扩展性：尽量使用散耦合的数据结构

Java中函数不是第一类对象，所以需要额外的手段实现诸如js中“遍历函数数组”的能力

## 六、抽象与接口

abstract class 不可以生成实例，可以被其他类型继承

abstract 成员函数只包含函数签名，需要被子类实现

数据与表现分离：数据层防止所有的棋子状态，表现层可以实现为Java原生、网页等

责任驱动程序设计：将程序的功能分配到合适的类里面去做

细胞自动机例子：

Cell <-- Field  <-- View

狐狸兔子例子，较为复杂：

Animal -- (Fox && Rabbit) // 这里可以交给A开发

Field <-- View // 这里交给B开发

Cell 比较尴尬，他表示一个格子，格子上可能是狐狸或兔子，而狐狸和兔子继承自Animal

OOP语言，除了 C++ 都不支持多继承

A和B可以依靠**接口Cell**联系

接口是纯抽象类，所有的成员函数都是抽象函数，所有的成员变量都是`public static final`

一个class可以`extends`一个类型，但是可以`implements`很多个接口

## 七、控制反转和MVC

控制反转 --- 回调函数

内部类：类内部的类、函数内部的类

内部类可以访问类的变量和方法，但是函数的内部类只能访问函数的final变量

匿名类：

```java
// ActionListener 是一个接口
btn.addActionListener(new ActionListener() {
  @Override
  public void actionPerformed(ActionEvent e) {
    // do something
  }
})
```

MVC：View层只需要管理好如何重绘就可以了，所以它知道Modal；Modal集中管理所有数据，Modal层和View层之间通过接口协议约定好，Control指的是用户操作，操作触发控制反转导致 Modal 层数据变化，并因此触发View层的更新。

在MVC设计模式中，Control并不直接跟View打交道，而是通过变更Modal间接更新视图。

转变：Control事件 -> 控制反转 -> Modal.setValue -> View.repaint

MVC：以课程表为例，表格有三个实体：JTable 类、TableData 类和 TableModel 接口

TableData 需要实现 TableModel 接口，在接口中定义好各个方法供View层调用。其中 getColumnName, getRowCount, getColumnCount, isCellEditable 等决定了表格的属性，getValueAt, setValueAt 给出了数据变更动作，而 addTableModelListener, removeTableModelListener 可以新添加或移除 View。
在这个实现中，View层和Control层被放在了一起，即都位于 JTable 类中（这是一种常见的MVC实现方式）。

服务端MVC：

1. 浏览器发送request
2. Controller接收到消息，调用Modal层接口变更数据
3. Controller调用View层接口更新视图（渲染出页面）
4. 发送页面字符串给浏览器

在此过程中，C层很厚，M和V则很薄，且M和V互相不知道对方的存在

## 八、异常和捕获

为函数/类添加异常：`public void openFile() throws OpenException, CloseException {}`

所有异常继承自`Exception`类，它又继承自`Throwable`

在`try...catch...`语句结尾可以加上`catch(Exception){...}`表示捕获通用错误

子类重载的父类方法不能抛出比父类方法更多的异常，因为多态性`Super s = new Child(...)`这种向上造型是可以的，而编译器无从得知s变量可以抛出子类方法中新增的异常，因此也不能被识别捕获到.

完善的异常和捕获机制的好处：1. 便于扩展，程序在v1.0就定义好有可能抛出的异常，以后的迭代中可以抛出预先定义好的异常而不用担心crash；2.对于线性任务不需要将每步都包含在if语句中，集中处理异常就可以

### Ex、流

InputStrem、OutputStream  (只能做字节层面的读写)

从流中读取`System.in.read(byteArray)`

流只操作二进制的数据流，需要结合DataInputStream、BufferedOutputStream等过滤器才能处理基本数据类型

