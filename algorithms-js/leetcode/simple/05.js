// https://leetcode.com/problems/search-insert-position/
// Given a sorted array and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function(nums, target) {
  let l = 0, r = nums.length;
  while (l < r) {
    let m = ((l + r) / 2) | 0;
    if (nums[m] >= target) r = m;
    else l = m + 1;
  }
  return l;
};

// search in array
// binary search is cheap but useful

function searchInArray (nums, target, bit) {
  let l = 0, r = nums.length;
  bit = bit | 1;
  while (l < r) {
    let m = ((l + r) / 2) | 0;
    // notice1: bit 1 -- ascendent(default); bit -1 -- decendent;
    // notice2: r should not be m - 1
    if (nums[m]*bit > target*bit) r = m;
    else if (nums[m] == target) return m;
    else l = m + 1;
  }
  return -1;
}
