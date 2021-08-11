# Poke使用案例
---

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

#[
    TEST  
]
---

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

|标题1|标题2|121|
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
---

> TEST1
123
>> TEST2
456
