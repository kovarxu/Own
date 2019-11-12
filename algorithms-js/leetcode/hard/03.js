// https://leetcode.com/problems/substring-with-concatenation-of-all-words/discuss/420790/c%2B%2B-92-solution
// You are given a string, s, and a list of words, words, that are all of the same length. Find all starting indices of substring(s) in s that is a concatenation of each word in words exactly once and without any intervening characters.

/**
 * @param {string} s
 * @param {string[]} words
 * @return {number[]}
 */
var findSubstring = function(s, words) {
  if (s.length === 0 || words.length === 0) return []
  let sz = words[0].length, ls = s.length
  let ans = []
  let umap = Object.create(null), umap1 = Object.create(null)
  words.forEach(word => {
    if (umap[word]) umap[word] ++
    else umap[word] = 1
    umap1[word] = 0
  })

  for (let i = 0; i < sz; i++) {
    let left = i
    let cnt = 0
    Object.keys(umap1).forEach(key => umap1[key] = 0)
    for (let j = i; j < ls; j += sz) {
      let w = s.substr(j, sz)
      if (w in umap) {
        if (umap1[w] < umap[w]) {
          cnt ++
          umap1[w] ++
        } else {
          while (s.substr(left, sz) !== w) {
            cnt --
            umap1[s.substr(left, sz)] --
            left += sz
          }
          left += sz
        }

        if (words.length === cnt) {
          ans.push(left)
          cnt --
          umap1[s.substr(left, sz)] --
          left += sz
        }
      } else {
        cnt = 0
        left = j + sz
        Object.keys(umap1).forEach(key => umap1[key] = 0)
      }
    }
  }

  return ans
};
