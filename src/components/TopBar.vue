<script setup>
import { ref } from 'vue';

const username = ref('');
const emit = defineEmits(['open-auth']);

function onProfileClick() {
  if (!username.value) {
    emit('open-auth'); 
  } else {
    console.log("Открыть профиль пользователя");
  }
}
</script>

<template>
    <div class="nav-container">
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
          <span class="material-symbols-outlined">trophy</span>
        </div>
        <div class="profile" @click="onProfileClick">
        <span class="material-symbols-outlined">person</span>
        <span>{{ username || 'Войти' }}</span>
      </div>
        
      </div>      
    </div>
</template>

<style scoped>

.nav-container {
  display: flex;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
  height: 10%;
  padding-left:20px;
} 

.nav-con {
  display: flex;
  gap: 10px;
  padding-right: 20px;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 2px;
    cursor: pointer;
}

.underlined-text {
  text-decoration: underline;
}

.link {
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 5px;
}

.achievements{
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #9f7472;
}
.profile {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 4px;
  padding-left: 5px;
  height: 40px;
  width: 125px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #9f7472;
}

.profile:hover, .achievements:hover {
  background-color: #b67876;
  cursor: pointer;
}
</style>