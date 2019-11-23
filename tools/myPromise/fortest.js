var Promise = require('./demo')

new Promise((resolve, reject) => {
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


new Promise((resolve, reject) => {
  resolve(23);
})
.then(data => {
  return data + 2;
})
.then(data => {
  throw new Error('I am an error')
})
.then(data => {
  return data;
}, err => {
  return err;
})
.catch(err => {
  console.log(err);
  return err.toString();
})


var p1 = new Promise((resolve, reject) => {
  resolve(345);
}).then((data) => {
  return new Promise((resolve, reject) => {
    resolve('abc');
  })
  .then(data => { console.log(data) })
  .then(data => { console.log(data + 'def') })
}).then(data => { console.log(data) + 125})