<template>
    <div >
        <Image :src="src" @error="handleError" @load="handleLoad" :lazy="true" />
    </div>
    <div style="height: 1200px;"></div>
    <!-- <Editor :value="markdownText" /> -->
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Image from '@/components/common/Image.vue';
import Editor from '@/components/editor/Editor.vue';
import markdownText from '~/README.md';

function handleError(event: Event) {
    console.log(event.target);
}

function handleLoad(event: Event) {
    console.log(event.target)
}
const src = ref<string>(
    'https://img1.baidu.com/it/u=2579940132,1296036844&fm=11&fmt=auto'
);

setTimeout(() => (src.value = 'err'), 1000);
</script>
