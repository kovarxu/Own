// 1. 实现基本功能

var timer = null

function Pro (fns) {
    this.value = undefined
    this.cbs = []
    this.status = 'pending'
    // care about it
    fns(resolve.bind(this), reject.bind(this))
}

function resolve(res) {
    this.value = res
    this.status = 'resolved'
}

function reject(rej) {
    this.value = rej
    this.status = 'rejected'
}

Pro.prototype.then = function (res) {
    let value = this.value
    let newp = new Pro.resolve(value)
    newp.cbs = this.cbs.concat(res)
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
        newp.cbs.forEach(cb => {
            value = cb.call(null, value)
        })
    })
    return newp
}

Pro.resolve = function (data) {
    return new Pro((res, rej) => {res(data)})
}

Pro.reject = function (err) {
    return new Pro((res, rej) => {rej(err)})
}

var p = new Pro((res, rej) => res(11)).then(data => {
    console.log(data + 1)
    return data + 1
}).then(data => {
    console.log(data + 1)
    return data + 1
})

// 3. 终极版本Pro
// 支持穿透、promise.all, then中返回promise

function Pro (fns) {
  this.value = undefined
  this.ps = [this]
  this.res = null
  this.rej = null
  this.status = 'pending'
  this.timer = null
  this.isthen = false
  // care about it
  fns(resolve.bind(this), reject.bind(this))
}

function resolve(res) {
  this.value = res
  this.status = 'resolved'
}

function reject(rej) {
  this.value = rej
  this.status = 'rejected'
}

Pro.prototype.then = function (res, rej) {
  let value = this.value
  let newp = Pro.resolve(value)
  newp.status = 'pending'
  newp.res = res
  newp.rej = rej
  newp.ps = this.ps.concat(newp.ps)
  newp.isthen = true

  clearTimeout(this.timer)

  newp.timer = setTimeout(() => {
      let value
      let err
      let curp = newp.ps.shift()
      timerFunc()

      function timerFunc () {
          if (!curp.isthen && curp.status === 'pending') {
              setTimeout(timerFunc)
          } else {
              if (!err) {
                  try {
                      if (curp.res) {
                          value = curp.res.call(null, value)
                      } else if (!curp.isthen) {
                          value = curp.value
                      }
                      resolve.call(curp, value)
                  } catch (e) {
                      err = e
                  }
              }
              
              if (err) reject.call(curp, err)

              if (value && value.__proto__ === Pro.prototype) {
                  newp.ps = value.ps.concat(newp.ps)
                  // prevent execution of Pros in then
                  clearTimeout(value.timer)
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

Pro.resolve = function (data) {
  return new Pro((res, rej) => {res(data)})
}

Pro.reject = function (err) {
  return new Pro((res, rej) => {rej(err)})
}

Pro.all = function (iterable) {
  let sum = 0
  let mp = Pro.resolve()
  mp.status = 'pending'
  mp.isthen = false

  if (typeof iterable[Symbol.iterator] !== 'function') {
      throw new TypeError('Pro.all need an iterable parameter')
  }
  for (p of iterable) {
      if (p.__proto__ !== Pro.prototype) {
          throw new TypeError('Pro.all need Promise items')
      }
      ++sum

      p.then((data) => {
          if (--sum === 0) {
             resolve.call(mp, data) 
          }
      })
  }

  return mp
}

var p = new Pro((res, rej) => {
  setTimeout(() => res(1), 1000)
}).then(data => {
  console.log(data + 1)
  return data + 1
}).then(data => {
  console.log(data + 1)
  return new Pro((res, rej) => {
     setTimeout(() => res(10), 1000)
  }).then(data => {
      console.log(data + 1)
      return data + 1
  })
}).then().then(data => {
  console.log(data + 1)
  return data + 1
}).then(data => {
  console.log(data + 1)
  return data + 1
})

var p2 = Pro.all([p, new Pro((res, rej) => {
setTimeout(() => res(1), 3000)
})]).then(data => {
console.log(data)
})
