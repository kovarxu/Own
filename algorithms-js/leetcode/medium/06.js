// https://leetcode.com/problems/integer-to-roman/
// Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.

// Symbol       Value
// I             1
// V             5
// X             10
// L             50
// C             100
// D             500
// M             1000
// I can be placed before V (5) and X (10) to make 4 and 9. 
// X can be placed before L (50) and C (100) to make 40 and 90. 
// C can be placed before D (500) and M (1000) to make 400 and 900.

/**
 * @param {number} num
 * @return {string}
 */
var intToRoman = function(num) {
  let digits = [], divide = 1000
  while(num) {
    let n = Math.floor(num / divide)
    num = num - n * divide
    digits.push(n)
    divide /= 10
  }
  // 
  let out = ''
  // while(digits[0]--) out += 'M'
  //
  const symbols = ['*', 'M', 'D', 'C', 'L', 'X', 'V', 'I']
  for (let i = 0; i < symbols.length / 2; i ++) {
    if (digits[i] === 9) {
      out += symbols[i*2+1] + symbols[i*2-1];
      continue
    }
    if (digits[i] >= 5) out += symbols[i*2], digits[i] -= 5
    if (digits[i] === 4) {
      out += symbols[i*2+1] + symbols[i*2];
      continue
    }
    while(digits[i]--) out += symbols[i*2+1]
  }
  return out
};
