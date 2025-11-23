<script setup>

</script>

<template>
    <div class="nav-container">
        <router-link to="/manual" class="nav-item link">
            <span class="material-symbols-outlined">dictionary</span>
            <span style="text-decoration: underline;">Справочник</span>
        </router-link>
        <div class="nav-item">
           <span class="material-symbols-outlined">swords</span>
            <span style="text-decoration: underline;">Дуэли</span>
        </div>
    </div>
</template>

<style scoped>

.nav-container {
  display: flex;
  box-sizing: border-box;
  align-items: center;
  gap: 10px;
  height: 10%;
  padding-left:20px;
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
</style>