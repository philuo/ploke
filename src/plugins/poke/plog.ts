/**
 * 高亮方法
 */
export * as hljs from 'highlight.js';

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
    VEDIO,
}

/**
 * 禁止插入HTML
 */
const HTML_ESCAPE_TEST_RE = /[&<>"]/;
const HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
const HTML_REPLACEMENTS: {
    [key: string]: string;
} = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
};

export const escapeHtml = (str: string): string => {
    if (HTML_ESCAPE_TEST_RE.test(str)) {
        return str.replace(
            HTML_ESCAPE_REPLACE_RE,
            (ch: string) => HTML_REPLACEMENTS[ch]
        );
    }
    return str;
};

/**
 * TOKEN_TAG.TEXT 子类型
 */
enum TEXT_TAG {
    BOLDITALIC,
    BOLD,
    ITALIC,
    UNDERLINE,
    DELETELINE,
    INLINEREF,
    COLOR,
    BG,
    LINK,
}

/**
 * Plog标记
 * mark of plog content
 */
export interface PlogToken {
    /**
     * 类型
     */
    tag: TOKEN_TAG;

    /**
     * 默认值
     */
    value: string;

    /**
     * 块级元素额外修饰
     * 代码块语言类型、
     */
    lang?: string;

    /**
     * 块级元素子类型
     * 当前只有refblock使用
     */
    sub?: PlogToken[];
}

const textRegMap = {
    [TEXT_TAG.INLINEREF as number]: /\`([^\`]+)\`/g,
    [TEXT_TAG.BOLDITALIC as number]: /\*{3}([^\*]+)\*{3}/g,
    [TEXT_TAG.BOLD as number]: /\*{2}([^\*]+)\*{2}/g,
    [TEXT_TAG.ITALIC as number]: /\*([^\*]+)\*/g,
    [TEXT_TAG.UNDERLINE as number]: /@([^@]+)@/g,
    [TEXT_TAG.DELETELINE as number]: /~{2}([^~]+)~{2}/g,
    [TEXT_TAG.COLOR as number]: /%\[([\s\S]+)\]\(([\s\S]+)\)/g,
    [TEXT_TAG.BG as number]: /@\[([\s\S]+)\]\(([\s\S]+)\)/g,
    [TEXT_TAG.LINK as number]: /\[([\s\S]*)\]\(([\s\S]+)\)/g,
};

export const parser_t = (text: string): string => {
    const inlineref: string[] = [];
    return text
        .replace(textRegMap[TEXT_TAG.INLINEREF], (substr, match) => {
            inlineref.push(`<span class="inlineref">${match}</span>`);
            return substr;
        })
        .replace(textRegMap[TEXT_TAG.BOLDITALIC], '<i class="bold">$1</i>')
        .replace(textRegMap[TEXT_TAG.BOLD], '<strong>$1</strong>')
        .replace(textRegMap[TEXT_TAG.ITALIC], '<i>$1</i>')
        .replace(textRegMap[TEXT_TAG.UNDERLINE], '<ins>$1</ins>')
        .replace(textRegMap[TEXT_TAG.DELETELINE], '<del>$1</del>')
        .replace(textRegMap[TEXT_TAG.COLOR], '<span style="color:$2">$1</span>')
        .replace(
            textRegMap[TEXT_TAG.BG],
            '<span style="backgroud:$2">$1</span>'
        )
        .replace(
            textRegMap[TEXT_TAG.LINK],
            (_, alias, href) =>
                `<a href="${href.trim()}" target="_blank">${alias}</a>`
        )
        .replace(
            textRegMap[TEXT_TAG.INLINEREF],
            (_) => inlineref.pop() as string
        );
};

const tokenRegMap = {
    codeblockStart: (str: string) => /^`{3}[^`]*/.test(str),
    codeblockEnd: (str: string) => /^`{3}\s*$/.test(str),
    outlineblockStart: (str: string) => /^#(\([\s\S]*\))?\[[^\]]*$/.test(str),
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
    imgblockEnd: (str: string) => /^[\s\S]*\)[\s\S]*$/.test(str),

    // 有序列表
    // 无序列表
};

/**
 * 标记plog内容
 * mark the content of plog.
 */
export const tokenify = (
    content: string,
    safe: boolean = true
): PlogToken[] => {
    if (!content) return [];
    const text = (safe ? escapeHtml(content) : content).trim().split('\n');
    const token: PlogToken[] = [];

    for (let i = 0; i < text.length; ++i) {
        const item = text[i];

        // 匹配代码块
        if (tokenRegMap.codeblockStart(item)) {
            const chunkQueue: string[] = [];
            let currentLine = i + 1;
            const codeblock = {
                // 代码块语言类型
                lang: '',

                // 是否已匹配代码块内容
                match: false,

                // 以下类型 cycle = true
                // 'markdown', 'md', 'mkdown', 'mkd', 'poke'
                cycle: false,
            };

            // 匹配代码块语言
            codeblock.lang = item.replace(/`{3}/, '').trim();
            if (['markdown', 'md', 'mkdown', 'mkd'].includes(codeblock.lang)) {
                codeblock.cycle = true;
            }

            // 后顾查找代码块结束标志
            while (currentLine < text.length) {
                if (tokenRegMap.codeblockEnd(text[currentLine])) {
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
                    lang: codeblock.lang,
                });
                i = currentLine;
                continue;
            } else {
                const /* COPB */ childMarkOpen = {
                        status: false,
                        index: (currentLine = i + 1),
                    };
                const /* CBPB */ parentMarkClose = {
                        status: false,
                        index: currentLine,
                    };

                while (currentLine < text.length) {
                    const item = text[currentLine];
                    const isChunkStart = tokenRegMap.codeblockStart(item);
                    const isChunkEnd = tokenRegMap.codeblockEnd(item);

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
                    lang: codeblock.lang,
                });
                i = endLine;
                continue;
            }
        }

        // 匹配导读
        if (tokenRegMap.outline(item)) {
            const matchArr = item.match(
                /^\s*#(?:\(([\s\S]*)\))?\[([\s\S]*)\]\s*$/
            );
            token.push({
                tag: TOKEN_TAG.OUTLINE,
                lang: matchArr && matchArr[1] ? matchArr[1] : '',
                value: matchArr && matchArr[2] ? matchArr[2] : '',
            });
            continue;
        }
        if (tokenRegMap.outlineblockStart(item)) {
            let currentLine = i + 1;
            const matchArr = item.match(/^\s*#(?:\(([\s\S]*)\))?\[([^\]]*)$/);
            let lang = matchArr && matchArr[1] ? matchArr[1] : '';
            let chunkCode = matchArr && matchArr[2] ? matchArr[2] : '';
            let outlineblockEnd = false;

            while (currentLine < text.length) {
                const currentItem = text[currentLine];
                if (tokenRegMap.outlineblockEnd(currentItem)) {
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
                    lang,
                });
            }
            continue;
        }

        // 匹配标题
        if (tokenRegMap.title(item)) {
            token.push({
                tag: TOKEN_TAG.TITLE,
                value: item.trim().substring(2),
            });
            continue;
        }
        if (tokenRegMap.subtitle(item)) {
            token.push({
                tag: TOKEN_TAG.SUBTITLE,
                value: item.trim().substring(item.indexOf(' ') + 1),
            });
            continue;
        }

        // 匹配表格
        if (
            tokenRegMap.tableblock(item) &&
            tokenRegMap.tableblockAlign(text[i + 1])
        ) {
            i += 1;
            const tableblock = {
                lang: '',
                value: '',
                match: false,
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
                    const tableblockBody = tokenRegMap.tableblock(text[i + 1]);
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
                    lang: tableblock.lang,
                });
                continue;
            } else {
                i -= 1;
            }
        }

        // 匹配分隔线
        if (tokenRegMap.divider(item)) {
            token.push({
                tag: TOKEN_TAG.DIVIDER,
                value: item.trim(),
            });
            continue;
        }

        // 匹配引用
        if (tokenRegMap.refblock(item)) {
            let currentLine = i + 1;
            const chunkCode: PlogToken[] = [
                {
                    tag: TOKEN_TAG.TEXT,
                    value: `${item.replace(/^\s*>\s*/, '')}\n`,
                },
            ];

            while (currentLine < text.length) {
                const currentItem = text[currentLine];
                if (!currentItem.trim()) {
                    break;
                }
                if (tokenRegMap.refblock(currentItem)) {
                    currentLine = currentLine - 1;
                    break;
                }
                tokenRegMap.subrefblock(currentItem)
                    ? chunkCode.push({
                          tag: TOKEN_TAG.REF,
                          value: `${currentItem.replace(/^\s*>+\s*/, '')}\n`,
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
                sub: chunkCode,
            });
            continue;
        }

        // 匹配图片
        if (tokenRegMap.img(item)) {
            const matchArr = item.match(
                /^([^!]*)!\[([\s\S]*)\]\(([\s\S]+)\)([\s\S]*)$/
            ) as string[];
            let lang = '';
            let value = '';
            if (matchArr[1]) {
                token.push({
                    tag: TOKEN_TAG.TEXT,
                    value: matchArr[1],
                });
            }
            token.push({
                tag: TOKEN_TAG.IMG,
                lang: matchArr[2] || '',
                value: matchArr[3] || '',
            });
            if (matchArr[4]) {
                token.push({
                    tag: TOKEN_TAG.TEXT,
                    value: matchArr[4],
                });
            }
            continue;
        }
        if (tokenRegMap.imgblockStart(item)) {
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
                if (tokenRegMap.imgblockEnd(currentItem)) {
                    match = true;
                    i = currentLine;
                    const subMatchArr = currentItem.match(
                        /^([\s\S]*)\)([\s\S]*)$/
                    ) as string[];

                    if (matchArr[1]) {
                        token.push({
                            tag: TOKEN_TAG.TEXT,
                            value: matchArr[1],
                        });
                    }
                    token.push({
                        tag: TOKEN_TAG.IMG,
                        lang,
                        value: `${src}${(subMatchArr[1] || '').trim()}`,
                    });
                    if (subMatchArr[2]) {
                        token.push({
                            tag: TOKEN_TAG.TEXT,
                            value: subMatchArr[2],
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
            const latestToken = token[token.length - 1];
            if (latestToken && latestToken.tag === TOKEN_TAG.TEXT) {
                latestToken.value += item.trimEnd();
            } else {
                token.push({
                    tag: TOKEN_TAG.TEXT,
                    value: item.trimEnd(),
                });
            }
        }

        // 匹配空行
        else {
            const latestToken = token[token.length - 1];
            if (
                latestToken &&
                latestToken.tag === TOKEN_TAG.TEXT &&
                latestToken.value
            ) {
                token.push({
                    tag: TOKEN_TAG.TEXT,
                    value: '',
                });
            }
        }
    }

    token
        .filter((item) => item.tag === TOKEN_TAG.TEXT && item.value)
        .forEach((token) => {
            token.value = parser_t(token.value);
        });

    return token.filter(
        (item) =>
            (item.tag === TOKEN_TAG.TEXT && item.value) ||
            item.tag !== TOKEN_TAG.TEXT
    );
};
