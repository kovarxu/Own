// https://leetcode.com/problems/container-with-most-water/solution/
// We have to maximize the Area that can be formed between the vertical lines using the shorter line as length and the distance between the lines as the width of the rectangle forming the area.

/**
 * @param {number[]} height
 * @return {number}
 */
// online algorithm
var maxArea = function(height) {
  let left = 0, right = height.length-1, maxArea = 0
  while(left !== right) {
    let lower = Math.min(height[left], height[right])
    let onlineArea = (right-left) * lower
    if (onlineArea > maxArea) {
      maxArea = onlineArea
    }
    if (lower === height[left]) left++
    else right--
  }
  return maxArea
};