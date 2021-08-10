import { Plugin } from 'vite';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

// TEST
import _markdown from './plog';
const _test = _markdown({
    codeblockParser(code: string, language: string) {
        if (hljs.getLanguage(language)) {
            hljs.configure({ classPrefix: '' });
            return hljs.highlight(code, {
                language,
                ignoreIllegals: true
            }).value;
        }
        return `<pre><code>${code}</code></pre>`;
    }
});
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

/**
 * 配置MarkdownIt
 */
const md = new MarkdownIt({
    highlight(code: string, language: string) {
        if (hljs.getLanguage(language)) {
            hljs.configure({ classPrefix: '' });
            return hljs.highlight(code, {
                language,
                ignoreIllegals: true
            }).value;
        }
    }
});

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
            console.time('TEST');
            console.log(_test.render(code));
            console.timeEnd('TEST');
            const markdown = JSON.stringify(code);
            let html = '';

            if (options.ssr) {
                html = JSON.stringify(
                    '<article class="' +
                        (options.blockName || 'plog-md') +
                        '">' +
                        _test.render(code) +
                        '</article>'
                );
            }

            return `
                export const markdown = ${markdown};
                export default ${html || markdown};
            `;
        }
    } as Plugin);
