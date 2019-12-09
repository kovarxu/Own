import { reverse } from "dns";

// https://leetcode-cn.com/problems/rotate-image/
// You are given an n x n 2D matrix representing an image.
// Rotate the image by 90 degrees (clockwise).

/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
// transpose the matrix, then traverse each row
// 98.3% / 12.76%
var rotate = function(matrix) {
  let len = matrix[0].length
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < i; j++) {
      let tmp = matrix[i][j]
      matrix[i][j] = matrix[j][i]
      matrix[j][i] = tmp
    }
  }
  // reverse
  for (let i = 0; i < len; i++) {
    reverse(matrix[i])
  }
  return matrix
};
