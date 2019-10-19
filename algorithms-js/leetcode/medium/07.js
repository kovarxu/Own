// https://leetcode.com/problems/3sum/
// Given an array nums of n integers, are there elements a, b, c in nums such that a + b + c = 0? Find all unique triplets in the array which gives the sum of zero.

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
  const match = []
  nums.sort(function() {return a-b})

  for (let i = 0; i < nums.length - 2; i++) {
    let k = nums.length - 1
    for (let j = i+1; j < nums.length - 1; j++) {
      if (j == k) break
      while (nums[i] + nums[j] + nums[k] > 0) k--
      if (nums[i] + nums[j] + nums[k] === 0) {
        match.push([nums[i] + nums[j] + nums[k]])
      }
    }
  }

  return match
};