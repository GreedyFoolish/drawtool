import {settingStore} from "@/stores/drawer.js";

// 撤销/反撤销实现类
export class DrawActionStepper {
    lock = false;
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
        // 查询当前笔画是否有前置笔画操作行为是否已经入栈（比如当前笔画要和之前的笔画进行合并）
        const index = this.actions.findIndex(item => item.data.id === action.data.id)
        if (index === -1) {
            // 若没有该前置笔画操作行为，则直接添加即可
            this.actions.push(action);
            this.step++;
        } else {
            // 若有该前置笔画操作行为，则将前置笔画操作删除并添加最新操作
            this.actions.splice(index, 1)
            this.actions.push(action);
        }
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
        return this.lock || this.step <= 0;
    }

    // 判断是否可以下一步
    notAllowNext() {
        return this.lock || this.actions.length === this.step;
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
