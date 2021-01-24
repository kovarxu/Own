/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
// 字符串相乘
// https://leetcode-cn.com/problems/multiply-strings/
// 要点是可能多进位
var multiply = function(num1, num2) {
  if (num1 === '0' || num2 === '0') return '0';
  
  const arr = new Array(num1.length + num2.length).fill(0);
  const addToArr = (base, num) => {
    const sum = arr[base] + num;
    arr[base] = sum % 10;
    let carry = sum / 10 | 0;

    // 这个while carry的处理至关重要
    while (carry) {
      const b = arr[--base] + carry;
      arr[base] = b % 10;
      carry = b / 10 | 0;
    }
  }

  for (let i = num1.length - 1; i >= 0; i--) {
    for (let j = num2.length - 1; j >= 0; j--) {
      const base = i + j + 1;
      const mul = num1[i] * num2[j];
      if (mul < 10) {
        addToArr(base, mul);
      } else {
        addToArr(base, mul % 10);
        addToArr(base - 1, mul / 10 | 0);
      }
    }
  }

  let start = 0;
  while (arr[start] === 0) start ++;
  return arr.slice(start).join('');
}
