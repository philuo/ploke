<template>
    <Plog :class="$style.container" :token="t"/>
    <!-- <PlogSsr :markdown="markdown"/> -->
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { token } from '~/README.md';
const t = ref(token);
computed(() => {
    if (token) {
        console.log(123)
        t.value = token;
    }
});
console.log(token)
</script>

<style lang="scss" module>
.container {
    margin: .1rem .1rem 0;
}
</style>