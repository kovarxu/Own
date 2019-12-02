// https://leetcode-cn.com/problems/trapping-rain-water/
// Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it is able to trap after raining.
/**
 * @param {number[]} height
 * @return {number}
 */
// use stack
var trap = function(height) {
  let stack = [], cum = 0
  for (let i = 0; i < height.length; i++) {
    let current = height[i], len
    while ((len = stack.length) && stack[len - 1] < current) {
      let left = len > 1 ? stack[len - 2] : stack[0]
      let xcum = Math.min(left, current) - stack[len - 1]
      cum += xcum
      stack.length --
    }
    stack.push(current)
  }
  return cum
};
