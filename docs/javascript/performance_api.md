---
title: Performance API
desciption: Performance API
keywords:
  - performance
group:
  title: JavaScript
toc: content
---

# 引言

最近在看前端监控，监控页面性能指标离不开我们的 Performance API。浏览器也有 Performance 面板哈，这个工具的使用可以看看大佬们写的这篇[文章](https://juejin.cn/post/7149093181244571678)

本文主要包含以下内容：

- 实例属性
- 实例方法
- 性能记录
  - FCP
  - ...

# Performance API 简介

Performance API 是 Web API 的一部分,它提供了一系列方法和属性,用于获取当前页面的性能相关信息。

## 实例属性

:::info{title=Tip}
在 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance) 中已经明确指出 `navigation`、`timing`、`memory` 三个实例属性已经废弃，所以在这里就不介绍了。当然，在浏览器中可能还能用，这个具体看浏览器厂商吧。
:::

- timeOrigin: 返回一个表示 the performance measurement 开始时间的高精度 timestamp（PS：MDN 上还是把它标为实验性属性，但是 [caniuse](https://caniuse.com/?search=Performance.timeOrigin) 上已经有 94%+ 的支持了）

## 实例方法

我们先来给它们划分一下组，简单的了解一下，混个眼熟。

- mark():创建一个命名 PerformanceMark 对象，代表浏览器性能时间轴中的高分辨率时间戳标记
  - name: 表示标记名称的字符串。不得与已弃用接口的某个属性同名。
  - markoptions[可选]: 用于指定标记的时间戳和附加元数据的对象
    - detail[可选]: 标记中包含的任意元数据。默认为 null
    - startTime[可选]: DOMHighResTimeStamp 用作标记时间。默认为 performance.now()
- clearMarks(): 该方法从浏览器的性能时间线中 clearMarks()删除所有或特定的对象
  - name[可选]: name 表示对象的 的字符串 PerformanceMark。如果省略此参数，则将删除所有带有 entryType“ ”的条目。
