<template>
    <div v-html="text0"></div>
</template>

<script lang="ts" setup>
import text, { markdown } from '@/test.md';
import { ref } from 'vue';
const text0 = ref(text);
console.log(markdown)
</script>