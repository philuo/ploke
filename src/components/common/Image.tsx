import { ref, defineComponent, onBeforeUpdate } from 'vue';
import { lazyImageObserver } from '@/utils/lazy';
import errorImage from '@/assets/icons/error.svg';

interface Props {
    src: string;
    alt: string;
}

export default defineComponent({
    name: 'plog-image',
    props: {
        /**
         * 图片链接
         */
        src: {
            type: String,
            default: ''
        },
        alt: {
            type: String,
            default: '图片'
        }
    } as const,
    setup(props: Props) {
        const noError = ref(true);
        let oldVal = props.src;
        onBeforeUpdate(() => {
            if (props.src !== oldVal) {
                noError.value = true;
            }
        });

        return () => {
            oldVal = props.src;
            const normalElement = (
                <img
                    {...props}
                    class="plog-image"
                    onError={() => noError.value = false}
                    onLoad={() => noError.value = true}
                    onDragstart={(e) => e.preventDefault()}
                />
            );
            const errorElement = (
                <img
                    src={errorImage}
                    alt={props.alt}
                    class="err-image"
                    onDragstart={(e) => e.preventDefault()}
                />
            );

            return noError.value ? normalElement : errorElement;
        };
    }
});
