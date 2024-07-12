---
title: 面试
toc: content
---

#### 资深目标

1、React 组件化、系统化、数据化建设

2、熟悉 nodejs

3、有一定组织管理、推动能力，最好担任过小组长角色。

###

### 曹世阳

时间：0424

基础掌握的一般，工作经验少，手写代码差，不建议录用。

1、基本信息

- 已离职，从事企业效能项目，认为是边缘项目
- 找一个有挑战的项目

2、react setState 是同步还是异步

3、自定义 hooks 封装

- 命名
- 编写、返回值

4、class 的 super、static 区别

5、nodejs

- webpack 的异步加载支持
- 全局变量有什么

6、手写

- 防抖

- 实现一个模板字符串

## 0419

### 王升升

前端基础不扎实，出现一些概念性的错误，

语言表达能力不好，发展潜力一般，

编码能力不好

不建议录取

1、基本信息

在职，非计算机专业，其他专业前端专业，工作 7 年

2、自己成长最快的项目

外包华为的经历 & 京东的经历

- 接口返回大量数据比较多
  - 虚拟列表实现
- 技术架构迁移
  - webpack 到 vite
    - 插件怎么处理的
    - rollup
  - 量化
  - 及万行代码设计
  - vue2 升级 vue3
    - 耗时 3d

3、管理经验

带过 4 个人

4、浏览器的 event loop vs 浏览器的 event loop

5、JS 执行上下文

6、手写：

- 节流函数
- 并发请求限制

## 0418

### 孔祥栋

项目总结能力不足，经验不足

1、基本信息

在职

2、项目

白屏监测

- MutationObserver
- 白屏率

换肤系统

- 功能：文案、图像
- 禁用跳转：代理 window 环境
- 代理 XML

3、react

- createContext 作用
- setState 同步还是异步
- re-render 过程

4、手写

- Promise.myAll
- 翻转链表

## 0415

### 周文静

- 思路清晰
- 技术深度不够

1、基本信息

- 滴滴外卖 2 月底离职
- Vue2 技术栈

2、复杂业务的经历与收获

- 大文件上传
  - 文件分片
  - 断点续传
  - 权鉴设计
  - 防盗链设计

3、JS 基本数据类型与引用数据类型区别

- 堆内存 栈内存区别

4、Javascript 的执行上下文环境

- 函数提升
- 变量提升

5、vue

- vue3 性能提升上做的优化
  - diff 效率高
- Vue2 的 diff
  - 同层比较
  - 子节点比较
    - 4 种节点

6、node

7、promise.all

洗牌算法

发布订阅

```

```

请求并发限制

## 0412

### 倪志强

对 qiankun 微前端框架有研究，

1、基本需求

- 工作 2 年
- 业务稳定

2、qiankun

- 缺点：eval 语句
- vite 插件开发支持 qianjun 接入

3、CI/CD 构建优化

4、团队贡献

- 推动规范落地

5、组件库开发

6、webpack

- 优化
- loader 与 plugin 区别

7、vue3

- 对比 vue2 做的性能优化
- effectScope

8、TS

9、手写

- 翻转二叉树
- 发布订阅者

```js
const reversTree = (node) => {
  if(!node) return null
  const right = reversTree(tree.right)
 	const  left = reversTree(tree.left)
  node.left = right
  node.right = left
}


class Event {
  constrctor() {
    this._event = {}
  }
  on(eventName, cb){
    const callbacks = this._event[eventName] || []
    callbacks.push(cb)
    this._event[eventName] = callbacks
  }
  emit(eventName, ...args) {
    const callbacks = this._event[eventName] || []
    callbacks.forEach(cb => cb(..args))
  }
  off(eventName,cb) {
     const callbacks = this._event[eventName] || []
    callbacks =  callbacks.filter(callback => callback !=cb)
    this._event[eventName] = callbacks
  }
  once(eventName, cb) {
    const one = (...args) => {
      cb(...args)
      this.off(eventName, one)
    }
    this.on(eventName,one)
  }
}

```

## 0408

### 刘石磊

1、基本信息

在职，

2、组件库

20 多个，单包，father

3、微前端的优缺点

4、监控 SDK

5、react

- 全局错误捕获
- useMemo 应用场景

6、手写

- 节流函数

- 深拷贝

  ```js
  const deepClone = (data) => {
    let newData = {};
    const dataKeys = Object.keys(data);

    dataKyes.forEach((value) => {
      const currentDataValue = data[value];
      if (typeof currentDataValue !== 'object' || currentDataValue === null) {
        newData[value] = currentDataValue;
      } else if (Array.isArray(currentDataValue)) {
        newData[value] = [...currentDataValue];
      } else if (currentDataValue instanceof Set) {
        newData[value] = new Set([...currentDataValue]);
      } else if (currentDataValue instanceof Map) {
        newData[value] = new Map([...currentDataValue]);
      } else {
        newData[value] = deepClone(currentDataValue);
      }
    });
  };
  ```

  ```js
  class Event {
    construtor() {
      this._event = {};
    }

    on(eventName, callback) {
      const callbacks = this._event[eventName] || [];
      callbacks.push(callback);
      this._event[eventName] = callbacks;
    }

    emit(eventName, ...args) {}
  }
  ```

```js
function throttle(fn, wait) {
  let time = 0;
  const that = this;
  return function (...args) {
    let now = Date.now();
    if (now - time > wait) {
      fn.apply(this, ...args);
    }
  };
}
```

## 0402

### 仝航 通过

1、基本信息

- 15 年毕业
- 在职，期望
- 职位期望：期望管理

2、技术管理

- 什么是
- 应该怎么做
- 挑战是什么
  - 流程上约束
  - 规划上
  - 业务导向

3、自己最大的收获是什么

- 从一线到管理

4、日志 SDK，业务埋点 + APM 埋点

开发周期：发开 1 个月、校验 2 个月

- 从单包到单包
- 主动采集
- 业务公共
- 日志上报方式

3、点播 SDK、直播播放器，基于内核做的，做的是上层业务。

- 播放协议：HLS、FLV
  - H256、H264 区别
- 提高起播速度提升
  - CDN 播放器获取
  - 防盗链前端
- node server
  - qps 2k
  - 单机 qps
  - 发布平台运维

4、编辑器

- 扩展插件

5、low code

6、nodejs

- 全局变量有哪些

7、BFF

- 稳定性建设
- 排障

新生代、老生代、热函数

8、手写

- 发布订阅

- 翻转二叉树

## 0331

#### 谢圳钿

1、基本信息

- 目前在职
- 想找一个能继续进步的工作，感觉个人比较迷茫

2、react

- useMemo
- useCallback 应用场景

3、vue2 数组重载缺点

4、在 vue 中 data 为什么是函数

5、vue3 性能优化

6、Typescript

Pick、Omit

7、新的容器部署方式

- 配置 CI
- docker image 部署
- 缺点是什么？
  - 环境少
  - 缓存：
- 几天？ 1 个月
- 难点是什么？
- docker 常用命令
- linux 命令
- Nginx

7、nodejs 了解

8、

## 0329

### 冷东霖 待定

1、基本信息

- 阿里三年，C 端经验比较多
- P7

2、canvas 性能瓶颈与优化

- 事件系统
- 动画系统
- 粒子动画

3、react 性能优化

- 切片

4、业务场景组件拆分原则

5、公司发现的问题，推动解决，自己收获

6、nodejs

- 模块化
- ES Module
- 事件循环机制

6、手写

- 圆形重叠算法
- 并发请求

## 0329

### 代惟 通过

业务开发不错

1、基本信息

- 目前已离职

2、APM 监控整体架构

采集：

- 性能
- 异常
- 上报缓存

指标

数据分析：后端开发

缺点：报警的开发

3、node

- 非阻塞 IO 的实现
- 事件循环
- 模块化
- eggjs

4、vite 插件扩展

5、webpack 的 loader plugin

6、node 服务的监控

7、TS

- 断言
- returntype
- Interface type 区别
- partial

8、vue

- vue2 的数组劫持
- Vue3 的性能优化

9、手写

- deepClone

10、你想找个什么样的工作

## 0328

### 姜振祥 淘汰

1、基本信息

- 15 年毕业，之前做硬件，17 年转前端，5 年前端经验
- 不是很着急找工作，尝试找新的机会提升
  - 做些技术项目

2、组件库、脚手架

- 基于 vant 组件库封装
  - 私有源
  - 10 - 20 组件，开发 1 个月，7-8 个人参与
    - 构建发布
    - 组件开发，团队业务认领
- vue 脚手架

3、sentry 监控

4、美团优选的技术沉淀

- 性能优化，webpack 优化
- 接入 SSR

5、nodejs

- 非阻塞 IO 实现

6、react Fiber 架构

7、手写

- deepClone

## 0323

### 杨鹏浩 待定

1、求职原因

- 技术提升，希望做 B 端和服务系统

2、react

Threejs 动画?做过什么

粒子动画、帧动画、3d 动画技术选型要思考的点。

- 帧率
- 内存
- 还有什么？

3、nodejs

了解，经验不多。

- 事件循环
- 创建子进程方法
- IPC 通信策略

4、工程化架构经验

架构经验不足，技术选型经验不足。

- severless 不了解
- 微前端
  - 样式隔离、子应用管理、sigle vs qiankun vs msf
- 智能化
  - tensflow：前端优势和劣势
    - 离线识别 vs 在线识别 优缺点

5、技术项目

有技术项目经验，适当加分。

大树系统

解决的问题：pc 嵌入 h5，大屏展示，

自动生成界面、接口、数据、模拟容器、闭环数据

技术点：

- glbal、ast、线上日志、数据脱敏、hybrid 容器 scheme、模拟 bridge

遇到的问题：

推广：

## 0307

王清

1、基本信息

- 百度 1 年
- 作业帮 2 年

2、试题清洗服务

- koa 洋葱模型
- node 事件循环
- nextTick
- go 语言特性

3、vue children 的 diff 算法

4、vue3 性能优化

手写：

- 发布订阅者
- 并发请求限制

## 0302

杨艺韬

1、基本信息

- 12-17：安卓开发
- 18-20： 研究生、自己尝试创业
- 好未来
  - 一对一 增长 性能优化
  - 直播课堂 rtc-sdk
  - 组件库

2、好未来组件库

做了 2 个多月，组件沉淀不多，story book 有开发经验

3、vue3

- reactive 实现
- provide/inject 实现

4、TS

- omit
- returntype

5、前端技术指标的的制定

- 稳定性：接口成功率
- 加载耗时：白屏耗时、加载耗时
- 过程指标：bug 率、CR

6、nodeJs

了解

7、手写题目

- 节流函数
- 模板字符串
- 翻转链表

## 0228

魏甜

有 react 开发经验，手写题目待加强。

1、基本信息

- 17 年毕业
- 在职

2、D + SASS

- node 中间层
  - 基础架构开发的 node 框架：登录、路由转发、文件上传
  - 遇到的问题：调试 mysql
- axios 封装
  - 优点：避免重复造轮子
  - 缺点：推广不好
- react

  - useMemo

- 打包优化
  - 慢的原因：平台慢、体积大
  - 打包优化：
    - 平台优化：缓存
    - 拆包

3、文件上传系统

4、TS

5、js 事件循环机制

6、mysql 基本操作

7、webpack plugin loader 区别

8、手写：

- 爬楼梯
- 翻转二叉树

## 0223

黄惠民

1、工作不足 1 年，上家公司离职原因是由于家里有事情。

2、基本数据类型和引用数据类型

3、内存回收机制

4、进程和线程的区别

5、React

- useMemo 应用场景
- useRef
- 自定义 hooks

6、vue

- 数组改变视图
- 对象新增属性视图改变
- computed 和 watch 区别

7、nodejs

8、手写：

- 节流函数
- apply
- 翻转链表
- 模板字符串

## 0218

李同得

前端基础扎实，技术栈和我们匹配，掌握 TS 、React 良好，可快速上手业务。

1、基本信息

- 转转 裁员 已离职

2、git 常用命令

3、前端

- 白屏分析
- 性能指标

4、react

- 高阶函数
- context
- hooks 常用方法
- firber 架构

6、数据开发

7、TS

- 断言
- 联合类型 交叉类型
- omit partial

8、nodejs

​

## 0217

于鹏

前端基础扎实，有低代码开发经验，TS 待加强。

1、基本信息

好未来：2.2，11 月份离职，目前有两家 offer。

2、TS 一般

3、node 了解

4、vue3 性能优化

5、vue 的 data 为什么是函数

6、快排、爬楼梯、节流

王岩涛

1、基本信息

- 工作经历

网易、爱奇艺、快手

- 离职原因：
  - 快手职级：k3b

2、快手工作

- 灰度方案

  - 逐步放量

- 埋点
  - 页面埋点
  - 错误统计

3、错误类型

4、页面崩溃

- 栈溢出

5、node 一般

6、sql 一般

7、TS 一般

8、react 使用类组件、函数式组件较少

在前端性能优化有探索，前端的一些基础知识待加强, node 待加强

## 0216

丁凡：

整体上技术不错，iOS 开发转前端开发，在跨端和 nodejs 上有一定研究和尝试，

写业务的意愿不太强，后续主要关注下待遇问题和求职动机。

1、目前在杭州，跳槽是因为待遇问题，12 年接触软件开发，14-15 年 iOS 开发，16 转前端开发。

2、跨平台方案的痛点

- 白屏、卡顿

3、DOP 概念

4、RN 性能监控

5、react 的性能优化

6、react 的架构：statck、Fiber 架构

7、算法：数据双向绑定、洗牌算法

8、求职意向

想找一个有发展空间的岗位，偏技术，也可以带两三个人。

## 0215

白亚兵

1、跳槽原因

- 距离比较远
- 个人发展，美团四年

2、美团业务内容

- 数据治理 3 个人
  - 指标体系，用了美团内部的
    - 质量：js 错误率、FP、操作成功率
    - 系统：
  - 埋点 SDK ，用了美团内部的
  - 性能优化
    - 大资源放 CDN
    - 前置请求接口
    - 代码层面
- 数据安全 3 个人
- 业务组件库开发，2 个月
  - 前端开发

3、爬楼梯、防抖、发布订阅

大数据业务经验丰富,业务能力扎实，了解前端性能优化与指标建设，编码习惯良好

李宇恒

1、react vs vue 区别

2、react 做过哪些优化

- memo
- usecallback

3、setState 是同步还是异步

4、react 的 hooks 实现

5、vue 的 diff 算法

6、provide / inject

7、前端性能指标

白屏、FMP、FP

8、SSR 服务端缓存

9、日志监控与告警

10、node 全局变量

11、buffer

12、stream

13、node 的主要模块

了解 React 与 Vue，了解前端性能监控，有 SSR 开发经验

对一些基本的原理的掌握待加强。

## 1230

田丹丹

1、在职，工作 6 年，小米职级 15

- 小米主要工作是大数据的可视化工作
- 国科环宇空间也是数据可视化工作

2、canvas svg 区别

3、canvas 优化 不了解

4、vue 中 v-if 在 react 中如何实现

5、vue 与 react 开发中的代码优化

6、vue diff 与 react diff 区别

7、是否有管理经验，带过 2 个实习生

8、webpack 了解一般，vite 不了解

9、node 一般

10、手写

- 翻转链表
- 防抖 节流

数据可视化经验多，中后台项目开发经验丰富，适合大数据方向业务开发。

### 1228

相国强

1、工作两年，目前在职

项目：

网页版微信

- 优化
  - 虚拟列表

2、sentry 性能监控

- 自己部门项目使用

3、ts 一般

4、node 了解

5、react 一般

6、vue 比较熟悉

- 数组数据劫持
- Vue3 比 vue2 优化点

7、手写题

- 两个正方形或者圆形是否有交集
- 节流函数

熟悉自己项目，反应比较快，比较聪明，有一定潜力。

### 1224

孙涛

1、工作经验

一年工作经验，外包快手，本科 非计算机专业

2、项目经历

积木可视化搭建

两个开发，参与开发，非核心开发。

- 保存数据格式 了解
- 开发周期：2 - 3 年

VSCode 插件开发

- 开发周期：3-4 个月
- webview 的使用

3、性能优化 一般

4、http 缓存策略 熟悉

5、跨域解决方案 了解

- ajax hook

5、Map 和 Object 区别 了解

6、TS 一般

7、vue 的数据双向绑定

8、webpack 的 plugin 与 loader 区别

9、手写：

节流函数

深度优先遍历

整体：一年工作经验，前端基础扎实，学习能力好，工作踏实，适合业务开发

柳晓博

1、工作学习经历

- 百度知道 离职原因：裁员
- 大学双学位：计算机科学与技术、财务管理

2、项目经历

- 有数据大屏展示、H5、PC 网站开发

3、Object 描述符

4、webpack

- loader plugin 区别
- 按需加载
- tree shake

5、es6 的 了解

- Map 与 Object 区别

6、浅拷贝、深拷贝

7、TS

- 断言
- 泛型
- 泛型工具

8、react 不熟悉

useMemo、useCallback

9、echarts 的配置项

10、node

- 全局变量
- 环境变量
- 子进程

11、http2 和 http1.1 区别 了解

优点：

一年工作经验，计算机基础扎实，前端知识良好，有 echarts 的使用经验

缺点：

待加强 react 框架学习，TS 的学习。

适合业务开发。

### 1222

姚翰林

1、工作经历

5 年开发经验，专升本

离职原因：公司搬家，无年终奖，已提离职，下周离职

目前带 6 - 8 人

- 制定前端规范
  - 目录规范
  - eslint 强制统一
- 组件库维护
  - 组件数量

2、前端埋点

了解简单的业务埋点

- 手写
  - 指令埋点
    - 存储文件
- ## 第三方库

3、前端质量监测

一般了解

- 监控
  - 报错： runtime api
  - 性能：

4、webpack

- loader 和 plugin 区别
- 依赖收集
- tree shake

5、熟悉数据可视化 有开发工作经验

6、TS：一般

7、node

- 环境变量设置
- 全局变量
- 子进程

8、算法手写

- 斐波那契数列求和
- 深度优先遍历
- 防抖
- 发布订阅

优点：工作经验多，对前端规范、组件化开发有一定的探索

缺点：算法手写题差，ts 和 react 框架待加强

兰佳硕

1、工作经历

工作四年，专升本。

- 天眼查
  - 工程化探索
    - 懒加载
    - 预加载
  - 组件封装
    - 侧边、返回顶部
    - npm 私服
    - 两个月前
  - 线上部署
    - 脚本
      - 日志清理
- 自如

2、eggjs

- 启动过程 不了解
- IPC 通信 不了解

3、node

- 全部变量
- 环境变量设置

4、进程和线程区别

5、react 的 fiber 特性

6、react 的 hooks 理解

7、useCallback、useMemo、useRef 的应用场景

思路不清晰，对自己负责的项目不能完整的进行表达，对自己负责的项目技术研究不充分，不建议录用。

史阳阳

工作经验丰富，有教多的低代码平台开发经验，数据平台建设的低代码开发经验，有 RN 经验，有项目的工程优化与性能优化经验，语言沟通好，待加强 TS 的学习。

1、工作经历

- 17 年开始做前端，4 年前端工作经验
- 装修行业，策划 2 年：13-15
  - 营销活动
  - 市场活动
- 16-17：开店
- 培训：4 个月
- 教育与技术专业 本科
- 离职原因：
  - 组织调整
  - 希望能有更多工作经历，拓展自己的职业生涯

2、项目经历

低代码平台：

- 数据格式：json
- 工具栏、快捷键、
- 前端 7 人\* 4 个月 后端 4 个人
- 优化：
  - webpack 优化
    - 打包：loader 配置 exclude
    - 降低包大小：tree shake
  - nginx 强缓存
  - json 优化
    - 静态打包
  - chrome 工具
    - lighthouse
    - coverage

react-native：了解

组件库：参与

3、迭代器

4、Map Set 了解

5、for of 与 for in

6、Promise 异常捕获 不了解

7、全局错误捕获

8、对象描述符

9、webpack 的实现

- 异步加载 不了解
- 依赖收集 不了解
- 打包过程 了解
- tree shake 原理

7、后端

- node
  - 全局变量
  - 环境变量
  - 启动子进程 不熟悉
- mysql 数据库

8、react

- hooks 了解
- 声明周期 熟悉
- firber 特性

9、做过项目负责人，有带 3 人左右经验

杨凯峰

1、学历：本科，专业：化工

2、项目经历：

1）中后台项目 熟悉

- 路由权限设计

2）Hybrid 项目：

性能优化：了解

- 骨架屏
- 懒加载
- 按需加载
- 网络层面
  - gzip
  - cdn

3、前端模块化的理解 了解

4、熟悉 vue

- 数据双向绑定
- watcher 的理解

5、手写题 一般

- 爬楼梯
- 翻转链表
- 模板引擎
- 二维数组合并为一维数组

工作经验 1 年，基础掌握良好，语言表达好，适合业务开发。

王旭敏

1、工作经历

.net 转前端

叮当快药

- 被公司优化

天眼查

- 离职原因：职位不匹配
- B 端界面展示

优酷

- 离职原因：外包岗，

- 端内 H5
  - 白屏问题，不了解
  - DNS 解析，一般
  - CDN 内容分发，了解
  - SSR 了解
- 全站换肤

  - 开发 webpack loader 熟悉

- node 一体化
  - egg 启动过程 熟悉

对公司的意愿强。

2、react hooks 熟悉

3、TS 不了解

工作 6 年左右，熟悉掌握 react 框架，有 eggjs 的项目经验

待加强，编码能力和项目总结。

### 1221

韩慧鹏

1、工作经历

好未来：已离职

- taro

  - 多端：
  - 语音实时录制
    - 采样率 位数

- AI 识别能力
- 图片识别

2、Map 和 object 的区别 了解

3、Set 了解

4、canvas 优化方式 一般

5、vue 的数组劫持

6、TS

适合业务开发。

优点：

有 node 相关开发经验，有 web 音频处理经验，编码习惯良好，为人踏实

缺点：

经验比较少，语言表达一般，和我们技术不太匹配。

2、

### 1220

刘士通

1、离职原因：

- 没有新项目
- 来北京发展
- 工作 3 年，专业是 计算机专业

2、项目

CMS

- 项目搭建
  - umi 搭建
    - 请求：request 与 response 拦截
    - eslint 配置
- 上传
  - 断点上传
  - File API
- 按需加载
- canvas

echarts 图表，有项目经验

腾讯地图有用过，了解

3、XMLHttpRequest 的请求 不了解

4、手写题目

- react 支持数据双向绑定
- 菲波那切数列

xxx

1、出来原因

- 刚去滴滴不到三个月，两个前端，初创团队，和之前描述不符合。
- 希望正规的前端团队

2、在 58 经历：

- 车主服务
  - C 端系统
  - H5 页面：微信内嵌、58 app 内嵌

3、3 - 10 月去一个朋友创业公司

4、个人成长：

- 基建、脚手架

5、数据可视化

- canvas 优化 了解一般

- svg 了解一般

6、前端性能优化 一般

- 白屏优化：缓存、异步路由

7、node 了解一般

8、TS

- 断言
- 内置类型

整体看，虽然工作了 5 年，但是只有三年的工作经验，潜力比较小，思路不清晰

### 1214

傅晓杰

1、已离职状态

2、主要工作

直播课堂开发

- 课堂稳定性：
  - 稳定日志打点上报

中后台开发

3、TS 的内置类型 不了解

4、TS 了解一般

5、react 了解一般

整体技术一般，编码能力差，不通过

### 1213

智敏

1、研究生学历，工作两年多

2、工作内容

- 低代码

  管理应用、布局、项目创建、创建页面（菜单渲染）、画布区

  ast、渲染，了解 amis

  - ast 数据， 熟悉
  - 组件库支持 了解
  - 自定义组件：支持 vue
  - 运维部署 了解一般

- 中台中后台项目 & 中后台框架沉淀 熟悉
  - 技术方案 熟悉
- 日志可视化展示平台

3、node 了解一般

4、position 定位，熟悉

5、前端跨域一般解决方案，了解

6、浏览器渲染机制，熟悉

7、手写：防抖、new 操作符、发布订阅者

整体：熟悉自己负责的业务，技术体系化一般，整体技术待加强。

### 20211210

靳国强

1、工作 4 年

好未来职级：2.1、腾讯 T8

2、cocos 经历：

- 优化方式 熟悉
  - cpu：降低计算次数
  - 内存：降低低端机的加载资源
  - dracall
- canvas 熟悉
  - 流畅度
  - 离屏渲染
  - 内存管理
- webGL

3、hybrid JS-bridge 原理

4、小程序的原理 一般

5、vue 父子组件传参

6、TS 内置类型 了解

7、手写题：

- 发布订阅者
- 防抖
- instanceof

### 20211209

唐博

1、工作主要内容

- 网校：课件编辑器

- 游戏动画技术指标和瓶颈点

  - 核心指标 了解
    - 打开速度
    - 打开率
  - 端内预加载策略 了解
  - 瓶颈点 不了解

- 高途：课件数据分析监控
  - node 服务 一般
    - nestjs
    - mysql
- 爱奇艺：
  - react ssr 小程序 掌握

2、ES6 解决的问题及带来的问题

3、影响 react 和 vue 的响应速度

4、vue diff 算法 childNode diff

5、手写

- new 操作符
- instanceof
- 防抖
- 翻转二叉树

整体：思路清晰，语言表达良好，技术深度待加强。

### 20211208

李琛

1、lottile 优化

- 预加载
  - 并发加载
- 离线包策略

2、node 掌握一般

3、es6 新增属性解决问题

- promise
- 箭头函数
- 结构

4、vue

- $set
- 公共父级
- data 是一个函数

5、手写题

- 并发请求处理函数
- new 操作符

优点：

1、态度好，编码习惯良好

缺点：

1、对自己负责的项目缺少深入研究

### 20211207

王凯东

1、对 FE 有技术热情，投身了前端行业

2、跳槽频繁

- 京东跳出来：技术瓶颈，晋升，工作内容
- 猿辅导
  - 交互设计文档，业务组件
  - Swager 接口生成服务
  - 业务组件：tabel 组件

3、自我规划

- 组件库
- 自动化、脚本配置
- 工程化

4、es6 解决了什么问题

- 回调
- 结构
- symbol
- 静态解析

5、进程和线程的区别

优点：

1、前端基础扎实

2、语言表达好

3、技术热情好

缺点：

1、技术广度待加强，技术深度待加强

2、前端工程化待加强

汪斌

1、出来原因

- 压力大，业务多
- 有成长

2、PC 站技术设计：

- SSR
  - 流量 300k 300 30%内存
  - 渲染
  - 监控
  - GC
  - 热函数
  - 自研框架
  - 遇到的问题
- BFF + GQL
- 状态管理

3、ES 与 require

4、tree shake

5、loader、plugin 区别

6、webpack 拆包、加载

7、vue react 区别
