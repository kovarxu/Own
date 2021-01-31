## 剑指offer汇总

### 二叉树

题目
-------------
1. 二叉搜索树的第K大的节点
2. 给定先序遍历和中序遍历结果，重建二叉树
3. 输入一组数字，判断是否是二叉搜索树的后序遍历序列
4. 树的子结构（判断B树是否是A树中的一部分）
5. 二叉树的镜像
6. 从上到下打印二叉树
7. 和为某一值的路径
8. 二叉树的深度
9. 之字形顺序打印二叉树（第一排左->右，第二排右->左，以此类推）
10. 判断是否为平衡树（左右子树高度差不超过1）
11. 序列化和反序列化二叉树
12. 对称的二叉树

解答：
-------------
1. 二叉搜索树的中序遍历正好是一个递增的序列

2. 规则：

- 先序遍历：[root, ...left, ...right]
- 中序遍历：[...left, root, ...right]
- 后序遍历：[...left, ...right, root]

如果树是搜索树，则 `left, right, root` 的数值大小关系也可以相对应

3. 按照2中的规律，找到树根，遍历找到left和right的交界处，然后遍历right找到是否都大于root判断是否满足条件，最后递归判断

4. 本题要注意有两个递归，当找到一个节点相同时接下来的节点需要连续判定匹配成功

```js
var isSubStructure = function(A, B) {
  if (!A || !B) return false;
  const match = function(a, b) {
    if (!b) return true;
    if (!a && b) return false;
    return a.val === b.val && match(a.left, b.left) && match(a.right, b.right);
  }
  return match(A, B) || isSubStructure(A.left, B) || isSubStructure(A.right, B);
};
```

5. 左右翻转，递归解决

6. 层序遍历，用队列解决

7. 递归，注意必须是从根节点到叶节点的路径才算数
```js
var pathSum = function(root, sum) {
  const result = [];
  const childPass = function(node, save, remain) {
    const val = node.val;
    // 这里直接检测和remain的差别，避免结果重复
    if (remain === val && !node.left && !node.right) {
      result.push([...save, val]);
    }
    save.push(val);
    node.left && childPass(node.left, save, remain - val);
    node.right && childPass(node.right, save, remain - val);
    save.pop();
  }
  root && childPass(root, [], sum);
  return result;
};
```

8. 递归解决，fn = 1 + max(fn.left, fn.right)

9. 层序遍历的变种

本题可以使用两个队列保存每次待遍历的内容，但是那样做就麻烦了
把`[node, layer]`这种数据结构保存在队列中，出队的时候根据`layer % 2`的值更新队列是最优解
```js
var zigzagLevelOrder = function(root) {
  const result = [];
  if (!root) {
    return result;
  }
  const queue = [[root, 0]];
  while (queue.length) {
    const [head, layer] = queue.shift();
    if (!result[layer]) {
      result[layer] = [];
    }
    if (layer % 2 === 0) {
      result[layer].push(head.val);
    } else {
      result[layer].unshift(head.val);
    }
    head.left && queue.push([head.left, layer + 1]);
    head.right && queue.push([head.right, layer + 1]);
  }
  return result;
}
```

10. 一个dfs问题的变种

```js
var isBalanced = function(root) {
  let result = true;
  const depth = root => {
    if (!root) return 0;
    const depthleft = depth(root.left);
    const depthright = depth(root.right);
    if (Math.abs(depthleft - depthright) > 1) {
      result = false;
    }
    return Math.max(depthleft, depthright) + 1;
  }
  depth(root);
  return result;
};
```

11. TODO

12. 这个题考察的还是dfs, 唯一要注意的是根节点的处理

```js
var isSymmetric = function(root) {
  if (!root) return true;
  const isSym = function(a,b) {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return (a.val === b.val) && isSym(a.left, b.right) && isSym(a.right, b.left);
  }
  return isSym(root.left, root.right);
};
```

### 链表

题目
-------------
1. 链表翻转
2. 删除排序链表中的重复元素
3. 环形链表的入口
4. 两个链表的第一个公共节点
5. 链表中倒数第K个节点
6. 复杂链表的复制（每一个节点都有一个指向任意节点或null的random字段）
7. 最后一个小朋友

解答：
-------------
1. 经典的五行代码

```js
var reverseList = function(head) {
  // !head 为了防止输入是null
  if (!head  || !head.next)  return head;
  // 这是典型的递归从尾至头执行运算（一般的情况都是先运算然后递归，这个是先递归，再执行运算，相当于从尾至头的运算）
  const newHead = reverseList(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
};
```

2. 经典的双指针

```js
var deleteDuplicates = function(head) {
  let [a, b] = [null, head];
  while (b) {
    // 先保存一下next，因为下面把后指针所在的元素的next设为了null
    const next = b.next;
    if (a === null) {
      a = b;
      a.next = null;
    } else if (a.val !== b.val) {
      a.next = b;
      a = b;
      a.next = null;
    }
    b = next;
  }
  return head;
};
```

3. 双指针解决

要点：
- 识别是否有环：快慢指针，一个一次进一格，另一个一次进两格，如果两个指针能够相遇则肯定存在环
- 注意需要从-1位置开始移动，不能从头开始，所以需要pivot指向头指针打辅助

```js
var detectCycle = function(head) {
  const pivot = new ListNode();
  pivot.next = head;
  let [p1, p2, p3] = [pivot, pivot, pivot];
  while (true) {
    p2 = p2.next;
    p3 = p3.next;
    if (!p3) return null;
    p3 = p3.next;
    if (!p3) return null;
    // 两个指针相遇了，有环
    if (p2 === p3) {
      while(p1 !== p2) {
        p1 = p1.next;
        p2 = p2.next;
      }
      return p1;
    }
  }
};
```

4. 先遍历一个链表给每个节点打下标记，然后遍历另外一个链表即可

5. 比较常见的题目，注意处理边界条件，画个图/设定一个pivot可以简化操作

```js
var getKthFromEnd = function(head, k) {
  if (!head) {
    throw new Error();
  }
  const pivot = new ListNode();
  pivot.next = head;
  let [a, b] = [pivot, pivot];
  for (let i = 0; i < k; i++) {
    b = b.next;
    if (!b) {
      throw new Error();
    }
  }
  while (b) {
    a = a.next;
    b = b.next;
  }
  return a;
};
```

6. 思路：先遍历一次确定主链的复制正确性，期间保留`<源Node, 复制Node>`的映射到Map中；然后再一次遍历两条链，处理random数据

7. 背代码

### 栈

题目
-------------
1. 两个栈实现队列
2. 包含min的栈
3. 栈的压入、弹出序列（给出一个压入顺序和一个弹出顺序，判断是否符合栈）
4. 滑动窗口的最大值（模拟一个队列解决）
5. 无重复字符的最长字串（双指针典范）

解答：
-------------
3. 思路是建立一个栈来模拟操作，如果最后栈非空则失败

5. 第一眼看这题的反应，（我以前做过这个题好几遍了）。再看一眼之后发现，（什么？我什么时候做过这个题？）

这道题并非来自《剑指offer》，但是比较经典

```js
var lengthOfLongestSubstring = function(s) {
  const m = {};
  let [rk, ans] = [-1, 0];
  for (let i = 0; i < s.length; i++) {
    if (i !== 0) {
      m[s[i - 1]] = 0;
    }
    while (rk + 1 < s.length && !m[s[rk + 1]]) {
      m[s[rk + 1]] = 1;
      rk++;
    }
    ans = Math.max(ans, rk - i + 1);
  }
  return ans;
};
```

### 排序

题目
-------------
1. 归并和快速排序
2. 数据流的中位数（二分搜索）
3. 和为s的连续正数序列（给出一个值如9，找到连续数字相加等于它的序列，如`[[2,3,4], [4,5]]`
4. 旋转数组的最小数字
5. 丑数（质因数仅包含2,3,5）
6. 数组中重复的数字（map）
7. 顺时针打印矩阵（需要注意点：）

解答：
-------------
1. 归并和快排

```js
// 归并：先分后合，这个helper可以用于“合并两个排序数组”类似的问题
const sortHelper = (list1, list2) => {
  let [i, j] = [0, 0];
  const result = [];
  // 要领1：合并两个有序数组，三个while
  while (i < list1.length || j < list2.length) {
    if (list1[i] < list2[j] || j >= list2.length) {
      result.push(list1[i]);
      i++;
    } else {
      result.push(list2[j]);
      j++;
    }
  }
  return result;
}

export function sort(nums) {
  // 归并排序
  if (nums.length <= 1) {
    return nums;
  }
  // 要领2：这里不可以写nums.length - 1，需要保证长度为2的数组不能死循环
  const center = nums.length / 2 | 0;

  return sortHelper(
    sort(nums.slice(0, center)),
    sort(nums.slice(center, nums.length)
  ));
}
```

```ts
// 快排
function swap<T>(arr: Array<T>, ida: number, idb: number) {
  const tmp: T = arr[ida];
  arr[ida] = arr[idb];
  arr[idb] = tmp;
}

// 这个helper是关键，可以用于“数组中第K大的数”之类的问题
// 步骤：交换 -- 前后指针递进 -- 后指针进1 -- 交换
const sortHelper = (arr: Array<number>, start: number, end: number): number => {
  if (start === end) {
    return start;
  } else if (start > end) {
    throw 'start need to be no less than end';
  }

  let p = start - 1;
  let center = ((start + end) / 2) | 0;
  swap(arr, center, end);
  const pivot = arr[end];
  for (let q = start; q < end; q++) {
    if (arr[q] < pivot) {
      p ++;
      p !== q && swap(arr, p, q);
    }
  }
  p ++;
  swap(arr, p, end);
  return p;
}

export const rapid = (arr: Array<number>, ...rest: Array<number>): Array<number> => {
  const [ start = 0, end = arr.length - 1 ] = rest;
  if (start < end) {
    const qIndex = sortHelper(arr, start, end);
    rapid(arr, start, qIndex - 1);
    rapid(arr, qIndex + 1, end);
  }
  return arr;
}
```

3. 有多种思路

- 暴力法，以每一个数字为起点逐步向前找，直到找到一个大于或等于目标值的和
- 数学公式法，连续数字是有求和公式的
- 双指针法，是对暴力法的优化，在暴力法中很多计算都重复了，比如在对`1`运算是需要算`1+2+3+4+5+...`，在对`2`运算是需要算`2+3+4+5+...`，很多操作其实是重复的，双指针法将这些操作进行了合并

4. 直接取数组中的最小值即可，使用二分法需要考虑重复数字的情况，还要回退到使用线性查询，比较麻烦

5. 2,3,5三个指针分别在解析到的数组上向前移动

```js
var nthUglyNumber = function(n) {
  // 2, 3, 5
  // 自身在自身组成的序列上移动
  const list = [1];
  let [p2, p3, p5] = [0, 0, 0];
  let [s2, s3, s5] = [2, 3, 5];
  for (let i = 1; i < n; i++) {
    // 1. 找到s中的最小值，push进list中
    const min = Math.min(s2, s3, s5);
    list.push(min);
    // 2. 找到s中最小值对应的index，移动p并更新s
    if (s2 === min) {
      p2++;
      s2 = 2 * list[p2];
    }
    if (s3 === min) {
      p3++;
      s3 = 3 * list[p3];
    }
    if (s5 === min) {
      p5++;
      s5 = 5 * list[p5];
    }
  }
  return list.pop();
};
```

7. 细节较多这道题

```js
function spiralOrder(matrix) {
  const row = matrix.length;
  const column = matrix[0].length;
  const result = [];
  let iter = 0;

  while (true) {
    if (iter >= Math.min(column, row) - iter) {
      return result;
    }
    // 1
    let i = iter;
    for (; i < column - iter; i++) {
      result.push(matrix[iter][i]);
    }

    // 2
    i--;
    let j = iter + 1;
    for (; j < row - iter; j++) {
      result.push(matrix[j][i]);
    }

    // 3
    j--;
    // 边界条件，如果这一行打印和第一行一致，则说明已经结束了
    if (iter === j) {
      return result;
    }
    for (i = column - iter - 2; i >= iter; i--) {
      result.push(matrix[j][i]);
    }

    // 4
    i++;
    // 边界条件，如果这一列打印和第一列一致，则说明已经结束了
    if (column - iter - 1 === iter) {
      return result;
    }
    for (j = row - iter - 2; j > iter; j--) {
      result.push(matrix[j][iter]);
    }

    iter++;
  }
};
```
