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
    },
    minimap: {
        type: Boolean,
        default: false
    },
    fontSize: {
        type: Number,
        default: 14
    },
    readOnly: {
        type: Boolean,
        default: false
    },
    lineNumbers: {
        type: Boolean,
        default: true
    },
    language: {
        type: String,
        default: 'markdown'
    },
    scrollbar: {
        type: Object,
        default: {
            horizontal: false,
            vertical: false
        }
    }
});
const emitter = defineEmits(['change']);
const monacoRef = ref<null | HTMLElement>(null);
let monaco: editor.IStandaloneCodeEditor;
onMounted(() => {
    monaco = editor.create((monacoRef.value as HTMLElement), {
        value: props.value,
        language: props.language,
        readOnly: props.readOnly,
        lineNumbers: props.lineNumbers ? 'on' : 'off',
        multiCursorPaste: 'full',
        scrollbar: {
            horizontalScrollbarSize: props.scrollbar.horizontal ? 10 :0,
            horizontalSliderSize: props.scrollbar.horizontal ? 10 : 0,
            verticalScrollbarSize: props.scrollbar.vertical ? 10 :0,
            verticalSliderSize: props.scrollbar.vertical ? 10 :0
        },
        minimap: {
            enabled: props.minimap,
        },
        fontSize: props.fontSize,
        lineDecorationsWidth: 0,
        renderLineHighlight: 'line',
        lineHeight: 1.5,
        folding: true,
        automaticLayout: true,

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
    padding: .15rem 0;
    box-sizing: border-box;

    .view-line {
        width: calc(100% - 16px);
    }

    .monaco-editor {

        .scroll-decoration {
            box-shadow: none;
        }

        .margin-view-overlays {
            user-select: none;
        }

        .find-widget {
            box-shadow: 0 0 .12rem #eee;
            border-radius: .04rem;

            .monaco-sash {
                display: none;
            }
        }
    }
}
</style>
