<template>
    <Editor :value="markdown"/>
</template>

<script lang="ts" setup>
import markdown from '../README.md';
import Editor from '@/components/editor/Editor.vue';
</script>
