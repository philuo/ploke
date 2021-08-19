<template>
    <div class="editor-container">
        <div class="preview">
            <Plog :class="$style.container" :token="token" hotmode/>
        </div>
        <textarea
            class="editor"
            @input="handleInput"
            @keydown="handleKeyDown"
            autofocus
        />
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { tokenify, PlogToken } from '@/plugins/poke/plog';
import { taskQueue, editorKeyControl } from '@/utils/index';
import { token as token2 } from '../README.md';

const task = taskQueue();
const token = ref<PlogToken[]>(token2 as []);
const handleInput = ({ target: { value } }: any) => {
    task.set('tokenify', () => (token.value = tokenify(value)));
};
const handleKeyDown = (event: KeyboardEvent) => {
    editorKeyControl(event, (value: string) => token.value = tokenify(value));
};
</script>

<style lang="scss">
@import '@styles/editor';
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
