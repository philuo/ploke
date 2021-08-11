import { Plugin } from 'vite';
import Plog, { tokenify } from './plog';
const plog = Plog();

interface PluginOptions {
    /**
     * 是否服务器端渲染
     * true 返回html字符串
     * false 返回markdown字符串
     */
    ssr: boolean;

    /**
     * DOM容器类名
     * 默认 plog-md
     */
    blockName?: string;
}

export default (options: PluginOptions): Plugin =>
    ({
        // name of vite-plugin
        name: 'vite-plugin-markdown-imported',

        // state of process
        enforce: 'pre',

        // life cycle
        async transform(code: string, id: string) {
            if (!id.endsWith('.md')) {
                return null;
            }

            /// TEST \\\\\\\\\\\\\\\\\\\\\\\\\
            // console.time('TEST tokenify');
            // for(let i = 0; i < 1000; ++i) {
            //     tokenify(code);
            // }
            // console.timeEnd('TEST tokenify');
            /// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

            const token = tokenify(code);
            let html = '';

            if (options.ssr) {
                html = JSON.stringify(plog.render(token));
            }

            return `
                export const token = ${JSON.stringify(token)};
                export default ${html || JSON.stringify(code)};
            `;
        }
    } as Plugin);
