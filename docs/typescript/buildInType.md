---
title: 内置类型
description: 用来介绍 Typescript 内置类型
keywords:
  - typescript
  - 内置类型
group:
  title: TypeScript
  order: 1
toc: content
---

### 1. Partial&lt;T&gt;

> `Partial` 接收一个泛型类型 `Type`，并将 `Type` 所有属性都设置为可选的，返回构造的新类型。

使用场景

```ts
interface User {
  name: string;
  age: number;
  address: string;
}

function updateUser(user: User, fieldsToUpdate: Partial<User>) {
  return { ...user, ...fieldsToUpdate };
}

const user: User = { name: 'xiaoming', age: 30, address: '上海' };
const newUser = updateUser(user, { address: '北京' });
```

源码实现

```ts
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

### 2. Required&lt;T&gt;

> `Required` 接收一个泛型类型 `Type`，并将 `Type` 所有属性都设置为必选的，返回构造的新类型「Required 的作用与 Partial 相反」。

使用场景

```ts
interface Props {
  name?: string;
  age?: number;
}

function printProps(props: Required<Props>) {
  console.log(`${props.name} is ${props.age} years old.`);
}

printProps({ name: 'xiaoming' }); // Property 'age' is missing in type '{ name: string; }' but required in type 'Required<Props>'
```

源码实现

```ts
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

### 3. Readonly&lt;T&gt;

> `Readonly` 接收一个泛型类型 `Type`，并将 `Type` 所有属性都设置为只读的，返回构造的新类型，新类型的属性不可再进行分配

使用场景

```ts
interface User {
  name: string;
  age: number;
}

const user: Readonly<User> = { name: 'xiaoming', age: 30 };
user.name = 'zhangsan'; // Cannot assign to 'name' because it is a read-only property.
```

源码实现

```ts
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

### 4. Record&lt;K, T&gt;

> 构造一个对象类型，其属性键为 `Keys`，属性值为 `Type`。

使用场景

```ts
interface User {
  name: string;
  age: number;
}

type UserName = 'xiaoming' | 'xiaohong' | 'xiaohuang';

const users: Record<UserName, User> = {
  xiaoming: { name: 'ming', age: 23 },
  xiaohong: { name: 'hong', age: 24 },
  xiaohuang: { name: 'huang', age: 25 },
};
```

源码实现

```ts
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```

### 5. Pick&lt;T, K&gt;

> 从类型 `Type` 中选择一组属性 `Keys` 来创建类型

使用场景

```ts
interface User {
  name: string;
  age: number;
  address: string;
}

type NameAndAgeOnly = Pick<User, 'name' | 'age'>;
const nameAndAgeOnly: NameAndAgeOnly = { name: 'xiaoming', age: 26 };
```

源码实现

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

### 6. Exclude&lt;UnionType, ExcludedMembers&gt;

> 从联合类型 `UnionType` 中排除 `ExcludedMembers` 类型然后返回一个新类型。

使用场景

```ts
interface User {
  name: string;
  age: number;
  address: string;
}

type UserExcludeAddress = Exclude<keyof User, 'address'>; // "name" | "age"
```

源码实现

```ts
type Exclude<T, U> = T extends U ? never : T;
```

### 7. Extract&lt;T, U&gt;

> 从联合类型 `Type` 中提取 `Union` 类型然后返回一个新类型

使用场景

```ts
interface User {
  name: string;
  age: number;
  address: string;
}
type UserAddress = Extract<keyof User, 'address'>; // address

type Person = {
  name: string;
  age: string;
};
const user: Extract<keyof User, keyof Person> = 'name' || 'age';

type SuccessCode = Extract<200 | 404, 200>; // 200
```

源码实现

```ts
type Extract<T, U> = T extends U ? T : never;
```

### 8. Omit&lt;T, U&gt;

> 与 `Pick` 相反，`Omit` 是从 `Type` 中选取所有 `Keys` 属性然后删除构造一个新类型

使用场景

```ts
interface User {
  name: string;
  age: number;
  address: string;
}

type UserOmitAge = Omit<User, 'address'>;

const userOmitAge: UserOmitAge = { name: 'xiaoming', age: 30 };
```

源码实现

```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

### 9. NonNullable&lt;T&gt;

> 通过从 `Type` 中排除 `null` 和 `undefined` 来构造一个类型

使用场景

```ts
type PortNumber = string | number | null;
type ServerPortNum = NonNullable<PortNumber>;
```

源码实现

```ts
type NonNullable<T> = T & {};
```

### 10. Parameters&lt;T&gt;

> 接受一个函数类型, 将函数的参数处理成一个元组类型。

使用场景

```ts
function createStudent(sno: string, name: string, age: number) {
  return { sno, name, age };
}

type CreateStudentParams = Parameters<typeof createStudent>;

const createStuParams: CreateStudentParams = ['112899022', 'ming', 30];
const stu1 = createStudent(...createStuParams);
```

源码实现

```ts
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;
```

### 11. ConstructorParameters&lt;T&gt;

> 接受一个具有构造函数的类型, 将构造函数的参数处理成一个元组类型。

使用场景

```ts
class Test {
  constructor(a: number, b: string) {}
}
type T1 = ConstructorParameters<typeof Test>; //  [a: number, b: string]

type T2 = ConstructorParameters<new (x: string, y: number) => any>; // [x: string, y: number]
```

源码实现

```ts
type ConstructorParameters<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: infer P) => any ? P : never;
```

### 12. ReturnType&lt;T&gt;

> 获取函数类型的返回值类型。

使用场景

```ts
function getUser() {
  return { name: 'ming', age: 30 };
}

type User = ReturnType<typeof getUser>;

const user: User = { name: 'hong', age: 26 };
```

源码实现

```ts
type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;
```

### 13. InstanceType&lt;T&gt;

> 获取构造函数类型的返回类型（构造函数返回什么什么类型，`InstanceType` 获取的就是什么类型）。

使用场景

```ts
class Person {
  constructor(public name: string) {}
}
type PersonInstance = InstanceType<typeof Person>;
const person: PersonInstance = new Person('Alice');

interface User {
  new (name: string): Object;
}
type UserInstance = InstanceType<User>; // Object
```

源码实现

```ts
type InstanceType<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: any) => infer R ? R : any;
```

### 14. Awaited&lt;T&gt;

> 获取 Promise 中的类型(如 await、then 方法返回的被 Promise 包裹的数据的类型)。适合处理异步操作并确保解析值的类型安全

使用场景

```ts
type A = Awaited<Promise<string>>; // string
type B = Awaited<Promise<Promise<number>>>; // number

// 假如这是一个第三方库，User没有导出，fetchUser函数导出了
interface User {
  name: string;
  age: number;
}
export async function fetchUser(): Promise<User> {
  const data = await fetch('https://www.example.com/user').then((res) => {
    return res.json();
  });
  return data;
}

// 我们开发中在获取到了User类型
type UserFetch = Awaited<ReturnType<typeof fetchUser>>;

async function getUserInfo() {
  let user: UserFetch = { name: 'ming', age: 30 };
  return user;
}
```

源码实现

```ts
type Awaited<T> = T extends null | undefined
  ? T // special case for `null | undefined` when not in `--strictNullChecks` mode
  : T extends object & { then(onfulfilled: infer F, ...args: infer _): any } // `await` only unwraps object types with a callable `then`. Non-object types are not unwrapped
  ? F extends (value: infer V, ...args: infer _) => any // if the argument to `then` is callable, extracts the first argument
    ? Awaited<V> // recursively unwrap the value
    : never // the argument to `then` was not callable
  : T; // non-object or non-thenable
```

### 15. ThisParameterType&lt;T&gt;

> 提取函数类型的 `this` 参数的类型, 如果函数类型没有 this 参数, 返回 unknown。

使用场景

```ts
function toHex(this: number) {
  return this.toString(16);
}

function numberToString(n: ThisParameterType<typeof toHex>) {
  return toHex.apply(n);
}
```

源码实现

```ts
type ThisParameterType<T> = T extends (this: infer U, ...args: never) => any
  ? U
  : unknown;
```

### 16. OmitThisParameter&lt;T&gt;

> 与 ThisParameterType 相反， 排除函数类型的 this 参数

使用场景

```ts
function toHex(this: number) {
  return this.toString(16);
}

const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5);
```

源码实现

```ts
type OmitThisParameter<T> = unknown extends ThisParameterType<T>
  ? T
  : T extends (...args: infer A) => infer R
  ? (...args: A) => R
  : T;
```

### 17. ThisType&lt;T&gt;

> 控制字面量对象中 this 所表示的类型。 只在 `--noImplicitThis` 下有用

使用场景

```ts
// 正常情况推导出来的this
type Point = {
  x: number;
  y: number;
  moveBy(dx: number, dy: number): void;
};

let p: Point = {
  x: 10,
  y: 20,
  moveBy(dx, dy) {
    this.x += dx; // this has type Point
    this.y += dy; // this has type Point
  },
};
```

源码实现

```ts
interface ThisType<T> {}
```

### 18. ReadonlyArray&lt;T&gt;

> 描述只能读的数组， 不可进行添加、删除、替换操作。

使用场景

```ts
const arr: ReadonlyArray<string> = ['aaa', 'bbb', 'ccc'];
arr.slice(); // okay
arr.push('hello!'); //  Type error
arr.pop(); // Type error
arr.splice(1, 1); // Type error
arr[0] = 'aa'; // Type error
```

源码实现

```ts
interface ReadonlyArray<T> {
  readonly length: number;
  toString(): string;
  toLocaleString(): string;
  concat(...items: ConcatArray<T>[]): T[];
  concat(...items: (T | ConcatArray<T>)[]): T[];
  join(separator?: string): string;
  slice(start?: number, end?: number): T[];
  indexOf(searchElement: T, fromIndex?: number): number;
  lastIndexOf(searchElement: T, fromIndex?: number): number;
  every<S extends T>(
    predicate: (value: T, index: number, array: readonly T[]) => value is S,
    thisArg?: any,
  ): this is readonly S[];
  every(
    predicate: (value: T, index: number, array: readonly T[]) => unknown,
    thisArg?: any,
  ): boolean;
  some(
    predicate: (value: T, index: number, array: readonly T[]) => unknown,
    thisArg?: any,
  ): boolean;
  forEach(
    callbackfn: (value: T, index: number, array: readonly T[]) => void,
    thisArg?: any,
  ): void;
  map<U>(
    callbackfn: (value: T, index: number, array: readonly T[]) => U,
    thisArg?: any,
  ): U[];
  filter<S extends T>(
    predicate: (value: T, index: number, array: readonly T[]) => value is S,
    thisArg?: any,
  ): S[];
  filter(
    predicate: (value: T, index: number, array: readonly T[]) => unknown,
    thisArg?: any,
  ): T[];
  reduce(
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
      array: readonly T[],
    ) => T,
  ): T;
  reduce(
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
      array: readonly T[],
    ) => T,
    initialValue: T,
  ): T;
  reduce<U>(
    callbackfn: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
      array: readonly T[],
    ) => U,
    initialValue: U,
  ): U;
  reduceRight(
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
      array: readonly T[],
    ) => T,
  ): T;
  reduceRight(
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
      array: readonly T[],
    ) => T,
    initialValue: T,
  ): T;
  reduceRight<U>(
    callbackfn: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
      array: readonly T[],
    ) => U,
    initialValue: U,
  ): U;
  readonly [n: number]: T;
}
```

### 19. ThisType&lt;T&gt;

> 字符串中的每个字符转换为对应的大写。

使用场景

```ts
type Greeting = 'Hello, world';
type ShoutyGreeting = Uppercase<Greeting>; // "HELLO, WORLD"

type ASCIICacheKey<Str extends string> = `ID-${Uppercase<Str>}`;
type MainID = ASCIICacheKey<'my_app'>; // "ID-MY_APP"
```

源码实现

```ts
type Uppercase<S extends string> = intrinsic;
```

### 20. Uppercase&lt;T&gt;

> 将字符串中的每个字符转换为对应的大写。

使用场景

```ts
type Greeting = 'Hello, world';
type QuietGreeting = Uppercase<Greeting>; //  "HELLO, WORLD"

type ASCIICacheKey<Str extends string> = `id-${Uppercase<Str>}`;
type MainID = ASCIICacheKey<'MY_APP'>; // "id-MY_APP"
```

源码实现

```ts
type Uppercase<S extends string> = intrinsic;
```

### 21. Lowercase&lt;T&gt;

> 将字符串中的每个字符转换为对应的小写。

使用场景

```ts
type Greeting = 'Hello, world';
type QuietGreeting = Lowercase<Greeting>; //  "hello, world"

type ASCIICacheKey<Str extends string> = `id-${Lowercase<Str>}`;
type MainID = ASCIICacheKey<'MY_APP'>; // "id-my_app"
```

源码实现

```ts
type Lowercase<S extends string> = intrinsic;
```

### 22. Capitalize&lt;T&gt;

> 将字符串中的第一个字符转换为大写字母。

使用场景

```ts
type Lowercase = 'hello world';

type Cap = Capitalize<Lowercase>; // Hello world
```

源码实现

```ts
type Capitalize<S extends string> = intrinsic;
```

### 23. Capitalize&lt;T&gt;

> 将字符串中的第一个字符转换为大写字母。

使用场景

```ts
type Uppercase = 'HELLO WORLD';
type Uncap = Uncapitalize<Uppercase>; // hELLO WORLD
```

源码实现

```ts
type Uncapitalize<S extends string> = intrinsic;
```
