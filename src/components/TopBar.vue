<script setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/userStore.js';
import { getUserStatistics } from '../api/auth.js';
import { Icon } from '@iconify/vue';

const userStore = useUserStore();

const emit = defineEmits(['open-auth', 'open-profile']);

async function onProfileClick() {
  if (!userStore.username) {
    emit('open-auth');
    
  } else {
    emit('open-profile');
    const res = await getUserStatistics();
    if (res.status === 200) {
        userStore.setStatistics(res.data);
    }
    else {
        console.error('Failed to fetch user statistics:', res);
    } 
  }
}
</script>

<template>
  <div class="nav-container">
    <div class="nav-left">
      <div class="logo-block">
        <div class="nav-item logo">
          <span class="material-symbols-outlined">public</span>
          <span class="underlined-text">GeoMatch</span>
        </div>
        <div class="subtitle">Игра в категории стран</div>
      </div>
    </div>

    <div class="nav-con">
      <router-link to="/manual" class="nav-item link">
        <span class="material-symbols-outlined">dictionary</span>
        <span style="text-decoration: underline;">Справочник</span>
      </router-link>

      <div class="nav-item">
        <span class="material-symbols-outlined">swords</span>
        <span style="text-decoration: underline;">Дуэли</span>
      </div>
    </div>

    <div class="nav-con">
      <div class="achievements">
        <Icon icon="material-symbols:trophy-rounded" width="24" height="24" color="rgb(216 191 91)"/>
      </div>

      <div class="profile" @click="onProfileClick">
        <span class="material-symbols-outlined">person</span>
        <span>{{ userStore.username || 'Войти' }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>

.nav-container {
  background: linear-gradient(90deg, #1c1b33 0%, #322a57 50%, #4b3072 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  height: 70px;
  color: #E7E6FF; /* основной цвет текста */
}

.nav-left {
  display: flex;
  flex-direction: column;
}

.logo-block {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.subtitle {
  font-size: 12px;
  opacity: 0.75;
  margin-left: 25px;
  margin-top: -2px;
  color: rgba(255, 255, 255, 0.65);
}

.nav-con {
  display: flex;
  gap: 16px;
  align-items: center;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.material-symbols-outlined {
  color: #D6D4FF;
  font-size: 20px;
  transition: color 0.15s ease;
}

/* При наведении текст и иконки могут становиться немного ярче */
.nav-item:hover span,
.profile:hover span,
.achievements:hover span {
  color: #FFFFFF;
}

.underlined-text {
  font-size: 18px;
  text-decoration: underline;
}

.link {
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Правый блок */
.achievements,
.profile {
  display: flex;
  align-items: center;
  gap: 6px;
  box-sizing: border-box;
  height: 32px;
  padding: 0 6px;
  border-radius: 10px;

  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  transition: background 0.2s ease, color 0.2s ease;
}

.profile:hover,
.achievements:hover {
  background: rgba(255, 255, 255, 0.12);
}

.achievements {
  width: 32px;
  justify-content: center;
  padding: 0;
}

.profile {
  width: auto;
}
</style>