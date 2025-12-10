<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { populationQuestions } from '../data/Manual/population'
import { countryCodes } from '../data/countryCodes'

const router = useRouter()

const sections = [
  { id: 'population', label: 'Население' },
  { id: 'area', label: 'Площадь' },
  { id: 'capitals', label: 'Столицы' },
  { id: 'continents', label: 'Континенты' },
]

function getCountryCode(country) {
  return countryCodes[country] || null;
}

function getLocalFlag(country) {
  return new URL(`../assets/FlagsNoInISO/${country}.svg`, import.meta.url).href;
}

const active = ref('population')

const expanded = ref([]);

function toggle(index) {
  expanded.value[index] = !expanded.value[index];
}

function closeManual() {
  router.push('/')   // возвращаемся на главную
}
</script>

<template>
  <div class="manual-container">

    <button class="close-btn" @click="closeManual">
      <span class="material-symbols-outlined btn">close</span>
    </button>

    <!-- Левая навигация -->
    <aside class="sidebar">
      <div class="sidebar-title">Категории</div>
      <div class="sidebar-item" v-for="s in sections" :key="s.id" :class="{ active: active === s.id }"
        @click="active = s.id">
        {{ s.label }}
      </div>
    </aside>

    <!-- Контент -->
    <main class="content">
      <div v-if="active === 'population'">
        <h2>Население</h2>
        <div v-for="(question, index) in populationQuestions" :key="index" class="question-block">

          <div class="toggle-btn">
            {{ question[0] }}
            <!-- Кнопка раскрытия / скрытия -->
            <img class="arrow" v-if="expanded[index]"src="../assets/down-arrow.svg" @click="toggle(index)"></img>
            <img class="arrow" v-else src="../assets/back-arrow.svg" @click="toggle(index)"></img>
          </div>
          <!-- Разворачиваемый блок -->
          <transition name="fade">
            <div v-if="expanded[index]" class="countries-grid">
              <div v-for="country in question[1]" :key="country" class="country-item">

                <div class="flag-wrapper">

                  <!-- Если есть код — вставляем flag-icons -->
                  <span v-if="getCountryCode(country)" class="flag-icon fi"
                    :class="`fi-${getCountryCode(country)}`"></span>
                  <!-- Иначе — локальный файл -->
                  <img v-else class="flag-icon" :src="getLocalFlag(country)" />
                </div>

                {{ country }}
              </div>
            </div>
          </transition>
        </div>

      </div>
      <div v-if="active === 'area'">Здесь текст о площади.</div>
      <div v-if="active === 'capitals'">Здесь текст о столицах.</div>
      <div v-if="active === 'continents'">Здесь текст о континентах.</div>
    </main>

  </div>
</template>

<style scoped>
.manual-container {
  display: flex;
  min-height: 100vh;
  background: #9e7b79;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  background: #e2cfcf;
  border: 2px solid #ccc;
  border-radius: 14px;
  cursor: pointer;
  transition: 0.2s;
}

.close-btn:hover {
  background: #f0f0f0;
}

/* Левая панель */
.sidebar {
  width: min(260px, 20%);
  background: #f3f3f3;
  border-right: 1px solid #ccc;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  background: #9e7b79;
}

.sidebar-item {
  padding: 14px 20px;
  cursor: pointer;
  border-left: 4px solid transparent;
}

.sidebar-item.active {
  background: #e2cfcf;
  border-left: 4px solid #42b883;
  font-weight: bold;
}

.sidebar-title {
  font-size: large;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

/* Правая область */
.content {
  flex: 1;
  padding: 20px 40px;
}

.arrow{
  width: 16px;
  height: 16px;
  cursor: pointer;
  margin-left: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.toggle-btn {
  display: flex;
  align-items: center;
  margin: 10px 0px;
}

.content-title {
  margin-top: 10px;
}

.content-length {
  font-size: small;
  margin-top: 10px;
}

h2 {
  margin-bottom: 20px;
  text-align: center;
}

.countries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 4px;
  margin-top: 10px;
  font-size: x-small;
}

.country-item {
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2px;
}

.flag-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4px;
}

@media (max-width: 500px) {
  .close-btn {
    width: 20px;
    height: 20px;
  }

  .sidebar {
    width: 120px;
  }

  .btn {
    font-size: 16px;
  }

  .sidebar-item {
    font-size: x-small;
    padding: 7px 10px;
    cursor: pointer;
    border-left: 4px solid transparent;
  }

  .sidebar-title {
    font-size: small;
  }

  .content {
    flex: 1;
    font-size: x-small;
    padding: 10px 20px;
  }

  .country-item{
    width: 80px;
    font-size: xx-small;
  }
}
</style>