<template>
    <div class="editor-container">
        <div class="preview">
            <Plog :class="$style.container" :token="token" />
        </div>
        <textarea class="editor" @input="handleInput" @keydown="handleKeydown"/>
        <!-- <div  tabindex="1" @input="handleInput" /> -->
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { tokenify, PlogToken } from '@/plugins/poke/plog';
// import { token } from '~/README.md';
// const t = ref(token);
// computed(() => {
//     if (token) {
//         t.value = token;
//     }
// })
const token = ref<PlogToken[]>([]);
const handleInput = ({ target: { value } }: any) => {
    token.value = tokenify(value);
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
