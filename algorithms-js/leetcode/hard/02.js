// https://leetcode.com/problems/regular-expression-matching/
// Given an input string (s) and a pattern (p), implement regular expression matching with support for '.' and '*'.
/**
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 */

// recursive algorithm
// L(s,p)
// if (p[0] == '*') then ...
// elif (s[0] == p[0] || p[0] == '.') then ...
function isMatch(s, p) {
  var ls = s.length, lp = p.length
  if (!lp) return !ls
  var first_match = ls > 0 && (s[0] === p[0] || p[0] === '.') 
  if (lp > 1 && p[1] === '*') {
      return isMatch(s, p.substring(2)) || (first_match && isMatch(s.substring(1), p))
  } else {
      return first_match && isMatch(s.substring(1), p.substring(1))
  }
}

// dynamic program
// optimal substructure --- L[i, j]
// convert:
// if s[j] is * then L[i][j] = L[i][j-2] || isMatch && L[i-1][j]
// else L[i][j] = isMatch && L[i-1][j-1]
// resolve direction: Bottom Up
// border condition:
// diminish border --- create a bigger array
// s = 'ab' p = '.*'
var isMatch = function(s, p) {
  let ls = s.length, lp = p.length;
  let L = Array.from({ length: ls+1 }, () => Array(lp+1).fill(false))
  L[ls, lp] = true
  for (let i = ls; i >= 0; i--) {
    for (let j = lp - 1; j >= 0; j--) {
      let firstMatch = i < ls && (s[i] === p[j] || p[j] === '.')
      if (j + 1 < lp && p[j+1] === '*') {
        L[i][j] = L[i][j+2] || isMatch && L[i+1][j]
      } else {
        L[i][j] = (j < lp-1) && firstMatch && L[i+1][j+1]
      }
    }
  }
  return L[0][0]
};
