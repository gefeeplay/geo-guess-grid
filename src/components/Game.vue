<script setup>
import { ref, computed } from "vue";
import { questions } from "../data/questions";
import CountryInput from "../components/CountryInput.vue";
import FlagShow from "../components/FlagShow.vue";
import TopBar from "../components/TopBar.vue";
import SignInUp from "./SignInUp.vue";

const rows = 3;
const cols = 3;
const cells = 9;

const answers = ref(Array(cells).fill(""));
const points = ref(0);
const mistakes = ref(0);
const stats = ref({
  "Очки": points,
  "Ошибки": mistakes,
});

function getRandomUniqueQuestions(count) {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const allRandomQuestions = ref(getRandomUniqueQuestions(6));
const randomQuestionsLeft = ref(allRandomQuestions.value.slice(0, 3));
const randomQuestionsTop = ref(allRandomQuestions.value.slice(3, 6));

const possibleAnswers = computed(() => {
  const arr = [];
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const horizontal = randomQuestionsTop.value[row][1];
      const vertical = randomQuestionsLeft.value[col][1];
      const possible = horizontal.filter((country) =>
        vertical.includes(country)
      );
      arr.push(possible);
    }
  }
  return arr;
});

const selectedCell = ref(null);
const showModal = ref(false);
const selectedCountry = ref("");

function handleClick(cell) {
  if (answers.value[cell - 1]) return;
  selectedCell.value = cell;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

function handleSelect(country) {
  selectedCountry.value = country;

  const idx = selectedCell.value - 1;
  const validCountries = possibleAnswers.value[idx];

  const isCorrect = validCountries.includes(country);

  answers.value[idx] = {
    country,
    correct: isCorrect,
  };

  if (isCorrect) points.value += 1;
  else mistakes.value += 1;

  showModal.value = false;
}

function refreshQuestions() {
  const newSet = getRandomUniqueQuestions(6);
  randomQuestionsLeft.value = newSet.slice(0, 3);
  randomQuestionsTop.value = newSet.slice(3, 6);
  answers.value = Array(cells).fill("");
  points.value = 0;
  mistakes.value = 0;
}

const showAuth = ref(false);

</script>

<template>
  <div class="full-page">
    <CountryInput :show="showModal" @close="closeModal" @select="handleSelect" />
    
    <TopBar @open-auth="showAuth = true" />

    <SignInUp v-if="showAuth" @close="showAuth=false" @auth-success="onAuth" />

    <div class="center-container">
      <div class="title">
        <div>GeoGuessGrid - Triple G</div>
      </div>

      <div class="pg-con">
        <div class="cells-quest">
          <div v-for="q in randomQuestionsLeft" :key="q[0]" class="cell-item-quest">
            {{ q[0] }}
          </div>
        </div>

        <div class="cells-ans">
          <div v-for="q in randomQuestionsTop" :key="q[0]" class="cell-item-quest">
            {{ q[0] }}
          </div>

          <div
            class="cell-item"
            v-for="cell in cells"
            :key="cell"
            @click="handleClick(cell)"
            :class="{
              filled: answers[cell - 1],
              correct: answers[cell - 1]?.correct === true,
              wrong: answers[cell - 1]?.correct === false,
            }"
          >
            <FlagShow
              v-if="answers[cell - 1]?.country"
              :country="answers[cell - 1].country"
            />

            <div
              v-if="answers[cell - 1]"
              class="cell-answer"
              :class="{
                filled: answers[cell - 1],
                correct: answers[cell - 1]?.correct === true,
                wrong: answers[cell - 1]?.correct === false,
              }"
            >
              {{ answers[cell - 1].country }}
            </div>
          </div>
        </div>

        <div class="cells-stats">
          <div class="cell-item-quest stats-item">
            <div class="stat-icon">
              <span class="material-symbols-outlined share" @click="refreshQuestions">replay</span>
            </div>
            <div class="stat-text">Начать заново</div>
          </div>

          <div
            v-for="(value, key) in stats"
            :key="key"
            class="cell-item-quest stats-item"
          >
            <div class="stat-value">{{ value }}</div>
            <div class="stat-text">{{ key }}</div>
          </div>

          <div class="cell-item-quest stats-item">
            <div class="stat-icon">
              <span class="material-symbols-outlined share">share</span>
            </div>
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
