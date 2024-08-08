---
title: 浏览器渲染流程
desciption: 浏览器渲染流程
keywords:
  - 浏览器
  - 渲染流程
group:
  title: 浏览器
  order: 3
toc: content
---

# 浏览器渲染流程

本文主要包含以下内容：

- 浏览器渲染整体流程
- _DOM_ 树的形成
- _CSSOM_ 树的形成
- 生成渲染树
- 阻塞渲染
- 重绘和回流

  - 现代浏览器的优化机制
  - 减少回流和重绘的方式

## 浏览器渲染整体流程

整个页面可以看做是一幅画，这幅画是由浏览器绘制出来的，浏览器绘制这幅画的过程称之为渲染。

渲染是一件复杂的工作，它大致分为以下几个过程：

1. 解析 _HTML_，生成 _DOM_ 树，解析 _CSS_，生成样式规则树
2. 将 _DOM_ 树和样式规则树结合，生成渲染树（ _Render Tree_ ）
3. 根据生成的渲染树，确定元素的布局信息（元素的尺寸、位置），**这一步称之为 _reflow_，译作回流或重排**
4. 根据渲染树和布局信息，生成元素的像素信息（元素横纵的像素点，左上角的偏移量、每个像素的颜色等）。**这一步称之为 _repaint_，译作重绘**
5. 将像素信息提交到 _GPU_ 完成屏幕绘制

当元素的布局信息发生变化时，会导致回流。当元素的像素信息发生变化时，会导致重绘。回流一定会导致重绘，因为布局信息的变化一定会导致像素信息的变化。

在实际开发中，获取和设置元素尺寸、位置均会导致回流和重绘，而仅设置元素的外观（比如背景颜色）则只会导致重绘，不会导致回流。

回流是一项繁琐的工作，会降低效率，因此在开发中，应该尽量避免直接获取和设置元素的尺寸、位置，尽量使用变量来保存元素的布局信息。

下面，我们将具体来看一下浏览器在渲染页面时每一个步骤。

## _DOM_ 树的形成

当我们打开一个网页时，浏览器都会去请求对应的 _HTML_ 文件。虽然平时我们写代码时都会分为 _HTML、CSS、JS_ 文件，也就是字符串，但是计算机硬件是不理解这些字符串的，所以在网络中传输的内容其实都是 _0_ 和 _1_ 这些字节数据。

当浏览器接收到这些字节数据以后，它会将这些字节数据转换为字符串，也就是我们写的代码。

![](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-11-20-091349.png#alt=image-20211120171348433)

当数据转换为字符串以后，浏览器会先将这些字符串通过词法分析转换为标记（ _token_ ），这一过程在词法分析中叫做标记化（ _tokenization_ ）。

那么什么是标记呢？

这其实属于编译原理这一块的内容了。简单来说，标记还是字符串，是构成代码的最小单位。这一过程会将代码分拆成一块块，并给这些内容打上标记，便于理解这些最小单位的代码是什么意思。

![](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-11-20-091409.png#alt=image-20211120171408897)

当结束标记化后，这些标记会紧接着转换为 _DOM_ 节点，之后所有的 _DOM_ 节点会根据彼此之间的关系形成一颗 _DOM_ 节点树。

![](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-11-20-091428.png#alt=image-20211120171428854)

以上就是浏览器从网络中接收到 _HTML_ 文件然后一系列的转换过程。

![](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-11-20-091451.png#alt=image-20211120171451336)

## _CSSOM_ 树的形成

接下来是转换 _CSS_ 到 _CSSOM_ 树的过程。整体流程和上面类似：

![](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-11-20-091510.png#alt=image-20211120171510677)

在这一过程中，浏览器会确定每一个节点的样式到底是什么，并最终生成一颗样式规则树，这棵树上面记录了每一个 _DOM_ 节点的样式。

![](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-11-20-091530.png#alt=image-20211120171529844)

将 _CSS_ 从字节数据转换为 _CSSOM_ 这一过程其实是很消耗资源的。因为样式你可以自行设置给某个节点，也可以通过继承获得。在这一过程中，浏览器需要递归 _CSSOM_ 树，然后确定具体的元素到底是什么样式。

举个例子：

```html
<div>
  <a href="#">
    <span></span>
  </a>
</div>
```

```css
span {
  color: red;
}

div > a > span {
  color: red;
}
```

对于第一种设置样式的方式来说，浏览器只需要找到页面中所有的 _span_ 标签然后设置颜色。

但是对于第二种设置样式的方式来说，浏览器首先需要找到所有的 _span_ 标签，然后找到 _span_ 标签上的 _a_ 标签，最后再去找到 _div_ 标签，然后给符合这种条件的 _span_ 标签设置颜色，这样的递归过程就很复杂。

所以我们应该尽可能的避免写过于具体的 _CSS_ 选择器，然后对于 _HTML_ 来说也尽量少的添加无意义标签，保证层级扁平。

## 生成渲染树

当我们生成 _DOM_ 树和 _CSSOM_ 树以后，就需要将这两棵树组合为渲染树（ _Render Tree_ ）。

![](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-11-20-091551.png#alt=image-20211120171550663)

在这一过程中，不是简单的将两者合并就行了。渲染树只会包括需要显示的节点和这些节点的样式信息，如果某个节点是 _display: none_ 的，那么就不会在渲染树中显示。

当浏览器生成渲染树以后，就会根据渲染树来进行布局（也可以叫做回流），之后确定每一个像素点的信息（重绘），然后调用 _GPU_ 绘制，合成图层，显示在屏幕上。对于这一部分的内容因为过于底层，还涉及到了硬件相关知识，这里就不再继续展开内容了。

## 阻塞渲染

首先渲染的前提是已经生成了渲染树（ _Render Tree_ ）。而生成渲染树的前提是生成了 _DOM_ 树和 _CSSOM_ 样式规则树。

所以如果想要渲染的速度加快，我们就应该降低要渲染的文件的大小，并且 _HTML_ 节点的层级扁平化（没有无意义的标签），优化选择器。

当浏览器在解析到 _script_ 标签时，会暂停构建 _DOM_，原因很简单，因为 _JS_ 能够修改 _DOM_ 节点，所以浏览器会先执行 _JS_ 代码，当 _JS_ 代码执行完成后才会从暂停的地方重新开始。

也就是说，如果你想首屏渲染的越快，就越不应该在首屏就加载 _JS_ 文件，这也是都建议将 _script_ 标签放在 _body_ 标签底部的原因。

另外，在现代浏览器中，为我们提供了新的方式来避免 _JS_ 代码阻塞渲染的情况：

- _async_
- _defer_
- _prefetch_
- _preload_

关于这几种方式的区别，我们在另外一篇文章中再具体来看。

## 重绘和回流

重绘和回流会在我们设置节点样式时频繁出现，同时也会很大程度上影响性能。

- 重绘：当节点需要更改外观而不会影响布局的，比如改变 _color_ 就叫称为重绘
- 回流：布局或者几何属性需要改变就称为回流。

**回流必定会发生重绘，重绘不一定会引发回流。**因此回流所需的成本比重绘高得多，改变父节点里的子节点很可能会导致父节点的一系列回流。

当页面布局和几何信息发生变化的时候，就需要回流。比如以下情况：

- 添加或删除可见的 _DOM_ 元素

- 元素的位置发生变化

- 元素的尺寸发生变化（包括外边距、内边框、边框大小、高度和宽度等）

- 内容发生变化，比如文本变化或图片被另一个不同尺寸的图片所替代。

- 页面一开始渲染的时候（这肯定避免不了）

- 浏览器的窗口尺寸变化（因为回流是根据视口的大小来计算元素的位置和大小的）

### 现代浏览器的优化机制

现代的浏览器都是很聪明的，由于每次重排（回流）都会造成额外的计算消耗，因此大多数浏览器都会通过队列化修改并批量执行来优化重排过程。

浏览器会将修改操作放入到队列里，直到过了一段时间或者操作达到了一个阈值，才清空队列。

但是，当你获取布局信息的操作的时候，会强制队列刷新，比如当你访问以下属性或者使用以下方法：

- _offsetTop、offsetLeft、offsetWidth、offsetHeight_

- _scrollTop、scrollLeft、scrollWidth、scrollHeight_

- _clientTop、clientLeft、clientWidth、clientHeight_

- _getComputedStyle( )_

- _getBoundingClientRect_

更多会触发回流的属性和方法可以参阅：_[https://gist.github.com/paulirish/5d52fb081b3570c81e3a](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)_

### 减少回流和重绘的方式

接下来，让我们谈谈如何减少回流和重绘。

#### 1. 最小化重绘和回流

由于重绘和重排可能代价比较昂贵，因此最好就是可以减少它的发生次数。为了减少发生次数，我们可以合并多次对 _DOM_ 和样式的修改，然后一次处理掉。考虑这个例子：

```javascript
const el = document.getElementById('test');
el.style.padding = '5px';
el.style.borderLeft = '1px';
el.style.borderRight = '2px';
```

例子中，有三个样式属性被修改了，每一个都会影响元素的几何结构，引起回流。

当然，大部分现代浏览器都对其做了优化，因此，只会触发一次重排。但是如果在旧版的浏览器或者在上面代码执行的时候，有其他代码访问了布局信息(上文中的会触发回流的布局信息)，那么就会导致三次重排。

因此，我们可以合并所有的改变然后依次处理，比如我们可以采取以下的方式。

使用 _cssText_

```javascript
const el = document.getElementById('test');
el.style.cssText += 'border-left: 1px; border-right: 2px; padding: 5px;';
```

将要修改的 _CSS_ 样式写在一个样式类里面，然后通过添加和删除该样式类的方式来改变样式

```javascript
const el = document.getElementById('test');
el.className += ' active';
```

#### 2. 批量修改 _DOM_

当我们需要对 _DOM_ 对一系列修改的时候，可以通过以下步骤减少回流重绘次数：

1.  使元素脱离文档流

2.  对其进行多次修改

3.  将元素带回到文档中。

该过程的第一步和第三步可能会引起回流，但是经过第一步之后，对 _DOM_ 的所有修改都不会引起回流，因为它已经不在渲染树了。

有三种方式可以让 _DOM_ 脱离文档流：

- 隐藏元素，应用修改，重新显示

- 使用文档片段（ _document fragment_ ）在当前 _DOM_ 之外构建一个子树，再把它拷贝回文档。

- 将原始元素拷贝到一个脱离文档的节点中，修改节点后，再替换原始的元素。

考虑我们要执行一段批量插入节点的代码：

```javascript
function appendDataToElement(appendToElement, data) {
  let li;
  for (let i = 0; i < data.length; i++) {
    li = document.createElement('li');
    li.textContent = 'text';
    appendToElement.appendChild(li);
  }
}

const ul = document.getElementById('list');
appendDataToElement(ul, data);
```

如果我们直接这样执行的话，由于每次循环都会插入一个新的节点，会导致浏览器回流一次。

我们可以使用上面所提到的三种方式进行优化。

（1）隐藏元素，应用修改，重新显示

这个会在展示和隐藏节点的时候，产生两次重绘。

```javascript
function appendDataToElement(appendToElement, data) {
  let li;
  for (let i = 0; i < data.length; i++) {
    li = document.createElement('li');
    li.textContent = 'text';
    appendToElement.appendChild(li);
  }
}
const ul = document.getElementById('list');
ul.style.display = 'none';
appendDataToElement(ul, data);
ul.style.display = 'block';
```

（2）使用文档片段（ _document fragment_ ）在当前 _DOM_ 之外构建一个子树，再把它拷贝回文档

```javascript
const ul = document.getElementById('list');
const fragment = document.createDocumentFragment();
appendDataToElement(fragment, data);
ul.appendChild(fragment);
```

（3）将原始元素拷贝到一个脱离文档的节点中，修改节点后，再替换原始的元素。

```javascript
const ul = document.getElementById('list');
const clone = ul.cloneNode(true);
appendDataToElement(clone, data);
ul.parentNode.replaceChild(clone, ul);
```

#### 3. 避免触发同步布局事件

上文我们说过，当我们访问元素的一些属性的时候，会导致浏览器强制清空队列，进行强制同步布局。

举个例子，比如说我们想将一个 _p_ 标签数组的宽度赋值为一个元素的宽度，我们可能写出这样的代码：

```javascript
function initP() {
  for (let i = 0; i < paragraphs.length; i++) {
    paragraphs[i].style.width = box.offsetWidth + 'px';
  }
}
```

这段代码看上去是没有什么问题，可是其实会造成很大的性能问题。

在每次循环的时候，都读取了 _box_ 的一个 _offsetWidth_ 属性值，然后利用它来更新 _p_ 标签的 _width_ 属性。

这就导致了每一次循环的时候，浏览器都必须先使上一次循环中的样式更新操作生效，才能响应本次循环的样式读取操作。每一次循环都会强制浏览器刷新队列，一刷新队列就会引发回流和重绘。

我们可以优化为：

```javascript
const width = box.offsetWidth;
function initP() {
  for (let i = 0; i < paragraphs.length; i++) {
    paragraphs[i].style.width = width + 'px';
  }
}
```

#### 4. 复杂动画脱离文档流

对于复杂动画效果，由于会经常的引起回流重绘，因此，我们可以使用绝对定位，让它脱离文档流。否则会引起父元素以及后续元素频繁的回流。

#### 5. _CSS3_ 硬件加速（ _GPU_ 加速 ）

比起考虑如何减少回流重绘，我们更期望的是，根本不要回流重绘。

使用 _CSS3_ 硬件加速，可以让 _transform、opacity、filters_ 这些动画不会引起回流重绘。但是对于动画的其它属性，比如 _background-color_ 这些，还是会引起回流重绘的，不过它还是可以提升这些动画的性能。

常见的触发硬件加速的 _CSS_ 属性：

- _transform_

- _opacity_

- _filters_

- _Will-change_
