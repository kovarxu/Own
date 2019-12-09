// https://leetcode-cn.com/problems/permutations/
// Given a collection of distinct integers, return all possible permutations.
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
// 96.46% / 51.85%
var permute = function(nums) {
  let result = []
  let rest = nums.slice()
  let arr = []
  permutation(rest, arr, result)
  return result
  function permutation (rest, arr, result) {
    if (rest.length == 0) return result.push(arr.slice())
    let i = rest.length
    for (let i = 0; i < rest.length; i++){
      let elm = rest[i]
      arr.push(elm)
      let sr = rest.slice()
      sr.splice(i, 1)
      permutation(sr, arr, result)
      arr.pop()
    }
  }
};

// https://leetcode-cn.com/problems/permutations-ii/
// Given a collection of numbers that might contain duplicates, return all possible unique permutations.
// 87.69% / 77.97%
var permuteUnique = function(nums) {
  let result = []
  let rest = nums.slice()
  let arr = []
  rest.sort((a, b) => a - b)
  permutation(rest, arr, result)
  return result
  function permutation (rest, arr, result) {
    if (rest.length == 0) return result.push(arr.slice())
    for (let i = 0; i < rest.length; i++){
      if (i > 0 && rest[i] == rest[i-1]) continue
      let elm = rest[i]
      arr.push(elm)
      let sr = rest.slice()
      sr.splice(i, 1)
      permutation(sr, arr, result)
      arr.pop()
    }
  }
};
