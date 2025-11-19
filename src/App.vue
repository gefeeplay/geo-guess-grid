<script setup>
import { ref, computed } from "vue";
import { questions } from "./data/questions";
import CountryInput from "./components/CountryInput.vue";

const rows = 3;
const cols = 3;
const cells = 9;
const answers = ref(Array(cells).fill(""));

function getRandomUniqueQuestions(count) {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// выбираем 6 случайных вопросов без повторений
const allRandomQuestions = ref(getRandomUniqueQuestions(6));
// первые 3 — верхние
const randomQuestionsTop = ref(allRandomQuestions.value.slice(0, 3));
// следующие 3 — нижние
const randomQuestionsBottom = ref(allRandomQuestions.value.slice(3, 6));

const possibleAnswers = computed(() => {
  const arr = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const horizontal = randomQuestionsBottom.value[row][1];
      const vertical = randomQuestionsTop.value[col][1];
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

  if (validCountries.includes(country)) {
    answers.value[idx] = country; // ✅ верный ответ
  } else {
    answers.value[idx] = `❌ ${country}`; // ❌ неверный
  }

  showModal.value = false;
}

function refreshQuestions() {
  const newSet = getRandomUniqueQuestions(6);
  randomQuestionsTop.value = newSet.slice(0, 3);
  randomQuestionsBottom.value = newSet.slice(3, 6);
}

</script>

<template>
  <div class="full-page">
    <!-- Модальное окно -->
    <CountryInput :show="showModal" @close="closeModal" @select="handleSelect"/>

    <div class="nav-container">Вверхний навбар</div>

    <div class="center-container">
      <div class="title">
        <div>GeoGuessGrid - Triple G</div>
      </div>

      <div class="pg-con">
        <!-- Вопросы вертикально-->
        <div class="cells-quest">
          <div v-for="(question, index) in randomQuestionsTop" :key="'top-' + index" class="cell-item-quest">
            {{ question[0] }}
          </div>
        </div>

        <div class="cells-ans">
          <!-- Вопросы горизонтально-->
          <div v-for="(question, index) in randomQuestionsBottom" :key="'bottom-' + index" class="cell-item-quest">
            {{ question[0] }}
          </div>
          <!-- Ответы-->
          <div class="cell-item" v-for="cell in cells" @click="handleClick(cell)" :class="{ filled: answers[cell - 1] }">
            <div v-if="answers[cell - 1]" class="cell-answer">{{ answers[cell - 1] }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="nav-container">Нижний навбар</div>
  </div>
</template>

<style scoped>
.full-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.center-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px black solid;
  border-radius: 5px;
  height: 80%;
  padding: 1rem;
}

.nav-container {
  display: flex;
  justify-content: center;
  border: 1px black solid;
  border-radius: 5px;
  height: 10%;
}

.pg-con {
  display: flex;
  justify-content: center;
  height: 100%;
}

.cells-ans {
  justify-content: center;
  display: grid;
  grid-template-columns: repeat(3, 125px);
  grid-template-rows: repeat(4, 125px);
  gap: 10px;
  margin-top: 25px;
}

.cells-quest {
  display: grid;
  grid-template-rows: repeat(3, 125px);
  max-width: 125px;
  gap: 10px;
  margin-top: 160px;
  margin-right: 10px;
}

.cell-item , .cell-item-quest {
  display: flex;
  justify-content: center;
  
  border-radius: 5px;
  min-width: 125px;
  min-height: 125px; 
  box-sizing: border-box;
  font-size: small;
}

.cell-item {
  border: 1px black solid;
  cursor: pointer;
  margin-bottom: 10px;
  align-items: end;
  padding-bottom: 10px; 
}

.cell-item:hover {
  background: #6b7f89;
}

.cell-item.filled {
  background: #a1adb2;
  cursor: default;
}

.cell-item-quest {
  box-shadow: 3px 3px 10px rgb(90, 90, 135);
  margin: 0 10px 10px 0;
  padding: 5px;
  align-items: center; 
  text-align: center;
  color: white;
  background: rgb(100, 100, 150);
}

.cell-answer {
  font-weight: bold;
  color: #333;
}
</style>
