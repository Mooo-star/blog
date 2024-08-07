---
title: JavaScript 事件循环
description:
  - 运行机制
  - 事件循环
group:
  title: JavaScript
toc: content
---

# JavaScript 事件循环

在介绍 JavaScript 事件循环之前呢，我们先来介绍一些前置知识。

## 进程与线程

### 什么是进程

CPU 是计算机的核心，承担所有的计算任务。

官网说法，进程是 CPU 资源分配的最小单位。

字面意思就是进行中的程序，我将它理解为一个可以独立运行且拥有自己的资源空间的任务程序，进程包括运行中的程序和程序所使用到的内存和系统资源。CPU 可以有很多进程，我们的电脑每打开一个软件就会产生一个或多个进程，为什么电脑运行的软件多就会卡，是因为 CPU 给每个进程分配资源空间，但是一个 CPU 一共就那么多资源，分出去越多，越卡，每个进程之间是相互独立的，CPU 在运行一个进程时，其他的进程处于非运行状态，CPU 使用 时间片轮转调度算法 来实现同时运行多个进程。

### 什么是线程

线程是 CPU 调度的最小单位。

线程是建立在进程的基础上的一次程序运行单位，通俗点解释线程就是程序中的一个执行流，一个进程可以有多个线程。

一个进程中只有一个执行流称作单线程，即程序执行时，所走的程序路径按照连续顺序排下来，前面的必须处理好，后面的才会执行。

一个进程中有多个执行流称作多线程，即在一个程序中可以同时运行多个不同的线程来执行不同的任务， 也就是说允许单个程序创建多个并行执行的线程来完成各自的任务。

### 进程与线程的区别

进程是操作系统分配资源的最小单位，线程是程序执行的最小单位。

一个进程由一个或多个线程组成，线程可以理解为是一个进程中代码的不同执行路线。

进程之间相互独立，但同一进程下的各个线程间共享程序的内存空间(包括代码段、数据集、堆等)及一些进程级的资源(如打开文件和信号)。

调度和切换：线程上下文切换比进程上下文切换要快得多。

### 多进程与多线程

- 多进程：多进程指的是在同一个时间里，同一个计算机系统中如果允许两个或两个以上的进程处于运行状态。多进程带来的好处是明显的，比如大家可以在网易云听歌的同时打开编辑器敲代码，编辑器和网易云的进程之间不会相互干扰；
- 多线程：多线程是指程序中包含多个执行流，即在一个程序中可以同时运行多个不同的线程来执行不同的任务，也就是说允许单个程序创建多个并行执行的线程来完成各自的任务；

## JS 为什么是单线程

JS 的单线程，与它的用途有关。

作为浏览器脚本语言，JavaScript 的主要用途是与用户互动，以及操作 DOM。这决定了它只能是单线程，否则会带来很复杂的同步问题。比如，假定 JavaScript 同时有两个线程，一个线程在某个 DOM 节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？

还有人说 JS 还有 Worker 线程，对的，为了利用多核 CPU 的计算能力，HTML5 提出 Web Worker 标准，允许 JavaScript 脚本创建多个线程，但是子线程是完 全受主线程控制的，而且不得操作 DOM。所以，这个标准并没有改变 JavaScript 是单线程的本质。

## 浏览器

拿 Chrome 来说，我们每打开一个 Tab 页就会产生一个进程。

### 浏览器包含哪些进程

1. Browser 进程
   1. 浏览器的主进程(负责协调、主控)，该进程只有一个；
   2. 负责浏览器界面显示，与用户交互。如前进，后退等；
   3. 负责各个页面的管理，创建和销毁其他进程；
   4. 将渲染(Renderer)进程得到的内存中的 Bitmap(位图)，绘制到用户界面上；
   5. 网络资源的管理，下载等；
2. 第三方插件进程
   1. 每种类型的插件对应一个进程，当使用该插件时才创建；
3. GPU 进程
   1. 该进程也只有一个，用于 3D 绘制等等；
4. 渲染进程
   1. 即通常所说的浏览器内核(Renderer 进程，内部是多线程)；
   2. 每个 Tab 页面都有一个渲染进程，互不影响；
   3. 主要作用为页面渲染，脚本执行，事件处理等；

<div align='center'>
  <img src="https://mooo-star.github.io/blog/browser_process.png">
</div>

### 为什么浏览器需要多进程

假设浏览器是单进程，那么某个 Tab 页崩溃了，就影响了整个浏览器，体验有多差？同理如果插件崩溃了也会影响整个浏览器。

浏览器进程有很多，每个进程又有很多线程，都会占用内存

### 渲染进程

页面的渲染，JS 的执行，事件的循环，都在渲染进程内执行，所以我们要重点了解渲染进程

渲染进程是多线程的，看渲染进程的一些常用较为主要的线程

#### GUI 渲染线程

1. 负责渲染浏览器界面，解析 HTML，CSS，构建 DOM 树和 RenderObject 树，布局和绘制等；
   1. 解析 HTML 代码( HTML 代码本质是字符串)转化为浏览器认识的节点，生成 DOM 树，也就是 DOM Tree；
   2. 解析 CSS，生成 CSSOM ( CSS 规则树)；
   3. 把 DOM Tree 和 CSSOM 结合，生成 Rendering Tree (渲染树)；
2. 当我们修改了一些元素的颜色或者背景色，页面就会重绘( Repaint )；
3. 当我们修改元素的尺寸，页面就会回流( Reflow )；
4. 当页面需要 Repaing 和 Reflow 时 GUI 线程执行，绘制页面；
5. 回流( Reflow )比重绘( Repaint )的成本要高，我们要尽量避免 Reflow 和 Repaint；
6. GUI 渲染线程与 JS 引擎线程是互斥的：
   1. 当 JS 引擎执行时 GUI 线程会被挂起(相当于被冻结了)；
   2. GUI 更新会被保存在一个队列中等到 JS 引擎空闲时立即被执行；

#### JS 引擎线程

1. JS 引擎线程就是 JS 内核，负责处理 Javascript 脚本程序(例如 V8 引擎)；
2. JS 引擎线程负责解析 Javascript 脚本，运行代码；
3. JS 引擎一直等待着任务队列中任务的到来，然后加以处理：
   1. 浏览器同时只能有一个 JS 引擎线程在运行 JS 程序，所以 JS 是单线程运行的；
   2. 一个 Tab 页( renderer 进程)中无论什么时候都只有一个 JS 线程在运行 JS 程序；
4. GUI 渲染线程与 JS 引擎线程是互斥的，JS 引擎线程会阻塞 GUI 渲染线程
   1. 就是我们常遇到的 JS 执行时间过长，造成页面的渲染不连贯，导致页面渲染加载阻塞(就是加载慢)；
   2. 例如浏览器渲染的时候遇到 `<script>` 标签，就会停止 GUI 的渲染，然后 JS 引擎线程开始工作，执行里面的 JS 代码，等 JS 执行完毕，JS 引擎线程停止工作，GUI 继续渲染下面的内容。所以如果 JS 执行时间太长就会造成页面卡顿的情况；（所以有了 `defer` 和 `async` 标签）

#### 事件触发线程

1. 属于浏览器而不是 JS 引擎，用来控制事件循环，并且管理着一个事件队列(task queue)；
2. 当 JS 执行碰到事件绑定和一些异步操作(如 setTimeOut，也可来自浏览器内核的其他线程，如鼠标点击、AJAX 异步请求等)，会走事件触发线程将对应的事件添加到对应的线程中(比如定时器操作，便把定时器事件添加到定时器线程)，等异步事件有了结果，便把他们的回调操作添加到事件队列，等待 JS 引擎线程空闲时来处理；
3. 当对应的事件符合触发条件被触发时，该线程会把事件添加到待处理队列的队尾，等待 JS 引擎的处理；
4. 因为 JS 是单线程，所以这些待处理队列中的事件都得排队等待 JS 引擎处理；

#### 定时触发器线程

1. setInterval 与 setTimeout 所在线程；
2. 浏览器定时计数器并不是由 JavaScript 引擎计数的(因为 JavaScript 引擎是单线程的，如果处于阻塞线程状态就会影响记计时的准确)；
3. 通过单独线程来计时并触发定时(计时完毕后，添加到事件触发线程的事件队列中，等待 JS 引擎空闲后执行)，这个线程就是定时触发器线程，也叫定时器线程；
4. W3C 在 [HTML 标准](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout-dev)中规定，规定要求 setTimeout 中低于 4ms 的时间间隔在大于 5 层嵌套的情况下算为 4ms；

#### 异步 http 请求线程

1. 在 XMLHttpRequest 在连接后是通过浏览器新开一个线程请求；
2. 将检测到状态变更时，如果设置有回调函数，异步线程就产生状态变更事件，将这个回调再放入事件队列中再由 JavaScript 引擎执行；
3. 简单说就是当执行到一个 http 异步请求时，就把异步请求事件添加到异步请求线程，等收到响应(准确来说应该是 http 状态变化)，再把回调函数添加到事件队列，等待 js 引擎线程来执行；

## 事件循环基础

JS 分为同步任务和异步任务。

同步任务都在主线程(这里的主线程就是 JS 引擎线程)上执行，会形成一个执行栈。主线程之外，事件触发线程管理着一个任务队列，只要异步任务有了运行结果，就在任务队列之中放一个事件回调。一旦执行栈中的所有同步任务执行完毕(也就是 JS 引擎线程空闲了)，系统就会读取任务队列，将可运行的异步任务(任务队列中的事件回调，只要任务队列中有事件回调，就说明可以执行)添加到执行栈中，开始执行

我们来看一段简单的代码

```js
let setTimeoutCallBack = function () {
  console.log('');
};

let httpCallback = function () {
  console.log('http');
};

console.log('1');

setTimeout(setTimeoutCallBack, 1000);

httpajax.get('/info', httpCallback);

console.log('2');
```

以上代码的执行过程：

1. JS 是按照顺序从上往下依次执行的，可以先理解为这段代码时的执行环境就是主线程，也就是也就是当前执行栈；
2. 首先，执行 `console.log('我是同步任务 1')` ；
3. 接着，执行到 setTimeout 时，会移交给定时器线程，通知定时器线程 1s 后将 setTimeoutCallBack 这个回调交给事件触发线程处理，在 1s 后事件触发线程会收到 setTimeoutCallBack 这个回调并把它加入到事件触发线程所管理的事件队列中等待执行；
4. 接着，执行 http 请求，会移交给异步 http 请求线程发送网络请求，请求成功后将 httpCallback 这个回调交由事件触发线程处理，事件触发线程收到 httpCallback 这个回调后把它加入到事件触发线程所管理的事件队列中等待执行；
5. 再接着执行 `console.log('我是同步任务 2')` ；
6. 至此主线程执行栈中执行完毕，JS 引擎线程已经空闲，开始向事件触发线程发起询问，询问事件触发线程的事件队列中是否有需要执行的回调函数，如果有将事件队列中的回调事件加入执行栈中，开始执行回调，如果事件队列中没有回调，JS 引擎线程会一直发起询问，直到有为止；

可以发现：

1. 定时触发线程只管理定时器且只关注定时不关心结果，定时结束就把回调扔给事件触发线程；
2. 异步 http 请求线程只管理 http 请求同样不关心结果，请求结束把回调扔给事件触发线程；
3. 事件触发线程只关心异步回调入事件队列；
4. JS 引擎线程只会执行执行栈中的事件，执行栈中的代码执行完毕，就会读取事件队列中的事件并添加到执行栈中继续执行；
5. 反复执行，就是我们所谓的事件循环(Event Loop)；

## 宏任务与微任务

### 宏任务

在 ECMAScript 中， macrotask 也被称为 task。我们可以将每次执行栈执行的代码当做是一个宏任务(包括每次从事件队列中获取一个事件回调并放到执行栈中执行)， 每一个宏任务会从头到尾执行完毕，不会执行其他。

由于 JS 引擎线程和 GUI 渲染线程是互斥的关系，浏览器为了能够使宏任务和 DOM 任务有序的进行，会在一个宏任务执行结果后，在下一个宏任务执行前，GUI 渲染线程开始工作，对页面进行渲染。

常见的宏任务

1. 主代码块；
2. setTimeout；
3. setInterval；
4. setImmediate - Node；
5. requestAnimationFrame - 浏览器

### 微任务

ES6 新引入了 Promise 标准，同时浏览器实现上多了一个 microtask 微任务概念，在 ECMAScript 中， microtask 也被称为 jobs。

我们已经知道宏任务结束后，会执行渲染，然后执行下一个宏任务， 而微任务可以理解成在当前宏任务执行后立即执行的任务。

当一个宏任务执行完，会在渲染前，将执行期间所产生的所有微任务都执行完。

常见的微任务：

1. process.nextTick - Node；
2. Promise.then；
3. catch；finally；
4. Object.observe；
5. MutationObserver；

## 完整的事件循环

通过上面的描述，事件循环各个部分的知识点已经全部说完了，接下来说一下主角 ---- 事件循环。先附上图一份，有不对的地方欢迎大佬指正。

<div align='center'>
  <img src="https://mooo-star.github.io/blog/event_loop.png">
</div>

接下来，用一段代码来解释一下

```js
console.log('开始执行');

function print() {
  console.log('同步函数执行 1');
}

print();

setTimeout(() => {
  console.log('setTimeout 执行');
}, 1000);

setInterval(() => {
  console.log('setInterval 执行');
}, 500);

fetch('https://www.baidu.com').then(() => {
  console.log('请求');
});

new Promise((resolve) => {
  setTimeout(() => {
    console.log('promise 中的 setTimeout');
  }, 300);

  console.log('promise 执行');
  resolve(123);
}).then((res) => {
  console.log('promise 输出');
});
```

执行结果

```
开始执行
同步函数执行 1
promise 执行
promise 输出
请求
promise 中的 setTimeout
setInterval 执行
setTimeout 执行
setInterval 执行 xN
```

来解释一下

首先从上到下执行代码，输出所有能执行的 `console` ，遇到 promise setInterval setTimeout request ，将他们交给对应的线程去监听。这时候各个线程的情况如下

- 定时器线程：setTimeout「1000s」、setInterval「500s」、setTimeout「300s」
- http 异步请求线程： fetch
- 微队列：Promise.resolve

这一遍下来，浏览器输出

```
开始执行
同步函数执行 1
promise 执行
```

接下来就是去循环询问有没有可以执行的，promise 最快，并且优先级最高，所以接下来先打印 `promise 输出` ,后面就是谁先准备好，打印谁。由于 `setInterval` 并没有清理函数，所以他会一直执行。

这就是一个简单的事件循环，简单的理解就是 JS 正常执行代码，遇到异步任务扔给对应的任务队列处理，遇到微任务扔给微任务队列处理，然后下次看谁先好了执行谁。不过微任务有优先权，只要他好了，他就优先于其他异步任务去执行。
