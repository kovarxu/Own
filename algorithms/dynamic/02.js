// https://leetcode.com/problems/longest-substring-without-repeating-characters/
// Given a string, find the length of the longest substring without repeating characters
// 动态规划问题
// 状态转化：
// M[i] = 
// while j in (i-M[i-1], i-1)
  // if s[j] !== s[i] j++
  // else M[i] = i - j
// else M[i] = M[j] +1
// 边界条件：
// M[0] = 1
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
  if (s.length == 0) return 0
  let len = s.length,i,j
  const M = Array(len).fill(1)
  for (i = 1; i < len; i++) {
    let flag = 1
    for (j = i - M[i-1]; j < i; j++) {
      if (s[j] !== s[i]) continue
      else {
        flag = 0
        M[i] = i - j
        break
      }
    }
    if (j === i) {
        M[i] = M[i-1] + 1
    }
  }
  return Math.max.apply(null, M)
};
