import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getUserInfo } from '../api/auth';

export const useUserStore = defineStore('userStore', () => {
    const email = ref(localStorage.getItem('userEmail') || '');
    const jwtToken = ref(localStorage.getItem('jwt') || '');
    const isLoading = ref(false);

    const games_won = ref(NaN);
    const games = ref(NaN);
    const duels_won = ref(NaN);
    const duels= ref(NaN);

    const username = computed(() => {
        if (!email.value) return '';
        const name = email.value.split('@')[0] // до "@"
        return name
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

    function setStatistics(stats) {
        games_won.value = stats.games_won;
        games.value = stats.games
        duels_won.value = stats.duels_won
        duels.value =  stats.duels
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
        games_won,
        games,      
        duels_won, 
        duels,
        jwtToken,
        isAuthenticated,
        isLoading,
        setEmail,
        setStatistics, 
        setToken,
        clearAuth,
        checkAuth
    };
});