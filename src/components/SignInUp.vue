<script setup>
import { ref, computed } from 'vue';
import { registerUser, loginUser } from '../api/auth.js';
import { useUserStore } from '../stores/userStore.js';

const userStore = useUserStore();

const emit = defineEmits(['close', 'auth-success']);

// режим формы: 'signin' или 'signup'
const mode = ref('signin');
const isSignIn = computed(() => mode.value === 'signin');

function toggleMode() {
    mode.value = isSignIn.value ? 'signup' : 'signin';
}

// email / password
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');

// Видимость пароля
const showPassword = ref(false);
function togglePassword() {
    showPassword.value = !showPassword.value;
}

// Проверка сложности: минимум 10 символов + хотя бы одна цифра
const passwordValid = computed(() => {
    return password.value.length >= 10 && /\d/.test(password.value);
});

// Совпадение паролей
const passwordsMatch = computed(() => {
    if (isSignIn.value) return true;
    return password.value === passwordConfirm.value;
});

// Финальная валидация формы
const formValid = computed(() => {
    if (isSignIn.value) {
        return email.value.length > 0 && password.value.length > 0;
    }
    return email.value.length > 0 && passwordValid.value && passwordsMatch.value;
});

// ===============================
//         ОТПРАВКА ФОРМЫ
// ===============================
async function submit() {
    errorMsg.value = '';

    try {
        if (isSignIn.value) {
            // LOGIN
            const res = await loginUser(email.value, password.value);
            const token = res.data.access_token;

            localStorage.setItem('jwt', token);

            userStore.setEmail(email.value);
            emit("auth-success");
            isLogin.value = true
            setTimeout( () => emit("close"), 1000)
        } else {
            // REGISTER
            await registerUser(email.value, password.value);

            // сразу логиним после регистрации
            const res = await loginUser(email.value, password.value);
            const token = res.data.access_token;

            localStorage.setItem('jwt', token);

            userStore.setEmail(email.value);
            emit("auth-success");
            isLogin.value = true
            setTimeout( () => emit("close"), 1000)
        }
    } catch (err) {
        errorMsg.value = err.response?.data?.detail || 'Ошибка при запросе';
    }
}

const errorMsg = ref('');
const isLogin = ref(false);

</script>

<template>
    <!-- МОДАЛЬНАЯ ОБЛАСТЬ -->
    <teleport to="body">
        <div class="modal-overlay" @click.self="emit('close')">
            <div class="modal">
                <form class="form">
                    <!-- Кнопка закрытия -->
                    <span class="close-btn material-symbols-outlined" @click="emit('close')">close</span>

                    <div class="flex-column">
                        <label>Email </label>
                    </div>

                    <div class="inputForm">
                        <span class="material-symbols-outlined">alternate_email</span>
                        <input type="text" class="input" placeholder="Enter your Email" v-model="email">
                    </div>

                    <!-- PASSWORD -->
                    <div class="flex-column">
                        <label>Password </label>
                    </div>
                    <div class="inputForm">
                        <span class="material-symbols-outlined">{{ showPassword ? 'lock_open_right' : 'lock' }}</span>

                        <input :type="showPassword ? 'text' : 'password'" class="input"
                            placeholder="Enter your Password" v-model="password">

                        <span class="material-symbols-outlined visible" @click="togglePassword">
                            {{ showPassword ? 'visibility' : 'visibility_off' }}
                        </span>
                    </div>

                    <!-- Ошибка сложности -->
                    <p class="info p" v-if="!passwordValid && !isSignIn">
                        Пароль должен иметь минимум 10 символов и хотя бы одну цифру
                    </p>

                    <!-- CONFIRM PASSWORD (только в режиме регистрации) -->
                    <div v-if="!isSignIn">
                        <div class="flex-column" style="margin-bottom: 10px;">
                            <label>Confirm Password</label>
                        </div>

                        <div class="inputForm">
                            <span class="material-symbols-outlined">{{ showPassword ? 'lock_open_right' :
                                'lock'}}</span>

                            <input :type="showPassword ? 'text' : 'password'" class="input"
                                placeholder="Repeat Password" v-model="passwordConfirm">
                        </div>

                        <!-- Ошибка несовпадения -->
                        <p class="info p" v-if="!passwordsMatch">
                            Пароли не совпадают
                        </p>
                    </div>

                    <button v-if="isSignIn" class="button-submit" :disabled="!formValid" @click.prevent="submit">
                        Sign In
                    </button>

                    <button v-else class="button-submit" :disabled="!formValid" @click.prevent="submit">
                        Sign Up
                    </button>

                    <p class="info p" v-if="isLogin" style="color: green;">
                        Авторизация успешна!
                    </p>

                    <p class="info p" v-if="errorMsg" style="color: red;">
                        {{ errorMsg }}
                    </p>

                    <p class="p">
                        {{ isSignIn ? "Don't have an account?" : "Already have an account?" }}
                        <span class="span" @click="toggleMode">
                            {{ isSignIn ? 'Sign Up' : 'Sign In' }}
                        </span>
                    </p>
                </form>
            </div>
        </div>
    </teleport>
</template>

<style scoped>
.form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #ffffff;
    padding: 30px;
    width: 450px;
    border-radius: 20px;
}

.form button {
    align-self: flex-end;
}

.flex-column>label {
    color: #151717;
    font-weight: 600;
}

.inputForm {
    border: 1.5px solid #ecedec;
    border-radius: 10px;
    height: 50px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    transition: 0.2s ease-in-out;
}

.input {
    margin-left: 10px;
    border-radius: 10px;
    border: none;
    width: 85%;
    height: 100%;
    font-family: Comfortaa, sans-serif;
}

.input:focus {
    outline: none;
}

/* Убираем фон и рамку при autofill */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: black !important;
    transition: background-color 9999s ease-in-out 0s !important;
    box-shadow: 0 0 0px 1000px #ffffff inset !important;
    /* или другой фон */
}

.inputForm:focus-within {
    border: 1.5px solid #2d79f3;
}

.flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
}

.flex-row>div>label {
    font-size: 14px;
    color: black;
    font-weight: 400;
}

.span {
    font-size: 14px;
    margin-left: 5px;
    color: #2d79f3;
    font-weight: 500;
    cursor: pointer;
}

.button-submit {
    margin: 20px 0 10px 0;
    background-color: #151717;
    border: none;
    color: white;
    font-size: 15px;
    font-weight: 500;
    border-radius: 10px;
    height: 50px;
    width: 100%;
    cursor: pointer;
}

.button-submit:hover {
    background-color: #252727;
}

.button-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.p {
    text-align: center;
    color: black;
    font-size: 14px;
    margin: 5px 0;
}

.info {
    color: red;
    font-size: 12px;
    margin: 0 0 5px 0;
}

.btn {
    margin-top: 10px;
    width: 100%;
    height: 50px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    gap: 10px;
    border: 1px solid #ededef;
    background-color: white;
    cursor: pointer;
    transition: 0.2s ease-in-out;
}

.btn:hover {
    border: 1px solid #2d79f3;
    ;
}

/* затемнение фона */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.55);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

/* сам модальный блок */
.modal {
    position: relative;
    animation: showModal 0.25s ease-out;
}

@keyframes showModal {
    from {
        transform: translateY(-10px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* кнопка закрытия */
.close-btn {
    position: relative;
    top: -15px;
    left: 435px;
    background: white;
    max-width: fit-content;
    border-radius: 50%;
    padding: 6px;
    cursor: pointer;
    font-size: 22px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.close-btn:hover {
    background: #eee;
}

.visible {
    cursor: pointer;
}

.visible:hover {
    color: #949494;
}
</style>