import highlight from 'highlight.js';

/**
 * 导出高亮方法
 */
export const hljs = highlight;

/**
 * Plog解析器配置参数
 * options of parser constructor.
 */
export interface PlogOptions {
    /**
     * 文本内容生成HTML
     */
    plaintextParser?: (chunk: string) => string;

    /**
     * 大纲内容生成HTML
     * revert content of plog to html string.
     */
    outlineParser?: (chunk: string, lang: string) => string;

    /**
     * 大纲内容生成HTML
     * revert content of plog to html string.
     */
    refblockParser?: (chunk: string, children: PlogToken['children']) => string;

    /**
     * 音频生成HTML
     * revert content of plog to html string.
     */
    audioParser?: (chunk: string, lang: string) => string;

    /**
     * 视频生成HTML
     * revert content of plog to html string.
     */
    videoParser?: (chunk: string, lang: string) => string;

    /**
     * 标题内容生成HTML
     * revert content of plog to html string.
     */
    titleParser?: (chunk: string) => string;

    /**
     * 子标题内容生成HTML
     * revert content of plog to html string.
     */
    subtitleParser?: (chunk: string) => string;

    /**
     * 代码块内容生成HTML
     * revert content of plog to html string.
     */
    codeblockParser?: (code: string, lang: string) => string;

    /**
     * 表格内容生成HTML
     */
    tableParser?: (chunk: string, lang: string) => string;

    /**
     * 图片内容生成HTML
     */
    imgParser?: (chunk: string) => string;

    /**
     * 链接内容生成HTML
     */
    linkParser?: (chunk: string) => string;

    /**
     * 链接内容生成HTML
     */
    dividerParser?: (chunk: string) => string;
}

/**
 * Plog解析器
 * parser of plog for rendering html string
 */
export interface PlogParser {
    /**
     * 渲染函数
     */
    render: (code: string | PlogToken[]) => string;

    /**
     * 更新解析器配置
     */
    config: (options: PlogOptions) => void;
}

/**
 * tokenify返回值类型
 */
export enum TOKEN_TAG {
    CODE,
    TABLE,
    OUTLINE,
    REF,
    TITLE,
    SUBTITLE,
    TEXT,
    DIVIDER,
    IMG,
    AUDIO,
    VEDIO
}

/**
 * TOKEN_TAG.TEXT 子类型
 */
export enum TEXT_TAG {
    BOLD,
    ITALIC,
    UNDERLINE,
    DELETELINE,
    INLINECODE,
    COLOR,
    BG,
    LINK
}

/**
 * Plog标记
 * mark of plog content
 */
export interface PlogToken {
    tag: TOKEN_TAG;
    value: string;
    lang?: string;
    children?: {
        tag: TOKEN_TAG | TEXT_TAG;
        value: string;
    }[];
}

const tokenRegMap = {
    lenient: {
        codeblockStart: (str: string) => /^\s*`{3}[^`]*/.test(str),
        codeblockEnd: (str: string) => /^`{3}\s*$/.test(str),
        outlineblockStart: (str: string) =>
            /^\s*#(\([\s\S]*\))?\[[^\]]*$/.test(str),
        outlineblockEnd: (str: string) => /^[\s\S]*\]\s*$/.test(str),
        tableblock: (str: string) => /^\s*\|([\s\S]*\|)+\s*$/.test(str),
        tableblockAlign: (str: string) =>
            /^\s*\|(\s*\:?-+\:?\s*\|)+\s*$/.test(str),
        outline: (str: string) =>
            /^\s*#(\([\s\S]*\))?\[[\s\S]*\]\s*$/.test(str),
        title: (str: string) => /^\s*#\s+/.test(str),
        subtitle: (str: string) => /^\s*#{2,}\s+/.test(str),
        divider: (str: string) =>
            /(^\s*\-{2,}\s*$)|(^\s*(\*{2,})\s*$)/.test(str),
        refblock: (str: string) => /^\s*>\s+.*\s*/.test(str),
        subrefblock: (str: string) => /^\s*>{2,}\s+.*\s*/.test(str),
        img: (str: string) => /^[^!]*!\[[\s\S]*\]\([\s\S]+\)/.test(str),
        imgblockStart: (str: string) => /^[^!]*!\[[\s\S]*\]\([^\)]*/.test(str),
        imgblockEnd: (str: string) => /^[\s\S]*\)[\s\S]*$/.test(str)

        // TODO
        // 有序列表
        // 无序列表
        // 图片块
    },
    strict: {
        codeblockStart: (str: string) => /^`{3}[^`]*/.test(str),
        codeblockEnd: (str: string) => /^`{3}\s*$/.test(str),
        outlineblockStart: (str: string) =>
            /^#(\([\s\S]*\))?\[[^\]]*$/.test(str),
        outlineblockEnd: (str: string) => /^[\s\S]*\]\s*$/.test(str),
        outline: (str: string) => /^#(\([\s\S]*\))?\[[\s\S]*\]$/.test(str),
        tableblock: (str: string) => /^\|([\s\S]*\|)+$/.test(str),
        tableblockAlign: (str: string) => /^\|(\s*\:?-+\:?\s*\|)+$/.test(str),
        title: (str: string) => /^#\s+/.test(str),
        subtitle: (str: string) => /^#{2,}\s+/.test(str),
        divider: (str: string) => /(^\-{2,}$)|(^(\*{2,})$)/.test(str),
        refblock: (str: string) => /^>\s+.*/.test(str),
        subrefblock: (str: string) => /^>{2,}\s+.*/.test(str),
        img: (str: string) => /^[^!]*!\[[\s\S]*\]\([\s\S]+\)/.test(str),
        imgblockStart: (str: string) => /^[^!]*!\[[\s\S]*\]\([^\)]*/.test(str),
        imgblockEnd: (str: string) => /^[\s\S]*\)[\s\S]*$/.test(str)

        // TODO
        // 有序列表
        // 无序列表
        // 图片块
    }
};

const textRegMap = {
    // bold(str) {
    // },
};

/**
 * 标题处理器
 * default parser of plaintext
 */
const _plaintextParser = (token: string) => {
    return '';
};

/**
 * 大纲内容处理器
 * default parser of outline
 */
const _outlineParser = (token: string) => {
    return '';
};

/**
 * 大纲内容处理器
 * default parser of outline
 */
const _refblockParser = (
    token: string,
    children: PlogToken['children'] = []
) => {
    let html = '<div class="plog-refblock">';
    if (token) {
        html += `<pre class="ref-text"><code>${token}</code></pre>`;
    }

    children.forEach((item) => {
        html += `<pre ${
            item.tag === TOKEN_TAG.REF ? 'class="plog-sub-refblock"' : ''
        }><code>${item.value}</code></pre>`;
    });

    return (html += '</div>');
};

/**
 * 标题处理器
 * default parser of title
 */
const _titleParser = (token: string) => {
    return `<h1>${token.substring(2)}</h1>`;
};

/**
 * 子标题处理器
 * default parser of title
 */
const _subtitleParser = (token: string) => {
    return `<h2>${token.substring(token.indexOf(' ') + 1)}</h2>`;
};

/**
 * 表格块处理器
 * default parser of table
 */
const _tableParser = (token: string, lang: string) => {
    const content = token.split('\n');
    let colNum = 0;
    let result = '<table class="plog-table">';
    const alignArr = lang.split(',');

    // 表头
    if (/\s*[^\|]+\s*/.test(content[0])) {
        result += '<thead><tr>';
        colNum = content[0]
            .replace(/\\\|/g, '&verticle_stroke;')
            .split('|')
            .slice(1, -1)
            .map(
                (item, index) =>
                    (result += `<th align="${alignArr[index]}">${item.replace(
                        /&verticle_stroke;/g,
                        '|'
                    )}</th>`)
            ).length;

        result += '</tr></thead>';
    }
    if (content.length > 1) {
        result += '<tbody>';
        content.forEach((item, index) => {
            if (index > 0) {
                result += '<tr>';
                item.replace(/\\\|/g, '&verticle_stroke;')
                    .split('|')
                    .slice(1, -1)
                    .map((el, index) => {
                        if (index < colNum) {
                            result += `<td align="${
                                alignArr[index]
                            }"><code class="cell-code">${el.replace(
                                /&verticle_stroke;/g,
                                '|'
                            )}</code></td>`;
                        }
                    });
                result += '</tr>';
            }
        });
        result += '</tbody>';
    }

    return result + '</table>';
};

/**
 * 默认代码块处理器
 * default parser of codeblock
 */
const _codeblockParser = (code: string, language: string) => {
    if (hljs.getLanguage(language)) {
        hljs.configure({ classPrefix: '' });
        return hljs.highlight(code, {
            language,
            ignoreIllegals: true
        }).value;
    }

    return code;
};

/**
 * 图片块处理器
 * default parser of reference
 */
const _imgParser = (token: string) => {
    return '';
};

/**
 * 音频块处理器
 * default parser of reference
 */
const _audioParser = (token: string) => {
    return '';
};

/**
 * 视频块处理器
 * default parser of reference
 */
const _videoParser = (token: string) => {
    return '';
};

/**
 * 超链接块处理器
 * default parser of reference
 */
const _linkParser = (token: string) => {
    return '';
};

/**
 * 分割线处理器
 * default parser of reference
 */
const _dividerParser = (token: string) => {
    return '<div class="divider"/>';
};

/**
 * 标记plog内容
 * mark the content of plog.
 */
export const tokenify = (
    content: string,
    mode: boolean = true
): PlogToken[] => {
    if (!content) return [];
    const text = content.trim().split('\n');
    const token: PlogToken[] = [];
    const reg = mode ? tokenRegMap['strict'] : tokenRegMap['lenient'];

    for (let i = 0; i < text.length; ++i) {
        const item = text[i];

        // 匹配代码块
        if (reg.codeblockStart(item)) {
            const chunkQueue: string[] = [];
            let currentLine = i + 1;
            const codeblock = {
                // 代码块语言类型
                lang: '',

                // 是否已匹配代码块内容
                match: false,

                // 以下类型 cycle = true
                // 'markdown', 'md', 'mkdown', 'mkd', 'poke'
                cycle: false
            };

            // 匹配代码块语言
            codeblock.lang = item.replace(/`{3}/, '').trim();
            if (['markdown', 'md', 'mkdown', 'mkd'].includes(codeblock.lang)) {
                codeblock.cycle = true;
            }

            // 后顾查找代码块结束标志
            while (currentLine < text.length) {
                if (reg.codeblockEnd(text[currentLine])) {
                    codeblock.match = true;
                    break;
                }
                chunkQueue.push(text[currentLine].trimEnd());
                currentLine += 1;
            }

            // 后顾完成的状态处理
            if (!codeblock.match) {
                if (currentLine < text.length) {
                    continue;
                }
            } else if (!codeblock.cycle) {
                token.push({
                    tag: TOKEN_TAG.CODE,
                    value: chunkQueue.join('\n'),
                    lang: codeblock.lang
                });
                i = currentLine;
                continue;
            } else {
                const /* COPB */ childMarkOpen = {
                        status: false,
                        index: (currentLine = i + 1)
                    };
                const /* CBPB */ parentMarkClose = {
                        status: false,
                        index: currentLine
                    };

                while (currentLine < text.length) {
                    const item = text[currentLine];
                    const isChunkStart = reg.codeblockStart(item);
                    const isChunkEnd = reg.codeblockEnd(item);

                    // 找到``` 标记为 co pb
                    if (!childMarkOpen.status && isChunkEnd) {
                        childMarkOpen.index = currentLine;
                        childMarkOpen.status = true;
                        parentMarkClose.status = true;
                        if (
                            currentLine === text.length - 1 ||
                            !text[currentLine + 1].trim()
                        ) {
                            break;
                        }
                    }

                    // 找到```x 标记 co
                    else if (!childMarkOpen.status && isChunkStart) {
                        childMarkOpen.index = currentLine;
                        childMarkOpen.status = true;
                    }

                    // 找到``` 标记 cb pb
                    if (childMarkOpen.status && isChunkEnd) {
                        childMarkOpen.status = false;
                        parentMarkClose.index = currentLine;
                        parentMarkClose.status = true;
                    }

                    // 找到```x 标记 co
                    else if (childMarkOpen.status && isChunkStart) {
                        childMarkOpen.index = currentLine;
                    }

                    currentLine += 1;
                }

                // 结尾行数索引
                const endLine = Math.max(
                    childMarkOpen.index,
                    parentMarkClose.index
                );
                let value = '';
                for (let line = i + 1; line < endLine; ++line) {
                    value += `${text[line]}\n`;
                }
                token.push({
                    tag: TOKEN_TAG.CODE,
                    value,
                    lang: codeblock.lang
                });
                i = endLine;
                continue;
            }
        }

        // 匹配导读
        if (reg.outline(item)) {
            const matchArr = item.match(
                /^\s*#(?:\(([\s\S]*)\))?\[([\s\S]*)\]\s*$/
            );
            token.push({
                tag: TOKEN_TAG.OUTLINE,
                lang: matchArr && matchArr[1] ? matchArr[1] : '',
                value: matchArr && matchArr[2] ? matchArr[2] : ''
            });
            continue;
        }
        if (reg.outlineblockStart(item)) {
            let currentLine = i + 1;
            const matchArr = item.match(/^\s*#(?:\(([\s\S]*)\))?\[([^\]]*)$/);
            let lang = matchArr && matchArr[1] ? matchArr[1] : '';
            let chunkCode = matchArr && matchArr[2] ? matchArr[2] : '';
            let outlineblockEnd = false;

            while (currentLine < text.length) {
                const currentItem = text[currentLine];
                if (reg.outlineblockEnd(currentItem)) {
                    i = currentLine;
                    const matchArr = currentItem.match(/^\s*(.*)\]\s*$/);
                    if (matchArr) {
                        chunkCode += matchArr[1];
                    }
                    outlineblockEnd = true;
                    break;
                }

                chunkCode += `${currentItem}\n`;
                currentLine += 1;
            }

            if (outlineblockEnd) {
                token.push({
                    tag: TOKEN_TAG.OUTLINE,
                    value: chunkCode,
                    lang
                });
            }
            continue;
        }

        // 匹配标题
        if (reg.title(item)) {
            token.push({
                tag: TOKEN_TAG.TITLE,
                value: item.trim()
            });
            continue;
        }
        if (reg.subtitle(item)) {
            token.push({
                tag: TOKEN_TAG.SUBTITLE,
                value: item.trim()
            });
            continue;
        }

        // 匹配表格
        if (reg.tableblock(item) && reg.tableblockAlign(text[i + 1])) {
            i += 1;
            const tableblock = {
                lang: '',
                value: '',
                match: false
            };
            const headColNum = item.replace(/\\\|/g, '').split('|');
            const alignColNum = text[i].replace(/\\\|/g, '').split('|');
            const lang = alignColNum
                .slice(1, -1)
                .map((item) => {
                    const left = item.trim().startsWith(':-');
                    const right = item.trim().endsWith('-:');
                    const center = left && right;
                    return center ? 'center' : right ? 'right' : 'left';
                })
                .join(',');
            if (headColNum.length === alignColNum.length) {
                tableblock.lang = lang;
                tableblock.value = item.trim();
                tableblock.match = true;
                while (tableblock.match) {
                    const tableblockBody = reg.tableblock(text[i + 1]);
                    if (tableblockBody) {
                        i += 1;
                        tableblock.value += '\n' + text[i].trim();
                    }

                    // 匹配到非表格体后释放捕获状态
                    tableblock.match = tableblockBody;
                }
                token.push({
                    tag: TOKEN_TAG.TABLE,
                    value: tableblock.value,
                    lang: tableblock.lang
                });
                continue;
            } else {
                i -= 1;
            }
        }

        // 匹配分隔线
        if (reg.divider(item)) {
            token.push({
                tag: TOKEN_TAG.DIVIDER,
                value: item.trim()
            });
            continue;
        }

        // 匹配引用
        if (reg.refblock(item)) {
            let currentLine = i + 1;
            const chunkCode: PlogToken[] = [
                {
                    tag: TOKEN_TAG.TEXT,
                    value: `${item.replace(/^\s*>\s*/, '')}\n`
                }
            ];

            while (currentLine < text.length) {
                const currentItem = text[currentLine];
                if (!currentItem.trim()) {
                    break;
                }
                if (reg.refblock(currentItem)) {
                    currentLine = currentLine - 1;
                    break;
                }
                reg.subrefblock(currentItem)
                    ? chunkCode.push({
                          tag: TOKEN_TAG.REF,
                          value: `${currentItem.replace(/^\s*>+\s*/, '')}\n`
                      })
                    : (chunkCode[
                          chunkCode.length - 1
                      ].value += `${currentItem}\n`);
                currentLine += 1;
            }

            i = currentLine;

            token.push({
                tag: TOKEN_TAG.REF,
                value: (chunkCode.shift() as PlogToken).value,
                children: chunkCode
            });
            continue;
        }

        // 匹配图片
        if (reg.img(item)) {
            const matchArr = item.match(
                /^([^!]*)!\[([\s\S]*)\]\(([\s\S]+)\)([\s\S]*)$/
            ) as string[];
            let lang = '';
            let value = '';
            if (matchArr[1]) {
                token.push({
                    tag: TOKEN_TAG.TEXT,
                    value: matchArr[1]
                });
            }
            token.push({
                tag: TOKEN_TAG.IMG,
                lang: matchArr[2] || '',
                value: matchArr[3] || ''
            });
            if (matchArr[4]) {
                token.push({
                    tag: TOKEN_TAG.TEXT,
                    value: matchArr[4]
                });
            }
            continue;
        }
        if (reg.imgblockStart(item)) {
            let currentLine = i + 1;
            let lang = '';
            let match = false;
            let src = '';
            const matchArr = item.match(
                /^([^!]*)!\[([\s\S]*)\]\(([^\)]*)/
            ) as string[];
            if (matchArr[2]) {
                lang = matchArr[2].trim();
            }
            if (matchArr[3]) {
                src += matchArr[3].trim();
            }
            while (currentLine < text.length) {
                const currentItem = text[currentLine];
                if (reg.imgblockEnd(currentItem)) {
                    match = true;
                    i = currentLine;
                    const subMatchArr = currentItem.match(
                        /^([\s\S]*)\)([\s\S]*)$/
                    ) as string[];

                    if (matchArr[1]) {
                        token.push({
                            tag: TOKEN_TAG.TEXT,
                            value: matchArr[1]
                        });
                    }
                    token.push({
                        tag: TOKEN_TAG.IMG,
                        lang,
                        value: `${src}${(subMatchArr[1] || '').trim()}`
                    });
                    if (subMatchArr[2]) {
                        token.push({
                            tag: TOKEN_TAG.TEXT,
                            value: subMatchArr[2]
                        });
                    }
                    break;
                }
                src += currentItem.trim();
                currentLine += 1;
            }
            if (match) {
                continue;
            }
        }

        // 匹配文本
        if (item.trim()) {
            token.push({
                tag: TOKEN_TAG.TEXT,
                value: item.trimEnd()
            });
        }
    }

    return token;
};

export default (options?: PlogOptions): PlogParser =>
    ((options: PlogOptions = {}) => {
        const opts = {
            codeblockParser: options.codeblockParser || _codeblockParser,
            outlineParser: options.outlineParser || _outlineParser,
            titleParser: options.titleParser || _titleParser,
            subtitleParser: options.subtitleParser || _subtitleParser,
            tableParser: options.tableParser || _tableParser,
            imgParser: options.imgParser || _imgParser,
            linkParser: options.linkParser || _linkParser,
            plaintextParser: options.plaintextParser || _plaintextParser,
            refblockParser: options.refblockParser || _refblockParser,
            dividerParser: options.dividerParser || _dividerParser
        };

        return {
            render(code: string | PlogToken[], mode: boolean = false) {
                let tokenList: PlogToken[] = [];

                if (!Array.isArray(code)) {
                    tokenList = tokenify(code, mode);
                } else {
                    tokenList = code;
                }

                return tokenList.reduce((html: string, token: PlogToken) => {
                    switch (token.tag) {
                        case TOKEN_TAG.CODE: {
                            return (html += `<pre ${
                                token.lang
                                    ? 'class="lang-' + token.lang + '"'
                                    : ''
                            } ${
                                token.lang ? 'lang="' + token.lang + '"' : ''
                            }><code>${opts.codeblockParser(
                                token.value,
                                token.lang as string
                            )}</code></pre>`);
                        }
                        case TOKEN_TAG.OUTLINE: {
                            return (html += opts.outlineParser(
                                token.value,
                                token.lang as string
                            ));
                        }
                        case TOKEN_TAG.TITLE: {
                            return (html += opts.titleParser(token.value));
                        }
                        case TOKEN_TAG.SUBTITLE: {
                            return (html += opts.subtitleParser(token.value));
                        }
                        case TOKEN_TAG.DIVIDER: {
                            return (html += opts.dividerParser(token.value));
                        }
                        case TOKEN_TAG.TABLE: {
                            return (html += opts.tableParser(
                                token.value,
                                token.lang as string
                            ));
                        }
                        case TOKEN_TAG.REF: {
                            return (html += opts.refblockParser(
                                token.value,
                                token.children as PlogToken['children']
                            ));
                        }
                        default:
                            return html;
                    }
                }, '');
            },

            config(newOptions: PlogOptions) {
                Object.assign(opts, newOptions);
            }
        };
    })(options);
