<template>
    <Image :src="src" />
    <!-- <Editor :value="markdownText" /> -->
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Image from '@/components/common/Image';
import Editor from '@/components/editor/Editor.vue';
import markdownText from '~/README.md';

const src = ref<string>('https://img1.baidu.com/it/u=2579940132,1296036844&fm=11&fmt=auto');
setTimeout(() => src.value = 'err', 500);
setTimeout(() => src.value = 'https://img1.baidu.com/it/u=2579940132,1296036844&fm=11&fmt=auto', 1000)
</script>
