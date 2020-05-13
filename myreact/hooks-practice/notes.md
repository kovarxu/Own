课程信息：React Hooks + Redux + PWA

前置准备

* 工具类 `node npm webpack eslint prettier(增强的代码美化工具)` 

* 语法类 `ES6 JSX CSS-flex`

* 概念类 `SPA/MPA PWA` 

* 效率类 `iconfont/webfont snippets代码片段，编辑器技巧`

* 原则类 职责分离，优化可维护性

### TODO

1. [√] Context, ContextType 练习
2. [√] lazy, Suspense, Error Boundary 练习
3. [√] componentShouldUpdate, PureComponent 练习
4. [√] memo 练习 查资料react怎么校验的属性相等
5. [√] useState 练习，调用setCount的时候传入相同的值，看看组件是否重渲染
6. [√] useEffect 练习，试试各种场景中的情形
7. [√] useContext 练习
8. [√] useMemo, useCallback 练习
9. [×] useRef 练习，思考在副作用中怎么确定一个对象与上次渲染时不一样了
10. [x] 自定义Hooks学习
11. [x] 学习一遍官网关于hooks的内容
12. [√] 利用hooks完成一个todolist实例
13. [√] 改造12中的todolist实例，分别推导出dispatch（集中管理状态变化，将变化形式固定为`{ type, payload }`格式），actionCreator（抽取一个函数返回`{ type, payload }`对象），bindActionCreators（将dispatch与上面一个函数结合起来）
14. [√] 改造13中的todolist实例，从actions中提取出reducer，把reducer拆分成以数据为维度
15. [√] 改造14中的todolist实例，actionCreator的返回值可以是一个函数`func(dispatch, state)`了, 这样action就可以获取到现有的state并进行一波比较操作；接着赋予异步能力，但是state有闭包值不更新的问题 （抽取出store，利用useEffect在todos和score发生变化时更新store）
16. [√] 复盘12-15，写点东西下来，练习一下原版redux的使用

### Qu

1. [Q] 为何render会执行两遍？[A] 与严格模式有关，concurrent模式下渲染阶段的钩子可能被执行多次，严格模式通过强制执行两次来暴露一些副作用问题 （constructor, render, setState, shouldComponentUpdate, componentWillUpdate, getDerivedStateFromProps）；函数组件和线上环境没有此问题。
2. [Q] 为何 componentDidCatch 捕获了错误还会报错？[A] 开发环境就是一闪而过然后报错，生产环境没这个问题。
3. [Q] 怎么解决父组件变了对象里的东西，子组件使用了shouldComponentUpdate钩子？ [A] 使用...或者Object.assign方法来重置对象，在使用PureComponent的场景可以使用immer库深拷贝。


#### Notes

1. 除非 shouldComponentUpdate() 返回 false，否则 setState() 将始终执行重新渲染操作。如果可变对象被使用，且无法在 shouldComponentUpdate() 中实现条件渲染，那么仅在新旧状态不一时调用 setState()可以避免不必要的重新渲染


### 创建项目

* 使用create-react-app生成项目 --- 将源设置成淘宝源才能快速下载下来
* react-scripts
* React-Dev-Tools
* npm run eject 释放所有配置文件，这样可以自由地配置编译文件

### React新特征

Context，contextType，lazy，Suspense，memo

* Context, ContextType: 效率API。使用Context.privider value提供值，使用Context.consumer消耗值，但是consumer的语法过于傻逼，在类上携带static ContextType属性即可在consumer中定义const context = this.context, 直接使用值了。

* lazy, Suspense: 性能API。

1. 使用lazy(() => import(/* webpackChunkName: "some" */ 'some-comp'))异步加载组件
2. 使用Suspense包裹组件`<Suspense fallback={<div>loading...</div>}>...</Suspense>`
3. 使用ComponentDidCatch生命周期函数捕获异常，setState进而引发error页面渲染
4. 替代3，使用static getDerivedStateFromError() 静态方法返回一个新的state，自动合并到组件的state中，更加优雅

* memo

子组件重渲染问题：父组件变化了state执行render，子组件重新渲染
一般解决方案：
* componentShouldUpdate(nextProps, nextState) 生命周期钩子函数,返回false则避免重复渲染
* extends PureComponent
坑：
* PureComponent只能比较对象的引用，无法比较深层
* 如果给子组件传入一个即时生成的函数（如使用.bind或者箭头函数生成），则子组件仍然会重复渲染
如果使用的是函数式组件，则无法继承自PureComponent，此时可以使用memo函数
用法：`const Foo = memo(function Foo(props) { return <div>{ props.person.age }</div> })`

### React Hooks

React处理复用的方式：

1. render属性：组件A（可复用部分）和组件B（将要使用A）进行拆分，组件C的render中使用组件A，传入的render属性返回组件B的引用
2. 高阶组件：组件A（可复用部分）定义在高阶组件内部，其模板中调用了传入高阶组件的形参B'来渲染模板，则组件C定义为HOC(A, B)

导致的问题：渲染属性和高阶组件导致层级冗杂 --- 生命周期函数逻辑不相干混乱，不利于拆分到更小的粒度；内联函数过度新建组件实例、类成员函数不能保证this

优化类组件三大问题：1.函数组件无this问题；2.自定义Hooks方便复用状态逻辑；3.副作用的关注点分离（所谓的副作用指的是一般在生命周期钩子中解决的Ajax请求、Storage、访问本地DOM元素

#### useState

使用：const [count, setCount] = useState(0)

或者：const [count, setCount] = useState(() => props.defaultCount || 0) // 注意这个函数只会执行一次

useState的初始化只会执行一次（React底层做了操作），它必须在第一次调用函数组件的时候调用，否则会报错

原因：React第一次调用函数组件时按useState调用顺序构建好内部的属性关系，如果后面再次渲染的时候增加新的useState或者少调用，则React无法得知哪个新增或删除，则报错

#### useEffect

副作用：生命周期钩子中解决的Ajax请求、Storage、访问本地DOM元素 等

使用：useEffect(() => {}, [])

调用时机：render之后，可以替代componentDidMount, componentWillUpdate钩子

如果参数函数返回了一个函数，则在每次注销组件时执行它，类似 componentWillUnmount 但不同

第二个参数是精髓：如果不提供，则每次组件更新都执行useEffect；如果提供一个空数组，则只在挂载时执行；如果提供的数组中有值，则只有这些元素发生了变化，才执行

#### useContext

完全可以替代`static contextType = CounterContext` ==> `const context = useContext(CounterContext)` 

而且带来了好处：可以在一个组件中使用多个contextType

但是也不能滥用，context会破坏组件的封装性

#### useMemo和useCallback

类似于memo高阶组件，useMemo主要作用于一段业务逻辑，防止它重复执行`const double = useMemo(() => count*2, [count])`第二参数跟useEffect相同的，但是useMemo不是在渲染后，而是在渲染时执行的。

如果父组件需要传一个函数给子组件: `const handleClick = useMemo(() => () => /* run some code */, [])`可以把写法改进为：`const handleClick = useCallback(() => /* run some code */, [])`

使用callback不能阻止创建新的函数，但是可以使子组件不重复渲染，从而优化了性能。

*useMemo与useCallback可以作为优化手段，不能一定保证不重复渲染，使用时需要注意。*

#### useRef

可以在两种情况下使用：需要保存组件/dom，或者需要保存一个值

#### 自定义Ref

#### Hooks原则

* 只在顶层（无条件、循环等）调用Hooks
* 只从React函数组件 或 自定义Hooks中调用Hooks

#### Hooks常见问题

对传统React编程的影响：

* 传统生命周期函数的实现

1. constructor -> useState
2. static getDerivedStateFromProps(props, state) -> useState 会死循环吗？
3. shouldComponentUpdate -> memo, 与hooks没关系
4. render
5. componentDidMount, componentDidUpdate, componentWillUnmount -> useEffect
6. 错误处理、边界检测，还无法取代

* 类成员属性怎么映射？

如`class Foo { it=0 }` -> `function Foo(props) { const it = useRef(0) }`

* Hooks如何获取历史的props和state？

使用useRef保存一个，然后在useEffect中更新

* forceUpdate

新建一个useState，手动触发重渲染

#### PWA

PWA组成技术

* Service Worker (on HTTPS)
* Fetch API
* Promise
* cache API
* Notification API

* workbox-webpack-plugin 谷歌出品的PWA插件
