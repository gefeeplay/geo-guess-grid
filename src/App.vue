<script setup>
/*import { onMounted } from 'vue';
import { getUserInfo } from './api/auth.js';
// Проверка токена при загрузке компонента/приложения
onMounted(async () => {
    try {
        const response = await getUserInfo();
        console.log('Данные пользователя:', response.data);
        // Здесь можно обновить store с данными пользователя
    } catch (error) {
        console.error('Токен невалиден:', error);
        // Удаляем невалидный токен
        localStorage.removeItem('jwt');
    }
});*/
</script>

<template>
  <router-view />
</template>

<style scoped>
</style>
