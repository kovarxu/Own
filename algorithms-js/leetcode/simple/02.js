// https://leetcode.com/problems/reverse-integer/
// Given a 32-bit signed integer, reverse digits of an integer.
/**
 * @param {number} x
 * @return {number}
 */
const SAFE_MAX = Math.pow(2, 31) - 1
const SAFE_MIN = -Math.pow(2, 31)

var reverse = function(x) {
  if (x > SAFE_MAX || x < SAFE_MIN) return 0
  let k = x < 0 ? -1: 1
  x = Math.abs(x)
  let y = x, r = 0
  while (Math.abs(y) >= 10) {
    let t = y / 10 | 0
    r = 10 * r + y - t * 10
    y = t
  }
  r = k * (10 * r + y)
  if (r > SAFE_MAX || r < SAFE_MIN) return 0
  return r
};