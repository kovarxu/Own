/*
链表的游标实现
约定：
1. 链表只有一个头部，索引数组0位置为头部
2. 空值由一个symbol类型的常量表示
3. 单向，默认从头部插入

ADT LinkedList {
  method: {
    insert(data, ref || null) // 在某个元素后插入ref, 如果为空则在头部插入
    remove(data) // 移除元素
    access(data) // 检索元素的索引
    isEmpty() // 是否为空
    clear() // 清空

    ****
    reverse() // 反转
    print() // 调试打印
  }
  property: {
    size // 元素的个数
  }
}
*/

const EPN = -1
const EPT = Symbol('__empty_element__')
const HEAD_POS = 0

class LinkedList {
  static headPos = HEAD_POS
  size = 0
  _mlen = 0

  constructor (len = 100) {
    this.cleanStack = [] // 回收的位置
    this.links = new Array(len).fill(EPN) // 游标
    this.datas = new Array(len).fill(EPT) // 数据
  }

  clear () {
    this.size = 0
    this._mlen = 0
    this.cleanStack.length = 0
    this.links.fill(EPN)
    this.datas.fill(EPT)
  }

  access (data, returnFront = false) {
    let cur = LinkedList.headPos, front = EPN
    while (cur !== EPN && this.datas[cur] !== data) {
      front = cur
      cur = this.links[cur]
    }
    if (cur === EPN) {
      console.log('没找到')
      front = EPN // important
    }
    return returnFront ? front : cur
  }

  remove (data) {
    let frontPos = this.access(data, true)
    if (frontPos !== EPN) {
      let delPos = this.links[frontPos]
      // 删除值
      this.datas[delPos] = EPT
      // 重新建立链接关系
      this.links[frontPos] = this.links[delPos]
      // 收集删除的位置
      this._recycle(delPos)

      -- this.size
    }
  }

  insert (data, ref = null) {
    let tmp
    let refPos = ref ? (tmp = this.access(ref)) >= 0 ? tmp : 0 : 0
    let nextPos = this.cleanStack.length ? this.cleanStack.pop() : ++this._mlen

    // 填入值
    this.datas[nextPos] = data
    // 重新建立链接关系
    this.links[nextPos] = this.links[refPos]
    this.links[refPos] = nextPos
    // 更新元素个数信息
    ++ this.size
  }

  isEmpty () {
    return this.size === 0
  }

  _recycle (pos) {
    this.cleanStack.push(pos)
  }

  reverse () {
    if (this.size === 0) return
    // 反转操作，类似链表双指针的实现
    let m = LinkedList.headPos, n, tmp = this.links[m]

    while ((n = tmp) !== EPN) {
      tmp = this.links[n]
      this.links[n] = m === LinkedList.headPos ? -1 : m
      m = n
    }
    this.links[LinkedList.headPos] = m

  }

  print () {
    if (this.size === 0) return
    let f = this.links[LinkedList.headPos]
    while (f !== EPN) {
      console.log(this.datas[f])
      f = this.links[f]
    }
  }
}
