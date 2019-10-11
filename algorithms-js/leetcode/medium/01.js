// https://leetcode.com/problems/add-two-numbers/
// Input: (2 -> 4 -> 3) + (5 -> 6 -> 4)
// Output: 7 -> 0 -> 8
// Explanation: 342 + 465 = 807.

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */

var addTwoNumbers = function(l1, l2) {
  var n1, n2, na, carry = 0
  var cur = null, pre = null, head = null
  var i = l1, j = l2
  while (i || j) {
    n1 = i ? i.val : 0
    n2 = j ? j.val : 0
    na = n1 + n2 + carry
    if (na > 9) {
      carry = 1
      na = na - 10
    } else {
      carry = 0
    }
    cur = new ListNode(na)
    if (pre) {
        pre.next = cur
    }
    pre = cur
    if (!head) {
       head = pre 
    }
    i && (i = i.next)
    j && (j = j.next)
  }
  if (carry) {
    cur = new ListNode(1)
    pre.next = cur
  }
  return head
};
