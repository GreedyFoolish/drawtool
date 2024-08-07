import {defineStore} from "pinia";

export const settingStore = defineStore("settingStore", {
    state: () => ({
        pageZoom: 1,
        backgroundIns: null,
        activeIndex: "edit",
        backgroundImageURL: "",
        decorativeImageList: {},
        backgroundSetting: {
            width: 400,
            height: 300,
        },
        selectTool: "arrow",
        drawMode: "arrow",
        toolbarConfig: {}
    }),
    getters:{

    },
});
