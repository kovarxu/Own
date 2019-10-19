// https://leetcode.com/problems/letter-combinations-of-a-phone-number/
// Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent.

// A mapping of digit to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.

/**
 * @param {string} digits
 * @return {string[]}
 */
/**
 * @param {string} digits
 * @return {string[]}
 */
// ---------------73%/25%---------------- // 
var letterCombinations = function(digits) {
  let result = []
  if (digits.length === 0) return result
    
  const digitLetterMap = new Map([
    [2, ['a', 'b', 'c']],
    [3, ['d', 'e', 'f']],
    [4, ['g', 'h', 'i']],
    [5, ['j', 'k', 'l']],
    [6, ['m', 'n', 'o']],
    [7, ['p', 'q', 'r', 's']],
    [8, ['t', 'u', 'v']],
    [9, ['w', 'x', 'y', 'z']],
  ])
  handleCombine(digits, '')

  function handleCombine (nums, prefix) {
    prefix = prefix || ''
    if (nums.length > 0) {
      let first = nums[0]
      let l = digitLetterMap.get(Number(first))
      for(let i = 0; i < l.length; i++) {
        handleCombine(nums.substr(1), prefix + l[i])
      }
    } else {
      result.push(prefix)
    }
  }

  return result
};

// ---------------71%/75%---------------- // 

var letterCombinations = function(digits) {
  let result = []
  if (digits.length === 0) return result
    
  const digitLetterMap = new Map([
    [2, ['a', 'b', 'c']],
    [3, ['d', 'e', 'f']],
    [4, ['g', 'h', 'i']],
    [5, ['j', 'k', 'l']],
    [6, ['m', 'n', 'o']],
    [7, ['p', 'q', 'r', 's']],
    [8, ['t', 'u', 'v']],
    [9, ['w', 'x', 'y', 'z']],
  ])
  
  for (let i = 0; i < digits.length; i++) {
    let l = digitLetterMap.get(Number(digits[i]))
    let r = []
    if (result.length == 0) {
      result = l
    } else {
      for (let j = 0; j < result.length; j++) {
        for (let k = 0; k < l.length; k++) {
          r.push(j + k)
        }
      }
      result = r
    }
  }

  return result
};