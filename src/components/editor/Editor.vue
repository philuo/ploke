<template>
    <div class="editor-container">
        <editor-preview :value="markdown" hotmode/>
        <editor-writer :value="markdown" @change="handleChange"/>
    </div>
</template>

<script lang="ts">


import { ref } from 'vue';
import EditorPreview from './EditorPreview.vue';
import EditorWriter from './EditorWriter.vue';
import markdownText from '~/README.md';

const markdown = ref<string>(markdownText);
const handleChange = (value: string) => {
    markdown.value = value;
};
</script>

<style lang="scss">
@import '@styles/editor';
.monaco {
    .monaco {
        width: 90%;
        height: 300px;
        margin: 20px auto;
        padding: 10px 0;
        box-sizing: border-box;
        border-radius: 12px;
        box-shadow: 0 0 8px #eee;
        overflow: hidden;

        .view-line {
            width: calc(100% - 16px);
        }

        .monaco-editor {
            .scroll-decoration {
                box-shadow: none;
            }
        }
    }
}
</style>