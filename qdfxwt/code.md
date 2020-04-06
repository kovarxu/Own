问题集合：

1. 实现字符串模板
2. 实现大数相加、相乘
3. 常用的尺寸
4. 拖拽API要会
5. 基本的dom API要会

#### 常用的尺寸

ele.clientWidth / ele.clientHeight  
可视尺寸，包含padding和content

ele.offsetWidth / ele.offsetHeight  
内容区域大小，包含border, padding和content

ele.clientTop / ele.clientLeft
等于border的宽度

ele.offsetTop / ele.offsetLeft
内容区域顶部到`offsetParent`内容区域（不含border）的距离

ele.getBoundingClientRect()
返回的width和height是内容区域的大小，还有left和top表示距离视口的尺寸

#### 拖拽API

* dragstart, drag, dragend | dragover, dragenter, dragleave, drop
* 注意拖拽文件的时候需要在document的dragover, drop; container的dragover上取消默认事件的执行
