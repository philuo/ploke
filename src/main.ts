import { createApp } from 'vue';
import Plog from './components/common/Plog';
import PlogSsr from './components/common/PlogSsr';
import App from './App.vue';
import '@styles/index.scss';

const app = createApp(App);
app.component('Plog', Plog);
app.component('PlogSsr', PlogSsr);
app.mount('#app');
