// https://leetcode-cn.com/problems/first-missing-positive/
// Given an unsorted integer array, find the smallest missing positive integer.
/**
 * @param {number[]} nums
 * @return {number}
 */
var firstMissingPositive = function(nums) {
  let len = nums.length;
  let save = Array(len);
  for (let i = 0; i < len; i++) {
    if (nums[i] >= 0) {
      save[nums[i]] = true;
    }
  }
  if (!save[1]) return 1;
  for (var i = 1; i < save.length - 1; i++) {
    if (save[i] && !save[i+1]) {
      return i+1;
    }
  }
  return i+1;
};
