// https://leetcode.com/problems/generate-parentheses/submissions/
// Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.
/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function(n) {
  var set = new Set()
  g('', 0, n)
  function g(pre, numInstack, remain) {
    if (numInstack !== 0) {
      g(pre + ')', numInstack - 1, remain)
    }
    if (remain > 0) {
      g(pre + '(', numInstack + 1, remain - 1)
    }
    else {
      let result = pre
      for (let i = 0; i < numInstack; i++) {
        result += ')'
      }
      set.add(result)
    }
  }
  return Array.from(set)
};