/**
 * @param {number[]} height
 * @return {number}
 */
// 接雨水
// https://leetcode-cn.com/problems/trapping-rain-water/
var trap = function(height) {
  // 思路：从左到右一次，然后从右到左一次，取最低点
  // [4,2,0,3,2,5] ==> 9
  const left = new Array(height.length);
  let m = 0;
  let i = 0;
  let sum = 0;

  for (; i < height.length; i++) {
    if (height[i] > m) {
      m = height[i];
    }
    left[i] = m;
  }

  m = 0;
  for (--i; i >= 0; i--) {
    if (height[i] > m) {
      m = height[i];
    }
    const store = Math.min(m, left[i]) - height[i];
    sum += store;
  }
  return sum;
};

// 双指针法
// 1. i处能积的水，取决于其左右两边的高度
// 2. 对于从左向右看，左边的标准可信，右边的不可信
// 3. 对于从右往左看，右边的标准可信，左边的不可信
var trap = function(height) {
  let leftMost = 0;
  let rightMost = 0;
  let i = 0;
  let j = height.length - 1;
  let sum = 0;
  let move = 'left';

  while (i !== j) {
    if (move === 'left') {
      if (height[i] > leftMost) {
        leftMost = height[i];
      }
      if (height[i] > rightMost) {
        move = 'right';
      } else {
        sum += leftMost - height[i];
        i++;
      }
    } else {
      if (height[j] > rightMost) {
        rightMost = height[j];
      }
      if (height[j] > leftMost) {
        move = 'left';
      } else {
        sum += rightMost - height[j];
        j--;
      }
    }
  }

  return sum;
}
