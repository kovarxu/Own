var search = function(nums, target) {
  if (nums.length == 0) return -1;
  else if (nums.length == 1) {
    if (nums[0] == target) return 0;
    else return -1;
  }
  // binary search
  var i = 0, j = nums.length - 1;
  while (i !== j) {
    var len = j - i + 1;
    var left = nums[i], right = nums[j];
    if (left == target) return i;
    if (right == target) return j;
    
    var m = Math.floor(len / 2);
    var middle = nums[i + m];
    if (middle === target) {
      return i + m;
    }
    else if (len > 3) {
      var lf = nums[m-1], rf = nums[m+1];
      var isTrunPoint = lf < middle && rf < middle;
      if (isTrunPoint) {
        if (target > right) {
          // left
          j -= m;
        } else {
          i += m;
        }
      } else {
        if (target < middle && target > right) {
          // left
          j -= m;
        } else {
          i += m;
        }
      }
    } else {
      return -1;
    } 
    continue;
  }
};