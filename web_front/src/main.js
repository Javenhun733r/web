import { createApp } from 'vue'
import App from './App.vue'
import router from "@/components/router";
import {FontAwesomeIcon} from "@/components/plugins/fontAwesome";

const app = createApp(App).component("font-awesome-icon", FontAwesomeIcon);
app.use(router)
app.mount('#app')