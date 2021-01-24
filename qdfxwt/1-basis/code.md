问题集合：

1. 实现字符串模板
2. 实现大数相加、相乘
3. 常用的尺寸
4. 拖拽API要会
5. 基本的dom API要会
6. async Promise系列

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

#### async Promise系列

* 手写LazyMan（微信面试题）
`LazyMan('xiaoming').sleep(10).eat('apple').eat('pear').sleepFirst(2)`

* async函数内两个await并行（虾皮面试题）
```js
async function foo () {
    var a = new Promise((resolve, reject) => {
        console.log('a')
        setTimeout(resolve, 3000)
    })
    var b = new Promise((resolve, reject) => {
        console.log('b')
        setTimeout(resolve, 4000)
    })
    var t = new Date()
    await a
    await b
    console.log(new Date() - t)
}
```

* async拆解

```js
async function foo() {
  part1
  await part2.then(part3)
  part4
  await part5.then(part6)
}

// 等价于
[ part1 + part2 ].then[ part3 ].then[ part4 + part5 ].then[ part6 ]
```
