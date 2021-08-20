<template>
    <div ref="monacoRef" class="editor monaco" @keydown="editorKeyControl" />
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { taskQueue, editorKeyControl } from '@/utils/index';
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
