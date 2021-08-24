<template>
    <transition>
        <div :class="$style['err-area']">
            <img :src="iconMap[type]" @dragstart.prevent />
            {{ text || txtMap[type] }}
        </div>
    </transition>
</template>

<script lang="ts" setup>
import errImage from '@/assets/icons/error-image.svg';
import errFile from '@/assets/icons/error-file.svg';

defineProps({
    /**
     * image | file | doc | video | audio
     */
    type: {
        type: String,
        default: 'image'
    },

    /**
     * 错误描述
     */
    text: {
        type: String,
        default: ''
    }
});

const iconMap: strKeyObject = {
    image: errImage,
    file: errFile
};
const txtMap: strKeyObject = {
    image: '图片失效'
};
</script>

<style lang="scss" module>
.err-area {
    height: inherit;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    color: #97a0af;

    img {
        flex-shrink: 0;
        height: .64rem;
    }
}
</style>
