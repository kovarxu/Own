// https://leetcode.com/problems/zigzag-conversion/
// The string "PAYPALISHIRING" is written in a zigzag pattern on a given number of rows like this: (you may want to display this pattern in a fixed font for better legibility)
/**
 * @param {string} s
 * @param {number} numRows
 * @return {string}
 */
var convert = function(s, numRows) {
  let maxCol = Math.ceil(s.length / numRows)
  let l = Array.from({length: numRows}, () => Array(maxCol).fill(''))
  let m = -1, n = 0, k = 0
  for (let i = 0; i < s.length; i++) {
    if (!k && ++m >= numRows) {
      --m, n++, k++
    } else if (k) {
      m = numRows - k
      n++, k++
    }
    if (k >= numRows - 2) k = 0
    l[m][n] = s[i]
  }
  return l
};