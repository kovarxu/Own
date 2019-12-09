/*
Trie树的简单实现
Trie树常用于字符的搜索、一系列同根字符串的处理等
约定：
1. 普通节点：未保存有值的节点

ADT Trie {
  method: {
    set(key, data) // 将key对应的word插入树中
    access(key) // 返回key是否在树中
    get(key) // 获取key对应的数据
    removeData(key) // 移除key对应的节点保存的数据
    removeChildren(key) // 移除key对应的节点的所有子节点
    removeKey(key) // 移除某个key，如果有子节点一并移除
  },
  property: {
    size // 插入的元素个数
  }
}

Class Node {
  method: {
    isDest() // 是否是一个保存有值的节点
    removeData() // 移除节点保存的数据，使其成为一个普通节点
    removeChildren() // 移除节点的所有子节点
  },
  property: {
    char // 节点对应的字符
    keys // 一个散列表，分别保存下一个字符对应的节点
    dest // 受否保存了值
    data // 节点保存的值
  }
}
*/

class Trie {
  _root = new Node() // 一个空节点，作为根节点
  size = 0

  access (key, isReturnVal) {
    let char, keyNode = this._root
    for (let i = 0; i < key.length; i++) {
      char = key[i]
      keyNode = keyNode.keys.get(char)
      if (!keyNode) {
        return isReturnVal ? undefined : false
      }
    }
    return isReturnVal ? keyNode : true
  }

  get (key) {
    let targetNode = this.access(key, true)
    return targetNode ? targetNode.data : undefined
  }

  set (key, data) {
    let char, keyNode = this._root, subordinate
    for (let i = 0; i < key.length; i++) {
      char = key[i]
      subordinate = keyNode.keys.get(char)
      if (!subordinate) {
        subordinate = new Node(char)
        keyNode.keys.set(char, subordinate)
        subordinate.stem = keyNode
      }
      keyNode = subordinate
    }

    keyNode.dest = true
    keyNode.data = data

    ++ this.size
  }

  removeData (key) {
    let targetNode = this.access(key, true)
    if (targetNode) {
      targetNode.removeData()
      -- this.size
    }
  }

  removeChildren (key) {
    let targetNode = this.access(key, true)
    if (targetNode) {
      targetNode.removeChildren()
    }
  }

  removeKey (key) {
    let targetNode = this.access(key, true)
      if (targetNode) {
        targetNode.removeChildren()

        let parent = targetNode.stem
        let char = targetNode.char
        parent.keys.delete(char)
      }
    }
}

class Node {
  constructor (char) {
    this.char = char
    this.stem = null
    this.keys = new Map()
    this.dest = false
    this.data = undefined
  }

  isDest () {
    return this.dest !== false
  }

  removeData () {
    this.data = undefined
    this.dest = false
  }

  removeChildren () {
    this.keys.clear()
  }
}
