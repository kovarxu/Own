// https://leetcode.com/problems/swap-nodes-in-pairs/submissions/
// Given a linked list, swap every two adjacent nodes and return its head.
// You may not modify the values in the list's nodes, only nodes itself may be changed.
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
// recussion
var swapPairs = function(head) {
  let newHead = gen(head)
  return newHead
};

function gen(cur) {
  if (!cur) return cur
  let next = cur.next
  if (next) {
    let pre = next.next
    next.next = cur
    cur.next = gen(pre)
    return next
  }
  return cur
}

// for
var swapPairs = function(head) {
  let cur = head, next, res
  let newHead = null
  while (cur) {
    next = cur.next
    if (next) {
      pre = next.next

      next.next = cur
      if (res) res.next = next
      if (!newHead) newHead = next
      cur.next = null
      res = cur

      cur = pre
    } else if (res) {
      res.next = cur
      cur = next
    } else {
      return cur
    }
  }
  return newHead
};
