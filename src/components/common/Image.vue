<template>
    <img
        v-if="!lazy && noError"
        :src="src || defaultSrc"
        :alt="alt"
        class="plog-image"
        :draggable="draggable"
        @error="handleError"
        @load="handleLoad"
    />
    <img
        ref="img"
        v-else-if="noError"
        :data-src="src"
        :alt="alt"
        class="plog-image"
        :draggable="draggable"
        :style="{
            objectFit: objectFit
        }"
        @error="handleError"
        @load="handleLoad"
    />
    <LoadError v-else />
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onUnmounted, PropType } from 'vue';
import LoadError from '@/components/common/LoadError.vue';
import { lazyImageObserver } from '@/utils/lazy';

// props & emiiter
const emitter = defineEmits(['load', 'error', 'dragstart']);
const props = defineProps({
    src: {
        type: String,
        default: ''
    },
    alt: String,
    defaultSrc: {
        type: String,
        default: ''
    },
    draggable: {
        type: Boolean,
        default: false
    },
    lazy: {
        type: Boolean,
        default: true
    },
    objectFit: {
        type: String as PropType<
            'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
        >,
        default: 'fill'
    }
});

// methods
const handleError = (event: Event) => {
    emitter('error', event);
    noError.value = false;
};
const handleLoad = (event: Event) => {
    emitter('load', event);
};

// data
const img = ref<Element | null>(null);
const noError = ref<boolean>(true);

// hooks
watch(
    () => props.src,
    () => (noError.value = true)
);

// life cycle
onMounted(() => {
    if (img.value && props.lazy) {
        lazyImageObserver.observe(img.value);
    }
});
onUnmounted(() => {
    if (img.value && props.lazy) {
        lazyImageObserver.unobserve(img.value);
    }
});
</script>

<style lang="scss">
.plog-image {
    width: 100%;
    height: 100%;
}
</style>
