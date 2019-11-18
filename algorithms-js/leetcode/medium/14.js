/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
// I am not familiar with binary search so this problem costs me much time
// binary search has boundary conditions, so as this problem
var search = function(nums, target) {
  if (nums.length == 0) return -1;
  else if (nums.length == 1) return nums[0] == target ? 0 : -1;

  // first find the pivot
  let i = 0, j = nums.length - 1, pivot = ((i + j) / 2) | 0;
  while (j > i + 1) {
    if (nums[pivot] > nums[i])
      i = pivot;
    else if (nums[pivot] < nums[j])
      j = pivot;
    pivot = ((i + j) / 2) | 0;
  }
  pivot = nums[j] > nums[i] ? j : i;

  let ll = nums.slice(0, pivot + 1);
  let rl = nums.slice(pivot + 1);
  
  if (target >= ll[0]) {
    return findInArray(ll, target);
  } else {
    let idInArray = findInArray(nums.splice(pivot + 1), target);
    return idInArray == -1 ? -1 : idInArray + pivot + 1;
  }

  // do the binary search
  function findInArray(arr, target) {
    if (arr.length == 0) return -1;
    let i = 0, j = arr.length - 1, mid;
    while (j > i + 1) {
      mid = ((i + j) / 2) | 0;
      if (arr[mid] == target) {
        return mid;
      } else if (arr[mid] > target) {
        //left
        j = mid;
      } else {
        //right
        i = mid;
      }
    }
    if (arr[i] == target) return i;
    if (arr[j] == target) return j;
    return -1;
  }
};