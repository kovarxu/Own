// https://leetcode.com/problems/remove-nth-node-from-end-of-list/
// Given a linked list, remove the n-th node from the end of list and return its head.

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function(head, n) {
  let save = head, cur = head
  while (cur) {
    if (n-- < 0) {
      save = save.next
    }
    cur = cur.next
  }
  // important, the element is the head
  if (n == 0) {
    head = head.next
  }
  else if (save) {
    let del = save.next
    save.next = del.next
  }
  ret

function ListNode(val) {
  this.val = val;
  this.next = null;
}

var a = ListNode(1)
var b = ListNode(2)
var c = ListNode(3)
var d = ListNode(4)
var e = ListNode(5)

a.next = b; b.next = c; c.next = d; d.next = e

console.log(removeNthFromEnd(a, 2))