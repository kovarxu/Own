// https://leetcode.com/problems/string-to-integer-atoi/
// Implement atoi which converts a string to an integer.

/**
 * @param {string} str
 * @return {number}
 */
const SAFE_MAX = Math.pow(2, 31) - 1
const SAFE_MIN = -Math.pow(2, 31)

var myAtoi = function(str) {
  let length = str.length, r = 0, s = 0
  for (let i = 0; i < length; i++) {
    if (!s && i === ' ') continue
    else if (!s && i === '+') s = 1
    else if (!s && i === '-') s = -1
    else if (i >= '0' && i <= '9') r = r * 10 + (i - 0), s = s || 1
    else break
  }
  r = r * (s ? s : 1)
  if (r > SAFE_MAX) return SAFE_MAX
  else if (r < SAFE_MIN) return SAFE_MIN
  else return r
};


// -------------------------- // 
var SAFE_MAX = Math.pow(2, 31) - 1
var SAFE_MIN = -Math.pow(2, 31)

var myAtoi = function (str) {
  let r = 0
  let m = str.match(/(?<=^ *)([+-]?\d+)/)
  if (m) r = Number(m[1])
  if (r > SAFE_MAX) return SAFE_MAX
  else if (r < SAFE_MIN) return SAFE_MIN
  else return r
}