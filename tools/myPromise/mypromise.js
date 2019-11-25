// 4. 终极版本Pro
// 满足Promise A+ 规范

var PENDING = 'pending'
var FULFILLED = 'fulfilled'
var REJECTED = 'rejected'
var $id = 0

function Promise(fns) {
    this.data = undefined
    this.reason = undefined
    this.status = PENDING
    this.resCallbacks = []
    this.rejCallbacks = []
    this.id = $id++

    try {
        fns(resolve.bind(this), reject.bind(this))
    } catch (e) {
        reject(e)
    }

    function resolve(data) {
        if (data instanceof Promise) {
            data.then(resolve, reject)
        } else {
            this.data = data
            this.status = FULFILLED
            this.resCallbacks.forEach(cb => cb(data))
        }
    }

    function reject(reason) {
        this.reason = reason
        this.status = REJECTED
        this.rejCallbacks.forEach(cb => cb(reason))
    }
}

Promise.prototype.then = function(onFulfilled, onRejected) {
    let newP
    if (typeof onFulfilled !== 'function') onFulfilled = data => data
    if (typeof onRejected !== 'function') onRejected = reason => { throw reason }

    if (this.status === PENDING) {
        newP = new Promise((resolve, reject) => {
            this.resCallbacks.push((data) => {
                try {
                    let x = onFulfilled(data)
                    resolvePromise(x, newP, resolve, reject)
                    // resolve(x)
                } catch (e) {
                    reject(e)
                }
            })
            this.rejCallbacks.push((reason) => {
                try {
                    let x = onRejected(reason)
                    resolvePromise(x, newP, resolve, reject)
                    // resolve(x)
                } catch (e) {
                    reject(e)
                }
            })
        })
    }
    else if (this.status === FULFILLED) {
        let data = this.data
        newP = new Promise((resolve, reject) => {
            try {
                let x = onFulfilled(data)
                resolvePromise(x, newP, resolve, reject)
                // resolve(x)
            } catch (e) {
                reject(x)
            }
        })
    }
    else if (this.status === REJECTED) {
        let reason = this.reason
        newP = new Promise((resolve, reject) => {
            try {
                let x = onRejected(reason)
                resolvePromise(x, newP, resolve, reject)
                // resolve(x)
            } catch (e) {
                reject(x)
            }
        })
    }

    return newP
}

function resolvePromise(x, promise, resolve, reject) {
    if (x instanceof Promise) {
        if (x.id <= promise.id) {
            throw 'Error: Circuit Reference In Promise.'
        }
        if (x.status === PENDING) {
            x.then(resolve, reject)
        } else if (x.status === FULFILLED) {
            resolve(x.data)
        } else if (x.status === REJECTED) {
            reject(x.reason)
        }
    } else if (typeof x === 'function' || typeof x === 'object') {
        try {
            let then = x.then
            if (typeof then === 'function') {
                let y = then.call(x, promise.data)
                resolvePromise(y, promise, resolve, reject)
            }
        } catch (e) {
            reject(e)
        }
    } else {
        resolve(x)
    }
}

Promise.resolve = function(data) {
    return new Promise((res,rej)=>{
        res(data)
    })
}

Promise.reject = function(err) {
    return new Promise((res,rej)=>{
        rej(err)
    })
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

// var p = new Promise((res, rej) => {
//     setTimeout(() => res(1), 1000)
// })

// p.then(data => { return p })

// var p2 = Promise.all([p, new Promise((res, rej) => {
//   setTimeout(() => res(1), 3000)
// })]).then(data => {
//   console.log(data)
// })

// var p3 = new Promise((res, rej) => res(1)).then(data => p3)