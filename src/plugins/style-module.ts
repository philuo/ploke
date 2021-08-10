import { Plugin } from 'vite';
import { computed, getCurrentInstance } from 'vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

/**
 * id信号
 */
interface IdSignal {
    /**
     * 是否vue源文件
     */
    isVueSource: boolean;

    /**
     * 是否vue中的markdown内容
     */
    isMarkdownSource: boolean;

    /**
     * 是否vue中的i18n内容
     */
    isI18nSource: boolean;
}

/**
 * useMarkdown
 */
interface MarkdownValue {
    /**
     * 代码块内容
     */
    codeList: {
        code: string;
        language: string;
    }[];

    /**
     * 除去代码块的内容
     */
    markdown: string;

    /**
     * 原始markdown内容
     */
    originMarkdown: string;
}

/**
 * 配置MarkdownIt
 */
const md = new MarkdownIt({
    highlight(code: string, language: string) {
        if (hljs.getLanguage(language)) {
            const str = hljs.highlight(code, { language }).value;
        }
        // 代码块内容两端除空白 & 加上语言标识
        return `$__lang__${language || 'html'}\n${code.trim()}`;
    }
});

/**
 * @function 获取MarkdownIt生成的DOM字符串
 * @returns MarkdownValue
 */
export function useMarkdown(): MarkdownValue {
    const ins: any = getCurrentInstance();
    const codeList: MarkdownValue['codeList'] = [];
    let markdown = '';
    let originMarkdown = '';

    if (ins && ins.type && ins.type.markdown) {
        originMarkdown = ins.type.markdown;
        markdown = originMarkdown.replace(
            /<pre><code\s*.*?>(.|\s)*?(<\/code><\/pre>)+?/g,
            (codeChunk: string) => {
                const codeWithPrefix = codeChunk.replace(
                    /<pre><code\s*.*>|<\/code><\/pre>/g,
                    ''
                );
                let language = '';
                const code = codeWithPrefix.replace(
                    /\$__lang__(.+)\s+/,
                    (match: string, lang: string) => ((language = lang), '')
                );
                codeList.push({ code, language });
                return '<div class="monaco"></div>';
            }
        );
    }

    return computed(() => ({
        codeList,
        markdown,
        originMarkdown
    })).value;
}

/**
 * @function 获取资源信号
 * @param id 资源请求链接
 * @returns IdSignal
 */
function getIdSignal(id: string): IdSignal {
    const signals: IdSignal = {
        isVueSource: false,
        isMarkdownSource: false,
        isI18nSource: false
    };

    if (id.endsWith('.vue')) {
        signals.isVueSource = true;
        return signals;
    }

    if (id.endsWith('.md') || id.endsWith('lang.markdown')) {
        signals.isMarkdownSource = true;
        return signals;
    }

    if (/lang\.i18n/.test(id)) {
        signals.isI18nSource = true;
        return signals;
    }

    return signals;
}

export default {

    // name of vite-plugin
    name: 'vite-plugin-style-module',

    // state of process
    enforce: 'pre',

    // life cycle
    async transform(code: string, id: string) {
        if (id.endsWith('.vue')) {
        }

        if (id.endsWith('.md')) {
            return `const str=\`${code}\`;export default str;`;
        }

        if (id.endsWith('lang.markdown')) {
            const matchArray = id.match(/index=(\d+)/);
            let index = '0';
            if (matchArray) {
                index = matchArray[1];
            }

            return `export default ins => { 
                const oriSetup = ins.setup;
                ins.setup = (props, ctx) => {
                    return Object.assign(oriSetup(props, ctx), {
                        md${index}: \`${code}\`
                    })
                }
            }`;
        }
    }
} as Plugin;
