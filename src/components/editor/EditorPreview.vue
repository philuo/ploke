
<template>
    <Plog :class="$style.container" :token="value" hotmode />
</template>

<script lang="ts">
defineProps({
    hotmode: {
        type: Boolean,
        default: false
    },
    value: {
        type: String,
        default: ''
    }
})
</script>

<style lang="scss" module>
.container {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    padding: 0.1rem 0.15rem 0.2rem;
}
@media screen and (min-width: 540px) {
    .container {
        margin-top: 0.4rem;
        padding: 0.1rem 0.3rem 0.2rem;
    }
}
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