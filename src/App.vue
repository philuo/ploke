<template>
    <editor :value="markdownText" />
</template>

<script lang="ts" setup>
import Editor from '@/components/editor/Editor.vue';
import markdownText from '~/README.md';
</script>
