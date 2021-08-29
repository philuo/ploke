<template>
    <div class="preview" @drop="handleDrag">
        <Plog :class="$style.container" :token="value" />
    </div>
</template>

<script lang="ts" setup>
import Plog from '@/components/common/Plog';

function handleDrag(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
    return false;
}
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
        padding: 0.1rem 0.3rem 0.2rem;
    }
}
</style>
