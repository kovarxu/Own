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

var reverseList = function(head) {
  if (!head  || !head.next)  return head;
  const newHead = reverseList(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
};

var deleteDuplicates = function(head) {
  let [a, b] = [null, head];
  while (b) {
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

var findContinuousSequence = function(target) {
  // 公式法
  const result = [];
  for(let i = 1; i < target; i++) {
    const delta2 = 1 + 4(i * i - i + 2 * target);
    if (delta2 < 0) continue;
    const root = (-1 + Math.sqrt(delta2)) / 2;
    if (Math.abs(root - Math.round(root)) < Number.EPSILON) {
      result.push(`${i} to ${root} is a valid sequence.`);
    }
  }
  return result;
};

// incorrect solution
var minArray = function(numbers) {
  // 2 2 2 3 0 1
  const checkIsTarget = (pos) => {
    return (pos < numbers.length - 1 && numbers[pos] > numbers[pos + 1]) ||
      (pos === 0 && numbers[pos] > numbers[pos + 1]);
  }
  let [start, end] = [0, numbers.length - 1];
  while (start < end) {
    const center = (start + end) / 2 | 0;
    let result = checkIsTarget(center);
    if (result) {
      return result;
    }
    if (numbers[center] >= numbers[start]) {
      start = center + 1;
    } else {
      end = center - 1;
    }
  }
};

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
