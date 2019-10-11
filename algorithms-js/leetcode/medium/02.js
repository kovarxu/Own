// https://leetcode.com/problems/longest-palindromic-substring/
// Given a string s, find the longest palindromic substring in s. You may assume that the maximum length of s is 1000.

/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
  let len = s.length
  let mi, mj, maxlen = 0
  for (let i = 0; i < 2*len; i++) {
    if (i % 2 === 0) {
      let j = 1, mlen = 1
      while (i/2 - j >= 0 && i/2 + j < len && s[i/2-j] === s[i/2+j]) {
        j++, mlen += 2
      }
      if (mlen > maxlen) {
        mi = i/2 - j + 1
        mj = i/2 + j - 1
        maxlen = mlen
      }
    } else {
      let j = 0, mlen = 0
      while ((i-1)/2 - j >= 0 && (i+1)/2 + j < len && s[(i-1)/2 - j] === s[(i+1)/2 + j]) {
        j++, mlen += 2
      }
      if (mlen > maxlen) {
          mi = (i-1)/2 - j + 1
          mj = (i+1)/2 + j - 1
          maxlen = mlen
      }
    }
  }
  return s.slice(mi, mj+1)
};
