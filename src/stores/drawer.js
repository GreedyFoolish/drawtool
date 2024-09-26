import {defineStore} from "pinia";
import {DrawActionStepper} from "@/utils/index.js";

export const settingStore = defineStore("settingStore", {
    state: () => ({
        pageZoom: 1,
        backgroundIns: null,
        writeBoardIns: null,
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
        actionDisabled: {
            lastStep: true,
            nextStep: true,
        },
        actionStepper: new DrawActionStepper(),
        selectTool: "arrow",
        drawMode: "arrow",
        toolbarConfig: {}
    }),
    getters:{

    },
});
