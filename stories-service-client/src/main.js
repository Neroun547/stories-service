import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'

const app = createApp(App)

app.use(router);

axios.defaults.baseURL = 'http://localhost:3000/api';
axios.defaults.headers.common.Authorization = "Bearer " + localStorage.getItem("authToken");

app.use(VueAxios, axios);

app.mount('#app')
