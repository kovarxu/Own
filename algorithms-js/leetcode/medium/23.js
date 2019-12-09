// https://leetcode-cn.com/problems/powx-n/
// Implement pow(x, n), which calculates x raised to the power n (xn).

/**
 * @param {number} x
 * @param {number} n
 * @return {number}
 */
// 75.78% / 5.69%
var myPow = function(x, n) {
  if (n === 0  && x !== 0) return 1
  let s = Math.sign(n)
  n *= s
  let binary_n = n.toString(2)
  let len = binary_n.length; r = Array(len).fill(1)

  let result = 1
  for (let i = len-1; i >=0 ; i--) {
    if (i == len-1) r[i] = x
    else r[i] = r[i+1] * r[i+1]
    
    if (binary_n[i] == '1') result *= r[i]
  }
  
  return s > 0 ? result : 1 / result
};

// 
