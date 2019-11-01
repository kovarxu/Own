// https://leetcode.com/problems/implement-strstr/
// Return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.

/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
// slove by dynamic programming
// L[i-1, j-1] = true if S[i] == R[j] && L[i-1][j-1] else false
var strStr = function(haystack, needle) {
  var ls = haystack.length, ns = needle.length
  if (ls < ns) return -1
  if (ls == ns) return haystack === needle ? 0 : -1;
  var L = Array.from({length: ls+1}, () => new Array(ns+1).fill(false))
  for (var i = 0; i <= ls; i++) {
    for (var j = 0; j <= ns; j++) {
      if (i == 0 && j != 0) L[i][j] = false
      else if (j == 0) L[i][j] = true
      else if (haystack[i-1] == needle[j-1] && L[i-1][j-1]) {
        L[i][j] = true
      }
    }
  }
  for (i = 0; i <= ls; i++) {
    if (L[i][ns]) {
      return i - ns
    }
  }
  return -1
};

// solve by in-built methods
var strStr = function(haystack, needle) {
  var ls = haystack.length, ns = needle.length
  if (ls < ns) return -1
  for (var i = 0; i <= ls-ns; i++) {
    if (haystack.substr(i, ns) == needle) {
      return i
    }
  }
  return -1
};
