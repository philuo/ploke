<template>
    <div class="editor-container">
        <EditorPreview :value="markdown" hotmode />
        <EditorWriter :value="markdown" @change="handleChange" />
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import EditorPreview from './EditorPreview.vue';
import EditorWriter from './EditorWriter.vue';

const props = defineProps({
    value: {
        type: String,
        default: ''
    }
});

const markdown = ref<string>(props.value);
const handleChange = (value: string) => {
    markdown.value = value;
};
</script>

<style lang="scss">
@import '@styles/editor';
</style>
