// https://leetcode.com/problems/combination-sum-ii/
// Given a collection of candidate numbers (candidates) and a target number (target), find all unique combinations in candidates where the candidate numbers sums to target.

// Each number in candidates may only be used once in the combination.

/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum2 = function(candidates, target) {
  candidates.sort((a,b) => a-b);
  let result = [];
  let curSum = 0, cum = [];
  search(0, curSum, target, cum, result);

  function search(index, curSum, target, cum, result) {
    if (curSum == target) {
      result.push(cum.slice());
      return true;
    } else if (curSum < target && index < candidates.length) {
      for (let j = index; j < candidates.length; j++) {
        // get gid of repeat
        if (j > index && candidates[j] == candidates[j-1]) continue;
        let dum = cum.slice();
        let next = candidates[j];
        dum.push(next);
        if (search(j+1, curSum + next, target, dum, result)) break;
      }
    }
  }
  
  return result;
};
