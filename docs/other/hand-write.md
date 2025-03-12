---
title: 手写
desciption: 手写题
keywords:
  - JS
  - 手写
toc: content
---

## 简介

:::info{title=TIP}
简单记录一下手写题
:::

### 手写深拷贝

:::info{title=TIP}
可以看一看这篇文章，[深拷贝的终极探索](https://segmentfault.com/a/1190000016672263)，里面写的是蛮复杂的，em...
:::

#### 测试对象

```js
// 创建一个包含循环引用的复杂对象
const obj = {
  // 基本数据类型
  string: '字符串',
  number: 42,
  boolean: true,
  null: null,
  undefined: undefined,
  bigint: BigInt(9007199254740991),
  symbol: Symbol('测试symbol'),

  // 引用类型
  array: [1, '2', { x: 3 }, [4, 5]],
  set: new Set([1, 2, 3]),
  map: new Map([
    ['key', 'value'],
    ['number', 123],
  ]),

  // 日期和正则
  date: new Date('2024-01-01'),
  regexp: /^test$/gi,

  // 函数
  function: function () {
    return this.string;
  },
  arrowFunction: () => 'arrow',

  // 内置对象
  error: new Error('测试错误'),
  promise: Promise.resolve('测试promise'),

  // 类型化数组
  int32Array: new Int32Array([1, 2, 3]),

  // 嵌套对象
  nested: {
    level1: {
      level2: {
        data: '嵌套数据',
      },
    },
  },
};

// 添加循环引用
obj.self = obj;
obj.nested.parent = obj;
obj.array.push(obj.nested);
obj.circular = obj.nested;
```

#### 实现

```js
function deepClone(target, map = new WeakMap()) {
  // 处理基本类型、null和BigInt
  if (target === null || typeof target !== 'object') {
    if (typeof target === 'bigint') {
      return BigInt(target.toString());
    }
    return target;
  }

  // 处理特殊对象类型
  if (target instanceof Date) return new Date(target);
  if (target instanceof RegExp) return new RegExp(target.source, target.flags);
  if (target instanceof Error) return new Error(target.message);
  if (target instanceof Promise) return Promise.resolve(target);
  if (target instanceof Set) {
    const newSet = new Set();
    for (const item of target) {
      newSet.add(deepClone(item, map));
    }
    return newSet;
  }
  if (target instanceof Map) {
    const newMap = new Map();
    for (const [key, value] of target) {
      newMap.set(deepClone(key, map), deepClone(value, map));
    }
    return newMap;
  }
  if (target instanceof Int32Array) {
    return new Int32Array(target);
  }

  // 处理循环引用
  if (map.has(target)) {
    return map.get(target);
  }

  // 创建新对象，保持原型链
  const cloneTarget = Array.isArray(target)
    ? []
    : Object.create(Object.getPrototypeOf(target));

  // 记录已克隆的对象，避免循环引用
  map.set(target, cloneTarget);

  // 处理 Symbol 类型的键
  const symbols = Object.getOwnPropertySymbols(target);
  if (symbols.length) {
    symbols.forEach((symbol) => {
      cloneTarget[symbol] = deepClone(target[symbol], map);
    });
  }

  // 克隆对象的所有属性
  for (const key in target) {
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      cloneTarget[key] = deepClone(target[key], map);
    }
  }

  return cloneTarget;
}
```

#### 测试

```js
// 测试用例
function runTests() {
  console.group('深拷贝测试用例');

  // 1. 测试基本数据类型
  const clonedObj = deepClone(obj);
  console.group('1. 基本数据类型测试');
  console.log('string:', clonedObj.string === obj.string);
  console.log('number:', clonedObj.number === obj.number);
  console.log('boolean:', clonedObj.boolean === obj.boolean);
  console.log('null:', clonedObj.null === obj.null);
  console.log('undefined:', clonedObj.undefined === obj.undefined);
  console.log('bigint:', clonedObj.bigint === obj.bigint);
  console.groupEnd();

  // 2. 测试引用类型独立性
  console.group('2. 引用类型独立性测试');
  // 数组测试
  clonedObj.array[0] = 999;
  console.log('数组独立:', obj.array[0] === 1);

  // Set测试
  clonedObj.set.add(4);
  console.log('Set独立:', !obj.set.has(4));

  // Map测试
  clonedObj.map.set('new', 'value');
  console.log('Map独立:', !obj.map.has('new'));

  // 嵌套对象测试
  clonedObj.nested.level1.level2.data = '修改后的数据';
  console.log('嵌套对象独立:', obj.nested.level1.level2.data === '嵌套数据');
  console.groupEnd();

  // 3. 测试特殊对象
  console.group('3. 特殊对象测试');
  console.log('Date:', clonedObj.date.getTime() === obj.date.getTime());
  console.log('RegExp source:', clonedObj.regexp.source === obj.regexp.source);
  console.log('RegExp flags:', clonedObj.regexp.flags === obj.regexp.flags);
  console.log('Error:', clonedObj.error.message === obj.error.message);
  console.log('Int32Array:', clonedObj.int32Array !== obj.int32Array);
  console.groupEnd();

  // 4. 测试循环引用
  console.group('4. 循环引用测试');
  console.log('self引用:', clonedObj.self === clonedObj);
  console.log('nested.parent引用:', clonedObj.nested.parent === clonedObj);
  console.log('circular引用:', clonedObj.circular === clonedObj.nested);
  console.groupEnd();

  // 5. 测试函数
  console.group('5. 函数测试');
  console.log('普通函数:', clonedObj.function() === obj.function());
  console.log('箭头函数:', clonedObj.arrowFunction() === obj.arrowFunction());
  console.groupEnd();

  // 6. 测试Symbol
  console.group('6. Symbol测试');
  console.log(
    'Symbol:',
    clonedObj.symbol.description === obj.symbol.description,
  );
  console.groupEnd();

  console.groupEnd();
}
```

### 手写 getType 函数

```js
function getType(obj) {
  // 使用 Object.prototype.toString.call() 获取对象的内部 [[Class]] 属性
  const type = Object.prototype.toString
    .call(obj)
    .match(/^\[object (.*)\]$/)[1]
    .toLowerCase();

  // 处理特殊情况
  if (type === 'string' && typeof obj === 'object') return 'object'; // 处理 new String('') 返回 'object'
  if (obj === null) return 'null'; // 处理 null 的特殊情况
  if (obj === undefined) return 'undefined'; // 处理 undefined 的特殊情况

  return type;
}
```
