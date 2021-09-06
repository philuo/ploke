// @ts-ignore
export { default as hljs } from './hljs';

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
    OL,
    UL,
    CHECKBOX,
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
    BG,
    COLOR,
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
    val: string;

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
    [TEXT_TAG.UNDERLINE as number]: /@{2}([^@]+)@{2}/g,
    [TEXT_TAG.DELETELINE as number]: /~{2}([^~]+)~{2}/g,
    [TEXT_TAG.BG as number]: /@\[([\s\S]+)\]\(([^\(\)]+)\)/g,
    [TEXT_TAG.COLOR as number]: /%\[([\s\S]+)\]\(([^\(\)]+)\)/g,
    [TEXT_TAG.LINK as number]: /\[([^\[\]]*)\]\(([^\(\)]+)\)/g,
};

export const parser_t = (text: string, safe = true): string => {
    const inlineref: string[] = [];
    return (safe ? escapeHtml(text) : text)
        .replace(textRegMap[TEXT_TAG.INLINEREF], (substr, match) => {
            inlineref.push(`<span class="inlineref">${match}</span>`);
            return substr;
        })
        .replace(textRegMap[TEXT_TAG.BOLDITALIC], '<i class="bold">$1</i>')
        .replace(textRegMap[TEXT_TAG.BOLD], '<strong>$1</strong>')
        .replace(textRegMap[TEXT_TAG.ITALIC], '<i>$1</i>')
        .replace(textRegMap[TEXT_TAG.UNDERLINE], '<ins>$1</ins>')
        .replace(textRegMap[TEXT_TAG.DELETELINE], '<del>$1</del>')
        .replace(
            textRegMap[TEXT_TAG.BG],
            '<span style="background:$2" class="bg">$1</span>'
        )
        .replace(
            textRegMap[TEXT_TAG.COLOR],
            '<span style="color:$2;text-decoration-color:$2">$1</span>'
        )
        .replace(textRegMap[TEXT_TAG.LINK], (_, alias: string, src: string) => {
            let name = alias.trim();
            let href = src.trim();
            let rlHref = href;
            if (!rlHref.startsWith('http') && !rlHref.startsWith('/')) {
                rlHref = 'https://' + rlHref;
            }
            return `<a href="${rlHref}" target="_blank">${name || href}</a>`;
        })
        .replace(
            textRegMap[TEXT_TAG.INLINEREF],
            (_) => inlineref.shift() as string
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
    ol: (str: string) => /^\d+\.\s*[\s\S]*$/.test(str),
    ul: (str: string) => /^-\s[\s\S]*$/.test(str),
    checkbox: (str: string) => /^-\s\[[\sxX]\][\s\S]*$/.test(str),
};

/**
 * 标记plog内容
 * mark the content of plog.
 */
export const tokenify = (content: string | PlogToken[], safe = true): PlogToken[] => {
    if (!content) return [];
    if (Array.isArray(content)) {
        return content;
    }
    const text = content.trim().split('\n');
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

                // 'markdown', 'md', 'mkdown', 'mkd', 'poke'
                cycle: false,
            };

            // 匹配代码块语言
            codeblock.lang = item.replace(/`{3}/, '').trim();
            if (
                ['markdown', 'md', 'mkdown', 'mkd', 'poke'].includes(
                    codeblock.lang
                )
            ) {
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
                    val: chunkQueue.join('\n'),
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
                let val = '';
                for (let line = i + 1; line < endLine; ++line) {
                    val += `${text[line]}\n`;
                }
                token.push({
                    tag: TOKEN_TAG.CODE,
                    val,
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
                val: matchArr && matchArr[2] ? matchArr[2] : '',
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
                    val: chunkCode,
                    lang,
                });
            }
            continue;
        }

        // 匹配标题
        if (tokenRegMap.title(item)) {
            token.push({
                tag: TOKEN_TAG.TITLE,
                val: item.trim().substring(2),
            });
            continue;
        }
        if (tokenRegMap.subtitle(item)) {
            token.push({
                tag: TOKEN_TAG.SUBTITLE,
                val: item.trim().substring(item.indexOf(' ') + 1),
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
                val: '',
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
                tableblock.val = item.trim();
                tableblock.match = true;
                while (tableblock.match) {
                    const tableblockBody = tokenRegMap.tableblock(text[i + 1]);
                    if (tableblockBody) {
                        i += 1;
                        tableblock.val += '\n' + text[i].trim();
                    }

                    // 匹配到非表格体后释放捕获状态
                    tableblock.match = tableblockBody;
                }
                token.push({
                    tag: TOKEN_TAG.TABLE,
                    val: tableblock.val,
                    lang: tableblock.lang,
                });
                continue;
            } else {
                i -= 1;
            }
        }

        // 匹配checkbox
        if (tokenRegMap.checkbox(item)) {
            let currentLine = i + 1;
            let lang = '';
            let chunkCode = '';
            item.replace(/^-\s\[([\sxX])\]([\s\S]*)/, (_, language, val) => {
                lang = language.trim();
                chunkCode = val.trimEnd();
                return '';
            });

            while (currentLine < text.length) {
                const currentItem = text[currentLine];
                if (!currentItem.trim()) {
                    i = currentLine;
                    break;
                }
                if (tokenRegMap.checkbox(currentItem)) {
                    i = currentLine - 1;
                    break;
                } else {
                    i = currentLine;
                    chunkCode += currentItem.trim();
                }
                currentLine += 1;
            }

            token.push({
                tag: TOKEN_TAG.CHECKBOX,
                val: chunkCode,
                lang,
            });
            continue;
        }

        // 匹配列表
        if (tokenRegMap.ol(item)) {
            let currentLine = i + 1;
            let chunkCode: string[] = [item.replace(/^\d+\.\s*/, '').trimEnd()];

            while (currentLine < text.length) {
                const currentItem = text[currentLine];
                if (tokenRegMap.ol(currentItem)) {
                    chunkCode.push(
                        currentItem.replace(/^\d+\.\s*/, '').trimEnd()
                    );
                    i = currentLine;
                } else if (!currentItem.trim()) {
                    i = currentLine;
                    break;
                } else {
                    chunkCode[chunkCode.length - 1] += currentItem
                        .replace(/^\d+\.\s*/, '')
                        .trimEnd();
                }
                currentLine += 1;
            }
            token.push({
                tag: TOKEN_TAG.OL,
                val: chunkCode.join('\n'),
            });
            continue;
        }
        if (tokenRegMap.ul(item)) {
            let currentLine = i + 1;
            let chunkCode: string[] = [item.replace(/^-\s*/, '').trimEnd()];

            while (currentLine < text.length) {
                const currentItem = text[currentLine];
                if (tokenRegMap.ul(currentItem)) {
                    chunkCode.push(currentItem.replace(/^-\s*/, '').trimEnd());
                    i = currentLine;
                } else if (!currentItem.trim()) {
                    i = currentLine;
                    break;
                } else {
                    chunkCode[chunkCode.length - 1] += currentItem
                        .replace(/^-\s*/, '')
                        .trimEnd();
                }
                currentLine += 1;
            }
            token.push({
                tag: TOKEN_TAG.UL,
                val: chunkCode.join('\n'),
            });
            continue;
        }

        // 匹配分隔线
        if (tokenRegMap.divider(item)) {
            token.push({
                tag: TOKEN_TAG.DIVIDER,
                val: item.trim(),
            });
            continue;
        }

        // 匹配引用
        if (tokenRegMap.refblock(item)) {
            let currentLine = i + 1;
            const chunkCode: PlogToken[] = [
                {
                    tag: TOKEN_TAG.TEXT,
                    val: `${item.replace(/^\s*>\s*/, '')}\n`,
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
                          val: `${currentItem.replace(/^\s*>+\s*/, '')}\n`,
                      })
                    : (chunkCode[
                          chunkCode.length - 1
                      ].val += `${currentItem}\n`);
                currentLine += 1;
            }

            i = currentLine;

            token.push({
                tag: TOKEN_TAG.REF,
                val: (chunkCode.shift() as PlogToken).val,
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
            let val = '';
            if (matchArr[1]) {
                token.push({
                    tag: TOKEN_TAG.TEXT,
                    val: matchArr[1],
                });
            }
            token.push({
                tag: TOKEN_TAG.IMG,
                lang: matchArr[2] || '',
                val: matchArr[3] || '',
            });
            if (matchArr[4]) {
                token.push({
                    tag: TOKEN_TAG.TEXT,
                    val: matchArr[4],
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
                            val: matchArr[1],
                        });
                    }
                    token.push({
                        tag: TOKEN_TAG.IMG,
                        lang,
                        val: `${src}${(subMatchArr[1] || '').trim()}`,
                    });
                    if (subMatchArr[2]) {
                        token.push({
                            tag: TOKEN_TAG.TEXT,
                            val: subMatchArr[2],
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
                latestToken.val += item.trimEnd();
            } else {
                token.push({
                    tag: TOKEN_TAG.TEXT,
                    val: item.trimEnd(),
                });
            }
        }

        // 匹配空行
        else {
            const latestToken = token[token.length - 1];
            if (
                latestToken &&
                latestToken.tag === TOKEN_TAG.TEXT &&
                latestToken.val
            ) {
                token.push({
                    tag: TOKEN_TAG.TEXT,
                    val: '',
                });
            }
        }
    }

    token
        .filter((item) => item.tag === TOKEN_TAG.TEXT && item.val)
        .forEach((token) => {
            token.val = parser_t(token.val, safe);
        });

    return token.filter(
        (item) =>
            (item.tag === TOKEN_TAG.TEXT && item.val) ||
            item.tag !== TOKEN_TAG.TEXT
    );
};
