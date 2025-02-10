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
