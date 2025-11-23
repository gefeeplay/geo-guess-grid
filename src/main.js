import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Game from './components/Game.vue'
import Manual from './components/Manual.vue'

const router = createRouter({
  history: createWebHistory('/geo-guess-grid/'),
  routes: [
    { path: '/', name: 'Game', component: Game },
    { path: '/manual', name: 'Manual', component: Manual },
  ]
})

createApp(App)
  .use(router)
  .mount('#app')