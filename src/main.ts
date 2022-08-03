import { createApp } from 'vue';

// 全局樣式
import '@/assets/css/global.less';
import '@/assets/css/main.css'

// 引入 Antd 
import Antd from 'ant-design-vue';

import App from '@/App.vue';
import router from '@/config/routes';
import store from '@/config/store';
import i18n from '@/config/i18n';


const app = createApp(App);
app.use(router);
app.use(store);
app.use(Antd);
app.use(i18n);
app.mount('#app');
