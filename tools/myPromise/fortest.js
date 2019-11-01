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