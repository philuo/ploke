const { Suite } = require('benchmark');
const suite = new Suite();

function racemark_single_thread(cb1: Function, cb2: Function) {
    suite
        .add(`${cb1.name}`, function () {
            cb1();
        })
        .add(`${cb2.name}`, function () {
            cb2();
        })
        .on('cycle', function (e: any) {
            console.log(String(e.target));
        })
        .on('complete', function (this: any) {
            console.log(
                'The fasted method is ' + this.filter('fastest').map('name')
            );
        })
        .run({ async: true });
}

const code = `<template>
<div :class="$style.container">
    <h1 :class="$style.name">{{ msg }}</h1>
</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const msg = ref<numberic>('Language');
</script>

<style lang="scss" module>
.container {
.name {
    color: red;
}
}

:global(.container) {
color: green;
}
</style>

<style scoped>
.container {
height: auto;
}
</style>`;
const regStyleModule = /<\s*style.+module(\s|.)*>(\s|.)*<\s*\/style\s*>/g;

console.log(code.split(/^(<style.+module>)|(<\/style>)$/));


function whiteSpace() {
    const arr = code.split(/(<style.+module>)|(<\/style>)/)[0];
}

racemark_single_thread(
    () => {
        code.replace(regStyleModule, '');
    },
    () => {
        whiteSpace();
    }
);


// export default {
//     racemark_single_thread
// }
