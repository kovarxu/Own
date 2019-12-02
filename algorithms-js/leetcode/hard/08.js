// https://leetcode-cn.com/problems/wildcard-matching/

// Input:
// s = "adceb"
// p = "*a*b"
// Output: true
// Explanation: The first '*' matches the empty sequence, while the second '*' matches the substring "dce".

// Input:
// s = "acdcb"
// p = "a*c?b"
// Output: false
// Explanation: "a" does not match the entire string "aa".

/**
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 */
var isMatch = function(s, p) {
  if (s == '') {
    if (/^\**$/.test(p)) return true
    return false
  }
  if (p == '') return s == ''
  // S[i][j] = true if (S[i-1][j-1] && (s[i] == p[j] || p[j] in '?*')) || (p[j] == '*' && S[i-1][j])
  let S = Array.from({ length: s.length + 1 }, () => new Array(p.length + 1).fill(false))
  for (let k = 0; k <= p.length; k++) {
    if (p[k] == '*') S[0][k+1] = true
    else break
  }
  S[0][0] = true
  for (var i = 0; i < s.length; i++) {
    for (var j = 0; j < p.length; j++) {
      if (S[i][j] && (s[i] == p[j] || p[j] == '?' || p[j] == '*')) {
        S[i+1][j+1] = true
      } else if (p[j] == '*' && (S[i][j+1] || S[i+1][j])) {
        S[i+1][j+1] = true
      }
    }
  }
  return S[i][j]
};