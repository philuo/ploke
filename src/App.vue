<template>
    <div class="editor-container">
        <div class="preview">
            <Plog :class="$style.container" :token="markdown" hotmode />
        </div>
        <div ref="monacoRef" class="editor monaco" @keydown="editorKeyControl" />
    </div>
</template>

<script lang="ts" setup>
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';
import 'monaco-editor/esm/vs/editor/contrib/find/findController';
import 'monaco-editor/esm/vs/editor/contrib/folding/folding';
import 'monaco-editor/esm/vs/editor/contrib/multicursor/multicursor';
import 'monaco-editor/esm/vs/editor/contrib/linesOperations/linesOperations';

import { ref, onMounted, onUnmounted } from 'vue';
import { taskQueue, editorKeyControl } from '@/utils/index';
import markdown from '../README.md';

const monacoRef = ref<HTMLElement | null>(null);
const task = taskQueue();
const token = ref<string>(markdown);

let monaco: editor.IStandaloneCodeEditor;
onMounted(() => {
    monaco = editor.create((monacoRef.value as HTMLElement), {
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
        task.set('changeMonacoContent', () => token.value = monaco.getValue());
    });
});
onUnmounted(() => {
    monaco && monaco.dispose();
});
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
