<script setup>
import { ref, computed } from 'vue'
import { countries } from '../data/countries'

const props = defineProps({
  show: Boolean,
})

const emits = defineEmits(['close', 'select'])

// Закрытие модалки
function close() {
  emits('close')
}

// Поиск и выбор страны
const query = ref("") // что ввёл пользователь
const selectedCountry = ref("") // выбранная страна

// фильтрация стран
const filteredCountries = computed(() => {
  if ((!query.value.trim()) || query.value.length < 2)
    return []
  const q = query.value.toLowerCase()
  return countries.filter(c => c.toLowerCase().includes(q))
})

// выбор страны
function selectCountry(country) {
  selectedCountry.value = country
  emits("select", country)
  query.value = country
  emits('close');
  query.value = ""
}
</script>

<template>
    <div v-if="show" class="modal" @click.self="close">
        <div class="con">
            <div class="group">
                <svg class="icon" aria-hidden="true" viewBox="0 0 24 24">
                    <g>
                        <path
                            d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z">
                        </path>
                    </g>
                </svg>
                <input v-model="query" placeholder="Начните вводить..." type="search" class="input">
            </div>
            <!-- Выпадающий список -->
            <ul v-if="filteredCountries.length" class="dropdown">
                <li v-for="country in filteredCountries" :key="country" class="dropdown-item" @click="selectCountry(country)">
                    {{ country }}
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.modal {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    animation: fadeIn 0.2s ease;
}

/* Анимации */
@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

/*Инпут + список стран*/ 
.con {
    display: flex;
    flex-direction: column;
    height: 250px;
    max-width: 350px;
    position: relative;
    overflow: hidden;
    /* скрывает всё, что выходит за границы блока */
}

.group {
    display: flex;
    line-height: 28px;
    align-items: center;
    position: relative;
    max-width: 350px;
}

.dropdown {
    position: absolute;
    top: 50px;
    /* отступ вниз от инпута */
    display: flex;
    flex-direction: column;
    gap: 4px;
    border-radius: 8px;
    margin-top: 4px;
    width: 100%;
    max-height: 200px;
    list-style: none;
    padding: 0;

    max-height: 180px;
    /* ограничиваем видимую высоту */
    overflow-y: auto;
    /* добавляем вертикальный скролл */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.dropdown::-webkit-scrollbar {
    width: 6px;
}

.dropdown::-webkit-scrollbar-thumb {
    background-color: #bbb;
    border-radius: 4px;
}

.dropdown::-webkit-scrollbar-thumb:hover {
    background-color: #999;
}

.dropdown-item {
    padding: 8px 12px;
    border-radius: 8px;
    background: white;
    cursor: pointer;
}

.dropdown-item:hover {
    background: rgb(200, 200, 200);
}

.input {
    width: 350px;
    height: 40px;
    line-height: 28px;
    padding: 0 1rem;
    padding-left: 2.5rem;
    border: 2px solid transparent;
    border-radius: 8px;
    outline: none;
    background-color: #f3f3f4;
    color: #0d0c22;
    font-family: "Comfortaa", "Open Sans", sans-serif;
    transition: .3s ease;
}

.input::placeholder {
    color: #9e9ea7;
}

.input:focus,
input:hover {
    outline: none;
    border-color: rgb(100, 100, 150);
    background-color: #fff;
    box-shadow: 0 0 0 4px rgba(90, 90, 135, 0.3);
}

.icon {
    position: absolute;
    left: 1rem;
    fill: #9e9ea7;
    width: 1rem;
    height: 1rem;
}
</style>