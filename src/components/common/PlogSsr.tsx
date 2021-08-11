/**
 * revert token to vNode
 * server-side render
 * @author Perfumere<1061393710@qq.com>
 * @date 2021-08-11
 */
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'PlogSsr',
    props: { markdown: String } as const,
    setup(props) {
        return () => (
            <article class="plog-article" innerHTML={props.markdown} />
        );
    }
});
