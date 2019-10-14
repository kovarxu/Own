// 极简响应式的实现

let hiJackedMethods = ['push', 'unshift', 'pop', 'shift', 'splice', 'sort', 'reverse']
let arrayProto = Array.prototype
let arrayMethods = Object.create(arrayProto)
hiJackedMethods.forEach(method => {
  Object.defineProperty(arrayMethods, method, {
    configurable: true,
    writable: false,
    value: function (...rest) {
      let originFunc = arrayProto[method]
      let result = originFunc.apply(this, rest)
      let inserted
      if (['push', 'unshift'].includes(method)) {
        inserted = rest
      } else if (method === 'splice' && rest.length >= 2) {
        inserted = rest.slice(2)
      }
      let ob = this.__ob__
      if (ob) {
        inserted && ob.observeArray(inserted)
        ob.dep.notify()
      }
      return result
    }
  })
})

function Observer (obj) {
  let dep = new Dep()
  this.dep = dep
  this.vm = obj
  if (typeof obj === 'object' && !obj.__ob__) {
    if (Array.isArray(obj)) {
      this.observeArray(obj)
    } else {
      this.walk(obj)
    }
    obj.__ob__ = this
  } else {
    return null
  }
}

Observer.prototype.observeArray = function (obj) {
  obj.__proto__ = arrayMethods
  obj.forEach(o => new Observer(o))
}

Observer.prototype.walk = function (obj) {
  let self = this
  Object.keys(obj).forEach(key => {
    let val = obj[key]
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get () {
        if (Dep.target) {
          self.dep.depend()
        }
        return val
      },
      set (newVal) {
        if (newVal !== val) {
          val = newVal
          self.dep.notify()
        }
      }
    })
  })
}

let $subid = 0
let $watid = 0

function Dep() {
  this.subs = []
  this.id = $subid++
}

Dep.prototype.depend = function () {
  let target = Dep.target
  if (target) {
    if (! this.subs.includes(target)) {
      this.subs.push(target)
    }
    if (! target.deps.includes(this)) {
      target.deps.push(this)
    }
  }
}

Dep.prototype.notify = function () {
  this.subs.forEach(sub => sub.update())
}

let callbacks = []
let waiting = false

function Watcher (obj, exp, cb, deep) {
  this.obj = obj
  this.deps = []
  this.exp = exp
  this.deep = deep
  this.id = $watid++
  let value = this.get()
  this.value = value
  if (this.deep) traverse(value)
  this.cb = cb
  Watcher._watchers.push(this)
}

Watcher._watchers = []

Watcher.prototype.get = function() {
  let obj = this.obj
  let value
  if (obj.__ob__) {
    Dep.target = this
    
    let steps = []
    if (this.exp) {
      steps = this.exp.split('.')
    }
    try {
      value = steps.reduce((o, k) => (obj = obj[k]), obj)
    } catch (e) {
      value = null
      console.error(e)
    }
  }
  return value
}

let p = Promise.resolve()

Watcher.prototype.update = function() {
  let val = this.get()
  let oldVal = this.value
  if (val !== oldVal || typeof val === 'object') {
    this.value = val
    if (typeof this.cb === 'function') {
      callbacks.push(() => this.cb.call(this.obj, val, oldVal))
    }
    if (!waiting) {
      waiting = true
      p.then(() => {
        for (let i = 0; i < callbacks.length; i++) {
          callbacks[i].call()
        }
        callbacks.length = 0
        waiting = false
      })
    }
  }
}

var seenObjects = new Set()

function traverse (val) {
  _traverse(val, seenObjects)
  seenObjects.clear()
}

function _traverse (val, seen) {
  if (val && typeof val === 'object' && Object.keys(val).length) {
    Object.keys(val).forEach(key => {
      let v = val[key]
      let isA = Array.isArray(v)
      let isObject = val && typeof val === 'object'
      if ((!isA && !isObject) || Object.isFrozen(val)) {
        return
      }
      if (v.__ob__) {
        var depId = v.__ob__.dep.id
        if (seen.has(depId)) {
          return 
        }
        seen.add(depId)
      }
      if (isA) {
        i = val.length;
        while (i--) { _traverse(val[i], seen) }
      } else {
        keys = Object.keys(val);
        i = keys.length;
        while (i--) { _traverse(val[keys[i]], seen) }
      }
    })
  }
}

// ---------------- for test ---------------
let foo = { name: 'xi', age: 33, department: 6, sets: {a: 1, b: 2, c: 3} }

let f = new Observer(foo)

new Watcher(foo, 'name', (val, oldVal) => console.log('name', val, oldVal))
new Watcher(foo, 'sets.a', (val, oldVal) => console.log('sets.a', val, oldVal))

foo.name = "wang"
foo.sets = { a: 6, b: 2, c: 3 }

// ************************* //

let bar = [1, 2, {go: 999}, 4]

let b = new Observer(bar)

new Watcher(bar, '', (val, oldVal) => console.log(`list `, val.length, oldVal.length))
b.dep.depend()

bar.push(0)
