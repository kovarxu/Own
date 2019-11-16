// https://leetcode.com/problems/longest-valid-parentheses/
// Given a string containing just the characters '(' and ')', find the length of the longest valid (well-formed) parentheses substring.

/**
 * @param {string} s
 * @return {number}
 */

// a very basic dynamic program problem

var longestValidParentheses = function(s) {
  var L = [0]
  var LB = '(', RB = ')'
  for (var i = 1; i < s.length; i++) {
    if (s[i] === RB && s[i-L[i-1]-1] === LB)
      L[i] = L[i-1] + 2 + (L[i-L[i-1]-2] || 0)
    else 
      L[i] = 0
  }
  return Math.max.apply(null, L)
};
