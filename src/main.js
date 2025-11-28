import { createApp } from 'vue'
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Game from './components/Game.vue'
import Manual from './components/Manual.vue'
import VerifyEmail from './components/VerifyEmail.vue'

const router = createRouter({
  history: createWebHistory('/geo-guess-grid/'),
  routes: [
    { path: '/', name: 'Game', component: Game },
    { path: '/manual', name: 'Manual', component: Manual },
    { path: '/verify', name: 'VerifyEmail', component: VerifyEmail }
  ]
})

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app
  .use(router)
  .use(pinia)
  .mount('#app')