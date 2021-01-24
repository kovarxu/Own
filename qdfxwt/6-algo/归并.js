const sortHelper = (list1, list2) => {
  let [i, j] = [0, 0];
  const result = [];
  // 要领1：合并两个有序数组，三个while
  while (i < list1.length && j < list2.length) {
    if (list1[i] < list2[j]) {
      result.push(list1[i]);
      i++;
    } else {
      result.push(list2[j]);
      j++;
    }
  }
  while (i < list1.length) {
    result.push(list1[i]);
    i++;
  }
  while (j < list2.length) {
    result.push(list2[j]);
    j++;
  }
  return result;
}

function sort(nums) {
  // 归并排序
  if (nums.length <= 1) {
    return nums;
  } else if (nums.length === 2) {
    // 要领2：边界条件处理
    const [m, n] = nums;
    return m > n ? [n, m] : [m, n];
  }
  const center = (nums.length - 1) / 2 | 0;

  return sortHelper(
    sort(nums.slice(0, center)), 
    sort(nums.slice(center, nums.length)
  ));
}

// sort([8,5,0,1,2,3,2,8,5,6]);