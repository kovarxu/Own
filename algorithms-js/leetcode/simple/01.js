// https://leetcode.com/problems/two-sum/
// Given an array of integers, return indices of the two numbers such that they add up to a specific target.
// You may assume that each input would have exactly one solution, and you may not use the same element twice.
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
// var twoSum = function(nums, target) {
//     for (var i = 0; i < nums.length; i++) {
//         var num = nums[i]
//         var desire = target - num
//         for (var j = i+1; j < nums.length; j++) {
//             if (nums[j] === desire) {
//                 return [i, j]
//             }
//         }
//     }
// };
var twoSum = function(nums, target) {
  var hashtable = {}
  for (var i = 0; i < nums.length; i++) {
      var num = nums[i]
      var desire = target - num
      if (hashtable[desire] !== undefined) {
          return [hashtable[desire], i]
      } else {
          hashtable[num] = i
      }
  }
};