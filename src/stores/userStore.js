import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getUserInfo } from '../api/auth';

export const useUserStore = defineStore('userStore', () => {
    const email = ref(localStorage.getItem('userEmail') || '');
    const jwtToken = ref(localStorage.getItem('jwt') || '');
    const isLoading = ref(false);

    const username = computed(() => {
        if (!email.value) return '';
        return email.value.split('@')[0];
    });

    const isAuthenticated = computed(() => !!jwtToken.value);

    function setEmail(newEmail) {
        email.value = newEmail;
        localStorage.setItem('userEmail', newEmail);
    }

    function setToken(token) {
        jwtToken.value = token;
        localStorage.setItem('jwt', token);
    }

    function clearAuth() {
        email.value = '';
        jwtToken.value = '';
        localStorage.removeItem('userEmail');
        localStorage.removeItem('jwt');
    }

    // Функция для проверки валидности токена
    async function checkAuth() {
        if (!jwtToken.value) return false;
        
        isLoading.value = true;
        try {
            const response = await getUserInfo();
            // Если запрос прошел успешно, токен валиден
            // Можно обновить данные пользователя из response
            console.log('Токен валиден, данные пользователя:', response.data);
            return true;
        } catch (error) {
            console.error('Токен невалиден:', error);
            clearAuth(); // очищаем невалидный токен
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    return { 
        email, 
        username, 
        jwtToken,
        isAuthenticated,
        isLoading,
        setEmail, 
        setToken,
        clearAuth,
        checkAuth
    };
});