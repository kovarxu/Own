const tsPattern = () => {
  // pattern 1
  function logger (func, ...arg) {
    console.log(func.name + ' is executed by logger1 ...')
    return func.apply(null, arg)
  }

  // pattern 2
  function loggerWrapper (func) {
    return function (...arg) {
      console.log(func.name + ' is executed by logger2 ...')
      return func.apply(null, arg)
    }
  }

  function add (...arg) {
    return arg.reduce((x, y) => x + y)
  }

  // pattern 1 test
  console.log(logger(add, 1, 2, 3))

  // pattern 2 test
  let log = loggerWrapper(add)
  console.log(log(1, 2, 3))
}

const act = function (acc, cur, curIndex, arr) {
  if (curIndex % 3 === 0) {
    arr.pop()
  }
  return acc + cur
}

const arr = [1,2,3,4,5,6]

console.log(arr.reduce(act, ''))
console.log(arr)
