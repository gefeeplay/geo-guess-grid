import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('userStore', () => {
    const email = ref(localStorage.getItem('userEmail') || '');
    const jwtToken = ref(localStorage.getItem('jwt') || '');

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

    return { 
        email, 
        username, 
        jwtToken,
        isAuthenticated,
        setEmail, 
        setToken,
        clearAuth 
    };
});