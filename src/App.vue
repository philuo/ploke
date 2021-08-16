<template>
    <Plog :class="$style.container" :token="t"/>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { token } from '~/README.md';
const t = ref(token);
computed(() => {
    if (token) {
        t.value = token;
    }
});
</script>

<style lang="scss" module>
.container {
    margin: .1rem .1rem 0;
}
</style>