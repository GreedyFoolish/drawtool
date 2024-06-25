import {defineStore} from "pinia";

export const settingStore = defineStore("settingStore", {
    state: () => ({
        activeIndex: "edit",
        timestamp: new Date().getTime(),
    }),
    getters:{

    },
});
