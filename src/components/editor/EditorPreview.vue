<template>
    <div class="preview">
        <Plog :class="$style.container" :token="value" :hotmode="hotmode" />
    </div>
</template>

<script lang="ts" setup>
import Plog from '@/components/common/Plog';

defineProps({
    hotmode: {
        type: Boolean,
        default: false
    },
    value: {
        type: String,
        default: ''
    }
});
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
