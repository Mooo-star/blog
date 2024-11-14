---
title: Package.json
desciption: package.json 解释
keywords:
  - package
  - json
group:
  title: 工程化
toc: content
---

## 是什么 & 有什么用

package.json 是前端项目中的一个重要配置文件，它存储了项目的相关信息以及项目所依赖的模块等重要信息。

```json
{
  "name": "demo",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "devDependencies": {},
  "dependencies": {}
}
```

在这里就不一一解释每个配置项都是什么意思了，大家可以移步 [package.json](https://docs.npmjs.com/cli/v10/configuring-npm/package-json) 查看详细的解释。

下面就是解释一些我认为不好理解的属性

## exports & main

我的理解 `exports` 就是 `main` 的进阶版，他们都是在指定这个包的入口。但是 `main` 只能指定一个文件作为入口，而 `exports` 可以随意指定。下面放一个例子

```json
{
  "main": "./dist/index.cjs",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./unstyled": {
      "types": "./dist/unstyled.d.ts",
      "import": "./dist/unstyled.mjs",
      "require": "./dist/unstyled.js"
    }
  }
}
```

当然他们两个的优先级是有区别的，直接认为 exports 的优先级高于 main 就可以了，可以说在有 exports 属性存在的情况下，不会看 main 字段配置了什么东西。
但是 main 有着更好的兼容性，而 exports 需要 node 版本在 10 以上。

注意：**如是声明了 exports 字段，那么只要引用不在 exports 中声明的文件，就会报错哦（antd pro 之前搞过一次这样的问题哈哈哈哈）**

还有就是一个 `module` 字段，好像是一个非标准字段吧， rollup 提出并使用的，现在应该大多数的工程化工具都会去解析这个字段？
这个字段就是来去区分 cjs 和 esm 的了，因为之前只有 cjs 这个标准，后边才出的 esm。

## bin

这个配置是用来安装可执行程序的，用于指定可执行脚本的入口点。在全局安装这个 npm 包的时候，该文件将链接到全局 bins 目录内，或者将创建一个 cmd（Windows 命令文件），以执行 bin 字段中指定的文件，这样就可以在终端中运行我们的 npm 包了。比如 vite webpack umi 等等。

当然 bin 中引用的文件需要以 `#!/user/bin/env node` 作为文件的开头，指定 node 的运行环境。
