// https://leetcode-cn.com/problems/multiply-strings/
// Given two non-negative integers num1 and num2 represented as strings, return the product of num1 and num2, also represented as a string.

/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
// 竖式乘法
// 可以根据规律进行优化（没做）
var multiply = function(num1, num2) {
  let result = ''
  let len1 = num1.length, len2 = num2.length
  for (let i = 0; i < len1; i++) {
    let st = ''
    for (let j = 0; j < len2; j++) {
      let product = num1[len1-i-1] * num2[len2-j-1]
      st = hip(st, String(product), j)
    }
    result = hip(result, st, i)
  }
  return result

  function hip(dest, num, i) {
    if (dest.length == 0 || dest == '0' && num == '0') return num
    while (i--) num = num + '0'
    let dlen = dest.length, nlen = num.length
    let addition = 0, result = '', len = Math.max(dlen, nlen)
    for (let i = 0; i < len; i++) {
      let s = Number(dest[dlen-i-1] || 0) + Number(num[nlen-i-1] || 0) + addition
      if (s >= 10) {
        s = s % 10
        addition = 1
      } else {
        addition = 0
      }
      result = s + result
    }
    return addition ? '1' + result : result
  }
};

