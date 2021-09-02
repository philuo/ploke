<template>
    <div
        ref="monacoRef"
        class="editor monaco"
        @keydown="editorKeyControl"
        @paste="handlePaste"
        @drop.stop.prevent="handleDrop"
        @dragover.prevent
    />
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import {
    taskQueue,
    editorKeyControl,
    Request,
    md5,
    compressImg
} from '@/utils/index';
import * as qiniu from 'qiniu-js';
import { editor, Selection } from 'monaco-editor/esm/vs/editor/editor.api';
import 'monaco-editor/esm/vs/editor/contrib/find/findController';
import 'monaco-editor/esm/vs/editor/contrib/folding/folding';
import 'monaco-editor/esm/vs/editor/contrib/multicursor/multicursor';
import 'monaco-editor/esm/vs/editor/contrib/linesOperations/linesOperations';

const task = taskQueue();
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
    monaco = editor.create(monacoRef.value as HTMLElement, {
        value: props.value,
        language: props.language,
        readOnly: props.readOnly,
        lineNumbers: props.lineNumbers ? 'on' : 'off',
        multiCursorPaste: 'full',
        scrollbar: {
            horizontalScrollbarSize: props.scrollbar.horizontal ? 10 : 0,
            horizontalSliderSize: props.scrollbar.horizontal ? 10 : 0,
            verticalScrollbarSize: props.scrollbar.vertical ? 10 : 0,
            verticalSliderSize: props.scrollbar.vertical ? 10 : 0
        },
        minimap: {
            enabled: props.minimap
        },
        fontSize: props.fontSize,
        lineDecorationsWidth: 0,
        renderLineHighlight: 'line',
        lineHeight: 1.5,
        folding: true,
        automaticLayout: true
    });
    monaco.onDidChangeModelContent(() => {
        task.set('changeMonacoContent', () =>
            emitter('change', monaco.getValue())
        );
    });
});
onUnmounted(() => {
    monaco && monaco.dispose();
});

const handleDrop = async (event: DragEvent) => {
    const file = (event.dataTransfer as DataTransfer).files[0];
    const fileStr = await file.text();
    const fileProperval = md5(fileStr.substr(0, 1024) + fileStr.substr(-1024));
    if (!localStorage.getItem(fileProperval)) {
        const { token } = await Request.get('http://172.24.244.174:8080/getToken');
        const imageBolb = await compressImg(file, { q: 0.75 });
        const observable = qiniu.upload(imageBolb, fileProperval, token);
        observable.subscribe({
            complete() {
                changeEditor(fileProperval);
                localStorage.setItem(fileProperval, fileProperval);
            }
        });
    } else {
        changeEditor(fileProperval);
    }
};

const changeEditor = (insertStr: string) => {
    if (monaco) {
        const selections = monaco.getSelections() as Selection[];
        monaco.executeEdits(
            '',
            selections.map(
                ({
                    startLineNumber,
                    startColumn,
                    endLineNumber,
                    endColumn
                }) => {
                    return {
                        range: {
                            startLineNumber,
                            startColumn,
                            endLineNumber,
                            endColumn
                        },
                        text: `![](${insertStr})`,
                        forceMoveMarkers: true
                    };
                }
            )
        );
    }
};

const handlePaste = async (event: ClipboardEvent) => {
    const board = event.clipboardData;

    if (board && board.items[0]) {
        const boardData = board.items[0];
        if (boardData.type.startsWith('image')) {
            const file = boardData.getAsFile() as File;
            const fileStr = await file.text();
            const fileProperval = md5(
                fileStr.substr(0, 1024) + fileStr.substr(-1024)
            );
            if (!localStorage.getItem(fileProperval)) {
                const { token } = await Request.get(
                    'http://172.24.244.174:8080/getToken'
                );
                const imageBolb = await compressImg(file, { q: 0.75 });
                const observable = qiniu.upload(
                    imageBolb,
                    fileProperval,
                    token
                );
                observable.subscribe({
                    complete() {
                        changeEditor(fileProperval);
                        localStorage.setItem(fileProperval, fileProperval);
                    }
                });
            } else {
                changeEditor(fileProperval);
            }
        }
    }
};
</script>

<style lang="scss">
.monaco {
    padding: 0.15rem 0;
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
            box-shadow: 0 0 0.12rem #eee;
            border-radius: 0.04rem;

            .monaco-sash {
                display: none;
            }
        }
    }
}
</style>
