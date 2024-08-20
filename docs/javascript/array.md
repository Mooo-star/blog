---
title: Array 方法
desciption: Array 方法
keywords:
  - Array
group:
  title: JavaScript
toc: content
---

# 简介

在 JavaScript 中，数组不是原始类型，而是具有以下核心特征的 Array 对象：

- JavaScript 数组是可调整大小的，并且可以包含不同的数据类型。（当不需要这些特征时，可以使用类型化数组。）
- JavaScript 数组不是关联数组，因此，不能使用任意字符串作为索引访问数组元素，但必须使用非负整数（或它们各自的字符串形式）作为索引访问。
- JavaScript 数组的索引从 0 开始：数组的第一个元素在索引 0 处，第二个在索引 1 处，以此类推，最后一个元素是数组的 length 属性减去 1 的值。
- JavaScript 数组复制操作创建浅拷贝。（所有 JavaScript 对象的标准内置复制操作都会创建浅拷贝，而不是深拷贝）。

# 方法

## 静态方法

### 1. Array.from

该方法可以将 `可迭代` 或 `类数组` 对象创建一个新的浅拷贝的数组实例。

```js
console.log(Array.from('foo'));
// Expected output: Array ["f", "o", "o"]

console.log(Array.from([1, 2, 3], (x) => x + x));
// Expected output: Array [2, 4, 6]
```

### 2. Array.formAsync

该方法可以由一个 `异步可迭代对象`、`可迭代对象` 或` 类数组` 对象创建一个新的、浅拷贝的 Array 实例。

```js
// 异步可迭代对象创建数组
const asyncIterable = (async function* () {
  for (let i = 0; i < 5; i++) {
    await new Promise((resolve) => setTimeout(resolve, 10 * i));
    yield i;
  }
})();

Array.fromAsync(asyncIterable).then((array) => console.log(array));
// [0, 1, 2, 3, 4]

// 同步可迭代对象创建数组
Array.fromAsync(
  new Map([
    [1, 2],
    [3, 4],
  ]),
).then((array) => console.log(array));
// [1, 2, 3]

// promise 类数组对象创建数组
Array.fromAsync({
  length: 3,
  0: Promise.resolve(1),
  1: Promise.resolve(2),
  2: Promise.resolve(3),
}).then((array) => console.log(array));
// [1, 2, 3]

// 使用 mapFn
function delayedValue(v) {
  return new Promise((resolve) => setTimeout(() => resolve(v), 100));
}

Array.fromAsync(
  [delayedValue(1), delayedValue(2), delayedValue(3)],
  (element) => delayedValue(element * 2),
).then((array) => console.log(array));
// [2, 4, 6]
```

> 还有一些使用上的 ⚠️ 注意事项：[与 Promise.all() 的比较](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/fromAsync#%E4%B8%8E_promise.all_%E7%9A%84%E6%AF%94%E8%BE%83)、[没有对同步可迭代对象的错误处理](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/fromAsync#%E6%B2%A1%E6%9C%89%E5%AF%B9%E5%90%8C%E6%AD%A5%E5%8F%AF%E8%BF%AD%E4%BB%A3%E5%AF%B9%E8%B1%A1%E7%9A%84%E9%94%99%E8%AF%AF%E5%A4%84%E7%90%86)

### 3. Array.isArray

用于确定传递的值是否是一个数组

### 4. Array.of

通过可变数量的参数创建一个新的 Array 实例，而不考虑参数的数量或类型

```js
console.log(Array.of('foo', 2, 'bar', true));
// Expected output: Array ["foo", 2, "bar", true]

console.log(Array.of());
// Expected output: Array []
```

## 实例方法

### 1. Array.prototype.at

该函数接收一个整数值并返回该索引对应的元素，允许正数和负数。

```js
const array1 = [5, 12, 8, 130, 44];

let index = 2;

console.log(`An index of ${index} returns ${array1.at(index)}`);
// Expected output: "An index of 2 returns 8"

index = -2;

console.log(`An index of ${index} returns ${array1.at(index)}`);
// Expected output: "An index of -2 returns 130"
```

### 2. Array.prototype.concat

方法用于合并两个或多个数组，返回一个新的数组，**不会改变原数组哦**。

```js
const array1 = ['a', 'b', 'c'];
const array2 = ['d', 'e', 'f'];
const array3 = array1.concat(array2);

console.log(array3);
// Expected output: Array ["a", "b", "c", "d", "e", "f"]
```

### 3. Array.prototype.copyWithin

方法浅复制数组的一部分到同一数组中的另一个位置，并返回它，**不会改变原数组的长度，但是会修改原数组**。

```js
const array1 = ['a', 'b', 'c', 'd', 'e'];

// Copy to index 0 the element at index 3
console.log(array1.copyWithin(0, 3, 4), array1);
// Expected output: Array ["d", "b", "c", "d", "e"]

// Copy to index 1 all elements from index 3 to the end
console.log(array1.copyWithin(1, 3));
// Expected output: Array ["d", "d", "e", "d", "e"]
```

不知道大家能不能看懂这个例子，我简单解释一下吧。

这个函数它接收三个参数，详细的参数解释就不在这里列了哈，大家直接看 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin#%E5%8F%82%E6%95%B0) 怎么说

- target：第一个参数代表复制的起始坐标。比如 target = 1，就是从下标为 1 的开始往后的内容要用 `start - end` 范围的数据填充
- start：从数组中 start 坐标开始复制
- end：数组中复制结束的坐标

### 4. Array.prototype.entries

返回一个新的数组迭代器对象，该对象包含数组中每个索引的键/值对。

```js
const array1 = ['a', 'b', 'c'];

const iterator1 = array1.entries();

console.log(iterator1.next().value);
// Expected output: Array [0, "a"]

console.log(iterator1.next().value);
// Expected output: Array [1, "b"]
```

### 5. Array.prototype.every

测试一个数组内的所有元素是否都能通过指定函数的测试。它返回一个布尔值。

```js
const isBelowThreshold = (currentValue) => currentValue < 40;

const array1 = [1, 30, 39, 29, 10, 13];

console.log(array1.every(isBelowThreshold));
// Expected output: true
```

### 6. Array.prototype.fill

用一个固定值填充一个数组中从起始索引（默认为 0）到终止索引（默认为 array.length）内的全部元素。它返回修改后的数组，**并且修改原数组**。

```js
const array1 = [1, 2, 3, 4];

// Fill with 0 from position 2 until position 4
console.log(array1.fill(0, 2, 4));
// Expected output: Array [1, 2, 0, 0]

// Fill with 5 from position 1
console.log(array1.fill(5, 1));
// Expected output: Array [1, 5, 5, 5]

console.log(array1.fill(6));
// Expected output: Array [6, 6, 6, 6]
```

### 7. Array.prototype.filter

创建给定数组一部分的浅拷贝，其包含通过所提供函数实现的测试的所有元素。

```js
const words = ['spray', 'elite', 'exuberant', 'destruction', 'present'];

const result = words.filter((word) => word.length > 6);

console.log(result);
// Expected output: Array ["exuberant", "destruction", "present"]
```

### 8. Array.prototype.find

返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。

```js
const array1 = [5, 12, 8, 130, 44];

const found = array1.find((element) => element > 10);

console.log(found);
// Expected output: 12
```

### 9. Array.prototype.findIndex

返回数组中满足提供的测试函数的第一个元素的索引。若没有找到对应元素则返回 -1。

```js
const array1 = [5, 12, 8, 130, 44];

const isLargeNumber = (element) => element > 13;

console.log(array1.findIndex(isLargeNumber));
// Expected output: 3
```

### 10. Array.prototype.findLast

与 `find` 刚好相反，从后面开始向前查找，符合条件就返回。

### 11. Array.prototype.findLastIndex

与 `findLastIndex` 刚好相反

### 12. Array.prototype.flat

数组拍平，创建一个新的数组，并根据指定深度递归地将所有子数组元素拼接到新的数组中。

```js
const arr1 = [0, 1, 2, [3, 4]];

console.log(arr1.flat());
// expected output: Array [0, 1, 2, 3, 4]

const arr2 = [0, 1, [2, [3, [4, 5]]]];

console.log(arr2.flat());
// expected output: Array [0, 1, 2, Array [3, Array [4, 5]]]

console.log(arr2.flat(2));
// expected output: Array [0, 1, 2, 3, Array [4, 5]]

console.log(arr2.flat(Infinity));
// expected output: Array [0, 1, 2, 3, 4, 5]
```

### 13. Array.prototype.flatMap

对数组中的每个元素应用给定的回调函数，然后将结果展开一级，返回一个新数组。

```js
const arr1 = [1, 2, 1];

const result = arr1.flatMap((num) => (num === 2 ? [2, 2] : 1));

console.log(result);
// Expected output: Array [1, 2, 2, 1]
```

### 14. Array.prototype.forEach

对数组的每个元素执行一次给定的函数。

```js
const array1 = ['a', 'b', 'c'];

array1.forEach((element) => console.log(element));

// Expected output: "a"
// Expected output: "b"
// Expected output: "c"
```

### 15. Array.prototype.includes

用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回 true，否则返回 false。

### 16. Array.prototype.indexOf

返回数组中第一次出现给定元素的下标，如果不存在则返回 -1。

### 17. Array.prototype.join

将一个数组（或一个类数组对象）的所有元素连接成一个字符串并返回这个字符串，用逗号或指定的分隔符字符串分隔。如果数组只有一个元素，那么将返回该元素而不使用分隔符。

### 18. Array.prototype.keys

返回一个新的数组迭代器对象，其中包含数组中每个索引的键。

```js
const array1 = ['a', 'b', 'c'];
const iterator = array1.keys();

for (const key of iterator) {
  console.log(key);
}

// Expected output: 0
// Expected output: 1
// Expected output: 2
```

### 19. Array.prototype.lastIndexOf

与 `indexOf` 相反，返回数组中给定元素最后一次出现的索引，如果不存在则返回 -1。该方法从 fromIndex 开始向前搜索数组。

### 20. Array.prototype.map

创建一个新数组，这个新数组由原数组中的每个元素都调用一次提供的函数后的返回值组成。

```js
const array1 = [1, 4, 9, 16];

// Pass a function to map
const map1 = array1.map((x) => x * 2);

console.log(map1);
// Expected output: Array [2, 8, 18, 32]
```

### 21. Array.prototype.pop

从数组中删除最后一个元素，并返回该元素的值。**此方法会更改数组的长度**。

### 22. Array.prototype.push

将指定的元素添加到数组的末尾，**并返回新的数组长度**。

### 23. Array.prototype.reduce

对数组中的每个元素按序执行一个提供的 reducer 函数，每一次运行 reducer 会将先前元素的计算结果作为参数传入，最后将其结果汇总为单个返回值。

```js
const array1 = [1, 2, 3, 4];

// 0 + 1 + 2 + 3 + 4
const initialValue = 0;
const sumWithInitial = array1.reduce(
  (accumulator, currentValue) => accumulator + currentValue,
  initialValue,
);

console.log(sumWithInitial);
// Expected output: 10
```

### 24. Array.prototype.reduceRight

与 `reduce` 方法运行方向相反，从右到左执行

### 25. Array.prototype.reverse

就地反转数组中的元素，并返回同一数组的引用。

```js
const array1 = ['one', 'two', 'three'];
console.log('array1:', array1);
// Expected output: "array1:" Array ["one", "two", "three"]

const reversed = array1.reverse();
console.log('reversed:', reversed);
// Expected output: "reversed:" Array ["three", "two", "one"]

// Careful: reverse is destructive -- it changes the original array.
console.log('array1:', array1);
// Expected output: "array1:" Array ["three", "two", "one"]
```

### 26. Array.prototype.shift

从数组中删除第一个元素，并返回该元素的值。**此方法更改数组的长度**。

### 27. Array.prototype.slice

返回一个新的数组对象，这一对象是一个由 start 和 end 决定的原数组的浅拷贝（包括 start，不包括 end），其中 start 和 end 代表了数组元素的索引。**原始数组不会被改变**。

```js
const animals = ['ant', 'bison', 'camel', 'duck', 'elephant'];

console.log(animals.slice(2));
// Expected output: Array ["camel", "duck", "elephant"]

console.log(animals.slice(2, 4));
// Expected output: Array ["camel", "duck"]

console.log(animals.slice(1, 5));
// Expected output: Array ["bison", "camel", "duck", "elephant"]

console.log(animals.slice(-2));
// Expected output: Array ["duck", "elephant"]

console.log(animals.slice(2, -1));
// Expected output: Array ["camel", "duck"]

console.log(animals.slice());
// Expected output: Array ["ant", "bison", "camel", "duck", "elephant"]
```

### 28. Array.prototype.some

测试数组中是否至少有一个元素通过了由提供的函数实现的测试。如果在数组中找到一个元素使得提供的函数返回 true，则返回 true；否则返回 false。**它不会修改数组**。

```js
const array = [1, 2, 3, 4, 5];

// Checks whether an element is even
const even = (element) => element % 2 === 0;

console.log(array.some(even));
// Expected output: true
```

### 29. Array.prototype.sort

**就地**对数组的元素进行排序，并返回对相同数组的引用。默认排序是将元素转换为字符串，然后按照它们的 UTF-16 码元值升序排序。

```js
const months = ['March', 'Jan', 'Feb', 'Dec'];
months.sort();
console.log(months);
// Expected output: Array ["Dec", "Feb", "Jan", "March"]

const array1 = [1, 30, 4, 21, 100000];
array1.sort();
console.log(array1);
// Expected output: Array [1, 100000, 21, 30, 4]
```

### 30. Array.prototype.splice

**就地**移除或者替换已存在的元素和/或添加新的元素

```js
const months = ['Jan', 'March', 'April', 'June'];
months.splice(1, 0, 'Feb');
// Inserts at index 1
console.log(months);
// Expected output: Array ["Jan", "Feb", "March", "April", "June"]

months.splice(4, 1, 'May');
// Replaces 1 element at index 4
console.log(months);
// Expected output: Array ["Jan", "Feb", "March", "April", "May"]
```

### 31. Array.prototype.toLocaleString

返回一个字符串，表示数组中的所有元素。每个元素通过调用它们自己的 toLocaleString 方法转换为字符串，并且使用特定于语言环境的字符串（例如逗号“,”）分隔开。

```js
const array1 = [1, 'a', new Date('21 Dec 1997 14:12:00 UTC')];
const localeString = array1.toLocaleString('en', { timeZone: 'UTC' });

console.log(localeString);
// Expected output: "1,a,12/21/1997, 2:12:00 PM",
// This assumes "en" locale and UTC timezone - your results may vary
```

### 32. Array.prototype.toReversed

toReversed() 方法是 reverse() 方法对应的复制版本。它返回一个元素顺序相反的新数组。

### 33. Array.prototype.toSorted

toSorted() 方法是 sort() 方法的复制方法版本。它返回一个新数组，其元素按升序排列。

### 34. Array.prototype.toSpliced

toSpliced() 方法是 splice() 方法的复制版本。它返回一个新数组，并在给定的索引处删除和/或替换了一些元素。

### 35. Array.prototype.toString

toString() 方法返回一个字符串，表示指定的数组及其元素。

### 36. Array.prototype.unshift

将指定元素添加到数组的开头，并返回数组的新长度。

### 37. Array.prototype.values

返回一个新的数组迭代器对象，该对象迭代数组中每个元素的值。

```js
const array1 = ['a', 'b', 'c'];
const iterator = array1.values();

for (const value of iterator) {
  console.log(value);
}

// Expected output: "a"
// Expected output: "b"
// Expected output: "c"
```

### 38. Array.prototype.with

使用方括号表示法修改指定索引值的复制方法版本。它会返回一个新数组，其指定索引处的值会被新值替换。

```js
const arr = [1, 2, 3, 4, 5];
console.log(arr.with(2, 6)); // [1, 2, 6, 4, 5]
console.log(arr); // [1, 2, 3, 4, 5]
```

# 总结

### 修改原数组的方法

1. pop
2. push
3. shift
4. unshift
5. slice
6. splice
7. sort
8. reverse
