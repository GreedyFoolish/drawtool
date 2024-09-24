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
        zoomInfo: {
            max: 2,
            min: 0.5,
            zoom: 1,
            offsetX: 0,
            offsetY: 0,
        },
        selectTool: "arrow",
        drawMode: "arrow",
        toolbarConfig: {}
    }),
    getters:{

    },
});
