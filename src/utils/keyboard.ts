interface KeyControlMap {
    [key: string]: (event: KeyboardEvent) => void;
}

function forward_enter(event: KeyboardEvent) {
    event.preventDefault();
    const element = event.target as HTMLTextAreaElement;
    let content = element.value;
    let index = content.lastIndexOf('\n', element.selectionEnd - 1);
    if (index === -1) {
        index = 0;
    }
    content = content.substring(0, index) + '\n' + content.substring(element.selectionEnd);
    element.value = content;
    element.setSelectionRange(index + 1, index + 1);
}

function backward_enter(event: KeyboardEvent) {
    event.preventDefault();
    const element = event.target as HTMLTextAreaElement;
    let content = element.value;
    let index = content.indexOf('\n', element.selectionEnd);
    if (index === -1) {
        index = content.length;
    }
    element.value =
        content.substring(0, index) + '\n' + content.substring(index);
    element.setSelectionRange(index + 1, index + 1);
}

function save(event: KeyboardEvent) {
    event.preventDefault();
}

function backspace(event: KeyboardEvent) {
    event.preventDefault();
    const element = event.target as HTMLTextAreaElement;
    const { selectionStart, selectionEnd } = element;
    let content = element.value;

    // 1. 清空选中区域
    if (selectionStart !== selectionEnd) {
        content =
            content.substring(0, selectionStart) +
            content.substring(selectionEnd);
        element.value = content;
    }

    // 2. 找到光标开头的换行字符位置
    let index = content.lastIndexOf('\n', selectionStart);

    // 当前一个字符已经是换行符了
    if (index === selectionStart - 1) {
        index -= 1;
    }

    content = content.substring(0, index + 1) + content.substring(selectionEnd);
    element.value = content;
    element.setSelectionRange(index + 1, index + 1);
}

const META_CONTROL: KeyControlMap = {
    ENTER: backward_enter,
    S: save,
    BACKSPACE: backspace,
};

const META_SHIFT_CONTROL: KeyControlMap = {
    ENTER: forward_enter
};

export const editorKeyControl = (event: KeyboardEvent, cb?: Function) => {
    const keyName = event.key.toUpperCase();
    const element = event.target as HTMLTextAreaElement;
    const { selectionStart, selectionEnd } = element;
    let content = element.value;
    if (keyName === 'TAB') {
        event.preventDefault();
        content =
            content.substring(0, selectionStart) +
            '    ' +
            content.substring(selectionEnd);
        element.value = content;
        element.setSelectionRange(selectionStart + 4, selectionStart + 4);
    }
    if (event.metaKey) {
        if (event.shiftKey) {
            META_SHIFT_CONTROL[keyName] && META_SHIFT_CONTROL[keyName](event);
        } else {
            META_CONTROL[keyName] && META_CONTROL[keyName](event);
        }
    }

    cb && cb(element.value);
};
