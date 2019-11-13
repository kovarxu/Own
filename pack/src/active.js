const _ = require('lodash')

exports.getList = function () {
  let l = [1, 2, 3, 0, 66]
  _.compact(l)
  return l
}
