---
title: bailout和ContextAPI
desciption: bailout和ContextAPI
keywords:
  - React
  - bailout
  - context
toc: content
---

# bailout 和 ContextAPI

ContextAPI 经历过一次重构，重构的原因和 bailout 策略相关。

在旧版的 ContextAPI 中，数据是保存在栈里面的。

在 beginWork 中，context 会不断的入栈（context 栈），这意味着 context consumer 可以通过这个 context 栈来找到对应的 context 数据。在 completeWork 中，context 会不断的出栈。

这种入栈出栈的模式，刚好对应了 reconcile 的流程以及一般的 bailout 策略。

那么旧版的 ContextAPI 存在什么缺陷呢？

但是针对“跳过整颗子树的 beginWork”这种程度的 bailout 策略，被跳过的子树就不会再经历 context 入栈出栈的过程，因此如果使用旧的 ContextAPI ，即使此时 context 里面的数据发生了变化，但是因为子树命中了 bailout 策略被整颗跳过了，所以子树中的 context consumer 就不会响应更新。

例如，有如下的代码：

```jsx | pure
import { useState, useContext, createContext } from 'react';

// 创建了一个 context 上下文
const MyContext = React.createContext(0);

const { Provider } = MyContext;

function NumProvider({ children }) {
  // 在 NumProvider 中维护了一个数据
  const [num, add] = useState(0);

  return (
    // 将 num 数据放入到了上下文中
    <Provider value={num}>
      <button onClick={() => add(num + 1)}>add</button>
      {children}
    </Provider>
  );
}

class Middle extends React.Component {
  shouldComponentUpdate() {
    // 直接返回 false，意味着会命中 bailout 策略
    return false;
  }

  render() {
    return <Child />;
  }
}

function Child() {
  // 从 context 上下文中获取数据，然后渲染
  const num = useContext(MyContext);
  // 也就是说，最终 Child 组件所渲染的数据不是自身组件，而是来自于上下文
  // 其中它的父组件会命中 bailout 策略
  return <p>{num}</p>;
}

// 父组件
function App() {
  return (
    <NumProvider>
      <Middle />
    </NumProvider>
  );
}

export default App;
```

在上面的示例中，App 是挂载的组件，NumProvider 是 context Provider（上下文的提供者），Child 是 context Consumer（上下文的消费者）。在 App 和 Child 之间有一个 Middle，我们在 Middle 组件直接使用了性能优化 API，设置 shouldComponentUpdate 为 false，使其直接命中 bailout 策略。

当点击 button 之后，num 会增加，但是如果是在旧版的 ContextAPI 中，这段代码是会存在缺陷的，在旧版 ContextAPI 中，子树的 beginWork 都会被跳过，这意味着 Child 组件的 beginWork 也会被跳过，表现出来的现象就是点击 button 后 num 不变。

那么新版的 ContextAPI 是如何修复的呢？

当 beginWork 进行到 context privider 的时候，会有如下的处理逻辑：

```javascript
if (objectIs(oldValue, newValue)) {
  // context value 未发生变化
  if (oldProps.children === newProps.children && !hasContextChanged()) {
    // 命中 bailout 策略
    return bailoutOnAlreadyFinnishedWork(current, workInProgress, renderLanes);
  }
} else {
  // context value 变化，向下寻找 Consumer，标记更新
  propageteContextChange(workInProgress, context, renderLanes);
}
```

在上面的代码中，首先会判断 context value 是否有变化，当 context value 发生变化时，beginWork 会从 Provider 立刻向下开启一次深度优先遍历，目的就是为了寻找 context consumer，如果一旦找到 context consumer，就对为对应的 FiberNode.lanes 上面附加一个 renderLanes，对应的相关逻辑如下：

```javascript
// Context Consumer lanes 附加上 renderLanes
fiber.lanes = mergeLanes(fiber.lanes, renderLanes);
const alternate = fiber.alternate;

if (alternate !== null) {
  alternate.lanes = mergeLanes(alternate.lanes, renderLanes);
}
// 从 Context Consumer 向上遍历
scheduleWorkOnParentPath(fiber.return, renderLanes);
```

上面的 scheduleWorkOnParentPath 方法的作用是从 context consumer 向上遍历，依次为祖先的 FiberNode.childLanes 附加 renderLanes。

因此，我们来总结一下，当 context value 发生变化的时候，beginWork 从 Provider 开始向下遍历，找到 context consumer 之后为当前的 FiberNode 标记一个 renderLanes，再从 context consumer 向上遍历，为祖先的 FiberNode.childLanes 标记一个 renderLanes。

注意无论是向下遍历寻找 context consumer 还是从 context consumer 向上遍历修改 childLanes，这个都发生在 Provider 的 beginWork 中。

因此，上述的流程完成后，虽然 Provider 命中了 bailout 策略，但是由于流程中 childLanes 已经被修改了，因此就不会命中“跳过整颗子树的 beginWork”的逻辑，相关代码如下：

```javascript
function bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes) {
  //...

  // 不会命中该逻辑
  if (!includesSomeLane(renderLanes, workInProgress.childLanes)) {
    // 整颗子树都命中 bailout 策略
    return null;
  }

  //...
}
```

通过上面的代码我们可以看出，“如果子树深处存在 context consumer”，即使子树的根 FiberNode 命中了 bailout 策略，由于存在 childLanes 的标记，因此不会完全跳过子树的 beginWork 过程，所以新版的 ContextAPI 能实现更新，解决了旧版 ContextAPI 无法更新的问题。
