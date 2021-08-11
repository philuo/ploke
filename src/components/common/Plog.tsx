/**
 * revert token to vNode
 * client-side render
 * @author Perfumere<1061393710@qq.com>
 * @date 2021-08-11
 */
import { defineComponent, PropType, onMounted, onUnmounted } from 'vue';
import {
    TOKEN_TAG,
    TEXT_TAG,
    PlogToken
} from '@/plugins/poke/plog';
import { lazyImageObserver } from '@/utils/lazy';
import hljs from 'highlight.js';

hljs.configure({
    classPrefix: ''
});

/**
 * 
 * 
    link: (str: string) => /^\[[\s\S]*\]\([\s\S]*\)$/.test(str),
    linkblockStart: (str: string) => /^\[[\s\S]*\]\([^\)]*$/.test(str),
    linkblockEnd: (str: string) => /^[\s\S]*\)[\s\S]*$/.test(str)
 * 
 */

// TEXT PARSER
const textParser = (token: string | PlogToken) => {
    if (!token) {
        return null;
    }

    if (typeof token === 'string') {
        return <>{token}</>;
    }

    return <>{token.value}</>;
};

function linkParser() {}
function boldParser() {}
function colorParser() {}
function bgParser() {}
function italicParser() {}
function underlineParser() {}
function deletelineParser() {}
function inlinecodeParser() {}
// BLOCK PARSER
const codeblockParser = (token: PlogToken) => {
    if (hljs.getLanguage(token.lang as string)) {
        return (
            <pre class={`lang-${token.lang}`} lang={token.lang}>
                <code
                    innerHTML={
                        hljs.highlight(token.value, {
                            language: token.lang as string
                        }).value
                    }
                />
            </pre>
        );
    }

    return (
        <pre
            class={(token.lang as string).trim() && `lang-${token.lang}`}
            lang={token.lang}
        >
            <code>{token.value}</code>
        </pre> 
    );
};
const tableParser = (token: PlogToken) => {
    const content = token.value.split('\n');
    const headCol = content[0]
        .replace(/\\\|/g, '&verticle_stroke;')
        .split('|')
        .slice(1, -1);
    let colNum = headCol.length;
    const alignArr = (token.lang as string).split(',') as ('center' | 'right' | 'left')[];
    let thead = null;
    let tbody = null;

    if (/\s*[^\|]+\s*/.test(content[0])) {
        thead = (
            <thead>
                <tr>
                    {headCol.map((item, index) => (
                        <th align={`${alignArr[index]}`}>
                            {item
                                .replace(/&verticle_stroke;/g, '|')
                                .split('\\n')
                                .map((el, ins, arr) => (
                                    <>
                                        {el}
                                        {arr[ins + 1] && <br />}
                                    </>
                                ))}
                        </th>
                    ))}
                </tr>
            </thead>
        );
    }

    if (content.length > 1) {
        tbody = (
            <tbody>
                {content.slice(1).map((item, index) => (
                    <tr>
                        {item
                            .replace(/\\\|/g, '&verticle_stroke;')
                            .split('|')
                            .slice(1, -1)
                            .map((el, ins) =>
                                ins < colNum ? (
                                    <td align={`${alignArr[ins]}`}>
                                        <code class="cell-code">
                                            {el
                                                .replace(
                                                    /&verticle_stroke;/g,
                                                    '|'
                                                )
                                                .split('\\n')
                                                .map((el, idx, arr) => (
                                                    <>
                                                        {el}
                                                        {arr[idx + 1] && <br />}
                                                    </>
                                                ))}
                                        </code>
                                    </td>
                                ) : null
                            )}
                    </tr>
                ))}
            </tbody>
        );
    }

    return (
        <table class="plog-table">
            {thead}
            {tbody}
        </table>
    );
};
const outlineParser = (token: PlogToken) => {
    return (
        <table class="plog-outline">
            <tbody>
                <tr>
                    <td class="head">{textParser(token.lang || '导读')}</td>
                    <td class="body">{textParser(token.value || '')}</td>
                </tr>
            </tbody>
        </table>
    );
};
const titleParser = (token: PlogToken) => {
    return <h1>{token.value.substring(2)}</h1>;
};
const subtitleParser = (token: PlogToken) => {
    return <h2>{token.value.substring(token.value.indexOf(' ') + 1)}</h2>;
};
const dividerParser = (token: PlogToken) => {
    return <div class="divider" />;
};
const refParser = (token: PlogToken) => {
    const children = (token.children as PlogToken[]).map((item) => (
        <pre class={item.tag === TOKEN_TAG.REF && 'plog-sub-refblock'}>
            <code class="ref-code">{item.value}</code>
        </pre>
    ));

    return (
        <div class="plog-refblock">
            {token.value && (
                <pre class="ref-text">
                    <code class="ref-code">{token.value}</code>
                </pre>
            )}
            {children}
        </div>
    );
};
const imgParser = (token: PlogToken) => {
    return (
        <p class="plog-imgblock">
            <img data-src={token.value} class="plog-img" />
        </p>
    );
};

const parser = {
    [TOKEN_TAG.CODE as number]: codeblockParser,
    [TOKEN_TAG.TABLE as number]: tableParser,
    [TOKEN_TAG.OUTLINE as number]: outlineParser,
    [TOKEN_TAG.TITLE as number]: titleParser,
    [TOKEN_TAG.SUBTITLE as number]: subtitleParser,
    [TOKEN_TAG.TEXT as number]: textParser,
    [TOKEN_TAG.REF as number]: refParser,
    [TOKEN_TAG.DIVIDER as number]: dividerParser,
    [TOKEN_TAG.IMG as number]: imgParser
};

const parser_t = {
    [TEXT_TAG.BOLD as number]: boldParser,
    [TEXT_TAG.COLOR as number]: colorParser,
    [TEXT_TAG.BG as number]: bgParser,
    [TEXT_TAG.ITALIC as number]: italicParser,
    [TEXT_TAG.UNDERLINE as number]: underlineParser,
    [TEXT_TAG.DELETELINE as number]: deletelineParser,
    [TEXT_TAG.INLINECODE as number]: inlinecodeParser,
    [TEXT_TAG.LINK as number]: linkParser,
};

const render = (tokenList: PlogToken[]) => {
    return tokenList.map((token) => parser[token.tag](token));
};

export default defineComponent({
    name: 'Plog',
    props: {
        token: {
            type: Array as PropType<PlogToken[]>,
            default: []
        }
    } as const,
    setup(props) {
        onMounted(() => {
            Array.from(document.querySelectorAll('.plog-article img')).forEach(
                (item) => lazyImageObserver.observe(item)
            );
        });
        onUnmounted(() => {
            lazyImageObserver.disconnect();
        });

        return () => (
            <article class="plog-article">{render(props.token)}</article>
        );
    }
});
