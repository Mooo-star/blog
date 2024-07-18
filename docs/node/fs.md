---
title: fs 文件系统
description: 用来介绍 node fs 内置模块
keywords:
  - node
  - fs
toc: content
---

### 介绍

fs 模块，作为 Node.js 平台中的一个核心组件，主要负责处理文件系统相关的操作。该模块提供了一系列用于文件管理的功能，例如文件的读取、写入、更新以及删除等。

在我们学习 fs 模块之前呢，首先要了解一下文件的权限。因为 fs 模块需要对文件进行操作，会涉及到操作权限的问题，所以需要先清楚文件权限是什么，都有哪些权限。

### Linux 文件权限

| 代表字符 | 权限 | 数字表示 | 对文件含义 |       对目录含义       |
| :------: | :--: | :------: | :--------: | :--------------------: |
|    r     |  读  |    4     |  查看文件  |        查看目录        |
|    w     |  写  |    2     |  修改文件  | 在目录中创建、删除文件 |
|    x     | 执行 |    1     |  执行文件  |        进入目录        |

拿下面的来举例说明下

```sh
-rw-r--r--    1 user  staff   896B  6 21 14:32 leet.js
drwxr-xr-x  107 user  staff   3.3K  6 21 13:22 node_modules
```

将上面的信息解析一下

|  权限信息  | 硬链接数量 | 所有者 | 所属组 | size |  创建日期  |    文件名    |
| :--------: | :--------: | :----: | :----: | :--: | :--------: | :----------: |
| -rw-r--r-- |     1      |  user  | staff  | 896B | 6 21 14:32 |   leet.js    |
| drwxr-xr-x |    107     |  user  | staff  | 3.3K | 6 21 13:22 | node_modules |

拿 `-rw-r--r--` 来举例，简单划分一下 `- | rw- | r-- | r--`。

第一位代表是文件还是文件夹，d 开头代表文件夹，- 开头的代表文件，而后面九位就代表当前用户、用户所属组和其他用户的权限位，按每三位划分，分别代表读（r）、写（w）和执行（x），- 代表没有当前位对应的权限。

### 标识位

Node.js 中，标识位代表着对文件的操作方式，如可读、可写、即可读又可写等等，在下面用一张表来表示文件操作的标识位和其对应的含义。

| 符号 |                                                        含义                                                         |
| :--: | :-----------------------------------------------------------------------------------------------------------------: |
|  a   |                                    打开文件进行追加。如果文件不存在则创建该文件                                     |
|  ax  |                                           类似于 `a` 但如果路径存在则失败                                           |
|  a+  |                                打开文件进行读取和追加。如果文件不存在，则创建该文件                                 |
| ax+  |                                          类似于 `a+` 但如果路径存在则失败                                           |
|  as  |                              以同步模式打开文件进行追加。如果文件不存在，则创建该文件                               |
| as+  |                           以同步模式打开文件进行读取和追加。如果文件不存在，则创建该文件                            |
|  r   |                                   打开文件进行读取。如果文件不存在，则会发生异常                                    |
|  rs  |                                打开文件以同步模式读取。如果文件不存在，则会发生异常                                 |
|  r+  |                                   打开文件进行读写。如果文件不存在，则会发生异常                                    |
| rs+  | 以同步模式打开文件进行读写。指示操作系统绕过本地文件系统缓存。适用于 NFS 挂载等情况。ps:对 I/O 有影响，非必要不使用 |
|  w   |                              打开文件进行写入。如果不存在就创建，如果存在则清空后写入                               |
|  wx  |                                            类似 `w` 但如果路径存在则失败                                            |
|  w+  |                              打开文件进行读写。如果不存在则创建，如果存在则清空后写入                               |
| wx+  |                                         类似于 `w+` 但如果路径存在则失败。                                          |

上面表格就是这些标识位的具体字符和含义，但是 flag 是不经常使用的，不容易被记住，所以在下面总结了一个加速记忆的方法。

- r：读取
- w：写入
- s：同步
- +：增加相反操作
- x：排他方式

> r+ 和 w+ 的区别，当文件不存在时，r+ 不会创建文件，而会抛出异常，但 w+ 会创建文件；如果文件存在，r+ 不会自动清空文件，但 w+ 会自动把已有文件的内容清空。

### fs 同步/异步

使用 `fs` 前，我们要先来了解一下 fs 的 **同步/异步** 操作。

如你所见，同步就是按照你写的代码顺序，一点一点的执行。异步当然就是和你写的代码顺序有所差异了。

首先，fs 的使用有三种方式

- 同步
- callback
- promise

#### 同步方式

拿官方的例子来说一下

```js
const { unlinkSync } = require('node:fs')

try {
  unlinkSync('/temp/hello');
  console.log('successfully deleted /temp/hello')

} cache(error) {
  // handle error
  console.log('unlinkSync has error')
}

console.log('unlink done')
```

这块儿代码按照顺序执行，输出如下

```
successfully deleted /temp/hello
unlink done

or

unlinkSync has error
unlink done
```

可以看到，同步的 API 会阻塞 Node.js 事件循环和下一步的执行，直到操作完成。有异常会立即跑出，可以用 `try ... catch` 来处理，也可以允许冒泡。

#### callback

```js
const { unlink } = require('node:fs');

unlink('/temp/hello', (err) => {
  if (err) {
    console.log('unlink has error');
    return;
  }

  console.log('successfully deleted /temp/hello');
});

console.log('unlink done');
```

执行结果

```
unlink done
successfully deleted /temp/hello

or

unlink done
unlink has error
```

这个时候执行就已经不一样了，很明显的，永远先输出后面的 `unlink done` ，因为回调的形式将回调函数异步调用，经过事件循环，在合适的阶段去执行这个函数。但是第一个参数始终保留用于异常。如果操作成功，则第一个参数为 `null` 或者 `undefined`，反之返回错误信息。

#### Promise

```js
const { unlink } = require('node:fs/promises');

(async function (path) {
  try {
    await unlink(path);
    console.log(`successfully deleted ${path}`);
  } catch (error) {
    console.log('unlink promise has error');
  }
})('/tmp/hello');

console.log('unlink promise done');
```

执行结果

```
unlink done
successfully deleted /temp/hello

or

unlink done
unlink promise has error
```

结果上与 callback 的形式一致，因为这也是一个异步操作，但是他的写法上又与同步的相似，使用 `try ... catch` 捕获异常。当然，使用 `then` `catch` 的写法也是可以的。

到这里，相信大家已经对上面的三种形式有了认知。这个时候有的小伙伴就要提问了，官方提供了三种方法，我们该怎么去选择使用哪一种呢？那接下来就要去介绍一下这三种方式的优劣了

1. 同步形式
   - sdfasfs
