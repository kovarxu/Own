// https://leetcode-cn.com/problems/permutations/
// Given a collection of distinct integers, return all possible permutations.
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function(nums) {
  let result = []
  let rest = nums.slice()
  let arr = []
  permutation(rest, arr, result)
  return result
  function permutation (rest, arr, result) {
    if (rest.length == 0) return result.push(arr.slice())
    for (let i in rest) {
      let elm = rest[i]
      arr.push(elm)
      permutation(rest.splice(i, 1), arr, result)
      arr.pop()
    }
  }
};
