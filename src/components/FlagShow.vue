<script setup>
import { computed } from "vue";
import "/node_modules/flag-icons/css/flag-icons.min.css";

// Импортируем таблицу ISO-кодов
import { countryCodes } from "../data/countryCodes";

// Принимаем страну
const props = defineProps({
    country: { type: String, required: true }
});

// Поиск флага выбранной страны
const getFlag = (countryName) => {
    if (!countryName) return { type: null, value: "" };

    const code = countryCodes[countryName];
    if (code) {
        return { type: "flag-icons", value: code };
    }

    try {
        const url = new URL(
            `../assets/FlagsNoInISO/${countryName}.svg`,
            import.meta.url
        ).href;

        return { type: "local", value: url };
    } catch {
        return { type: null, value: "" };
    }
};

// Автоматически получаем флаг
const flag = computed(() => getFlag(props.country));
</script>

<template>
    <div class="flag-wrapper">
        <span v-if="flag.type === 'flag-icons'" class="flag-icon" :class="`fi fi-${flag.value}`"></span>

        <img v-else class="flag-icon" :src="flag.value" :alt="country" />
    </div>
</template>

<style scoped>
.flag-icon,
.flag-icon img {
    width: 64px !important;
    height: 48px;
}

@media (max-width: 500px) {

    .flag-icon,
    .flag-icon img {
        width: 44.8px !important;
        height: 33.6px !important;
    }
}
</style>