const PENDING = 1
const FULLFILLED = 2
const REJECTED = 3
const defaultResolveCb = a => a
const defaultRejectCb = a => { throw a }

class Promise {
  state = PENDING
  value = undefined
  reason = undefined
  fullfillCbs = []
  rejectedCbs = []

  constructor(fn) {
    try {
      // 1. 注意bind
      fn(this.resolve.bind(this), this.reject.bind(this))
    } catch(e) {
      this.reject(e)
    }
  }

  resolve (value) {
    // 2. 注意这里是异步改状态
    setTimeout(() => {
      if (this.state === PENDING) {
        this.state = FULLFILLED
        this.value = value
        if (this.fullfillCbs.length) {
          this.fullfillCbs.forEach(fn => fn(this.value))
        }
      }
    })
  }

  reject (reason) {
    setTimeout(() => {
      if (this.state === PENDING) {
        this.state = REJECTED
        this.reason = reason
        if (this.rejectedCbs.length) {
          this.rejectedCbs.forEach(fn => fn(this.reason))
        }
      }
    })
  }

  then (res, rej) {
    if (typeof res !== 'function') {
      res = defaultResolveCb
    }
    if (typeof rej !== 'function') {
      rej = defaultRejectCb
    }
    return new Promise((resolve, reject) => {
      this.fullfillCbs.push(function(value) {
        try {
          let val = res(value)
          Promise._resolvePromise(val, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
      this.rejectedCbs.push(function(reason) {
        try {
          let val = rej(reason)
          Promise._resolvePromise(val, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
    })
  }

  // 3. 这里可以扩展使满足Promise A+规范
  static _resolvePromise(val, resolve, reject) {
    resolve(val)
    // if (val instanceof Promise) {
    //   val.then(resolve, reject)
    // } else if (typeof val === 'object') {
    //   let then = val.then
    //   if (typeof then === 'function') {

    //   } else {
    //     resolve(val)
    //   }
    // } else {
    //   resolve(val)
    // }
  }
}

// test

function test () {
  let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(90)
    }, 1000)
  }).then((data) => {
    console.log(data)
    throw 222
  }).then(null, err => {
    console.log(err)
    return 'abc'
  })

  return p1
}

test()
