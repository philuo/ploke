/**
 * revert token to vNode
 * client-side render
 * @author Perfumere<1061393710@qq.com>
 * @date 2021-08-11
 */
import {
    defineComponent,
    PropType,
    onMounted,
    onUnmounted,
    onUpdated,
} from 'vue';
import {
    TOKEN_TAG,
    PlogToken,
    parser_t,
    hljs,
    tokenify,
} from '@/plugins/poke/plog';
import { lazyImageObserver } from '@/utils/lazy';

const textParser = (token: PlogToken) => {
    if (!token) {
        return null;
    }

    return <p class="plog-text" innerHTML={token.val} />;
};

const codeblockParser = (token: PlogToken) => {
    if (hljs.getLanguage(token.lang as string)) {
        return (
            <pre class={`lang-${token.lang}`} lang={token.lang}>
                <code
                    innerHTML={
                        hljs.highlight(token.val, {
                            language: token.lang as string,
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
            <code>{token.val}</code>
        </pre>
    );
};

const tableParser = (token: PlogToken) => {
    const content = token.val.split('\n');
    const headCol = content[0]
        .replace(/\\\|/g, '&verticle_stroke;')
        .split('|')
        .slice(1, -1);
    let colNum = headCol.length;
    const alignArr = (token.lang as string).split(',') as (
        | 'center'
        | 'right'
        | 'left'
    )[];
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
                                        <span innerHTML={parser_t(el)}></span>
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
                                                .map((text, idx, arr) => (
                                                    <>
                                                        <span
                                                            innerHTML={parser_t(
                                                                text
                                                            )}
                                                        ></span>
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
                    <td
                        class="head"
                        innerHTML={parser_t(token.lang || '导读')}
                    />
                    <td class="body" innerHTML={parser_t(token.val || '')} />
                </tr>
            </tbody>
        </table>
    );
};
const titleParser = (token: PlogToken) => {
    return <h1 innerHTML={parser_t(token.val)} />;
};
const subtitleParser = (token: PlogToken) => {
    return <h2 innerHTML={parser_t(token.val)} />;
};
const dividerParser = (token: PlogToken) => {
    return <hr class="divider" />;
};
const refParser = (token: PlogToken) => {
    const children = (token.sub as PlogToken[]).map((item) => (
        <pre class={item.tag === TOKEN_TAG.REF && 'plog-sub-refblock'}>
            <code class="ref-code" innerHTML={parser_t(item.val)} />
        </pre>
    ));

    return (
        <div class="plog-refblock">
            {token.val && (
                <pre class="ref-text">
                    <code class="ref-code" innerHTML={parser_t(token.val)} />
                </pre>
            )}
            {children}
        </div>
    );
};
const imgParser = (token: PlogToken) => {
    return (
        <p class="plog-imgblock">
            <img data-src={token.val} class="plog-img" />
        </p>
    );
};
const olParser = (token: PlogToken) => {
    const list = token.val.split('\n');
    return (
        <ol class="plog-ol">
            {list.map((item) => (
                <li innerHTML={parser_t(item)} />
            ))}
        </ol>
    );
};
const ulParser = (token: PlogToken) => {
    const list = token.val.split('\n');
    return (
        <ul class="plog-ul">
            {list.map((item) => (
                <li innerHTML={parser_t(item)} />
            ))}
        </ul>
    );
};
const checkboxParser = (token: PlogToken) => {
    return (
        <div class="plog-checkbox">
            <div
                class={[
                    'checkbox',
                    !['x', 'X'].includes(token.lang as string)
                        ? 'no-checked'
                        : '',
                ]}
            >
                <div class="icon">
                    <svg viewBox="0 0 64 64" class="check-icon">
                        <path d="M50.42,16.76L22.34,39.45l-8.1-11.46c-1.12-1.58-3.3-1.96-4.88-0.84c-1.58,1.12-1.95,3.3-0.84,4.88l10.26,14.51  c0.56,0.79,1.42,1.31,2.38,1.45c0.16,0.02,0.32,0.03,0.48,0.03c0.8,0,1.57-0.27,2.2-0.78l30.99-25.03c1.5-1.21,1.74-3.42,0.52-4.92  C54.13,15.78,51.93,15.55,50.42,16.76z"></path>
                    </svg>
                </div>
                <span class="desc" innerHTML={parser_t(token.val)} />
            </div>
        </div>
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
    [TOKEN_TAG.IMG as number]: imgParser,
    [TOKEN_TAG.OL as number]: olParser,
    [TOKEN_TAG.UL as number]: ulParser,
    [TOKEN_TAG.CHECKBOX as number]: checkboxParser,
};

const render = (tokenList: string | PlogToken[]) => {
    return tokenify(tokenList).map((token) => parser[token.tag](token));
};

export default defineComponent({
    name: 'Plog',
    props: {
        token: {
            type: [String, Array] as PropType<string | PlogToken[]>,
            default: [],
        },
        hotmode: {
            type: Boolean,
            default: false,
        },
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
        onUpdated(() => {
            if (props.hotmode) {
                Array.from(
                    document.querySelectorAll('.plog-article img')
                ).forEach((item) => lazyImageObserver.observe(item));
            }
        });
        return () => (
            <article class="plog-article">{render(props.token)}</article>
        );
    },
});
