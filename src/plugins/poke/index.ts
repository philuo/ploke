import { Plugin } from 'vite';
import { tokenify } from './plog';
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
            console.time('100 times tokenify');
            // for(let i = 0; i < 100; ++i) {
                tokenify(code);
            // }
            console.timeEnd('100 times tokenify');
            // console.log('token.length', JSON.stringify(tokenify(code)).length);
            // console.log('poke.length', JSON.stringify(code).length);
            console.log(
                'Ratio: token / poke',
                JSON.stringify(tokenify(code)).length /
                    JSON.stringify(code).length
            );

            let token = '[]';
            if (options.ssr) {
                token = JSON.stringify(tokenify(code));
            }

            return `
                export const token = ${token};
                export default ${JSON.stringify(code)};
            `;
        }
    } as Plugin);
