// https://leetcode.com/problems/divide-two-integers/
// Given two integers dividend and divisor, divide two integers without using multiplication, division and mod operator.
// Return the quotient after dividing dividend by divisor.
// The integer division should truncate toward zero.

/**
 * @param {number} dividend
 * @param {number} divisor
 * @return {number}
 */
const MAX_NUM = Math.pow(2, 31) - 1
const MIN_NUM = -1 - MAX_NUM

var divide = function(dividend, divisor) {
  if (dividend === 0) return 0
  if (dividend > MAX_NUM || dividend < MIN_NUM) return MAX_NUM

  var caches = [{num: 0, val: 0}], isNeg = dividend < 0 && divisor > 0 || dividend > 0 && divisor < 0
  var dvd = Math.abs(dividend), dvs = Math.abs(divisor), n = 1
  while (dvs <= dvd) {
    caches.push({
      num: n,
      val: dvs
    })
    n += n
    dvs += dvs
  }

  var left = dvd, i = caches.length - 1, result = 0
  while (i > 0 && left > 0) {
    var val = caches[i].val
    if (left >= val) {
      result += caches[i].num
      left -= val
    }
    i--
  }

  return isNeg ? 0 - result : result
};
