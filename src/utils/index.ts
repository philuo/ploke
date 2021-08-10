const HTML_ESCAPE_TEST_RE = /[&<>"]/;
const HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
const HTML_REPLACEMENTS: {
    [key: string]: string;
} = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
};

export const escapeHtml = (str: string): string => {
    if (HTML_ESCAPE_TEST_RE.test(str)) {
        return str.replace(
            HTML_ESCAPE_REPLACE_RE,
            (ch: string) => HTML_REPLACEMENTS[ch]
        );
    }
    return str;
}
