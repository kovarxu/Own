// https://leetcode.com/problems/next-permutation/solution/
// We need to find the next lexicographic permutation of the given list of numbers than the number formed by the given array.

/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
// the algorithm is as following:
// 4 4 7 5 2 1
// 4 4* 7 5 2 1
// 4 4* 7 5* 2 1
// 4 5 7 4 2 1
// 4 5 (7 4 2 1)
// 4 5 1 2 4 7
var nextPermutation = function(nums) {
  let mi = 0, i = nums.length - 1
  while (i >= 0 && nums[i] > mi) mi = nums[i--]
  let j = i + 1, mi = nums[i]
  while (j < nums.length - 1 && nums[j] > mi) j++
  if (i !== j) {
    let tmp = nums[i]
    nums[i] = nums[j]
    nums[j] = tmp
    let remain = nums.slice(i+1)
    remain.sort((a, b) => a - b)
    Array.prototype.splice.apply(nums, [i+1, remain.length].concat(remain))
  }
};