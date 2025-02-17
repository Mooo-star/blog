---
title: 数组
desciption: 记录数组相关算法
keywords:
  - 数组
  - 二分法
group:
  title: 算法
  order: 2
toc: content
---

### 二分法

二分法（Binary Search）是一种在有序数组中查找特定元素的高效搜索算法。其基本思想是：

1. 将有序数组从中间位置分成两部分
2. 将目标值与中间位置的元素进行比较
3. 如果目标值等于中间元素，则找到目标值
4. 如果目标值小于中间元素，则在左半部分继续查找
5. 如果目标值大于中间元素，则在右半部分继续查找
6. 重复上述步骤，直到找到目标值或确定目标值不存在

二分查找的时间复杂度为 O(log n)，这使得它比线性查找 O(n) 更加高效。但需要注意的是，二分查找只适用于有序数组。

:::warning
注意：**二分在使用的时候要确定清楚自己定义的区间**
:::

#### <a href="https://leetcode.cn/problems/binary-search/description/" target="_blank" rel="noopener noreferrer">二分查找 - leetcode 704</a>

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function (nums, target) {
  let len = nums.length,
    left = 0,
    right = len - 1;

  while (left <= right) {
    const mid = Math.floor((right + left) / 2);
    const val = nums[mid];
    if (val === target) return mid;

    if (val < target) {
      left = mid + 1;
      continue;
    }

    if (val > target) {
      right = mid - 1;
      continue;
    }
  }

  return -1;
};
```

#### <a href="https://leetcode.cn/problems/search-insert-position/description/" target="_blank" rel="noopener noreferrer">搜索插入位置 - leetcode 35</a>

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function (nums, target) {
  var left = 0,
    right = nums.length - 1;
  var mid = Math.floor((left + right) / 2);
  while (left <= right) {
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] > target) {
      right = mid - 1;
      mid = Math.floor((left + right) / 2);
    } else if (nums[mid] < target) {
      left = mid + 1;
      mid = Math.floor((left + right) / 2);
    }
  }
  return left;
};
```

### <a href="https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/description/" target="_blank" rel="noopener noreferrer">在排序数组中查找元素的第一个和最后一个位置 - leetcode 34</a>

:::info
这道题在面试的时候直接遍历解答出来也是没问题的，就是效率可能不是很高。

使用二分的思路，就是各自寻找左右的边界值，最后再判断结果的返回就好了
:::

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function (nums, target) {
  let leftBoard = getLeftBoard(nums, target);
  let rightBoard = getRightBoard(nums, target);
  if (leftBoard == -2 || rightBoard == -2) return [-1, -1];
  if (rightBoard - leftBoard > 1) return [leftBoard + 1, rightBoard - 1];
  return [-1, -1];
};

var getRightBoard = function (nums, target) {
  let left = 0;
  let right = nums.length - 1;
  let rightBoard = -2;

  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);
    if (nums[mid] > target) {
      right = mid - 1;
    } else {
      left = mid + 1;
      rightBoard = left;
    }
  }

  return rightBoard;
};

var getLeftBoard = function (nums, target) {
  let left = 0;
  let right = nums.length - 1;
  let leftBoard = -2;

  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);
    if (nums[mid] >= target) {
      right = mid - 1;
      leftBoard = right;
    } else {
      left = mid + 1;
    }
  }

  return leftBoard;
};
```

### <a href="https://leetcode.cn/problems/sqrtx/description/" target="_blank" rel="noopener noreferrer">x 的平方根 - leetcode 69</a>

```js
/**
 * @param {number} x
 * @return {number}
 */
var mySqrt = function (x) {
  let left = 0,
    right = x;

  let ret = -1;

  while (left <= right) {
    const mid = Math.round((right + left) / 2);

    if (mid * mid <= x) {
      ret = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return ret;
};
```

### <a href="https://leetcode.cn/problems/valid-perfect-square/" target="_blank" rel="noopener noreferrer">有效的完全平方数 - leetcode 367</a>

```js
/**
 * @param {number} num
 * @return {boolean}
 */
var isPerfectSquare = function (num) {
  let left = 0,
    right = num;

  while (left <= right) {
    const mid = Math.round((right + left) / 2);
    if (mid * mid === num) return true;
    if (mid * mid < num) {
      left = mid + 1;
    }
    if (mid * mid > num) {
      right = mid - 1;
    }
  }

  return false;
};
```

## 双指针

### <a href="https://leetcode.cn/problems/remove-element/description/" target="_blank" rel="noopener noreferrer">移除元素 - leetcode 27</a>

```js

```
