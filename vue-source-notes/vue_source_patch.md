## patch过程

* patch (oldVnode, vnode, hydrating, removeOnly)

```javascript
if (isUndef(vnode)) {
  if (isDef(oldVnode)) invokeDestroyHook(oldVnode) // 新节点不存在而老节点存在，表明是删除，执行vnode的destroy和module绑定的destroy，然后循环子节点
    return
  }

  let isInitialPatch = false
  const insertedVnodeQueue = []

  if (isUndef(oldVnode)) {
    // empty mount (likely as component), create new root element 创建新元素
    isInitialPatch = true
    createElm(vnode, insertedVnodeQueue)
  } else {
    const isRealElement = isDef(oldVnode.nodeType) 
    if (!isRealElement && sameVnode(oldVnode, vnode)) { // 老节点是虚拟节点，且新节点和老节点相同
      // patch existing root node
      patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly) // patch是比较两个sameVnode节点的方法，后文有详细介绍
    } else {
      if (isRealElement) {
        ... // 服务端渲染逻辑若干
        // either not server-rendered, or hydration failed.
        // create an empty node and replace it
        oldVnode = emptyNodeAt(oldVnode) // 老节点是元素节点，直接清理
      }

      // replacing existing element
      const oldElm = oldVnode.elm // 这是组件的根dom元素
      const parentElm = nodeOps.parentNode(oldElm)

      // create new node
      createElm(vnode, insertedVnodeQueue, oldElm._leaveCb ? null : parentElm, nodeOps.nextSibling(oldElm))

      // update parent placeholder node element, recursively
      // 循环更新vnode的父虚节点
      if (isDef(vnode.parent)) {
        let ancestor = vnode.parent // 这是个虚节点
        const patchable = isPatchable(vnode) // vnode是一个真节点
        while (ancestor) {
          for (let i = 0; i < cbs.destroy.length; ++i) {
            cbs.destroy[i](ancestor) // 直接调用了父虚节点的destroy，将ref数组和directives清空，directives会激活所有的unbind回调
          }
          ancestor.elm = vnode.elm
          if (patchable) {
            for (let i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, ancestor) // 重新绑定父虚节点的所有module
            }
            // #6513
            // invoke insert hooks that may have been merged by create hooks.
            // e.g. for directives that uses the "inserted" hook.
            // 这是一个hack，一些module的create操作已经在初次patch时被整合到vnode的insert钩子中，重新绑定则立即激发这些钩子，但是不能激发组件mount
            const insert = ancestor.data.hook.insert
            // 钩子被合并过，成了一组函数
            if (insert.merged) {
              // start at index 1 to avoid re-invoking component mounted hook
              for (let i = 1; i < insert.fns.length; i++) {
                insert.fns[i]()
              }
            }
          } else {
            registerRef(ancestor) // 如果vnode不是一个真节点，则直接从它的父虚节点的refs数组中将它移除，不需要多余操作
          }
          ancestor = ancestor.parent
        }
      }

      // destroy old node
      if (isDef(parentElm)) { // parentElm存在，表明不是根节点
        removeVnodes(parentElm, [oldVnode], 0, 0) // 直接移除老节点
      } else if (isDef(oldVnode.tag)) {
        invokeDestroyHook(oldVnode)
      }
    }
  }

  invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
  return vnode.elm
}
```

* patchVnode(oldVnode, vnode, insertedVnodeQueue, ownerArray, index, removeOnly)

ownerArray是vnode所属的children列表，index是它在此列表中的序数，removeOnly是标识transition-group的参数

```javascript
if (isDef(vnode.elm) && isDef(ownerArray)) {
  // clone reused vnode
  vnode = ownerArray[index] = cloneVNode(vnode) // 使用vnode的浅拷贝操作
}
const elm = vnode.elm = oldVnode.elm // 注意这个elm根元素是oldVnode的
...// 这里进行了一些特殊情况的处理，包括vnode.isAsyncPlaceholder的处理（服务端渲染相关hydrate）和静态vnode的处理
let i
const data = vnode.data // 执行vnode的prepatch回调
if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
  i(oldVnode, vnode)
}

if (isDef(data) && isPatchable(vnode)) { 
  for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode) // 先执行所有module中的update，这些module有[ref, directive, class, attr, style, events, domProps]
  if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode) // 执行vnode的update回调
}

// 以下更新新老节点及其子节点
const oldCh = oldVnode.children
const ch = vnode.children
if (isUndef(vnode.text)) { // 新节点不是一个文本节点
  if (isDef(oldCh) && isDef(ch)) {
    if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly) // 如果老版本和新版本vnode都有儿子，则调用更新子节点的方法updateChildren
  } else if (isDef(ch)) {
    if (process.env.NODE_ENV !== 'production') {
      checkDuplicateKeys(ch) // 检测节点key重复，仅检测ch中的每一项
    }
    if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '') // 如果老节点是一个文本节点，则把elm的content设为空，如 <div>kkkfffggg</div> 变成 <div></div>
    addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue) // 加入新节点的所有儿子
  } else if (isDef(oldCh)) {
    removeVnodes(elm, oldCh, 0, oldCh.length - 1) // 如果新节点没儿子，而老节点有儿子，则将它们删掉
  } else if (isDef(oldVnode.text)) {
    nodeOps.setTextContent(elm, '') // 老节点是文本节点，新节点不是文本节点且没有儿子（就是为空），把elm的content设为空
  }
} else if (oldVnode.text !== vnode.text) {
  nodeOps.setTextContent(elm, vnode.text) // 新节点是文本节点，只更新dom文本
}
```

* updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly)

操作比较的主要是oldCh和newCh，oldStartIdx和newStartIdx分别是数组从头至尾的指针  

循环进行的场景：

1. 如果oldCh的左右有undefined，消除之（第6步操作可能产生undefined节点）
2. 如果当前的newch头节点和oldch头节点相同（注意`sameVnode`识别方法：两节点有相同key或者节点的key,data,isComment等相等,或者是相同的异步工厂函数（服务端渲染））执行patchVnode
3. 如果当前的newch尾节点和oldch尾节点相同，执行patchVnode
4. 如果当前的newch尾节点和oldch头节点相同，说明节点被移到右边去了，先执行patchVnode，然后把old头节点移动到old尾节点之后
5. 如果当前的newch头节点和oldch尾节点相同，说明节点被移到左边去了，先执行patchVnode，然后把old尾节点移动到old头节点之前
6. 其它情况

```javascript
if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx) // 保存oldCh从oldStartIdx到oldEndIdx之间的所有key值
idxInOld = isDef(newStartVnode.key) // 检测newch头节点是否在oldKeyToIdx中
  ? oldKeyToIdx[newStartVnode.key] // 如果有key值，直接通过key值检测
  : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx) // 如果没有key值，则要对newch头节点和oldKeyToIdx中的每一项进行都sameVnode比较操作，这样效率就非常低了
if (isUndef(idxInOld)) { // New element 在oldCh中找不到，为新元素
  createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
} else {
  vnodeToMove = oldCh[idxInOld]
  if (sameVnode(vnodeToMove, newStartVnode)) { // 仍然要sameVnode操作一遍，因为可能会出现tag不同但是key相同的情况
    patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
    oldCh[idxInOld] = undefined
    canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm) // 把对应的元素移动到oldStartVnode之前
  } else {
    // same key but different element. treat as new element
    createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
  }
}
newStartVnode = newCh[++newStartIdx]
```

以上所有情况头尾指针都要相应地进行移动


