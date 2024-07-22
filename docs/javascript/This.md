---
title: This
desciption: javascript 中的 this
keywords:
  - this
group:
  title: JavaScript
toc: content
---

# This

> Types are further subclassified into ECMAScript language types and specification types.
> An ECMAScript language type corresponds to values that are directly manipulated by anECMAScript programmer using the ECMAScript language. The ECMAScript language types areUndefined, Null, Boolean, String, Number, and Object.
> A specification type corresponds to meta-values that are used within algorithms to describethe semantics of ECMAScript language constructs and ECMAScript language types. Thespecification types are Reference, List, Completion, Property Descriptor, Property Identifier,Lexical Environment, and Environment Record

我们简单的翻译一下：ECMAScript 的类型分为语言类型和规范类型。
ECMAScript 语言类型是开发者直接使用 ECMAScript 可以操作的。其实就是我们常说的 Undefined,Null, Boolean, String, Number, 和 Object。
而规范类型相当于 meta-values，是用来用算法描述 ECMAScript 语言结构和 ECMAScript 语言类型的。规范类型包括：Reference, List, Completion, Property Descriptor, Property Identifier, LexicalEnvironment 和 Environment Record。
我们只要知道在 ECMAScript 规范中还有一种只存在于规范中的类型，它们的作用是用来描述语言底层行为逻辑。
这里要讲的重点是便是其中的 Reference 类型。它与 this 的指向有着密切的关联。

### Reference

那什么又是 Reference ？

> The Reference type is used to explain the behaviour of such operators as delete, typeof, andthe assignment operators.

所以 Reference 类型就是用来解释诸如 delete、typeof 以及赋值等操作行为的。
这里的 Reference 是一个 Specification Type，也就是 “只存在于规范里的抽象类型”。它们是为了更好地描述语言的底层行为逻辑才存在的，但并不存在于实际的 js 代码中。
再看接下来的这段具体介绍 Reference 的内容：

> A Reference is a resolved name binding.
> A Reference consists of three components, the base value, the referenced name and theBoolean valued strict reference flag.
> The base value is either undefined, an Object, a Boolean, a String, a Number, or an environmentrecord (10.2.1).
> A base value of undefined indicates that the reference could not be resolved to a binding. Thereferenced name is a String.

这段讲述了 Reference 的构成，由三个组成部分，分别是：

- base value；
- referenced name；
- strict reference；

可是这些到底是什么呢？
我们简单的理解的话：
base value 就是属性所在的对象或者就是 EnvironmentRecord，它的值只可能是 undefined, anObject, a Boolean, a String, a Number, or an environment record 其中的一种。
referenced name 就是属性的名称。
举个例子：

```javascript
var foo = 1; // 对应的Reference是：
var fooReference = {
  base: EnvironmentRecord,
  name: 'foo',
  strict: false,
};

var foo = {
  bar: function () {
    return this;
  },
};

foo.bar(); // foo

// bar对应的Reference是：
var BarReference = {
  base: foo,
  propertyName: 'bar',
  strict: false,
};
```

而且规范中还提供了获取 Reference 组成部分的方法，比如 GetBase 和 IsPropertyReference。

### GetBase

> GetBase(V). Returns the base value component of the reference V.

返回 reference 的 base value。

```javascript
var foo = 1;

var fooReference = {
  base: EnvironmentRecord,
  name: 'foo',
  strict: false,
};

GetValue(fooReference); // 1;
```

GetValue 返回对象属性真正的值，但是，调用 GetValue，返回的将是具体的值，而不再是一个 Reference

### IsPropertyReference

> IsPropertyReference(V). Returns true if either the base value is an object orHasPrimitiveBase(V) is true; otherwise returns false.

如果 base value 是一个对象，就返回 true。

### 如何确定 this 的值

关于 Reference 讲了那么多，为什么要讲 Reference 呢？到底 Reference 跟本文的主题 this 有哪些关联呢？

- Let ref be the result of evaluating MemberExpression；
- if Type(ref) is Reference, then
  - If IsPropertyReference(ref) is true, then
  - Let thisValue be GetBase(ref).
- Else, the base of ref is an Environment Record
  - Let thisValue be the result of calling the ImplicitThisValue concrete method ofGetBase(ref).
- Else, Type(ref) is not Reference.
- Let thisValue be undefined.

让我们描述一下：

1. 计算 MemberExpression 的结果赋值给 ref；
2. 判断 ref 是不是一个 Reference 类型；
   1. 如果 ref 是 Reference，并且 IsPropertyReference(ref) 是 true, 那么 this 的值为 GetBase(ref)
   2. 如果 ref 是 Reference，并且 base value 值是 Environment Record, 那么 this 的值为 ImplicitThisValue(ref)
   3. 如果 ref 不是 Reference，那么 this 的值为 undefined；

### 具体分析

什么是 MemberExpression？看规范 11.2 Left-Hand-Side Expressions：
MemberExpression :

- PrimaryExpression // 原始表达式
- FunctionExpression // 函数定义表达式
- MemberExpression [ Expression ] // 属性访问表达式
- MemberExpression . IdentifierName // 属性访问表达式
- new MemberExpression Arguments // 对象创建表达式

举个例子：

```javascript
function foo() {
  console.log(this);
}

foo(); // MemberExpression 是  foo

function foo() {
  return function () {
    console.log(this);
  };
}

foo()(); // MemberExpression 是  foo()

var foo = {
  bar: function () {
    return this;
  },
};

foo.bar(); // MemberExpression 是  foo.bar
```

所以简单理解 MemberExpression 其实就是()左边的部分。

### 判断 ref 是不是一个 Reference 类型。

关键就在于看规范是如何处理各种 MemberExpression ，返回的结果是不是一个 Reference 类型。

```javascript
var value = 1;

var foo = {
  value: 2,
  bar: function () {
    return this.value;
  },
};

//示例1
console.log(foo.bar());

//示例2
console.log(foo.bar());

//示例3
console.log((foo.bar = foo.bar)());

//示例4
console.log((false || foo.bar)());

//示例5
console.log((foo.bar, foo.bar)());
```

### foo.bar()

上面的 demo 中， MemberExpression 计算的结果是 foo.bar ，那么 foo.bar 是不是一个 Reference 呢？
根据规范，这里展示了一个计算的过程，什么都不管了，就看最后一步：

> Return a value of type Reference whose base value is baseValue and whose referenced name is propertyNameString, and whose strict mode flag is strict.

我们得知该表达式返回了一个 Reference 类型
根据之前的内容，我们知道该值为：

```javascript
var Reference = {
  base: foo,
  name: 'bar',
  strict: false,
};
```

接下来按照流程：
如果 ref 是 Reference，并且 IsPropertyReference(ref) 是 true, 那么 this 的值为 GetBase(ref)
该值是 Reference 类型，那么 IsPropertyReference(ref) 的结果是多少呢？
前面我们说了 IsPropertyReference 方法，如果 base value 是一个对象，结果返回 true。
base value 为 foo，是一个对象，所以 IsPropertyReference(ref) 结果为 true。
这个时候我们就可以确定 this 的值：

```javascript
this = GetBase(ref)
```

GetBase 也已经铺垫了，获得 base value 值，这个例子中就是 foo，所以 this 的值就是 foo ，示例 1 的结果就是 2。

### (foo.bar)()

```javascript
console.log(foo.bar());
```

foo.bar 被 () 包住

> Return the result of evaluating Expression. This may be of type Reference.
> NOTE This algorithm does not apply GetValue to the result of evaluating Expression.

实际上 () 并没有对 MemberExpression 进行计算，所以其实跟示例 1 的结果是一样的。

### (foo.bar = foo.bar)()

看示例 3，有赋值操作符
因为使用了 GetValue，所以返回的值不是 Reference 类型
按照之前讲的判断逻辑，如果 ref 不是 Reference，那么 this 的值为 undefined
this 为 undefined，非严格模式下，this 的值为 undefined 的时候，其值会被隐式转换为全局对象

### (false || foo.bar)()

示例 4，因为使用了 GetValue，所以返回的不是 Reference 类型，this 为 undefined。

### (foo.bar, foo.bar)()

看示例 5，因为使用了 GetValue，所以返回的不是 Reference 类型，this 为 undefined。

### 总结

```javascript
var value = 1;

var foo = {
  value: 2,
  bar: function () {
    return this.value;
  },
};

//示例1
console.log(foo.bar()); // 2
//示例2
console.log(foo.bar()); // 2
//示例3
console.log((foo.bar = foo.bar)()); // 1
//示例4
console.log((false || foo.bar)()); // 1
//示例5
console.log((foo.bar, foo.bar)()); // 1
```
