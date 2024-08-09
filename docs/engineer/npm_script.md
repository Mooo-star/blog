---
title: NPM Script
desciption: NPM Script
keywords:
  - NPM
  - Script
group:
  title: 工程化
toc: content
---

# 概述

## 什么是 NPM Script

npm script 是记录在 package.json 中的 scripts 字段中的一些自定义脚本，使用自定义脚本，用户可以将一些项目中常用的命令行记录在 package.json 不需要每次都要敲一遍。

```json
"scripts": {
    "build": "dumi build",
    "dev": "dumi dev",
    "prepare": "husky install && dumi setup",
    "preview": "dumi preview",
    "start": "npm run dev"
  },
```

上面就是我们日常见到最多的 NPM Script 了。通过这样的命令我们在启动项目或者跑脚本的时候就可以直接 `npm start` 。不用再写很长的命令，这可以大幅提高效率。

## NPM Script 的优点

:::info{title=PS}
以下内容来自 ChatGPT
:::

- 简洁和集中管理：npm scripts 让你能够在 package.json 文件中集中管理项目所需的脚本和任务，而无需依赖其他构建工具。所有的任务都在一个地方定义，减少了项目的复杂性。
- 无依赖工具：npm scripts 是 Node.js 和 npm 的内置功能，无需额外安装构建工具或任务运行器。你可以直接使用 JavaScript 或 Shell 脚本来编写任务。
- 跨平台兼容性：借助 cross-env 等工具，npm scripts 可以轻松跨平台运行，支持 Windows、macOS 和 Linux。这使得在不同的开发环境中保持一致性变得简单。
- 易于学习和使用：对于熟悉 npm 和 Node.js 的开发者来说，npm scripts 很容易上手和使用。你只需要在 package.json 文件中定义命令，然后使用 `npm run <script>` 来执行。
- 方便的脚本组合：你可以通过在 npm scripts 中使用 &&、||、& 等操作符来组合多个命令，或者使用内联的 npm 脚本调用（例如，npm run build && npm run test）来依次运行多个任务。
- 可以与其他 npm 包集成：你可以很方便地将 npm 包作为开发依赖（devDependencies）并在 npm scripts 中调用它们。这使得你可以利用社区提供的大量工具和插件，简化开发流程。
- 支持环境变量：npm scripts 支持在脚本中使用环境变量，这使得你可以根据不同的环境（开发、生产等）来动态配置行为。
- 简单的并行和串行任务管理：通过 &、&&、|| 以及内置的 npm-run-all 等工具，你可以轻松管理并行和串行任务，适应不同的工作流需求。

## 怎么执行

:::info{title=Tip}
首先需要大家自己去建一个项目哈，自己搞三个脚本随便输出点东西就可以了。
附上我的一个[仓库](https://github.com/Mooo-star/node)
:::

### 串行 &&

顺序执行多条命令, 当碰到执行出错的命令后将不执行后面的命令

定义 script

```json
"scripts": {
  "print": "node ./src/script_3.js && node ./src/script_2.js && node ./src/script_1.js"
}
```

Output:

```bash
> node@1.0.0 print
> node ./src/script_3.js && node ./src/script_2.js && node ./src/script_1.js

3 秒
2 秒
1 秒
```

### 并行 &

并行执行多条命令, 在命名最后跟上 `wait` 可阻塞当前进程, 直到所有并行命令执行完毕才会结束进程

```json
"scripts": {
  "print": "node ./src/script_3.js & node ./src/script_2.js & node ./src/script_1.js & wait"
}
```

Output:

```bash
> node@1.0.0 print
> node ./src/script_3.js & node ./src/script_2.js & node ./src/script_1.js & wait

1 秒
2 秒
3 秒
```

### 或 ||

顺序执行多条命令, 当命令被正确执行那么后面的命令将不会被执行

```json
"scripts": {
  "print": "node ./src/script_3.js || node ./src/script_2.js || node ./src/script_1.js"
}
```

Output:

```bash
> node@1.0.0 print
> node ./src/script_3.js || node ./src/script_2.js || node ./src/script_1.js

3 秒
```

### [参数 & 环境变量](https://docs.npmjs.com/cli/v10/commands/npm#configuration)

- 参数：可以使用 `--key val` 来设置参数，`key` 为参数名，`val` 为参数值。当然，你也可以不传参数值，不传的话默认为 `true`
- 环境变量：可以通过在环境变量中使用 `npm_config_` 作为名称前缀来设置任何配置。需要注意的是，所有以 `npm_config_` 开头的环境变量都会被解释为配置，并且不区分大小写。同样也可以拿到 `package.json` 中的配置信息

详情可以参见这 npm 原链接，https://docs.npmjs.com/cli/v10/commands/npm#configuration 、https://docs.npmjs.com/cli/v10/using-npm/config

OK，到这里基本的使用就讲解的差不多了。接下来上点强度。

## 进阶

### 原理

npm 脚本的原理非常简单。每当执行 npm run，就会自动新建一个 Shell，在这个 Shell 里面执行指定的脚本命令。因此，只要是 Shell（一般是 Bash）可以运行的命令，就可以写在 npm 脚本里面。

比较特别的是，npm run 新建的这个 Shell，会将当前目录的 node_modules/.bin 子目录加入 PATH 变量，执行结束后，再将 PATH 变量恢复原样。

这意味着，当前目录的 node_modules/.bin 子目录里面的所有脚本，都可以直接用脚本名调用，而不必加上路径。比如，当前项目的依赖里面有 Mocha，只要直接写 mocha test 就可以了。

```json
"test": "mocha test"
```

### 日志输出

执行 npm 的过程中会产生一些日志输出, 例如执行 npm init -y 会将生成的 package.json 文件中的内容输出到终端中, 在 npm 命令中我们可通过 --loglevel 来设置日志输出级别

`--loglevel` 的默认值为 notice。

1. silent
   - 描述：不会输出任何内容。即使发生错误，npm 也不会输出任何日志信息。
   - 使用场景：用于完全静默运行 npm 命令的场景，比如在持续集成环境中，不希望看到任何输出。
2. error
   - 描述：仅输出错误信息。这是最少的输出级别，仅在命令执行失败时输出相关的错误信息。
   - 使用场景：当你只关心命令是否执行成功，而不需要看到其他信息时。
3. warn
   - 描述：输出错误和警告信息。这一日志级别除了显示错误，还会显示可能会引起问题的警告信息。
   - 使用场景：在你需要了解可能影响项目的潜在问题时，但又不想看到过多的调试信息。
4. notice
   - 描述：默认日志级别。输出通知、警告和错误信息。notice 级别用于输出一些有用的信息，比如安装完成提示、配置信息等。
   - 使用场景：这是 npm 默认的日志级别，适用于一般开发场景，能够提供足够的上下文信息。
5. http
   - 描述：输出所有 HTTP 请求和响应的详细信息。包括请求的 URL、请求头、响应状态码等。
   - 使用场景：当你需要调试 npm 与远程仓库的网络通信问题时，可以使用这个日志级别。
6. timing
   - 描述：输出任务的时间信息，包括各个阶段的开始时间和耗时。通常与性能优化相关。
   - 使用场景：当你需要了解 npm 命令各个步骤的执行耗时时，使用这个日志级别来分析性能瓶颈。
7. info
   - 描述：输出一般信息、错误、警告和通知。此级别会显示 npm 的各类操作细节，如包的安装路径、配置加载情况等。
   - 使用场景：适合开发过程中需要了解更多操作细节的情况。
8. verbose
   - 描述：输出非常详细的信息，包含所有上面级别的信息，以及调试信息。几乎所有 npm 的内部操作都会被记录下来。
   - 使用场景：在深入调试或需要详细了解 npm 命令内部执行过程时使用。
9. silly
   - 描述：输出最详细的调试信息，甚至包括一些不常用的调试数据。几乎每一个步骤和变量都被记录下来。
   - 使用场景：非常罕见的使用场景，通常用于调试 npm 本身或深入分析非常复杂的错误。

同样，他们也有着自己的别名

- -d: --loglevel info
- --dd: --loglevel verbose
- --verbose: --loglevel verbose
- --ddd: --loglevel silly
- -q: --loglevel warn
- --quiet: --loglevel warn
- -s: --loglevel silent
- --silent: --loglevel silent

### 钩子

相信大家应该见过下面的脚本

```json
{
  "scripts": {
    "precompress": "echo precompress",
    "compress": "echo compress",
    "postcompress": "echo postcompress"
  }
}
```

像这样的脚本，我们在运行 `npm run compress` 的时候会按照顺序执行 `precompress`、`compress`、`postcompress`，三个命令，输出如下：

```bash
> node@1.0.0 precompress
> echo precompress

precompress

> node@1.0.0 compress
> echo compress

compress

> node@1.0.0 postcompress
> echo postcompress
```

这是 npm 提供的功能，利用这个特性我们可以拆分我们的脚本，让其更专注的干一件事情。

### Life Cycle Script

:::info{title=Tip}
下面附上 GPT 给出的 NPM LifeCycle Script
:::

1. preinstall
   - 描述：在包安装开始之前执行的脚本。这是在 npm 处理依赖关系之前的最早时机。

- 使用场景：通常用于安装某些全局依赖、环境准备工作或者检查依赖版本等。

2. install

- 描述：在包安装过程中执行的脚本，通常在依赖已经下载并解压后执行。
- 使用场景：用于构建项目、生成配置文件或执行安装后需要的额外任务。

3. postinstall

- 描述：在包及其所有依赖安装完成之后执行的脚本。
- 使用场景：可以用于完成安装后的一些清理工作、配置文件调整、生成文档等。

4. preuninstall

- 描述：在包卸载之前执行的脚本。
- 使用场景：用于在卸载前进行数据备份或通知其他系统即将进行卸载。

5. uninstall

- 描述：在包卸载过程中执行的脚本。
- 使用场景：可以用于清理配置文件、注销服务或其他卸载过程中需要的操作。

6. postuninstall

- 描述：在包及其依赖卸载完成后执行的脚本。
- 使用场景：用于完成卸载后的清理任务，通知其他系统卸载已经完成等。

7. preversion

- 描述：在 npm 版本号变更之前执行的脚本。
- 使用场景：用于在发布新版本之前做准备工作，比如运行测试、代码格式化、更新版本信息等。

8. version

- 描述：在版本号变更时执行的脚本，通常用于修改版本号。
- 使用场景：可以用于在版本号变更时自动更新文档或 changelog，或执行其他版本号变更相关的任务。

9. postversion

- 描述：在版本号变更并提交到版本控制系统之后执行的脚本。
- 使用场景：用于发布新版本后执行的一些操作，比如推送到远程仓库、发布到 npm registry 等。

10. prepublishOnly

- 描述：在 npm publish 或 npm install 之前执行，但不会在本地安装时执行（即，不在 npm install <pkg> 或 npm link 时触发）。
- 使用场景：用于确保在发布之前所有的准备工作都已经完成，如编译、测试等。

11. prepack

- 描述：在包被打包之前执行的脚本。
- 使用场景：通常用于在打包前进行构建或准备工作。

12. postpack

- 描述：在包打包完成之后执行的脚本。
- 使用场景：用于清理打包过程中的临时文件或者发布打包结果。

13. prepare

- 描述：在 npm install、npm publish、npm pack 和 npm link 之前执行。如果使用了 Git，git push 和 git pull 也会触发它。
- 使用场景：常用于在安装或发布之前构建项目，确保项目是准备好的。

14. prepublish

- 描述：这个脚本在任何类型的发布之前运行（包括 npm publish 和 npm install）。目前已被拆分成 prepublishOnly 和 prepare 两个独立脚本，通常不再单独使用。
- 使用场景：用于项目发布之前的准备工作，但现在多使用 prepublishOnly。

15. pretest

- 描述：在运行测试脚本之前执行。
- 使用场景：用于在测试前准备环境，如编译代码、设置测试数据库等。

16. test

- 描述：执行项目的测试脚本，通常是 npm test 命令的核心部分。
- 使用场景：用于运行项目的测试套件。

17. posttest

- 描述：在测试脚本运行完毕后执行。
- 使用场景：用于测试后进行清理或报告生成等任务。

18. prestart

- 描述：在项目启动脚本之前执行。
- 使用场景：用于在启动项目之前设置环境变量、启动依赖服务等。

19. start

- 描述：执行项目的启动脚本，通常用于运行应用程序或服务器。
- 使用场景：用于启动应用程序，常见于开发和生产环境。

20. poststart

- 描述：在项目启动脚本之后执行。
- 使用场景：用于在项目启动后执行额外的任务，如发送通知或监控启动状态等。

21. prestop

- 描述：在项目停止脚本之前执行。
- 使用场景：用于在停止应用之前执行的一些准备工作，如通知用户、保存状态等。

22. stop

- 描述：执行项目的停止脚本，通常用于关闭应用程序或服务器。
- 使用场景：用于停止应用程序，常见于开发和生产环境。

23. poststop

- 描述：在项目停止脚本之后执行。
- 使用场景：用于停止应用后执行的清理任务，如关闭数据库连接、清除缓存等。

24. prerestart

- 描述：在重启项目之前执行。
- 使用场景：通常用于在应用重启前执行的任务，如备份数据、重新加载配置等。

25. restart

- 描述：执行项目的重启脚本，通常包括停止和启动的组合。
- 使用场景：用于重启应用程序。

26. postrestart

- 描述：在重启项目之后执行。
- 使用场景：用于重启后执行的任务，如确认服务状态、发送通知等。

详细的生命周期钩子的特性还请看[官方文档](https://docs.npmjs.com/cli/v10/using-npm/scripts#life-cycle-scripts)给出的解释

## 参考文章

- [npm script 详解](https://juejin.cn/post/6917533974285778957)
- [npm scripts 使用指南](https://www.ruanyifeng.com/blog/2016/10/npm_scripts.html)
- [npm 官网](https://docs.npmjs.com/)
