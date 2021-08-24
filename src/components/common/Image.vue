<template>
    <img
        v-if="!lazy && noError"
        :src="src || defaultSrc"
        :alt="alt"
        class="plog-image"
        @error="handleError"
        @load="handleLoad"
        @dragstart="handleDragStart"
    />
    <img
        ref="img"
        v-else-if="noError"
        :data-src="src"
        :alt="alt"
        class="plog-image"
        :style="{
            objectFit: objectFit
        }"
        @error="handleError"
        @load="handleLoad"
        @dragstart="handleDragStart"
    />
    <LoadError v-else />
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, PropType } from 'vue';
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
    dragable: {
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
const handleDragStart = (event: Event) => {
    if (!props.dragable) {
        event.preventDefault();
    }
    emitter('error', event);
};

// data
const img = ref<Element | null>(null);
const noError = ref<boolean>(true);
let observer: IntersectionObserver;

// hooks
watch(
    () => props.src,
    () => {
        if (img.value && props.lazy) {
            const rect = img.value.getBoundingClientRect();
            if (
                (rect.top >= 0 || rect.bottom >= 0) &&
                rect.top < window.screen.availHeight
            ) {
                (img.value as HTMLImageElement).src = props.src;
            }
        }
        noError.value = true;
    }
);

// life cycle
onMounted(() => {
    if (img.value && props.lazy) {
        lazyImageObserver.observe(img.value);
    }
});
</script>

<style lang="scss">
.plog-image {
    width: 100%;
    height: 100%;
}
</style>
