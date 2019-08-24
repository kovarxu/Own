## transition一般用法

```html
<div @click="onToggle">toggle</div>
<transition name="bq" :css="true" mode="out-in" :appear="true" @enter="onEnter" @leave="onLeave">
    <div v-show="showBq">ContentContentContent</div>
</transition>
...
<style>
.bq-enter-active, .bq-appear-active {
    animation: move-in .5s;
}
.bq-leave-active {
    animation: move-in 1s reverse;
}
@keyframes move-in {
    0% {
        transform: translate(200px, 0);
        // opacity: 0;
    }
    100% {
        transform: translate(0, 0);
        // opacity: 1;
    }
}
...
</style>
```

## 分析

### enter

```javascript
function enter (vnode, toggleDisplay) {
...
if (isDef(el._leaveCb)) { // 如果正在执行leave动画，会直接执行leave回调
  el._leaveCb.cancelled = true
  el._leaveCb()
}
const data = resolveTransition(vnode.data.transition) // 解析了所有的class，这一步包含name的替换（如果没有name则为'v'），如果自定义了transition类则也进行替换
const {
  css, // 默认为true，使用css类作为状态切换
  type, // 有效值为 "transition" 和 "animation"。默认 Vue.js 将自动检测出持续时间长的为过渡事件类型。
  appear, // 首次展现是否立即应用过渡效果，可以是一个函数
  enterClass, enterToClass, enterActiveClass, appearClass, appearToClass, appearActiveClass,
  beforeEnter,enter,afterEnter,enterCancelled,beforeAppear,afterAppear,appearCancelled,
  duration // 可以自定义过渡时长
} = data
... // appear和enter切换的逻辑
const expectsCSS = css !== false && !isIE9
const userWantsControl = getHookArgumentsLength(enterHook) // 这个东西比较有意思，比如enterHook => onEnter(el)，则返回false；enterHook => onEnter(el,t)，参数大于1则返回true
...// 处理duration取值duration或者duration.leave
const cb = el._enterCb = once(() => { // 这个函数是一个在duration时间到之后执行的回调，一般是由下方setTimeout激发的
  if (expectsCSS) {
    // 移除enter-active & enter-to类
  }
  if (cb.cancelled) {
    // 执行enterCancelledHook（非正常结束）
  } else {
    // 执行afterEnterHook（正常结束）回调
  }
  el._enterCb = null
})

if (!vnode.data.show) {
  // remove pending leave element on enter by injecting an insert hook
  mergeVNodeHook(vnode, 'insert', () => {
    ...
    enterHook && enterHook(el, cb) // 当vnode执行insert之后执行的回调，appear或enter，cb被当做二个参数传入
  })
}

// start enter transition
beforeEnterHook && beforeEnterHook(el)
if (expectsCSS) {
  addTransitionClass(el, startClass) // 第一帧，添加v-enter和v-enter-active类
  addTransitionClass(el, activeClass)
  nextFrame(() => { 
    removeTransitionClass(el, startClass) // 下一帧，移除v-enter
    if (!cb.cancelled) {
      addTransitionClass(el, toClass) // 移除v-enter-to
      if (!userWantsControl) { // 注意这个东西
        if (isValidDuration(explicitEnterDuration)) { // 如果设置了duration参数
          setTimeout(cb, explicitEnterDuration) // 这里可以看到移除v-enter-to和v-enter-active类的操作，通过setTimeout
        } else {
          whenTransitionEnds(el, type, cb) // 这里依据type决定按照transition还是animation的结束作为回调执行的时机，如果type未指定则按照两种动画执行时长最大者执行
        }
      }
    }
  })
}

if (vnode.data.show) {
  toggleDisplay && toggleDisplay()
  enterHook && enterHook(el, cb)
}

if (!expectsCSS && !userWantsControl) { // vuejs文档中有：当只用 JavaScript 过渡的时候，在 enter 和 leave 中必须使用 done 进行回调。否则，它们将被同步调用，过渡会立即完成。
// 前一半好理解，后一半如果没有done的传递，则userWantsControl这个参数为false，过渡会立即完成
// done其实就是上文enterHook(el, cb)中的cb函数，只不过被手动执行了而已
  cb()
}

}
```

### leave

```javascript
function leave (vnode, rm) {
if (isDef(el._enterCb)) { // 如果正在执行enter动画，会直接执行enter回调
  el._enterCb.cancelled = true
  el._enterCb()
}

const data = resolveTransition(vnode.data.transition)
if (isUndef(data) || el.nodeType !== 1) { // 直接执行rm函数
  return rm()
}

const {
  css,type,duration
  leaveClass,leaveToClass,leaveActiveClass,
  beforeLeave,leave,afterLeave,leaveCancelled,delayLeave,
} = data

const expectsCSS = css !== false && !isIE9 // 这两个参数和enter里面相同
const userWantsControl = getHookArgumentsLength(leave)
...// 处理duration取值duration或者duration.leave

const cb = el._leaveCb = once(() => {
  if (el.parentNode && el.parentNode._pending) { // 消除在父dom上记录上leave的vnode
    el.parentNode._pending[vnode.key] = null
  }
  if (expectsCSS) {
    // 移除leave-active & leave-to类
  }
  if (cb.cancelled) { // 非正常结束（被取消）
    if (expectsCSS) {
      // 移除leave类
    }
    leaveCancelled && leaveCancelled(el)
  } else {
    rm()
    afterLeave && afterLeave(el)
  }
  el._leaveCb = null
})

if (delayLeave) {
  delayLeave(performLeave)
} else {
  performLeave()
}

function performLeave () {
  // the delayed leave may have already been cancelled
  if (cb.cancelled) {
    return
  }
  // 在父dom上记录上leave的vnode
  if (!vnode.data.show && el.parentNode) {
    (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key: any)] = vnode
  }
  beforeLeave && beforeLeave(el) // 执行beforeLeave(el)回调
  if (expectsCSS) { // 这个跟enter一样
    addTransitionClass(el, leaveClass)
    addTransitionClass(el, leaveActiveClass)
    nextFrame(() => {
      removeTransitionClass(el, leaveClass)
      if (!cb.cancelled) {
        addTransitionClass(el, leaveToClass)
        if (!userWantsControl) {
          if (isValidDuration(explicitLeaveDuration)) {
            setTimeout(cb, explicitLeaveDuration)
          } else {
            whenTransitionEnds(el, type, cb)
          }
        }
      }
    })
  }
  leave && leave(el, cb) // 由于leave是vnode从显示到不显示的变化，所以没有enter中分为appear和enter两种情况，也不用绑在vnode的insert上，直接执行leave回调就可以了
  if (!expectsCSS && !userWantsControl) { // 同enter，某些情况下需要加done
    cb()
  }
}

}
```
