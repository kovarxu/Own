1. 字符串方法对应

字符串是不可变的

|java|js|
|:--:|:--:|
|length()|length|
|equals() / equalsIgnoreCase()| === |
|contains()|indexOf() > -1|
|trim() / strip()|trim()|
|replace()|replace(//g)|
|split()|split()|
|String.join('.', array)|join()|
|s.formatted / String.format|``|
|String.valueOf() / toCharArray()|String()|

2. StringBuilder

字符缓存，是可变的，常用方法为 `append, toString`

3. 包装类型

装箱和拆箱：java.lang.Boolean, java.lang.Integer, java.lang.Short 等

- 装箱后不可变，比较只能用`equals`不可以用`=`
- 推荐使用工厂方法生成新实例，如`Integer.valueOf(s)`, 给编译器留缓存优化的空间
- 包装类上有一些实用方法可用

4. JavaBean

自动生成 getter/setter，比较方便，【操作：鼠标右键 -- Generate】

5. Enum

Enum也是个class

用法
```java
enum Weekday {
  SUN, MON, TUE, WED, THU, FRI, SAT;
}

Weekday.SUN.name(); // SUN 返回名称
Weekday.SUN.ordinal(); // 0 返回顺序
```

原理
```java
// 不允许继承
public final class Color extends Enum {
  // 每个成员都是唯一的实例
  public static final Color RED = new Color();
  public static final Color BLUE = new Color();
  public static final Color GREEN = new Color();
  // 不允许手动创建实例
  private Color() {

  }
}
```

扩展
```java
enum MyEnum {
  TK(1), TR(4), TD(5);
  private final int dayValue;
  private MyEnum(int dayValue) {
    this.dayValue = dayValue;
  }
}
```

6. record (JDK 14以上才支持)

生成不可变类

```java
public record class Point {
  public Point (int x, int y) {
    if (x < 0 || y < 0) {
      throw new IllegalArgumentException();
    }
  }
}
```

7. 常用工具类： Math, Random, SecureRandom

8. Logging 标准库

好处：
- 设置日志输出样式
- 定制输出级别
- 重定向到文件
- 按照包名控制日志级别

不好的地方：
- JVM启动时需要读取配置文件初始化
- 一旦运行main方法，就无法修改配置
