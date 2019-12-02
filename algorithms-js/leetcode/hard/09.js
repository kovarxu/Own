// https://leetcode-cn.com/problems/jump-game-ii/
// Given an array of non-negative integers, you are initially positioned at the first index of the array.

// Each element in the array represents your maximum jump length at that position.

// Your goal is to reach the last index in the minimum number of jumps

// Input: [2,3,1,1,4]
// Output: 2
/**
 * @param {number[]} nums
 * @return {number}
 */
// brute force

var jump = function(nums) {
  let len = nums.length
  if (len === 1) return 1
  let L = Array(len).fill(Infinity)
  for (let i = len - 2; i >= 0; i++) {
    let step = nums[i]
    if (step >= len - 1 - i) L[i] = 1
    else {
      let l = Infinity
      while (step--) {
        if (L[i + step] < l) {
          l = L[i + step]
        }
      }
      L[i] = l + 1
    }
  }
  return Math.min.apply(null, L)
};

// greddy
// 这个问题贪婪算法恰有最优解
var jump = function(nums) {
  let end = 0, maxPosition = 0, steps = 0
  for (let i = 0; i < nums.length - 1; i++) {
    maxPosition = Math.max(maxPosition, nums[i] + i)
    if (i == end) {
      end = maxPosition
      steps ++
    }
  }
  return steps
}

'[3 2 3 1 2 4 6 5 2 1]'

