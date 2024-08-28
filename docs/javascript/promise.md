---
title: 手写 Promise
desciption: 手写 Promise
keywords:
  - Promise
group:
  title: JavaScript
toc: content
---

## Promise A+

我们想要手写一个 Promise，就要遵循 Promise/A+ 规范，业界所有 Promise 的类库都遵循这个规范。

其实 Promise/A+ 规范对如何实现一个符合标准的 Promise 类库已经阐述的很详细了。每一行代码在 Promise/A+ 规范中都有迹可循，所以在下面的实现的过程中，我会尽可能的将代码和 Promise/A+ 规范一一对应起来。

下面开始步入正题啦～

## 基础版 Promise

首先，我们要知道 Promise 他有什么样的状态，什么样的方法。接下来就是我们去实现它。

先来做一些前置工作：

Promise 有着三种状态，那么我们先来定义三个常量来记录这三种状态。

```js
// 记录Promise的三种状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
```

Promise 属于一个微任务，要放到微任务队列中，所以我们写一个函数来模拟一下

```js
/**
 * 运行一个微队列任务
 * 把传递的函数放到微队列中
 * @param {Function} callback
 */
function runMicroTask(callback) {
  // 判断 node 环境
  // 为了避免「变量未定义」的错误，这里最好加上前缀 globalThis
  // globalThis 是一个关键字，指代全局对象，浏览器环境为 window，node 环境为 global
  if (globalThis.process && globalThis.process.nextTick) {
    process.nextTick(callback);
  } else if (globalThis.MutationObserver) {
    const p = document.createElement('p');
    const observer = new MutationObserver(callback);
    observer.observe(p, {
      childList: true, // 观察该元素内部的变化
    });
    p.innerHTML = '1';
  } else {
    setTimeout(callback, 0);
  }
}
```

ok，到这里，我们的准备工作就做的差不多了，接下来就是要去实现最基本的 Promise。

先回忆一下 Promise 怎么使用

```js
const pro = new Promise((res, rej) => {
  res(1);
});

pro
  .then((res) => {
    console.log(1);
  })
  .catch((err) => {
    console.log('err', err);
  })
  .finally(() => {
    console.log('finally');
  });
```

请问，上面的代码输出什么呢（面试经典问题）？

```bash
1
finally
```

那么接下来我们就开始写自己的 Promise 了。

首先，`MyPromise` 需要是一个 class ，其次，他需要有三个静态函数 `then`、`catch`、`finally`，还要支持传递一个 `callback` 去执行用户的逻辑。

废话不多说，直接上代码：

```js
// 记录Promise的三种状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

/**
 * 运行一个微队列任务
 * 把传递的函数放到微队列中
 * @param {Function} callback
 */
function runMicroTask(callback) {
  // 判断node环境
  // 为了避免「变量未定义」的错误，这里最好加上前缀globalThis
  // globalThis是一个关键字，指代全局对象，浏览器环境为window，node环境为global
  if (globalThis.process && globalThis.process.nextTick) {
    process.nextTick(callback);
  } else if (globalThis.MutationObserver) {
    const p = document.createElement('p');
    const observer = new MutationObserver(callback);
    observer.observe(p, {
      childList: true, // 观察该元素内部的变化
    });
    p.innerHTML = '1';
  } else {
    setTimeout(callback, 0);
  }
}

/**
 * 判断一个数据是否是Promise对象
 * @param {any} obj
 * @returns
 */
function isPromise(obj) {
  return !!(obj && typeof obj === 'object' && typeof obj.then === 'function');
}

class MyPromise {
  /**
   * 创建一个Promise
   * @param {Function} executor 任务执行器，立即执行
   */
  constructor(executor) {
    this._state = PENDING; // 状态
    this._value = undefined; // 数据
    this._handlers = []; // 处理函数形成的队列
    try {
      executor(this._resolve.bind(this), this._reject.bind(this));
    } catch (error) {
      this._reject(error);
      console.error(error);
    }
  }

  /**
   * 向处理队列中添加一个函数
   * @param {Function} executor 添加的函数
   * @param {String} state 该函数什么状态下执行
   * @param {Function} resolve 让then函数返回的Promise成功
   * @param {Function} reject 让then函数返回的Promise失败
   */
  _pushHandler(executor, state, resolve, reject) {
    this._handlers.push({
      executor,
      state,
      resolve,
      reject,
    });
  }

  /**
   * 根据实际情况，执行队列
   */
  _runHandlers() {
    if (this._state === PENDING) {
      // 目前任务仍在挂起
      return;
    }
    while (this._handlers[0]) {
      const handler = this._handlers[0];
      this._runOneHandler(handler);
      this._handlers.shift();
    }
  }

  /**
   * 处理一个handler
   * @param {Object} handler
   */
  _runOneHandler({ executor, state, resolve, reject }) {
    runMicroTask(() => {
      if (this._state !== state) {
        // 状态不一致，不处理
        return;
      }

      if (typeof executor !== 'function') {
        // 传递后续处理并非一个函数
        this._state === FULFILLED ? resolve(this._value) : reject(this._value);
        return;
      }
      try {
        const result = executor(this._value);
        if (isPromise(result)) {
          result.then(resolve, reject);
        } else {
          resolve(result);
        }
      } catch (error) {
        reject(error);
        console.error(error);
      }
    });
  }

  /**
   * Promise A+规范的then
   * @param {Function} onFulfilled
   * @param {Function} onRejected
   */
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this._pushHandler(onFulfilled, FULFILLED, resolve, reject);
      this._pushHandler(onRejected, REJECTED, resolve, reject);
      this._runHandlers(); // 执行队列
    });
  }

  /**
   * 仅处理失败的场景
   * @param {Function} onRejected
   */
  catch(onRejected) {
    return this.then(null, onRejected);
  }

  /**
   * 无论成功还是失败都会执行回调
   * @param {Function} onSettled
   */
  finally(onSettled) {
    return this.then(
      (data) => {
        onSettled();
        return data;
      },
      (reason) => {
        onSettled();
        throw reason;
      },
    );
  }

  /**
   * 更改任务状态
   * @param {String} newState 新状态
   * @param {any} value 相关数据
   */
  _changeState(newState, value) {
    if (this._state !== PENDING) {
      // 目前状态已经更改
      return;
    }
    // 下面这个判断是为了处理value为Promise的情况
    // 这一段代码课程中没有涉及，特此注释说明
    if (isPromise(value)) {
      value.then(this._resolve.bind(this), this._reject.bind(this));
      return;
    }
    this._state = newState;
    this._value = value;
    this._runHandlers(); // 状态变化，执行队列
  }

  /**
   * 标记当前任务完成
   * @param {any} data 任务完成的相关数据
   */
  _resolve(data) {
    this._changeState(FULFILLED, data);
  }

  /**
   * 标记当前任务失败
   * @param {any} reason 任务失败的相关数据
   */
  _reject(reason) {
    this._changeState(REJECTED, reason);
  }
}
```

现在来解释一下上面的代码：

1. 首先是 constructor，在这个函数中呢，我们要接受用户的 callback（executor），并且定义本次 promise 的状态以及处理函数的队列。做完这些工作之后呢，我们需要立即去执行传递进来函数。
2. 执行 executor 这个函数需要传递两个函数进去，也就是 resolve 和 reject，供用户使用。
3. 接下来就是要看 resolve 和 reject 做了什么，这两个函数做的内容也很简单就是去修改一下本次 Promise 的状态，并且一经修改，不可再次修改。所以我们封装了 `_changeState` 函数来完成这项工作。
4. 然后就是 then 的过程，then 这个函数除了接手 resolve reject 的结果，还可以继续链式操作，也就是说，他要返回一个 Promise,而我们的操作也直接在这个新的 Promise 中执行。为此呢，我们的任务队列就派上了用场，每一个 then 都会向任务队列中推入两个任务，一个 resolve 状态，一个 rejected 状态的任务，然后执行。PS：我知道大家会有问题：为什么要推入两个任务。先跟着往下走。
5. 推入完任务之后就是去执行他了。为此呢，我们写了一个简单的调度，就是 `_runHandlers` 和 `_runOneHandler` 这两个函数来帮我们去执行队列中的任务。在这个任务中呢，我们直接判断当前 promise 的状态和传入队列中函数的状态是否一致，一致的话我们执行，不一致就不执行。这里就与上面推入两个任务相吻合了，不用担心多传递了任务这个问题，因为 Promise 只能有**一个**已决状态。
6. then 完了之后，我们的链式调用就结束了。剩下的 catch finally 也直接去调用 then 就好了，catch 要进入 rejected 状态，所以直接 `then(null, onRejected)` 就 OK 了。finally 呢又是必须执行的，所以不管什么状态都让他去执行就好。

总结：

到这里呢，我们基本的 promise 的流程就结束了。上面的解释就是一个写这么一个 promise 的基本的思路，有一些细节的判断我没有解释，这个大家看代码的时候具体看看就好，都是细节性问题，大体思路流程清晰才是最重要的。问题要一步一步的解决，可能第一遍看上去会感觉有点抽象，这个时候呢，就多看几遍，拿代码多跑几遍，多调试几遍，实践出真知！

最后，Promise 还有很多的静态方法，这里就不一一赘述这些方法是怎么写的了，直接附上一份最完整的代码供各位大佬们审阅。

```js
// 记录Promise的三种状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

/**
 * 运行一个微队列任务
 * 把传递的函数放到微队列中
 * @param {Function} callback
 */
function runMicroTask(callback) {
  // 判断node环境
  // 为了避免「变量未定义」的错误，这里最好加上前缀globalThis
  // globalThis是一个关键字，指代全局对象，浏览器环境为window，node环境为global
  if (globalThis.process && globalThis.process.nextTick) {
    process.nextTick(callback);
  } else if (globalThis.MutationObserver) {
    const p = document.createElement('p');
    const observer = new MutationObserver(callback);
    observer.observe(p, {
      childList: true, // 观察该元素内部的变化
    });
    p.innerHTML = '1';
  } else {
    setTimeout(callback, 0);
  }
}

/**
 * 判断一个数据是否是Promise对象
 * @param {any} obj
 * @returns
 */
function isPromise(obj) {
  return !!(obj && typeof obj === 'object' && typeof obj.then === 'function');
}

class MyPromise {
  /**
   * 创建一个Promise
   * @param {Function} executor 任务执行器，立即执行
   */
  constructor(executor) {
    this._state = PENDING; // 状态
    this._value = undefined; // 数据
    this._handlers = []; // 处理函数形成的队列
    try {
      executor(this._resolve.bind(this), this._reject.bind(this));
    } catch (error) {
      this._reject(error);
      console.error(error);
    }
  }

  /**
   * 向处理队列中添加一个函数
   * @param {Function} executor 添加的函数
   * @param {String} state 该函数什么状态下执行
   * @param {Function} resolve 让then函数返回的Promise成功
   * @param {Function} reject 让then函数返回的Promise失败
   */
  _pushHandler(executor, state, resolve, reject) {
    this._handlers.push({
      executor,
      state,
      resolve,
      reject,
    });
  }

  /**
   * 根据实际情况，执行队列
   */
  _runHandlers() {
    if (this._state === PENDING) {
      // 目前任务仍在挂起
      return;
    }
    while (this._handlers[0]) {
      const handler = this._handlers[0];
      this._runOneHandler(handler);
      this._handlers.shift();
    }
  }

  /**
   * 处理一个handler
   * @param {Object} handler
   */
  _runOneHandler({ executor, state, resolve, reject }) {
    runMicroTask(() => {
      if (this._state !== state) {
        // 状态不一致，不处理
        return;
      }

      if (typeof executor !== 'function') {
        // 传递后续处理并非一个函数
        this._state === FULFILLED ? resolve(this._value) : reject(this._value);
        return;
      }
      try {
        const result = executor(this._value);
        if (isPromise(result)) {
          result.then(resolve, reject);
        } else {
          resolve(result);
        }
      } catch (error) {
        reject(error);
        console.error(error);
      }
    });
  }

  /**
   * Promise A+规范的then
   * @param {Function} onFulfilled
   * @param {Function} onRejected
   */
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this._pushHandler(onFulfilled, FULFILLED, resolve, reject);
      this._pushHandler(onRejected, REJECTED, resolve, reject);
      this._runHandlers(); // 执行队列
    });
  }

  /**
   * 仅处理失败的场景
   * @param {Function} onRejected
   */
  catch(onRejected) {
    return this.then(null, onRejected);
  }

  /**
   * 无论成功还是失败都会执行回调
   * @param {Function} onSettled
   */
  finally(onSettled) {
    return this.then(
      (data) => {
        onSettled();
        return data;
      },
      (reason) => {
        onSettled();
        throw reason;
      },
    );
  }

  /**
   * 更改任务状态
   * @param {String} newState 新状态
   * @param {any} value 相关数据
   */
  _changeState(newState, value) {
    if (this._state !== PENDING) {
      // 目前状态已经更改
      return;
    }
    // 下面这个判断是为了处理value为Promise的情况
    // 这一段代码课程中没有涉及，特此注释说明
    if (isPromise(value)) {
      value.then(this._resolve.bind(this), this._reject.bind(this));
      return;
    }
    this._state = newState;
    this._value = value;
    this._runHandlers(); // 状态变化，执行队列
  }

  /**
   * 标记当前任务完成
   * @param {any} data 任务完成的相关数据
   */
  _resolve(data) {
    this._changeState(FULFILLED, data);
  }

  /**
   * 标记当前任务失败
   * @param {any} reason 任务失败的相关数据
   */
  _reject(reason) {
    this._changeState(REJECTED, reason);
  }

  /**
   * 返回一个已完成的Promise
   * 特殊情况：
   * 1. 传递的data本身就是ES6的Promise对象
   * 2. 传递的data是PromiseLike（Promise A+），返回新的Promise，状态和其保持一致即可
   * @param {any} data
   */
  static resolve(data) {
    if (data instanceof MyPromise) {
      return data;
    }
    return new MyPromise((resolve, reject) => {
      if (isPromise(data)) {
        data.then(resolve, reject);
      } else {
        resolve(data);
      }
    });
  }

  /**
   * 得到一个被拒绝的Promise
   * @param {any}} reason
   */
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }

  /**
   * 得到一个新的Promise
   * 该Promise的状态取决于proms的执行
   * proms是一个迭代器，包含多个Promise
   * 全部Promise成功，则返回的Promise成功，数据为所有Promise成功的数据，并且顺序是按照传入的顺序排列
   * 只要有一个Promise失败，则返回的Promise失败，原因是第一个失败的Promise的原因
   * @param {iterator} proms
   */
  static all(proms) {
    return new MyPromise((resolve, reject) => {
      try {
        const results = [];
        let count = 0; // Promise的总数
        let fulfilledCount = 0; // 已完成的数量
        for (const p of proms) {
          let i = count;
          count++;
          MyPromise.resolve(p).then((data) => {
            fulfilledCount++;
            results[i] = data;
            if (fulfilledCount === count) {
              // 当前是最后一个Promise完成了
              resolve(results);
            }
          }, reject);
        }
        if (count === 0) {
          resolve(results);
        }
      } catch (error) {
        reject(error);
        console.error(error);
      }
    });
  }

  /**
   * 等待所有的Promise有结果之后
   * 该方法返回的Promise完成
   * 并且按照顺序将所有结果汇总
   * @param {iterator} proms
   */
  static allSettled(proms) {
    const ps = [];
    for (const p of proms) {
      ps.push(
        MyPromise.resolve(p).then(
          (value) => ({
            status: FULFILLED,
            value,
          }),
          (reason) => ({
            status: REJECTED,
            reason,
          }),
        ),
      );
    }
    return MyPromise.all(ps);
  }

  /**
   * 返回的Promise与第一个有结果的一致
   * @param {iterator} proms
   */
  static race(proms) {
    return new MyPromise((resolve, reject) => {
      for (const p of proms) {
        MyPromise.resolve(p).then(resolve, reject);
      }
    });
  }
}
```
