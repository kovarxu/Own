// let missions = []
// let len = missions.length
// 顺序处理之后运行callback

(function next (id, len, cur, callback) {
  if (id < len) {
    let fn = missions[id]
    async(fn(cur), function (val) {
      next(++id, len, val, callback)
    })
  } else {
    callback(cur)
  }
})(0, len, undefined, callback)


// 处理一组任务然后运行callback
(function next (callback) {
  let count = 0
  let results = new Array(len)
  for (let i = 0; i < len; i++) {
    let fn = missions[id]
    async(fn(), function (val) {
      results[i] = val
      if (++count === count - 1) {
        callback(results)
      }
    })
  }
})()(callback)
