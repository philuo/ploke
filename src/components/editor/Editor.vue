<template>
    <div class="editor-container">
        <editor-preview :value="markdown" hotmode />
        <editor-writer :value="markdown" @change="handleChange" />
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import editorPreview from './EditorPreview.vue';
import editorWriter from './EditorWriter.vue';
import markdownText from '~/README.md';

const markdown = ref<string>(markdownText);
const handleChange = (value: string) => {
    markdown.value = value;
};
</script>

<style lang="scss">
@import '@styles/editor';
</style>
