// 4. 终极版本Pro
// 满足Promise A+ 规范

var $uid = 0
var PENDING = 'pending'
var FULFILLED = 'fulfilled'
var REJECTED = 'rejected'

function Pro(fns) {
    this.value = undefined
    this.ps = [this]
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
    return this.status
}

function reject(rej) {
    this.value = rej
    this.status = REJECTED
    return this.status
}


Pro.prototype.then = function(onFulfilled, onRejected) {
    let value = this.value

    let newp = Pro.resolve(value)
    newp.status = PENDING
    newp.res = typeof onFulfilled === 'function' ? onFulfilled : null
    newp.rej = typeof onRejected === 'function' ? onRejected : null
    newp.ps = this.ps.concat(newp.ps)
    newp.isthen = true

    clearTimeout(this.timer)

    newp.timer = setTimeout(()=>{
        let value
        let curp = newp.ps.shift()
        let curStatus = curp.status
        timerFunc()

        function timerFunc() {
            if (!curp.isthen && curp.status === PENDING) {
                setTimeout(timerFunc)
            } else {
                if (!curp.isthen) curStatus = curp.status

                let method = curStatus === REJECTED ? 'rej' : 'res'

                try {
                    if (curp[method]) {
                        value = curp[method].call(null, value)
                        curStatus = resolve.call(curp, value)
                    } else if (!curp.isthen) {
                        value = curp.value
                    } else {
                        // do nothing but pass down
                        if (curStatus === FULFILLED) resolve.call(curp, value)
                        else if (curStatus === REJECTED) reject.call(curp, value)
                    }
                } catch (e) {
                    curStatus = REJECTED
                    reject.call(curp, value)
                }

                if (curp.isthen && value) {
                    if (typeof value.then === 'function' && value.__proto__ !== Pro.prototype) {
                        value = new Pro(value.then)
                    }

                    if (value.__proto__ === Pro.prototype) {
                        if (value._uid <= curp._uid)
                            throw new TypeError('can not set chain promise')

                        curp.status = PENDING
                        curp.rej = curp.res = null
                        value.ps.push(curp)

                        newp.ps = value.ps.concat(newp.ps)
                        // prevent execution of Pros in then
                        clearTimeout(value.timer)
                    }
                }

                if (newp.ps.length) {
                    curp = newp.ps.shift()
                    timerFunc()
                }
            }
        }
    })

    return newp
}

Pro.resolve = function(data) {
    return new Pro((res,rej)=>{
        res(data)
    }
    )
}

Pro.reject = function(err) {
    return new Pro((res,rej)=>{
        rej(err)
    }
    )
}

var p1 = new Pro((resolve, reject) => {resolve(1)}).then()
.then(data => console.log(data))
var p2 = new Promise((resolve, reject) => {resolve(1)})


// -----------------------------------

Promise.resolve = function (data) {
    return new Promise((res, rej) => {res(data)})
}

Promise.reject = function (err) {
    return new Promise((res, rej) => {rej(err)})
}

Promise.all = function (iterable) {
    let sum = 0
    let mp = Promise.resolve()
    let wm = new WeakMap()
    
    mp.status = PENDING
    mp.isthen = false

    if (typeof iterable[Symbol.iterator] !== 'function') {
        throw new TypeError('Promise.all need an iterable parameter')
    }
    for (let p of iterable) {
        if (p.__proto__ !== Promise.prototype) {
            throw new TypeError('Promise.all need Promise items')
        }
        ++sum

        p.then((data) => {
            wm.set(p, data)
            if (--sum === 0) {
               let l = []
               for (p of iterable) {
                   l.push(wm.get(p))
               }
               resolve.call(mp, l) 
            }
        })
    }

    return mp
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