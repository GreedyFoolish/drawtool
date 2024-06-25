import {createApp} from 'vue'
import {createPinia} from "pinia";
import {getLangText, setLang} from "@/lang";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(ElementPlus)
// 挂载全局函数
app.config.globalProperties.$getLangText = getLangText
await Promise.all([setLang()]);
app.mount('#app')

