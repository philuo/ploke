export * from './keyboard';

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

class TaskQueue extends Array {
    private action: string;
    static actions: { [key: string]: { status: boolean; ret: number } } = {};

    // 任务构造器
    constructor(action: string) {
        super();
        TaskQueue.actions[action] = {
            status: false,
            ret: 0,
        };
        this.action = action;
    }

    // 任务执行器
    async shift() {
        TaskQueue.actions[this.action].ret += 1;
        // caller数量大于1 - 退出
        if (TaskQueue.actions[this.action].ret > 1) {
            TaskQueue.actions[this.action].ret = 1;
            return;
        }

        // 任务 - 进行态
        if (!!this.length) {
            // 任务出队 - 待执行
            const func = Array.prototype.shift.call(this);
            try {
                await func();
            } catch {
                /* None */
            }
            // 任务完成 - 吊起下一个任务
            TaskQueue.actions[this.action].ret -= 1;
            this.shift();
        }
        // 任务 - 完成态
        else {
            TaskQueue.actions[this.action].status = false;
            TaskQueue.actions[this.action].ret = 0;
        }
    }

    push(...args: Function[]): number {
        args.forEach((cb: Function) => Array.prototype.push.call(this, cb));
        this.start();
        return args.length;
    }

    stop() {
        TaskQueue.actions[this.action].ret = 2;
        TaskQueue.actions[this.action].status = false;
    }

    start() {
        if (this.length && !TaskQueue.actions[this.action].status) {
            TaskQueue.actions[this.action].ret = 0;
            TaskQueue.actions[this.action].status = true;
            this.shift();
        }
    }
}

export class AutoTaskQueue {
    private threshold: number;
    private task: { [key: string]: TaskQueue };

    constructor() {
        this.task = {};

        // 同类型任务排队阈值
        this.threshold = 4;
    }

    has(action: string) {
        if (this.task[action]) {
            return true;
        }
        return false;
    }

    set(action: string, ...args: Function[]) {
        if (!this.has(action)) {
            this.task[action] = new TaskQueue(action);
        }
        if (this.get(action).length > this.threshold) {
            this.get(action).pop();
        }
        this.get(action).push(...args);
    }

    get(action: string) {
        return this.task[action];
    }

    changeThreshold(num: number) {
        if (num > 0) {
            this.threshold = num;
        }
    }
}

/// on once remove
enum ExecStatus {
    One,
    Every,
    Done,
}

export interface EventMaping {
    [key: string]: {
        /**
         * 0 - 仅执行一次
         * 1 - 不限执行次数
         * 2 - 执行完成
         */
        status: ExecStatus;

        cb: Function;
    }[];
}

const events: EventMaping = {};

export class EventBus {
    static on(e: string, cb: Function) {
        e && !events[e] && (events[e] = []);
        events[e] && typeof cb === 'function'
            && !~events[e].findIndex((p) => p.cb === cb)
            && events[e].push({ cb, status: ExecStatus.Every });
    }

    static once(e: string, cb: Function) {
        e && !events[e] && (events[e] = []);
        events[e] && typeof cb === 'function'
        && !~events[e].findIndex((p) => p.cb === cb)
        && events[e].push({ cb, status: ExecStatus.One });
    }

    static remove(e: string, cb: Function) {
        if (!e || !events[e]) {
            return false;
        }

        const index = events[e].findIndex((p) => p.cb === cb);

        if (~index) {
            events[e].splice(index, 1);
        }

        return false;
    }

    static emit(e: string, ...args: any) {
        if (!events[e]) {
            return false;
        }
        events[e].forEach(async (p) => {
            if (p.status !== ExecStatus.Done) {
                await p.cb(...args);
            }
            if (p.status === ExecStatus.One) {
                p.status = ExecStatus.Done;
            }
        });
    }
}

export const isPhone = (ua: string): boolean => {
    return /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(
        ua
    );
}

export const taskQueue = () => new AutoTaskQueue();