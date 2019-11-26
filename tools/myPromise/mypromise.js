var PENDING = 'pending'
var FULFILLED = 'fulfilled'
var REJECTED = 'rejected'
var $id = 0

function Promise(fns) {
    var that = this
    this.data = undefined
    this.reason = undefined
    this.status = PENDING
    this.resCallbacks = []
    this.rejCallbacks = []
    this.id = $id++

    try {
        fns(resolve, reject)
    } catch (e) {
        reject(e)
    }

    function resolve(data) {
        if (data instanceof Promise) {
            return data.then(resolve, reject)
        }
        setTimeout(() => {
            if (that.status === PENDING) {
                that.data = data
                that.status = FULFILLED
                that.resCallbacks.forEach(cb => cb(data))
            }
        })
    }

    function reject(reason) {
        setTimeout(() => {
            if (that.status === PENDING) {
                that.reason = reason
                that.status = REJECTED
                that.rejCallbacks.forEach(cb => cb(reason))
            }
        })
        
    }
}

Promise.prototype.then = function(onFulfilled, onRejected) {
    let newP, that = this
    if (typeof onFulfilled !== 'function') onFulfilled = data => data
    if (typeof onRejected !== 'function') onRejected = reason => { throw reason }

    if (this.status === PENDING) {
        newP = new Promise((resolve, reject) => {
            this.resCallbacks.push(() => {
                try {
                    let data = that.data
                    let x = onFulfilled(data)
                    resolvePromise(x, newP, resolve, reject)
                    // resolve(x)
                } catch (e) {
                    reject(e)
                }
            })
            this.rejCallbacks.push(() => {
                try {
                    let reason = that.reason
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
        // we could not store data here for it's async handle in Promise,
        // `this.data` may change in the current func stack
        // we need to get the Real-time value
        // let data = this.data
        newP = new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let x = onFulfilled(that.data)
                    resolvePromise(x, newP, resolve, reject)
                    // resolve(x)
                } catch (e) {
                    reject(x)
                }
            })
        })
    }
    else if (this.status === REJECTED) {
        // let reason = this.reason
        newP = new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let x = onRejected(that.reason)
                    resolvePromise(x, newP, resolve, reject)
                    // resolve(x)
                } catch (e) {
                    reject(x)
                }
            })
        })
    }

    return newP
}

function resolvePromise(x, promise, resolve, reject) {
    // A. we should also concern about this boundary condition: thenable twice asynchronously:
    //    resolve / reject can only be called once 
    //
    // return {
    //     then: function (resolvePromise, rejectPromise) {
    //         setTimeout(function () {
    //             resolvePromise(sentinel);
    //         }, 0);

    //         setTimeout(function () {
    //             resolvePromise(other);
    //         }, 0);
    //     }
    // };
    //
    // B. if `throw reason` after resolvePromise / rejectPromise has been executed, ignore it
    //    or reject promise with the reason
    //
    // then: function (resolvePromise, rejectPromise) {
    //     resolvePromise(sentinel);
    //     rejectPromise(other);
    //     throw other;
    // }

    let called = false

    if (x instanceof Promise) {
        if (x.id <= promise.id) {
            throw new TypeError('Circuit Reference In Promise.')
        }
        if (x.status === PENDING) {
            // x.then(resolve, reject) ??
            // y would also be a promise instance, so resolvePromise should be called here, not resolve directly
            x.then(y => {
                resolvePromise(y, promise, resolve, reject);
            }, reason => {
                reject(reason);
            });
        } else {
            x.then(resolve, reject)
        }
    } else if (x && (typeof x === 'function' || typeof x === 'object')) {
        // null is banned
        try {
            let then = x.then
            if (typeof then === 'function') {
                // let y = then.call(x, resolve, reject)
                // resolvePromise(y, promise, resolve, reject)
                then.call(x, y => {
                    // upper reason A
                    if (called) return
                    called = true
                    resolvePromise(y, promise, resolve, reject)
                }, reason => {
                    // upper reason A
                    if (called) return
                    called = true
                    reject(reason)
                })
            } else {
                resolve(x)
            }
        } catch (e) {
            // upper reason B
            if (called) return
            called = true
            reject(e)
        }
    } else {
        resolve(x)
    }
}

Promise.resolve = function(data) {
    return new Promise((resolve, reject) => {
        resolve(data)
    })
}

Promise.reject = function(reason) {
    return new Promise((resolve, reject) => {
        reject(reason)
    })
}

Promise.prototype.catch = function (rej) {
    this.then(null, rej)
}

Promise.deferred = function () {
    let defer = {}
    defer.promise = new Promise((resolve, reject) => {
        defer.resolve = resolve
        defer.reject = reject
    })
    return defer
}

try {
    module.exports = Promise
} catch (e) {
}

// using mocha
// https://github.com/promises-aplus/promises-tests

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