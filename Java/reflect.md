1. Class 类

class / interface 的本质其实是数据类型，都是Class的实例；Class类型是一个final class且只有JDK可以调用它。

以String类为例，当JVM加载String类时，它首先读取String.class文件到内存，然后，为String类创建一个Class实例并关联起来：`Class cls = new Class(String);`

Class实例在JVM中是唯一的，一个Class实例包含了该class的所有完整信息:

```
Class Instance  ------------------->  String
name = "java.lang.String"
package = "java.lang"
super = "java.lang.Object"
interface = CharSequence...
field = value[], hash, ...
mathod = indexOf(), ...
```

2. 获取一个class的Class实例的三种方法：

- 直接取class的class属性，如`String.class`
- 调用实例的getClass方法，如`s.getClass()`
- 通过路径拿到，如`Class.forName("java.lang.String")`

3. 动态加载特征

JVM在读取到class之后才会加载它，不会在开始执行的时候就加载，所以可以做一些条件加载的事情，如代码运行到某处检测是否存在某个class，如果不存在则加载另外的class。

4. 动态获取字段

```java
PackClass pc = new PackClass("dododo");
System.out.println(pc.getName());
try {
    Field f = pc.getClass().getDeclaredField("name");
    // name是private字段，这一步设置为可访问，否则报 IllegalAccessException
    f.setAccessible(true);
    System.out.println(f.get(pc));
} catch (NoSuchFieldException e) {
    e.printStackTrace();
} catch (IllegalAccessException e) {
    e.printStackTrace();
}
```

注意可以直接获取到`private`属性，但是很繁琐，这个是提供给类库和底层使用的绕过办法，目的是可以获取到任意值的某个属性，即`any.name`

5. 动态获取方法

```java
PackClass pc = new PackClass("doi");
Method m1 = Class.forName("sj.PackClass").getDeclaredMethod("printMe"); // 重载参数
Method m2 = Class.forName("sj.PackClass").getDeclaredMethod("printMe", String.class);
Method m3 = Class.forName("sj.PackClass").getDeclaredMethod("printMe", String.class, String.class);
// setAccessible 可能会被安全程序拦截而报错
m1.setAccessible(true);
m2.setAccessible(true);
m3.setAccessible(true);
m1.invoke(pc);
m2.invoke(pc, "idea");
m3.invoke(pc, "idea", "power");
```

如果想要调用`static`方法，invoke第一参数固定传`null`

6. 创建对象

- `Person.class.newInstance()` 这种方式无法传入任何参数，且构造器必须是public的
- `Constructor c = Person.class.getConstrctor(int.class); c.newInstance(222)` 这种方式可以自由获取指定参数形式的构造器

7. 获取父类/实现的接口

- `Person.class.getSuperclass()`
- `Person.class.getInterfaces()`


