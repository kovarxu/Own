// 错误的答案，因为 isSubStructure 是判断A中是否有B，而一个父节点判定相等后子问题应该是A
var isSubStructure = function(A, B) {
  if (!A || !B) return false;
  return (
    (A.val === B.val) && (
      B.left ? isSubStructure(A.left, B.left) : true
    ) && (
      B.right ? isSubStructure(A.right, B.right) : true
    )
  ) || isSubStructure(A.left, B) || isSubStructure(A.right, B);
};

var isSubStructure = function(A, B) {
  if (!A || !B) return false;
  const match = function(a, b) {
    if (!b) return true;
    if (!a && b) return false;
    return a.val === b.val && match(a.left, b.left) && match(a.right, b.right);
  }
  return match(A, B) || isSubStructure(A.left, B) || isSubStructure(A.right, B);
};

// @return {number[][]}
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

// 维护两个队列进行切换，存在很大的成本
var zigzagLevelOrder = function(root) {
  let current = 0;
  const result = [];
  if (!root) {
    return result;
  }
  const queues = [[root], []];
  while (true) {
    // 遍历出队
    const currentQueue = queues[current];
    const nextQueue = queues[current === 0 ? 1 : 0];
    // 0号数组左->右遍历，1号右->左，添加到另一边则相反
    const step = [];
    if (currentQueue.length === 0) {
      break;
    }
    for (let i = 0; i < currentQueue.length; i++) {
      const currentNode = currentQueue[i];
      step.push(currentNode.val);
      if (currentNode.left) {
        nextQueue.push(currentNode.left);
      }
      if (currentNode.right) {
        nextQueue.push(currentNode.right);
      }
    }
    currentQueue.length = 0;
    result.push(current ? step.slice() : step);
    current = current === 0 ? 1 : 0;
  }
  return result;
};

// 只维护一个队列的版本
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

var isSymmetric = function(root) {
  if (!root) return true;
  const isSym = function(a,b) {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return (a.val === b.val) && isSym(a.left, b.right) && isSym(a.right, b.left);
  }
  return isSym(root.left, root.right);
};

