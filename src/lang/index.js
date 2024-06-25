import {ref} from "vue";
import {languages, targets} from "@/lang/target.js";

const langData = ref({});
export const lang = ref("");
export const getLangText = (key) => {
    if (key in langData.value) {
        return langData.value[key];
    } else {
        console.warn(`key "${key}" may not be translated`);
        return key;
    }
};
export const setLang = async (newLang = localStorage.getItem("language") || navigator.language) => {
    lang.value = languages[newLang] ?? (newLang in targets ? newLang : "en");
    localStorage.setItem("language", lang.value);
    try {
        const {dataList} = await import(`./lib/${lang.value}.js`);
        langData.value = dataList;
    } catch {
        const {dataList} = await import("./lib/zh-CHS.js");
        langData.value = dataList;
    }
};
