// 4. 终极版本Pro
// 满足Promise A+ 规范

var $uid = 0
var PENDING = 'pending'
var FULFILLED = 'fulfilled'
var REJECTED = 'rejected'

function Promise(fns) {
    this.value = undefined
    this.next = []
    this.res = null
    this.rej = null
    this.status = PENDING
    this.timer = null
    this.isthen = false
    this._uid = $uid++
    // care about it
    try {
        fns(resolve.bind(this), reject.bind(this))
    } catch (e) {
        this.status = REJECTED
        this.value = e
    }
}

function resolve(res) {
    this.value = res
    this.status = FULFILLED
    if (this.next.length) {
    }
    return this.status
}

function reject(rej) {
    this.value = rej
    this.status = REJECTED
    return this.status
}

function resolvePromise(promise, x) {

}

Promise.prototype.then = function(onFulfilled, onRejected) {
  if (typeof onFulfilled !== 'function') onFulfilled = data => data
  if (typeof onRejected !== 'function') onRejected = reason => {
    throw reason
  }

  let newp = new Promise()

  return newp
}

Promise.resolve = function(data) {
    return new Promise((res,rej)=>{
        res(data)
    }
    )
}

Promise.reject = function(err) {
    return new Promise((res,rej)=>{
        rej(err)
    }
    )
}

// -----------------------------------

Promise.resolve = function (data) {
    return new Promise((res, rej) => {res(data)})
}

Promise.reject = function (err) {
    return new Promise((res, rej) => {rej(err)})
}

Promise.defer = Promise.deferred = function () {
  let dfd = {}
  dfd.promise = new Promise((resolve,reject)=>{
      dfd.resolve = resolve
      dfd.reject = reject
  })
  return dfd
}

module.exports = Promise;


// var p = new Promise((res, rej) => {
//     setTimeout(() => res(1), 1000)
// }).then(data => {
//     console.log(data + 1)
//     return data + 1
// }).then(data => {
//     console.log(data + 1)
//     return new Promise((res, rej) => {
//        setTimeout(() => res(10), 1000)
//     }).then(data => {
//         console.log(data + 1)
//         return data + 1
//     })
// }).then().then(data => {
//     console.log(data + 1)
//     return data + 1
// }).then(data => {
//     console.log(data + 1)
//     return data + 1
// })

// var p2 = Promise.all([p, new Promise((res, rej) => {
//   setTimeout(() => res(1), 3000)
// })]).then(data => {
//   console.log(data)
// })

// var p3 = new Promise((res, rej) => res(1)).then(data => p3)