import { createApp } from 'vue';
import App from './App.vue';

// eslint-disable-next-line
import Varlet from '@varlet/ui';
import '@varlet/ui/es/style';

import '@/css/main.scss';

import router from './router';
import store from './store';
import i18n from './i18n';

const app = createApp(App);

app.use(store);
app.use(router);
app.use(i18n);
app.use(Varlet);

app.mount('#app');
