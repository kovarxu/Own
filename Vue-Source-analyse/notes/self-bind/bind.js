// 极简响应式的实现

function observe (obj) {
  let dep = new Dep()
  if (typeof obj === 'object' && !obj.__ob__) {
    Object.keys(obj).forEach(key => {
      let val = obj[key]
      Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: true,
        get () {
          if (Dep.target) {
            dep.depend()
          }
          return val
        },
        set (newVal) {
          if (newVal !== val) {
            val = newVal
            dep.notify()
          }
        }
      })
    })
    obj.__ob__ = true
  }
  return obj
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

function Watcher (obj, exp, cb) {
  this.obj = obj
  this.deps = []
  this.exp = exp
  this.id = $watid++
  this.value = this.get()
  this.cb = cb
  Watcher._watchers.push(this)
}

Watcher._watchers = []

Watcher.prototype.get = function() {
  let obj = this.obj
  if (obj.__ob__) {
    Dep.target = this
    
    let steps = this.exp.split('.')
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
  if (val !== oldVal) {
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
        waiting = false
      })
    }
  }
}

// ---------------- for test ---------------
let foo = { name: 'xi', age: 33, department: 6, sets: {a: 1, b: 2, c: 3} }

foo = observe(foo)

new Watcher(foo, 'name', (val, oldVal) => console.log('name', val, oldVal))
new Watcher(foo, 'sets.a', (val, oldVal) => console.log('sets.a', val, oldVal))

foo.name = "wang"
foo.sets = { a: 6, b: 2, c: 3 }
