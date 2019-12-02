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

/* page 2 状态 */
var p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(99)
    console.log('fulfilled')
  }, 5000)
})

var p = new Promise((resolve, reject) => {
  reject('abc')
})

p.then((data) => {
  console.log('in res ' + data)
}, (err) => {
  console.log('in rej ' + err)
})

/* page 3 结构 */
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

/* page 4 执行顺序 */
console.log('外部动作1')
setTimeout(() => {
  console.log('setTimeout 动作')
})

var p = new Promise((resolve, reject) => {
    console.log("log: 外部promise");
    resolve();
  })
  .then(() => {
    console.log("log: 外部第一个then");
    new Promise((resolve, reject) => {
      console.log("log: 内部promise");
      resolve();
    })
      .then(() => {
        console.log("log: 内部第一个then");
      })
      .then(() => {
        console.log("log: 内部第二个then");
      });
  })
  .then(() => {
    console.log("log: 外部第二个then");
  });

console.log('外部动作2')

/* page 5 语法糖 */

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

/* page 6 错误处理 */
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

/* page 7 A+规范边界条件 */
// 取第一个值
new Promise((resolve, reject) => {
  console.log('abc')
  resolve(1)
  reject(2)
  resolve(3)
  console.log('def')
}).then(data => {
  console.log(data)
})

// 穿透
new Promise((resolve, reject) => {
  resolve(1)
}).then(345)
.then(Promise.resolve('a'))
.then(Promise.reject('b'))
.then(data => {
  console.log(data)
})

// 循环引用
var p = Promise.resolve('yes').then(() => {
  return p
})
.then(() => {
  console.log('data')
},() => {
  console.log('error')
})

// thenable
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

// *** resolve Promise
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

/* page 8 async */ 
async function foo () {
  let data = await bar()
  console.log(data)
}

function bar () {
return Promise.resolve(1).then((data) => {
  setTimeout(console.log, 1000, data + 2)
})
}

var f = foo()
