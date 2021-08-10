/**
 * Plog解析器配置参数
 * options of parser constructor.
 */
interface PlogOptions {

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
     * 容器全局类名
     * class name of container
     */
    blockName?: string;
}

/**
 * Plog解析器
 * parser of plog for rendering html string
 */
interface PlogParser {

    /**
     * 渲染函数
     */
    render: (code: string) => string;

    /**
     * 更新解析器配置
     */
    config: (options: PlogOptions) => void;
}

/**
 * tokenify返回值类型
 */
enum TOKEN_TAG {
    CODE,
    OUTLINE,
    AUDIO,
    VEDIO,
    TITLE,
    SUBTITLE,
    TABLE,
    TEXT,
    EOL
    // REF
    // IMG,
    // LINK,
}

/**
 * Plog标记
 * mark of plog content
 */
interface PlogToken {
    tag: TOKEN_TAG;
    value: string;
    lang?: string;
}

/**
 * 标题处理器
 * default parser of plaintext
 */
const _plaintextParser = (token: string) => {
    return ''
}

/**
 * 大纲内容处理器
 * default parser of outline
 */
const _outlineParser = (token: string) => {
    return ''
}

/**
 * 标题处理器
 * default parser of title
 */
const _titleParser = (token: string) => {
    return `<h1>${token.substring(2)}<h1>`;
}

/**
 * 子标题处理器
 * default parser of title
 */
const _subtitleParser = (token: string) => {
    return `<h2>${token.substring(token.indexOf(' ') + 1)}<h2>`
}

/**
 * 表格块处理器
 * default parser of table
 */
const _tableParser = (token: string, lang: string) => {
    const content = token.split('\n');
    console.log(content[0])
    const reg = tokenRegMap['strict'];
    let result = '<table class="plog-table">';
    console.log(reg.tableblock('|1\|'))
    console.log(reg.tableblock(content[0]))
    if (reg.tableblock(content[0])) {
        content[0].split('|').slice(1, -1);
        result += '<thead>';
        
        result += '</thead>';
    }
    return ''
}

/**
 * 默认代码块处理器
 * default parser of codeblock
 */
const _codeblockParser = (code: string, lang: string) => {
    return ''
};

/**
 * 图片块处理器
 * default parser of reference
 */
const _imgParser = (token: string) => {
    return ''
}

/**
 * 音频块处理器
 * default parser of reference
 */
const _audioParser = (token: string) => {
    return ''
}

/**
 * 视频块处理器
 * default parser of reference
 */
const _videoParser = (token: string) => {
    return ''
}

/**
 * 超链接块处理器
 * default parser of reference
 */
const _linkParser = (token: string) => {
    return ''
}

const tokenRegMap = {
    lenient: {
        codeblockStart: (str: string) => /^\s*`{3}[^`]*/.test(str),
        codeblockEnd: (str: string) => /^`{3}\s*$/.test(str),
        outlineblockStart: (str: string) => /^\s*#(\([\s\S]*\))?\[[^\]]*$/.test(str),
        outlineblockEnd: (str: string) => /^[\s\S]*\]\s*$/.test(str),
        tableblock: (str: string) => /^\s*\|([\s\S]*\|)+\s*$/.test(str),
        tableblockAlign: (str: string) => /^\s*\|(\s*\:?-+\:?\s*\|)+\s*$/.test(str),
        outline: (str: string) => /^\s*#(\([\s\S]*\))?\[[\s\S]*\]\s*$/.test(str),
        title: (str: string) => /^\s*#\s+/.test(str),
        subtitle: (str: string) => /^\s*#{2,}\s+/.test(str),

        // 文本内容
        refblock: (str: string) => /^\s*>{1,3}\s.+\s*/.test(str),
        img: (str: string) => /^\!\[[\s\S]*\]\([\s\S]*\)$/.test(str),
        imgblockStart: (str: string) => /^\s*\!\[[\s\S]*\]\([^\)]*$/.test(str),
        imgblockEnd: (str: string) => /^[\s\S]*\)[\s\S]*$/.test(str),
        link: (str: string) => /^\[[\s\S]*\]\([\s\S]*\)$/.test(str),
        linkblockStart: (str: string) => /^\[[\s\S]*\]\([^\)]*$/.test(str),
        linkblockEnd: (str: string) => /^[\s\S]*\)[\s\S]*$/.test(str)
    },
    strict: {
        codeblockStart: (str: string) => /^`{3}[^`]*/.test(str),
        codeblockEnd: (str: string) => /^`{3}\s*$/.test(str),
        outlineblockStart: (str: string) => /^#(\([\s\S]*\))?\[[^\]]*$/.test(str),
        outlineblockEnd: (str: string) => /^[\s\S]*\]\s*$/.test(str),
        outline: (str: string) => /^#(\([\s\S]*\))?\[[\s\S]*\]$/.test(str),
        tableblock: (str: string) => /^\|([\s\S]*\|)+$/.test(str),
        tableblockAlign: (str: string) => /^\|(\s*\:?-+\:?\s*\|)+$/.test(str),
        title: (str: string) => /^#\s+/.test(str),
        subtitle: (str: string) => /^#{2,}\s+/.test(str),

        // 文本内容
        refblock: (str: string) => /^>{1,3}\s.+/.test(str),
        img: (str: string) => /^\!\[[\s\S]*\]\([\s\S]*\)$/.test(str),
        imgblockStart: (str: string) => /^\s*\!\[[\s\S]*\]\([^\)]*$/.test(str),
        imgblockEnd: (str: string) => /^[\s\S]*\)[\s\S]*$/.test(str),
        link: (str: string) => /^\[[\s\S]*\]\([\s\S]*\)$/.test(str),
        linkblockStart: (str: string) => /^\[[\s\S]*\]\([^\)]*$/.test(str),
        linkblockEnd: (str: string) => /^[\s\S]*\)[\s\S]*$/.test(str)
    }
};

/**
 * 标记plog内容
 * mark the content of plog.
 */
const tokenify = (content: string, mode: boolean): PlogToken[] => {
    if (!content) return [];
    const text = content.trim().split('\n');
    const token: PlogToken[] = [];
    const reg = mode ? tokenRegMap['strict'] : tokenRegMap['lenient'];
    const codeblock = {

        // 代码块语言类型
        lang: '',

        // 代码块内容
        value: '',

        // 是否已匹配代码块内容
        match: false
    };

    const outlineblock = {
        
        // 导读块抬头
        lang: '',

        // 导读块内容
        value: '',

        // 是否已经匹配导读块内容
        match: false
    };

    const tableblock = {

        // 对齐方式
        lang: '',

        // 表格块内容
        value: '',

        // 是否已经匹配导读块内容
        match: false
    };


    for (let i = 0; i < text.length; ++i) {
        const item = text[i];

        // 匹配代码块
        if (!codeblock.match && reg.codeblockStart(item)) {
            codeblock.lang = item.replace(/`{3}/, "").trim();
            codeblock.match = true;
            continue;
        }
        if (codeblock.match && reg.codeblockEnd(item)) {
            token.push({
                tag: TOKEN_TAG.CODE,
                value: codeblock.value.trimEnd(),
                lang: codeblock.lang
            });
            codeblock.lang = '';
            codeblock.value = '';
            codeblock.match = false;
            continue;
        }
        else if (codeblock.match) {
            codeblock.value += item.trimEnd() + '\n';
            continue;
        }

        // 匹配导读
        if (reg.outline(item)) {
            token.push({
                tag: TOKEN_TAG.OUTLINE,
                value: item.trim()
            });
            continue;
        }

        // 匹配导读块
        if (!outlineblock.match && reg.outlineblockStart(item)) {
            outlineblock.match = true;
            const matchArr = item.match(/^\s*#(?:\(([\s\S]*)\))?\[([^\]]*)$/);
            if (matchArr) {
                outlineblock.lang = matchArr[1] || '';
                outlineblock.value = matchArr[2] || '';
            }
            continue;
        }
        if (outlineblock.match && reg.outlineblockEnd(item)) {
            token.push({
                tag: TOKEN_TAG.OUTLINE,
                value: outlineblock.value,
                lang: outlineblock.lang
            });
            outlineblock.lang = '';
            outlineblock.value = '';
            outlineblock.match = false;
        }
        else if (outlineblock.match) {
            outlineblock.value += item.trimEnd();
            continue;
        }

        // 匹配一级标题
        if (reg.title(item)) {
            token.push({
                tag: TOKEN_TAG.TITLE,
                value: item.trim()
            });
            continue;
        }

        // 匹配次级标题
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
            tableblock.lang = text[i + 1];
            tableblock.value = item.trim();
            tableblock.match = true;
            while(tableblock.match) {
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
            tableblock.lang = '';
            tableblock.value = '';
            tableblock.match = false;
            continue;
        }

        // 匹配文本
        token.push({
            tag: item ? TOKEN_TAG.TEXT : TOKEN_TAG.EOL,
            value: item.trimEnd()
        });
    }

    return token;
}

export default (options?: PlogOptions): PlogParser => ((options: PlogOptions = {}) => {
    const opts = {
        codeblockParser: options.codeblockParser || _codeblockParser,
        outlineParser: options.outlineParser || _outlineParser,
        titleParser: options.titleParser || _titleParser,
        subtitleParser: options.subtitleParser || _subtitleParser,
        tableParser: options.tableParser || _tableParser,
        imgParser: options.imgParser || _imgParser,
        linkParser: options.linkParser || _linkParser,
        plaintextParser: options.plaintextParser || _plaintextParser,
        blockName: options.blockName || 'plog-article'
    };

    return {
        render(code: string, mode: boolean = false): string {
            const html = tokenify(code, mode).reduce((html: string, token: PlogToken) => {
                switch (token.tag) {
                    case TOKEN_TAG.CODE: {
                        return html += opts.codeblockParser(token.value, token.lang as string);
                    }
                    case TOKEN_TAG.OUTLINE: {
                        return html +=  opts.outlineParser(token.value, token.lang as string);
                    }
                    case TOKEN_TAG.TITLE: {
                        return html +=  opts.titleParser(token.value);
                    }
                    case TOKEN_TAG.SUBTITLE: {
                        return html +=  opts.subtitleParser(token.value);
                    }
                    case TOKEN_TAG.TABLE: {
                        return html +=  opts.tableParser(token.value, token.lang as string);
                    }

                    default: return html;
                }
            }, '');

            return `<article class="${opts.blockName}">${html}<article>`;
        },

        config(newOptions: PlogOptions) {
            Object.assign(opts, newOptions);
        }
    }
})(options);