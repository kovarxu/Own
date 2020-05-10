### 记录一些团队React项目的搭建过程

### 使用feflow

1. 安装: `npm install -g feflow-cli`

2. 安装ivweb开发脚手架 `feflow install generator-ivweb`

3. 安装webpack `feflow install builder-webpack4`

4. 创建项目，使用交互模式 `feflow init`

5. 进入项目目录，开始开发 `feflow dev`

### 项目结构

feflow.json: 项目打包配置文件

src: 项目源码

src/assets: 资源，包括公用的css, js, html等

src/middleware: redux中间件

src/modules: 依赖模块

src/pages: 页面

src/pages/index: actions, components, reducers

### 技术栈

react + redux + less

### 技术总结

feflow cli 核心是一个cli工具，它的命令如`feflow dev, feflow build`等是放在`packages\feflow-plugin-devtool\templates`中的

初始模板没有router

重点注意redux，react-redux的使用

redux概念：state，reducer，action，connect，combineReducer

1. reducer跟initialState放在一起，可以拆成很多小块块，reducer组件不直接用到
2. action的返回值是一个对象，其中一个字段type表明触发何种reducer
3. 在组件中调用action需要使用dispatch函数，一般Privider的后代组件有this.props.dispatch方法
4. 可利用connect将字段操作简化，格式是connect(mapStateToProps, mapActionsToProps), 前者是返回一个对象的函数，后者可以是一个函数，或者一个对象
