// https://leetcode.com/problems/count-and-say/
// The count-and-say sequence is the sequence of integers with the first five terms as following:

/**
 * @param {number} n
 * @return {string}
 */
// 1.     1
// 2.     11
// 3.     21
// 4.     1211
// 5.     111221
// ...

// enumerate
var countAndSay = function(n) {
  let cur = '';
  for (let i = 1; i <= n; i++) {
    if (i == 1) cur = '1';
    else {
      let newCur = '', j = 0;
      while (j < cur.length) {
        let k = j + 1;
        while (k < cur.length && cur[k] == cur[j]) k++;
        newCur += (k - j) + cur[j];
        j = k;
      }
      cur = newCur;
    }
  }
  return cur;
};
