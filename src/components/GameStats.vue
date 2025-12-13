<script setup>
import { Icon } from '@iconify/vue';
import { ref, computed } from 'vue';

const props = defineProps({
  points: Number,
  mistakes: Number,
  streak: Number,
  time: {
    type: Number,
    required: true,
  },
})

const total = computed(() => props.points + props.mistakes);

const streakLevel = computed(() => {
    if (props.streak >= 6) return 'high'
    if (props.streak >= 3) return 'medium'
    return 'low'
})

const formattedTime = computed(() => {
  const minutes = Math.floor(props.time / 60)
  const seconds = props.time % 60

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

const emit = defineEmits(["restart"]);
</script>

<template>
    <div class="cells-stats">
        <!-- Очки -->
        <div class="stats-item">
            <div class="stat-left">
                <div class="stat-text">Очки</div>
                <div class="stat-value">{{ points }}</div>
            </div>

            <div class="stat-icon" style="background-color: rgba(52, 101, 69, 0.7); color: #2bef7d;">
                <Icon icon="material-symbols:star-rounded" width="24" height="24" />
            </div>
        </div>

        <!-- Серия -->
        <!-- Серия -->
        <div class="stats-item">
            <div class="stat-left">
                <div class="stat-text">Серия</div>
                <div class="stat-value">{{ streak }}</div>
            </div>

            <div class="stat-icon flame" :class="streakLevel">
                <Icon icon="solar:flame-bold-duotone" width="24" height="24" />
            </div>
        </div>

        <!-- Время -->
        <div class="stats-item">
            <div class="stat-left">
                <div class="stat-text">Время</div>
                <div class="stat-value">{{ formattedTime }}</div>
            </div>
            <div class="stat-icon" style="background-color: rgba(61, 64, 139, 0.7); color: #60a5fa;">
                <Icon icon="majesticons:clock" width="24" height="24" />
            </div>
        </div>

        <!-- Попыток (ошибки + очки) -->
        <div class="stats-item">
            <div class="stat-left">
                <div class="stat-text">Попытки</div>
                <div class="stat-value">{{ total }}/9</div>
            </div>

            <div class="stat-icon" style="background-color: rgba(107,74,152,0.7); color: #bb81cc;">
                <Icon icon="uis:graph-bar" width="24" height="24" />
            </div>
        </div>

        <!-- Перезапуск -->
        <!--<div class="stats-item" @click="emit('restart')">
            <div class="stat-left">
                <div class="stat-text">Новая игра</div>
            </div>  
            
            <div class="stat-icon">
                <span class="material-symbols-outlined share">replay</span>
            </div>
        </div>
        
        <div class="stats-item">
            <div class="stat-left">
                <div class="stat-text">Поделиться</div>
            </div>
            <div class="stat-icon">
                <span class="material-symbols-outlined share">share</span>
            </div>    
        </div>
        -->
    </div>
</template>

<style scoped>
.cells-stats {
    justify-content: center;
    display: flex;
    margin-top: 25px;
    width: 90%;
    gap: 5px;
}

.stats-item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    box-sizing: border-box;
    height: 75px;
    width: max(120px, 22%);
    padding: 8px 10px;
    margin: 0 10px 10px 0;
    text-align: center;
    color: white;
    background-color: rgba(54, 34, 92, 0.8);
    border-radius: 10px;
}

.stat-left {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.stat-value {
    font-size: 20px;
    font-weight: 700;
    text-align: start;
}

.stat-icon {
    width: 40px;
    height: 40px;

    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    font-size: 22px;

}

.stat-text {
    text-align: start;
    font-size: small;
    color: #d1c0ee;
}

.share {
    cursor: pointer;
    font-size: 28px;
}

/* Базовое состояние */
.stat-icon.flame {
  background-color: rgba(110, 61, 61, 0.5);
  color: #fb923c;
  transition: all 0.3s ease;
}

/* 0–2 */
.stat-icon.flame.low {
  filter: brightness(0.9);
  opacity: 0.6;
}

/* 3–5 */
.stat-icon.flame.medium {
  filter: brightness(1.2);
  opacity: 0.85;
  box-shadow: 0 0 8px rgba(251, 146, 60, 0.5);
}

/* 6–9 */
.stat-icon.flame.high {
  filter: brightness(1.4);
  opacity: 0.95;
  box-shadow: 0 0 12px rgba(251, 146, 60, 0.9);
}

</style>