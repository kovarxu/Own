// https://leetcode-cn.com/problems/trapping-rain-water/
// Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it is able to trap after raining.
// https://leetcode-cn.com/problems/trapping-rain-water/solution/
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

var trap = function(height) {
  let stack = [0], sum = 0
  stack.top = function(){
    return this[this.length - 1]
  }
  for (let i = 1; i < height.length; i++) {
    while (height[i] > height[stack.top()]) {
      let l = stack.pop()
      let h = height[l]
      while (stack.length > 0 && h == height[stack.top()]) {
         stack.pop()
      }
      if (stack.length == 0) { stack.length = 0 }
      else {
        l = stack[stack.length - 1]
        let lheight = Math.min(height[i], height[l]) - h
        let offset = i - l - 1
        sum += lheight * offset
      }
    }
    stack.push(i)
    
  }
  return sum
};
