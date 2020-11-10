## xstate: 状态管理器

## Basics

### Machine

类型：层级状态、平行状态、历史状态

### States / State Nodes

初始状态：machine.initialState

多种节点类型，state本身有meta属性附带属性

### Events

事件、传参、空事件、事件条件

### Transitions

on属性（层级结构）、transition方法（状态转化、自身转化）

inner-transtion && outer-transition: 内转化不会执行父容器的enter和exit，外转化会

内转化使用'.xxx'语法，外转化使用'xxx.yyy'语法

转化禁止：{EVENT: undefined}; 多转化目标：{EVENT: {target: [1, 2]}}

## Effects

### Actions

entry, exit, on 等均可挂载actions

基本格式：on: { actions: send('JOIN') / [forwardTo('some-service-id'), log((context, event) => ...)] }

send('SOME_EVENT') 产生新的action对象，或者直接在Machine第二个参数中定义actions

send可以添加to或者id参数表明目的地，send的事件不会立即执行（但是raise会）

action参数分别是conetext和event

respond() / forwardTo() --- 被激活自动机相应/service激活者发送信息

escalate(errorMsg) --- onError: {actions: (context, event) => ...}

log(expr, label)

### transition guard

条件跳转cond，可以在Machine第二个参数加入guards表示明确的条件, cond第三参数中的cond中可以取得传入的参数

in守卫：必须在目标元素触发才可导致事件触发

### context

以context创建新的machine：machine.withContext({...})

设置值：assign({key: value}) / assign({key: func}) / assign((context, event) => newContext)

### activities

进入state时执行的事件，返回一个取消函数，适用于绑定/取消一些回调啥的

### services

invoke: { id: ..., src: string/machine/function => Promise }

onError / onDone

### actors

actors只能做三件事：派生新actor、修改自己的属性、发送自己的状态给其他actor

actors在assign中，使用spawn创建

同步状态：调用sendUpdate(), 它的父actor保存的状态才会更新


### delay

延迟支持任务的便捷形式：{after: { 3000: 'flip' }}

支持自定义delay的条件：或者直接在Machine第二个参数中定义delays，然后在state中使用




