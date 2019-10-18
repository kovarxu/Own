// https://leetcode.com/problems/longest-common-prefix/
// Write a function to find the longest common prefix string amongst an array of strings.
// If there is no common prefix, return an empty string "".

/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(strs) {
  if (strs.length === 0) return ''
  if (strs.length === 1) return strs[0]
  var ss = strs.slice().sort()
  var start = ss[0], end = ss[ss.length-1], prefix = ''
  for(var i=0; i < start.length; i++) {
    if (start[i] === end[i]) prefix += start[i]
    else break
  }
  return prefix
};
