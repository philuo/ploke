import { defineComponent, PropType, onUpdated } from 'vue';
import { lazyImageObserver } from '@/utils/lazy';

interface Props {
    src?: string;
    alt?: string;
}

export default defineComponent({
    name: 'plog-image',
    props: {

        /**
         * 图片链接
         */
        src: {
            type: String as PropType<string>,
            default: '',
        },

        /**
         * 图片描述
         */
        alt: {
            type: String,
            default: '',
        },
    } as const,
    setup(props: Props) {

        // methods
        const loadError = (event: Event) => {
            console.log(event.target);
        };

        // datas
        const dataProps: Props = {};
        if (props.src) {
            dataProps.src = props.src;
        }
        if (props.alt) {
            dataProps.alt = props.alt;
        }

        // elements
        onUpdated(() => {
            console.log(props)
        });
        return () => {

            // datas
            const dataProps: Props = {};
            if (props.src) {
                dataProps.src = props.src;
            }
            if (props.alt) {
                dataProps.alt = props.alt;
            }

            // elements
            let test = <img src={props.src}/>;

            return (
                test
            )
        };
    },
});
