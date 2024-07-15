---
title: 回溯
desciption: 记录回溯算法
keywords:
  - 算法
  - 回溯
group:
  title: 算法
  order: 2
toc: content
---

### 简介

回溯算法是一种用于寻找问题所有解或某个最优解的算法。它通过逐步构建解，探索所有可能的解空间，并在发现不满足条件的解时回溯（撤销上一步的决策），从而找到最终的正确解。回溯算法是一种系统化的试错方法，非常适用于组合优化问题，如排列、组合、子集和图的着色等。

代码示例

```js
function leet(nums) {
  const result = [];
  const path = [];

  function backtrack() {
    if (condition) {
      result.push([...paht]);
      return;
    }

    for (let i = i; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack();
      path.pop();
    }
  }

  backtrack();

  return result;
}
```

### <a href="https://leetcode.cn/problems/combinations/description/" target="_blank" rel="noopener noreferrer">组合 - leetcode 77</a>

```js
/**
 * @param {number} n
 * @param {number} k
 * @return {number[][]}
 */
var combine = function (n, k) {
  const result = [];

  function backtrack(startIndex, path) {
    if (path.length === k) {
      result.push(path);
      return;
    }

    for (let i = startIndex; i < n; i++) {
      backtrack(i + 1, [...path, i + 1]);
    }
  }

  backtrack(0, []);

  return result;
};
```

### <a href="https://leetcode.cn/problems/combination-sum/description/" target="_blank" rel="noopener noreferrer">组合总和 - leetcode 39</a>

```js
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum = function (candidates, target) {
  const result = [];
  const len = candidates.length;
  function backtrack(startIndex, path, sum) {
    if (sum === target) {
      result.push(path);
      return;
    }

    for (let i = startIndex; i < len; i++) {
      const num = candidates[i];
      if (num + sum > target) {
        continue;
      }

      backtrack(i, [num, ...path], sum + num);
    }
  }

  backtrack(0, [], 0);

  return result;
};
```

### <a href="https://leetcode.cn/problems/combination-sum-ii/description/" target="_blank" rel="noopener noreferrer">组合总和 II - leetcode 40</a>

```js
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum2 = function (candidates, target) {
  const result = [];
  const len = candidates.length;

  function backtrack(startIndex, path, sum, used) {
    if (sum === target) {
      result.push(path);
      return;
    }

    for (let i = startIndex; i < len; i++) {
      const num = candidates[i];

      if (i > 0 && num == candidates[i - 1] && used[i - 1] == false) {
        continue;
      }

      if (num + sum > target) {
        continue;
      }
      used[i] = true;
      backtrack(i + 1, [num, ...path], sum + num, used);
      used[i] = false;
    }
  }

  backtrack(0, [], 0, []);

  return result;
};
```

### <a href="https://leetcode.cn/problems/combination-sum-iii/description/" target="_blank" rel="noopener noreferrer">组合总和 III - leetcode 216</a>

```js
/**
 * @param {number} k
 * @param {number} n
 * @return {number[][]}
 */
var combinationSum3 = function (k, n) {
  const result = [];
  const path = [];

  function backtrack(startIndex, sum) {
    if (sum === n && path.length === k) {
      result.push([...path]);
      return;
    }

    for (let i = startIndex; i <= 9; i++) {
      if (sum + i > n) continue;

      path.push(i);
      backtrack(i + 1, sum + i);
      path.pop();
    }
  }

  backtrack(1, 0);

  return result;
};
```

### <a href="https://leetcode.cn/problems/permutations/description/" target="_blank" rel="noopener noreferrer">全排列 - leetcode 46</a>

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function (nums) {
  const len = nums.length;
  const result = [];

  function backtrack(used, path) {
    if (path.length === len) {
      result.push(path);
      return;
    }

    for (let i = 0; i < len; i++) {
      if (used[i]) continue;

      used[i] = true;
      backtrack(used, [...path, nums[i]]);
      used[i] = false;
    }
  }

  backtrack([], []);

  return result;
};
```

### <a href="https://leetcode.cn/problems/permutations-ii/description/" target="_blank" rel="noopener noreferrer">全排列 II - leetcode 47</a>

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permuteUnique = function (nums) {
  const len = nums.length;
  const result = [];
  nums.sort((a, b) => a - b);

  function backtrack(used, path) {
    if (path.length === len) {
      result.push(path);
      return;
    }

    for (let i = 0; i < len; i++) {
      if (i > 0 && nums[i] === nums[i - 1] && used[i - 1]) {
        continue;
      }

      if (used[i]) continue;

      used[i] = true;
      backtrack(used, [...path, nums[i]]);
      used[i] = false;
    }
  }

  backtrack([], []);

  return result;
};
```

### <a href="https://leetcode.cn/problems/subsets/description/" target="_blank" rel="noopener noreferrer">子集 - leetcode 78</a>

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsets = function (nums) {
  const result = [];
  const len = nums.length;

  function backtrack(startIndex, path) {
    result.push(path);

    for (let i = startIndex; i < len; i++) {
      backtrack(i + 1, [...path, nums[i]]);
    }
  }

  backtrack(0, []);

  return result;
};
```

### <a href="https://leetcode.cn/problems/subsets-ii/description/" target="_blank" rel="noopener noreferrer">子集 II - leetcode 90</a>

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsetsWithDup = function (nums) {
  const result = [];
  const len = nums.length;
  const path = [];
  // 排序
  nums.sort((a, b) => a - b);

  function backtack(startIndex) {
    result.push([...path]);

    for (let i = startIndex; i < len; i++) {
      if (i > startIndex && nums[i] === nums[i - 1]) continue;
      path.push(nums[i]);
      backtack(i + 1);
      path.pop();
    }
  }

  backtack(0);

  return result;
};
```
