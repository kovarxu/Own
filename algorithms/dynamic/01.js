// 有m个数字，n个加号插入其中，问求得的最大数字和是多少
// 状态：设最后一个加号在第i位数字之后
// 状态转换：M(m,n) = Max{ M(i, n-1) + Number(i+1, m) } [i in (n, m-1)]
// 边界条件：if (m <= n) M(m,n) = Infinity; if (n == 0) M(m,n) = Number(0, m)

let l = [1,2,3,0,4,9,8,5,3,1,2,0]
let n = 4, len = l.length, last = len-1

// Array.from({length: 3}, () => Array(3).fill(-1))
let M = Array.from({ length: len }, () => Array(n).fill(0))
let cachedNum = Array.from({ length: len }, () => Array(len).fill(-1))

function getNum (i, j) {
  if (cachedNum[i][j] >= 0) {
    return cachedNum[i][j]
  }
  let p = l.slice(i, j+1)
  return (cachedNum[i][j] = Number(p.join('')))
}

for (let i = 0; i < len; i++) {
  for (let j = 0; j < n; j++) {
    if (i <= j) M[i][j] = Infinity
    else if (j == 0) M[i][j] = getNum(0, i)
    else {
      for (let k = j; k < last; k++) {
        M[i][j] = Math.max(M[i][j], M[k][j-1] + getNum(k+1, last))
      }
    }
  }
}

console.log('M', M)
