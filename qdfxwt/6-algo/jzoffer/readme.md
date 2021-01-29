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
