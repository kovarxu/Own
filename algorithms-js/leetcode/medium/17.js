// https://leetcode.com/problems/combination-sum/
// Given a set of candidate numbers (candidates) (without duplicates) and a target number (target), find all unique combinations in candidates where the candidate numbers sums to target.

// The same repeated number may be chosen from candidates unlimited number of times.

// Input: candidates = [2,3,5], target = 8,
// A solution set is:
// [
//   [2,2,2,2],
//   [2,3,3],
//   [3,5]
// ]

/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
// recursion
var combinationSum = function(candidates, target) {
  let results = [];
  let buffer = [];
  let startIndex = 0;
  search(candidates, startIndex, target, buffer, results);
  return results;
};

function search(candidates, startIndex, target, buffer, results) {
  if (target == 0) {
    results.push(buffer.slice());
  } else if (target > 0) {
    let s = candidates[startIndex];
    buffer.push(s);
    search(candidates, startIndex, target-s, buffer, results);
    buffer.pop();
    if (startIndex + 1 < candidates.length)
      search(candidates, startIndex + 1, target, buffer, results);
  }
}

// recursion, with optimization
var combinationSum = function(candidates, target) {
  candidates.sort(function(a,b) { return a-b; })
  let results = [];
  search(0, [], target, candidates, results);
  return results;
};

function search(csum, clist, target, candidates, results) {
  if (csum == target) 
    results.push(clist);
  else if (csum < target) {
    for (let c of candidates) {
      if (csum + c > target)
        break;
      else if (clist.length > 0 && c < clist[clist.length - 1])
        continue;
      else {
        let dlist = clist.slice();
        dlist.push(c);
        search(csum + c, dlist);
      }
    }
  }
}
