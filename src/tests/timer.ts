import { Suite } from 'benchmark';
const suite = new Suite();

export function racemark_single_thread(cb1: Function, cb2: Function) {
    suite
        .add(`${cb1.name}`, function () {
            cb1();
        })
        .add(`${cb2.name}`, function () {
            cb2();
        })
        .on('cycle', function (e: any) {
            console.log(String(e.target));
        })
        .on('complete', function (this: any) {
            console.log(
                'The fasted method is ' + this.filter('fastest').map('name')
            );
        })
        .run({ async: true });
}

export default {
    racemark_single_thread
}
