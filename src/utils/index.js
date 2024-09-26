import {settingStore} from "@/stores/drawer.js";

// 撤销/反撤销实现类
export class DrawActionStepper {
    step = 0;
    actions = [];
    // 恢复操作实现
    reduceMap = {
        drawChange: {
            last: (data) => {
                settingStore().writeBoardIns.setPageAction(data, "last");
            },
            next: (data) => {
                settingStore().writeBoardIns.setPageAction(data, "next");
            },
        },
    }

    // 操作行为入栈
    addAction(action) {
        this.actions = this.actions.slice(0, this.step);
        this.actions.push(action);
        this.step++;
        this.checkAction()
        return this;
    }

    // 上一步
    lastStep() {
        if (this.notAllowLast()) {
            return false;
        }
        const action = this.actions[this.step - 1];
        this.reduceMap[action.type].last(action.data);
        this.step--;
        this.checkAction()
    }

    // 下一步
    nextStep() {
        if (this.notAllowNext()) {
            return false;
        }
        const action = this.actions[this.step];
        this.reduceMap[action.type].next(action.data);
        this.step++;
        this.checkAction()
    }

    // 更新上一步，下一步禁用状态
    checkAction() {
        settingStore().actionDisabled.lastStep = this.notAllowLast();
        settingStore().actionDisabled.nextStep = this.notAllowNext();
    }

    // 判断是否可以上一步
    notAllowLast() {
        return this.step <= 0;
    }

    // 判断是否可以下一步
    notAllowNext() {
        return this.actions.length === this.step;
    }
}

// 防抖
export class AntiShake {
    constructor(fn, time = 400) {
        this.fn = fn;
        this.time = time;
    }

    shaking = false;
    args = null;

    start(...args) {
        this.args = args;
        if (this.shaking === false) {
            this.shaking = true;
            setTimeout(() => {
                if (this.shaking === true) {
                    this.shaking = false;
                    this.fn?.(...this.args);
                }
            }, this.time);
        }
    }

    stop() {
        this.shaking = false;
    }
}
