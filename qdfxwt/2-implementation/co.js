// 要领：
// 1. 每条await语句转化为一条yield语句
// 2. 每条await语句返回一个Promise，如果await之后不是Promise则包装成为Promise过链
// 3. 使用自循环，不使用while，因为while在同步编程中无法暂停，将导致死循环
function co(generator) {
  let result = generator.next();
  let { value: step, done } = result;
  let chain;
  let _resolve;
  let _reject;
  let p = new Promise((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  });
  // 边界条件：async foo() { return 3 } => Promise<fullfilled, 3>
  if (done) {
    return Promise.resolve(step);
  }

  const preceed = function() {
    if (step && typeof step.then === 'function') {
      // 返回值是promise，则形成promise链
      chain = step;
    } else {
      // 返回值不是promise，包装一下
      chain = Promise.resolve(step);
    }
    chain.then(() => {
      result = generator.next();
      done = result.done;
      step = result.value;

      if (!done) {
        preceed();
      } else {
        _resolve(step);
      }
    }, (reason) => {
      _reject(reason);
    })
  }
  preceed();

  return p;
}

// example
/*
function* gen() {
  console.log(111);
  yield bar();
  yield console.log(222);
  return 3;
}

async function bar() {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 1000);
  }).then(() => console.log('after 1000ms'));
}

co(gen());

// 等价于
async function foo() {
  console.log(111);
  await bar();
  await console.log(222);
  return 3;
}
*/
