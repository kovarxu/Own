## 关于常识

### 大小写

    * prop：文档建议`<blog-post post-title="hello!"></blog-post>`, `props: ['postTitle']`, 实际使用两者都是`camelCase`也没事
    * 自定义事件：`我们推荐你始终使用 kebab-case 的事件名` 事实上就是这样

### 生命周期可用的东西

    * 在`beforeCreate`阶段，`$route`里面是有东西的，但是`data`和`vuex`里面都是`undefined`
    * 在`created`阶段，`data`和`vuex`已经有东西了，在这个阶段使用`this.$nextTick((el) => {})`可以在下一个DOM刷新时机操作dom对象

--------------

## 图片相对路径不显示问题

    使用`const img = require('img/xxx.png')`这种形式先导入图片，然后在项目中应用
    这个问题在组件动态显示的时候会出现

--------------

## Vue操作DOM的方法

1. 使用`$nextTick`

2. 在元素上面打上`ref`,然后调用`this.$refs['{ref}'][0]`即可获取dom元素，然后就能用JQ等东西操作了

3. 在指令中使用：

```javascript
directives: {
    shout: {
        bind (el, binding, Vdom, Vdom) {
            // el就是dom元素
            // binding是绑定的参数对象，常用的是`binding.value`表示绑定的值
        }
    }
}
```

4. 定义方法使用:

```javascript
methods: {
    getElement (selector) {
        return this.$el.querySelector(selector);
    }
}
```

--------------

## Vue实现一个`slideToggle`

1. 使用CSS3的transition实现，对固定高度的东西可以用，对高度不固定（常见的情况）不好用

2. 改进，使用`max-height`代替`height`实现

3. 自己写一个`toggle`组件