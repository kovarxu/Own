// 4. 终极版本Pro
// 满足Promise A+ 规范

var PENDING = 'pending'
var FULFILLED = 'fulfilled'
var REJECTED = 'rejected'
var savedThenable = new WeakMap()

function Promise(fns) {
    this.data = undefined
    this.reason = undefined
    this.status = PENDING
    this.resCallbacks = []
    this.rejCallbacks = []
    this.savedThenable.set(this, true)

    try {
        fns(resolve.bind(this), reject.bind(this))
    } catch (e) {
        reject(e)
    }

    function resolve(data) {
        this.data = data
        this.status = FULFILLED
        this.resCallbacks.forEach(cb => cb(data))
    }

    function reject(reason) {
        this.reason = reason
        this.status = REJECTED
        this.rejCallbacks.forEach(cb => cb(reason))
    }
}

Promise.prototype.then = function(onFulfilled, onRejected) {
    let newP

    if (this.status === PENDING) {
        newP = new Promise((resolve, reject) => {
            this.resCallbacks.push((data) => {
                try {
                    let x = onFulfilled(data)
                    // resolvePromise(x, newP, resolve, reject)
                    resolve(x)
                } catch (e) {
                    reject(x)
                }
            })
            this.rejCallbacks.push((reason) => {
                try {
                    let x = onRejected(reason)
                    resolve(x)
                } catch (e) {
                    reject(x)
                }
            })
        })
    }
    else if (this.status === FULFILLED) {
        let data = this.data
        newP = new Promise((resolve, reject) => {
            try {
                let x = onFulfilled(data)
                resolve(x)
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
                resolve(x)
            } catch (e) {
                reject(x)
            }
        })
    }

    return newP
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

// var p2 = Promise.all([p, new Promise((res, rej) => {
//   setTimeout(() => res(1), 3000)
// })]).then(data => {
//   console.log(data)
// })

// var p3 = new Promise((res, rej) => res(1)).then(data => p3)