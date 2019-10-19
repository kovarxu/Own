// https://leetcode.com/problems/3sum-closest/
// Given an array nums of n integers and an integer target, find three integers in nums such that the sum is closest to target. Return the sum of the three integers. You may assume that each input would have exactly one solution.

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
// 1. sort
// 2. i from 0 through n-2, j from i through n-1
// 3. 
var threeSumClosest = function(nums, target) {
  nums.sort(function(a,b) {return a-b})

  let closet = Infinity
  for (let i = 0; i < nums.length - 2; i++) {
    let p = nums.length - 1
    for (let j = i+1; j < nums.length - 1; j++) {
      for (let k = p+1; k < nums.length - 1; k++) {
        let r = nums[i] + nums[j] + nums[k] - target
        if (Math.ceil(r) < closet) closet = Math.ceil(r)
        else if (r > 0) break
      }
      while (p-- > j) {
        let r = nums[i] + nums[j] + nums[p] - target
        if (Math.ceil(r) < closet) closet = Math.ceil(r)
        else if (r < 0) break
      }
      if (p <= j) break
    }
  }
};
