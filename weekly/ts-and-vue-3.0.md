
### is

`function(tar: unknown) {if (typeof tar === 'string') {return tar.toUpperCase()}}`会报警告的，因为TS还是不知道tar是啥

`function isString(tar: unknown): tar is string {return typeof tar === 'string'}; if (isString(tar)) {return tar.toUpperCase()}`则不会报错，这种类型判断函数还是很有用的

### & |

`type C = A & B` C必须同时满足A和B

`type C = A | B` C只需要满足A或者B中的一个即可，但是不能逾越A & B

### Vue3.0 Proxy

Vue2.0中通过defineProperty，每个属性都要监听，proxy只需要监听一次即可

如果一个对象有4层，每一层都是一个对象：

Vue2.0需要执行3^4 = 81次  
Vue3.0需要执行3^3 = 27次  Vue3.0除了shallow监听之外，引入了readonly监听，这样其后代不会被监听到了，又优化了一波性能

```js
a = {
  b: {
    c: {
      d: {
        e: {
          f: 1
        }
        ...
      }
      ...
    }
    ...
  }
  ...
}

defineReactive(a)
```
