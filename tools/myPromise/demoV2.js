/* page 1 */
// 回调地狱
$.ajax({
  url: 'protocol://host:port/pathname1',
  method: 'GET',
  success: function (data) {
    $.ajax({
      url: 'protocol://host:port/pathname2',
      method: 'POST',
      data: someData,
      success: function (data) {
        $.ajax({
          url: 'protocol://host:port/pathname3',
          method: 'GET',
          data: someData,
          success: function (data) {
            $.ajax({
              url: 'protocol://host:port/pathname4',
              method: 'POST',
              success: function (data) {
                /* ... */
              }
            })
          }
        })
      }
    })
  }
})

// Promise
new Promise((resolve, reject) => {
  $.ajax({
    url: 'protocol://host:port/pathname1',
    method: 'GET',
    success: function (data) {
      resolve(data)
    }
  })
}).then((data) => {
  $.ajax({
    url: 'protocol://host:port/pathname2',
    method: 'POST',
    data: someData,
    success: function (data) {
      resolve(data)
    }
  })
}).then(...)

/* page 2 */
var p = new Promise((resolve, reject) => {
  setTimeout(() => resolve(99), 5000)
}).then(data => {
  console.log(++data);
  return data;
})

var p = new Promise((resolve, reject) => {
  reject('abc')
})

p.then((data) => {
  console.log('in res ' + data)
}, (err) => {
  console.log('in rej ' + err)
})

/* page 3 */
var p = new Promise((resolve, reject) => {
  resolve('a')
})

var p = new Promise((resolve, reject) => {
  resolve('a')
}).then(data => {
  console.log('a');
  return data + 'b'
})

var p = new Promise((resolve, reject) => {
  resolve('a')
}).then(data => {
  console.log('a');
  return data + 'b'
}, err => {
  console.log(err)
  return err + 'e'
})

var p = new Promise((resolve, reject) => {
  resolve('a')
}).then(data => {
  console.log('a');
  return data + 'b'
}, err => {
  console.log(err)
  return err + 'e'
}).then(data => {
  console.log('a');
  return data + 'b'
}, err => {
  console.log(err)
  return err + 'e'
})

p.then((res) => {
  console.log('a');
  return data + 'b'
})

p.then((res) => {
  console.log('a');
  return data + 'b'
})

var p = new Promise((resolve, reject) => {
  resolve('a')
}).then(data => {
  console.log('a');
  return data + 'b'
}, err => {
  console.log(err)
  return err + 'e'
}).then(data => {
  console.log('a');
  return new Promise((resolve, reject) => {
    resolve('x')
  })
}, err => {
  console.log(err)
  return err + 'e'
})

p.then((res) => {
  console.log('a');
  return data + 'b'
})

p.then((res) => {
  console.log('a');
  return data + 'b'
})

var p = new Promise((resolve, reject) => {
  resolve('a')
}).then(data => {
  console.log('a');
  return data + 'b'
}, err => {
  console.log(err)
  return err + 'e'
}).then(data => {
  console.log('a');
  return new Promise((resolve, reject) => {
    resolve('x')
  })
}, err => {
  console.log(err)
  return new Promise((resolve, reject) => {
    reject('e')
  })
})

p.then((res) => {
  console.log('a');
  return data + 'b'
})

p.then((res) => {
  console.log('a');
  return data + 'b'
})

// sugar
Promise.resolve(data)

new Promise((resolve, reject) => {
  resolve(data)
})

// sugar
Promise.reject(reason)

new Promise((resolve, reject) => {
  reject(reason)
})

// sugar
PromiseInstance.catch(err => {
  ...
})

PromiseInstance.then(null, err => {
  ...
})


new Promise((resolve, reject) => {
  console.log('abc')
  resolve(1)
  reject(2)
  resolve(3)
  console.log('def')
}).then(data => {
  console.log(data)
})

new Promise((resolve, reject) => {
  resolve(1)
}).then(345)
.then(Promise.resolve('a'))
.then(Promise.reject('b'))
.then(data => {
  console.log(data)
})

new Promise((resolve, reject) => {
  resolve(1)
}).then(data => {
  console.log(1)
  return {
    then (resolve, reject) {
      setTimeout(() => {
        resolve(++data)
      }, 1000)
    }
  }
}).then(data => {
  console.log(data)
})

new Promise((resolve, reject) => {
  resolve(new Promise((resolve, reject) => {
    resolve(100)
  }).then(data => {
      console.log('在内部')
      return data + 1
    })
  )
}).then(data => {
  console.log('在外部 ' + data);
})

// error
new Promise((resolve, reject) => {
  resolve(1)
}).then(data => {
  return new Error('错了！')
}).then(data => {
  console.log('In res ' + data)
}, err => {
  console.log('In rej ' + err)
})

new Promise((resolve, reject) => {
  resolve(1)
}).then(data => {
  throw new Error('reason')
}).then(data => {
  console.log('In res ' + data)
}, err => {
  console.log('In rej ' + err)
})

throw new Error('reason')
return Promise.reject('reason')
