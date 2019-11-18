// https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/
// Given an array of integers nums sorted in ascending order, find the starting and ending position of a given target value
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */

var searchRange = function(nums, target) {
  // first, find the pivot
  let i = 0, j = nums.length - 1, pivot = -1;
  let result = [-1, -1];
  // boundary conditions
  if (nums.length == 0) return result;
  else if (nums.length == 1) return nums[0] == target ? [0, 0] : result;

  // maybe this is the best binary search pattern!
  // diminish the boundary conditions in the while loop
  while (j >= i) {
    pivot = ((i + j) / 2) | 0;
    
    if (nums[pivot] == target) {
      result = [pivot, pivot];
      break;
    } else if (nums[pivot] > target) {
      j = pivot === j ? pivot - 1: pivot;
    } else {
      i = pivot === i ? pivot + 1: pivot;
    }
  }

  if (result[0] != -1) {
    i = j = result[0];
    while (i >= 0 && nums[i] == target) i--;
    while (j < nums.length && nums[j] == target) j++;
    result = [i+1, j-1];
  }

  return result;
}

