// https://leetcode-cn.com/problems/group-anagrams/
// Given an array of strings, group anagrams together.
// Input: ["eat", "tea", "tan", "ate", "nat", "bat"],
// Output:
// [
//   ["ate","eat","tea"],
//   ["nat","tan"],
//   ["bat"]
// ]

/**
 * @param {string[]} strs
 * @return {string[][]}
 */
// 76.05% / 5.43%
var groupAnagrams = function(strs) {
  const map = []
  let id = 0
  for (let i = 0; i < 26; i++) {
    map[i] = {id: id, num: 0}
  }

  const hash = new Map()
  const result = []
  for (str of strs) {
    let hashstr = getHash(str)
    let tmp = hash.get(hashstr) || []
    tmp.push(str)
    hash.set(hashstr, tmp)
  }
  for (let [hashkey, list] of hash) {
    result.push(list)
  }
  return result

  function getHash(str) {
    id += 1
    for (let s of str) {
      let sn = s.charCodeAt(0) - 97
      let tmp = map[sn]
      if (tmp.id === id) {
        map[sn].num ++
      } else {
        map[sn].id = id
        map[sn].num = 1
      }
    }
    let result = ''
    for(let i = 0; i < map.length; i++) {
      let obj = map[i]
      if (obj.id === id) {
        result += '#' + i + '|' + obj.num + '#'
      }
    }
    return result
  }
};
