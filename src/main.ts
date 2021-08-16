import { createApp } from 'vue';
import Plog from './components/common/Plog';
import App from './App.vue';
import '@styles/index.scss';

const app = createApp(App);
app.component('Plog', Plog);
app.mount('#app');
