<script setup>
import { ref, computed } from "vue";
import { questions } from "./data/questions";
import CountryInput from "./components/CountryInput.vue";
import { countryCodes } from "./data/countryCodes";
import "/node_modules/flag-icons/css/flag-icons.min.css";

const rows = 3;
const cols = 3;
const cells = 9;
const answers = ref(Array(cells).fill(""));
const points = ref(0);
const mistakes = ref(0);
const stats = ref({
  "Очки": points,
  "Ошибки": mistakes,
})

function getRandomUniqueQuestions(count) {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// выбираем 6 случайных вопросов без повторений
const allRandomQuestions = ref(getRandomUniqueQuestions(6));
// первые 3 — слева
const randomQuestionsLeft = ref(allRandomQuestions.value.slice(0, 3));
// следующие 3 — сверху
const randomQuestionsTop = ref(allRandomQuestions.value.slice(3, 6));

const possibleAnswers = computed(() => {
  const arr = [];
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const horizontal = randomQuestionsTop.value[row][1];
      const vertical = randomQuestionsLeft.value[col][1];
      // объединяем пересечение двух массивов
      const possible = horizontal.filter((country) =>
        vertical.includes(country)
      );
      arr.push(possible);
    }
  }
  return arr;
});

const selectedCell = ref(null);
const showModal = ref(false)
const selectedCountry = ref("")

//Обработка клика по ячейке
function handleClick(cell) {
  // если в ячейке уже есть ответ — ничего не делаем
  if (answers.value[cell - 1]) return;

  selectedCell.value = cell;
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

/* Обработка выбранной страны*/
function handleSelect(country) {
  selectedCountry.value = country;

  const idx = selectedCell.value - 1;
  const validCountries = possibleAnswers.value[idx];

  const isCorrect = validCountries.includes(country);  //правильность ответа

  //Ответ: страна и корректность
  answers.value[idx] = {
    country,
    correct: isCorrect
  };

  if (isCorrect) {
    points.value += 1;
  } else {
    mistakes.value += 1;
  }

  showModal.value = false;
}

// Поиск флага выбранной страны
const getFlag = (countryName) => {
  const code = countryCodes[countryName];

  // ISO-код найден → flag-icons
  if (code) {
    return { type: "flag-icons", value: code };
  }

  // Локальный svg
  try {
    const url = new URL(
      `./assets/FlagsNoInISO/${countryName}.svg`,
      import.meta.url
    ).href;

    return { type: "local", value: url };
  } catch (e) {
    console.warn("Флаг не найден:", countryName);
    return { type: "local", value: "" };
  }
};

// Обновление вопросов
function refreshQuestions() {
  const newSet = getRandomUniqueQuestions(6);
  randomQuestionsLeft.value = newSet.slice(0, 3);
  randomQuestionsTop.value = newSet.slice(3, 6);
  answers.value = Array(cells).fill("");
  points.value = 0;
  mistakes.value = 0;
}

</script>

<template>
  <div class="full-page">
    <!-- Модальное окно -->
    <CountryInput :show="showModal" @close="closeModal" @select="handleSelect" />
    
    <div class="nav-container">Вверхний навбар</div>

    <div class="center-container">
      <div class="title">
        <div>GeoGuessGrid - Triple G</div>
      </div>

      <div class="pg-con">
        <!-- Вопросы вертикально-->
        <div class="cells-quest">
          <div v-for="(question, index) in randomQuestionsLeft" :key="'top-' + index" class="cell-item-quest">
            {{ question[0] }}
          </div>
        </div>

        <div class="cells-ans">
          <!-- Вопросы горизонтально-->
          <div v-for="(question, index) in randomQuestionsTop" :key="'bottom-' + index" class="cell-item-quest">
            {{ question[0] }}
          </div>
          <!-- Ответы-->
          <div class="cell-item"
            v-for="cell in cells"
            @click="handleClick(cell)"
            :class="{
              filled: answers[cell - 1],
              correct: answers[cell - 1]?.correct === true,
              wrong: answers[cell - 1]?.correct === false
            }">

            <!-- Флаг страны-->
           <div v-if="answers[cell - 1]">
            <template v-if="getFlag(answers[cell - 1].country).type === 'flag-icons'">
              <div>
                <span class="flag-icon" :class="`fi fi-${getFlag(answers[cell - 1].country).value}`"></span>
              </div>
            </template>

            <template v-else>
              <div class="flag-icon">
                <img :src="getFlag(answers[cell - 1].country).value">
              </div>
            </template>
           </div>
            <!-- Сама страна-->
            <div v-if="answers[cell - 1]" class="cell-answer":class="{
              filled: answers[index],
              correct: answers[index]?.correct === true,
              wrong: answers[index]?.correct === false
              }"
            > 
              {{ answers[cell - 1].country }}
            </div>
          </div>
        </div>

        <div class="cells-stats">
          <div class="cell-item-quest stats-item">
            <div class="stat-icon"><span class="material-symbols-outlined share" @click="refreshQuestions">replay</span></div>
            <div class="stat-text">Начать заново</div>
          </div>

          <div v-for="(value, key) in stats" :key="key"  class="cell-item-quest stats-item">
            <div class="stat-value">{{ value }}</div>
            <div class="stat-text">{{ key }}</div>
          </div>
          <div class="cell-item-quest stats-item">
            <div class="stat-icon"><span class="material-symbols-outlined share">share</span></div>
            <div class="stat-text">Поделиться:</div>
          </div>
        </div>
      </div>
    </div>

    <div class="nav-container">Нижний навбар</div>
  </div>
</template>

<style scoped>
</style>
