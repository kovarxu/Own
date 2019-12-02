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

    // It should always be noticed that
    // resolve and reject are `different` between Promise instances
    function resolve(data) {
        // D. we don't need to handle thenable objects here (A+ specification not specified)
        //    that is to say, if we `resolve(thenable)` directly, the behavior is arbitrary
        //    For instance: log `{foo: "bar"}` or `{then: [func]}` in the following example are both correct actions
        //    new Promise((resolve, reject) => {
        //        resolve({ then (res, rej) { res({ foo: 'bar' }) }})
        //    }).then((data) => {console.log(data)})
        if (data instanceof Promise) {
            return data.then(resolve, reject)
        }
        // onFulfilled or onRejected must not be called until the execution context stack contains only platform code. (2.2.4)
        // C. why not fulfill / reject promise synchronously and call callbacks asynchronously? (2.3.3.3.1)
        //    a weird boundary condition: an already fulfilled / rejected promise for an asynchronous / synchronous thenable
        //    new Promise((resolve, reject) => {
        //            resolve({foo: 'bar'})
        //        })
        //        .then(data => {
        //            return Promise.resolve({ then (res, rej) { res(data) }} )
        //        })
        //        .then((data) => {console.log(data)})
        //    by this way, we must merely log `{foo: "bar"}`
        setTimeout(() => {
            if (that.status === PENDING) {
                that.data = data
                that.status = FULFILLED
                // setTimeout(() => {
                that.resCallbacks.forEach(cb => cb(data))
                // })
            }
        })
    }

    function reject(reason) {
        setTimeout(() => {
            if (that.status === PENDING) {
                that.reason = reason
                that.status = REJECTED
                // setTimeout(() => {
                that.rejCallbacks.forEach(cb => cb(reason))
                // })
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
                    reject(e)
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
                    reject(e)
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

// tests using mocha
// https://github.com/promises-aplus/promises-tests

() => {
    let x = onFulfilled()
    resolve(x)
}