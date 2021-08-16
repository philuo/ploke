# Poke使用案例
---

<div>XSS</div>

## 导读块

```poke
#[TEST]

#[
    TEST
]

#(导读)[
    TEST  
]
```

#(导读)[
    %[
        **这里是导读**, Poke语法测试版本
    ](lightblue)
]

## 标题

```md
# 一级标题

## 次级标题
```

# 一级标题
## 次级标题
---

## 分割线

```md
***
---
```

---

## 代码块

```md
```ts
import { computed, ref } from 'vue';
import markdown, { token } from '@/test.md';
const t = ref(token);
computed(() => {
    if (token) {
        t.value = token;
    }
})
console.log(token)
```
```

```ts
import { computed, ref } from 'vue';
import markdown, { token } from '@/test.md';
const t = ref(token);
computed(() => {
    if (token) {
        t.value = token;
    }
})
console.log(token)
```
---
## 表格块

```md
|标题1|标题2|121|
|:--|:-:|-|
|test\n2|test2||
|test|test2||
```

|标题1\|\n2[ww](212221)|标题2|121|
|:--|:-:|-|
|test\n2|test2||
|test|test2||
---

## 引用块

```md
> TEST1
123
>> TEST2
456
```

> TEST1
123
>> TEST2
456

---

## 图片块

```poke
![图片A](https://b.bdstatic.com/searchbox/mappconsole/image/20181016/1539689557-13863.png)

![图片B](https://b.bdstatic.com/searchbox
/mappconsole/image/20181016/1539689557-13863.png)
```

![图片A](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f70ef3eb1504c9f8be1d5e9eaa132b8~tplv-k3u1fbpfcp-watermark.awebp)

![图片A](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/
9f70ef3eb1504c9f8be1d5e9eaa132b8~tplv-k3u1fbpfcp-watermark.
awebp)

## 超链接

[baidu](https://www.baidu.com)

## 文案

TEST`[ss]`a

TEST`111
`1

*`123`*

~~`123`~~

**`123`**

***`123`***