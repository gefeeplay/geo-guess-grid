import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('userStore', () => {
    const email = ref('');

    // username = часть email до "@"
    const username = computed(() => {
        if (!email.value) return '';
        return email.value.split('@')[0];
    });

    function setEmail(newEmail) {
        email.value = newEmail;
    }

    return { email, username, setEmail };
});
