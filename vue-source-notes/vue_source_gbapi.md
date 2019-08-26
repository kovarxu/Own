## global API 部分

* Vue.extend

用法：

```javascript
// 创建构造器
var Profile = Vue.extend({
  template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
  data: function () {
    return {
      firstName: 'Walter',
      lastName: 'White',
      alias: 'Heisenberg'
    }
  }
})
// 创建 Profile 实例，并挂载到一个元素上。
new Profile().$mount('#mount-point')
```

分析：

每个VueComponent类都继承自Vue类，并且拥有唯一递增的cid，

```javascript
export function initExtend (Vue: GlobalAPI) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0
  let cid = 1

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions: Object): Function {
    extendOptions = extendOptions || {}
    const Super = this
    const SuperId = Super.cid
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {}) // 这个东西的存在为了避免重复extend
    if (cachedCtors[SuperId]) { // 如果已经extend过了这个对象，则直接返回cache过的值
      return cachedCtors[SuperId]
    }
    ... // 验证name的合法性
    const Sub = function VueComponent (options) {
      this._init(options)
    }
    Sub.prototype = Object.create(Super.prototype) // 将Sub的原型指向了Super(大多数情况下是Vue)的原型，完成继承
    Sub.prototype.constructor = Sub
    Sub.cid = cid++
    Sub.options = mergeOptions( // 覆盖父类部分属性
      Super.options,
      extendOptions
    )
    Sub['super'] = Super

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps(Sub)
    }
    if (Sub.options.computed) {
      initComputed(Sub)
    }

    ... // 拷贝global API
    ... // 保留对父类、自身等的引用

    // cache constructor
    cachedCtors[SuperId] = Sub
    return Sub
  }
}

```

* Vue.nextTick

* Vue.filter / Vue.component / Vue.directive

* Vue.mixin

* Vue.use

* Vue.set / Vue.delete

* Vue.util

* Vue.compile

time_limit {
  begtime: // 开始时间戳
  endtime: // 结束时间戳
}