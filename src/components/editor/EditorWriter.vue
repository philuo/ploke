<template>
    <div ref="monacoRef" class="editor monaco" @keydown="handleKeyDown" />
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { taskQueue } from '@/utils/index';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';
import 'monaco-editor/esm/vs/editor/contrib/find/findController';
import 'monaco-editor/esm/vs/editor/contrib/folding/folding';
import 'monaco-editor/esm/vs/editor/contrib/multicursor/multicursor';
import 'monaco-editor/esm/vs/editor/contrib/linesOperations/linesOperations';

const task = taskQueue()
const props = defineProps({
    value: {
        type: String,
        default: ''
    }
});
const emitter = defineEmits(['change']);
const monacoRef = ref<null | HTMLElement>(null);
let monaco: editor.IStandaloneCodeEditor;
onMounted(() => {
    monaco = editor.create((monacoRef.value as HTMLElement), {
        value: props.value,
        language: 'markdown',
        readOnly: false,
        lineNumbers: 'on',
        multiCursorPaste: 'full',
        scrollbar: {
            horizontalScrollbarSize: 0,
            horizontalSliderSize: 0,
            verticalScrollbarSize: 0,
            verticalSliderSize: 0,
        },
        minimap: {
            enabled: false,
        },
        fontSize: 14,
        lineDecorationsWidth: 0,
        renderLineHighlight: 'line',
        lineHeight: 1.5,
        folding: true,
    });
    monaco.onDidChangeModelContent(() => {
        task.set('changeMonacoContent', () => emitter('change', monaco.getValue()));
    });
});
onUnmounted(() => {
    monaco && monaco.dispose();
});
</script>

<style lang="scss">

</style>


import { ref, onMounted } from 'vue';
import { tokenify, PlogToken } from '@/plugins/poke/plog';
import { taskQueue, editorKeyControl } from '@/utils/index';
import markdown, { token as token2 } from '../README.md';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';

onMounted(() => {
    const monaco = editor.create((monacoRef.value as HTMLElement), {
        value: markdown,
        language: 'markdown',
        readOnly: false,
        lineNumbers: 'on',
        multiCursorPaste: 'full',
        scrollbar: {
            horizontalScrollbarSize: 0,
            horizontalSliderSize: 0,
            verticalScrollbarSize: 0,
            verticalSliderSize: 0,
        },
        minimap: {
            enabled: false,
        },
        fontSize: 14,
        lineDecorationsWidth: 0,
        renderLineHighlight: 'line',
        lineHeight: 1.5,
        folding: true,
    });
    monaco.onDidChangeModelContent(() => {
        task.set('changeMonacoContent', () => token.value = tokenify(monaco.getValue()));
    });
});
const monacoRef = ref<HTMLElement | null>(null);
const task = taskQueue();
const token = ref<PlogToken[]>(token2 as []);
const handleKeyDown = (event: KeyboardEvent) => {
    editorKeyControl(event);
};