// https://leetcode.com/problems/valid-sudoku/
// Determine if a 9x9 Sudoku board is valid. Only the filled cells need to be validated according to the following rules:

// Each row must contain the digits 1-9 without repetition.
// Each column must contain the digits 1-9 without repetition.
// Each of the 9 3x3 sub-boxes of the grid must contain the digits 1-9 without repetition.

/**
 * @param {character[][]} board
 * @return {boolean}
 */
// enumerate method
var isValidSudoku = function(board) {
  let size = board[0].length;
  let rowSets = Array.from({length: size}, () => new Set());
  let columnSets = Array.from({length: size}, () => new Set());
  let perSets = Array.from({length: size}, () => new Set());

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let keyOfSet =  (i / 3 | 0) * 3 + (j / 3 | 0);
      let val = board[i][j];
      if (val == '.') continue;
      else if (rowSets[i].has(val) || columnSets[j].has(val) || perSets[keyOfSet].has(val)) {
        return false;
      } else {
        rowSets[i].add(val);
        columnSets[j].add(val);
        perSets[keyOfSet].add(val);
      }
    }
  }

  return true;
};
