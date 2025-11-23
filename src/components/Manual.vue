<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const sections = [
  { id: 'population', label: 'Население' },
  { id: 'area', label: 'Площадь' },
  { id: 'capitals', label: 'Столицы' },
  { id: 'continents', label: 'Континенты' },
]

const active = ref('population')

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
      <div
        class="sidebar-item"
        v-for="s in sections"
        :key="s.id"
        :class="{ active: active === s.id }"
        @click="active = s.id"
      >
        {{ s.label }}
      </div>
    </aside>

    <!-- Контент -->
    <main class="content">
      <div v-if="active === 'population'">Здесь текст о населении стран.</div>
      <div v-if="active === 'area'">Здесь текст о площади.</div>
      <div v-if="active === 'capitals'">Здесь текст о столицах.</div>
      <div v-if="active === 'continents'">Здесь текст о континентах.</div>
    </main>

  </div>
</template>

<style scoped>
.manual-container {
  display: flex;
  height: 100vh;
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
  width: 260px;
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
}

</style>