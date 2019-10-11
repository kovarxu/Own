// https://leetcode.com/problems/median-of-two-sorted-arrays/
// There are two sorted arrays nums1 and nums2 of size m and n respectively.
// Find the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).
// You may assume nums1 and nums2 cannot be both empty.
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function(nums1, nums2) {
  let len1 = nums1.length, len2 = nums2.length
  let cen1 = Math.floor(len1 / 2), cen2 = Math.floor(len2 / 2)
  // nums[len] < nums[cen]
};