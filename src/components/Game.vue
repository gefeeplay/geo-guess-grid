<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { questions } from "../data/questions";
import CountryInput from "../components/CountryInput.vue";
import FlagShow from "../components/FlagShow.vue";
import TopBar from "../components/TopBar.vue";
import SignInUp from "./SignInUp.vue";
import Profile from "./Profile.vue";
import GameStats from "./GameStats.vue";

const rows = 3;
const cols = 3;
const cells = 9;

const answers = ref(Array(cells).fill(""));
const points = ref(0);
const mistakes = ref(0);
const streak = ref(0)
const time = ref(0)        // секунды
let timerId = null

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

  if (isCorrect) {
    points.value += 1
    streak.value += 1       // увеличиваем серию
  } else {
    mistakes.value += 1
    streak.value = 0        // сбрасываем серию
  }

  showModal.value = false;
}

function refreshQuestions() {
  const newSet = getRandomUniqueQuestions(6);
  randomQuestionsLeft.value = newSet.slice(0, 3);
  randomQuestionsTop.value = newSet.slice(3, 6);
  answers.value = Array(cells).fill("");
  points.value = 0;
  mistakes.value = 0;
  streak.value = 0

  resetTimer()     // ⬅ сброс
  startTimer()     // ⬅ новый запуск
}

function startTimer() {
  if (timerId) return

  timerId = setInterval(() => {
    time.value += 1
  }, 1000)
}

function stopTimer() {
  clearInterval(timerId)
  timerId = null
}

function resetTimer() {
  stopTimer()
  time.value = 0
}

const showAuth = ref(false);
const showProfile = ref(false);

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})

</script>

<template>
  <div class="full-page">
    <CountryInput :show="showModal" @close="closeModal" @select="handleSelect" />

    <TopBar @open-auth="showAuth = true" @open-profile="showProfile = true" />

    <SignInUp v-if="showAuth" @close="showAuth = false" @auth-success="onAuth" />
    <Profile v-if="showProfile" @close="showProfile = false" />

    <div class="center-container">
      <div class="title">
        <div>GeoGuessGrid - Triple G</div>
      </div>

      <!-- Статистика-->
      <GameStats :points="points" :mistakes="mistakes" :streak="streak" :time="time" @restart="refreshQuestions" />

      <div class="pg-con">
        <div class="qa-row">
          <div class="cells-quest">
            <div v-for="q in randomQuestionsLeft" :key="q[0]" class="cell-item-quest">
              {{ q[0] }}
            </div>
          </div>

          <div class="cells-ans">
            <div v-for="q in randomQuestionsTop" :key="q[0]" class="cell-item-quest">
              {{ q[0] }}
            </div>

            <div class="cell-item" v-for="cell in cells" :key="cell" @click="handleClick(cell)" :class="{
              filled: answers[cell - 1],
              correct: answers[cell - 1]?.correct === true,
              wrong: answers[cell - 1]?.correct === false,
            }">
              <FlagShow v-if="answers[cell - 1]?.country" :country="answers[cell - 1].country" />

              <div v-if="answers[cell - 1]" class="cell-answer" :class="{
                filled: answers[cell - 1],
                correct: answers[cell - 1]?.correct === true,
                wrong: answers[cell - 1]?.correct === false,
              }">
                {{ answers[cell - 1].country }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">Нижний навбар</div>
  </div>
</template>

<style scoped>
.pg-con {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
  height: 90%;
  background-color: rgba(54, 34, 91, 0.8);
  border-radius: 10px;
}

.qa-row {
  display: flex;
  flex-direction: row;
  /* quest слева, ans справа */
  align-items: flex-start;
  justify-content: center;
}

.cells-ans {
  justify-content: center;
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(4, 100px);
  gap: 10px;
  margin-top: 25px;
}

.cells-quest {
  display: grid;
  grid-template-rows: repeat(3, 100px);
  max-width: 100px;
  gap: 10px;
  margin-top: 135px;
  margin-right: 10px;
}

.cell-item-quest {
  display: flex;
  justify-content: center;
  border-radius: 5px;
  min-width: 100px;
  min-height: 100px;
  box-sizing: border-box;
  font-size: small;
  margin: 0 10px 10px 0;
  padding: 5px;
  align-items: center;
  text-align: center;
  color: white;
  background: rgb(100, 100, 150);
}

.cell-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  border-radius: 5px;
  min-width: 100px;
  min-height: 100px;
  box-sizing: border-box;
  font-size: x-small;
  cursor: pointer;
  background: #cfdae0;
}

.cell-item:hover {
  background: #6b7f89;
}

/* Оформление ячейки с ответом*/
.correct {
  background: #72b472 !important;
  /* зелёный */
  color: white;
  border-color: #3d8b3d;
  animation: pop 0.3s ease-out;
}

.wrong {
  background: #d46f6b !important;
  /* красный */
  color: white;
  border-color: #b52b27;
  animation: shake 0.3s ease-in-out;
}

@keyframes pop {
  0% {
    transform: scale(0.8);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-4px);
  }

  75% {
    transform: translateX(4px);
  }
}

.cell-answer {
  text-align: center;
  padding: 0px 5px;
  font-weight: bold;
  color: #333;
}

.footer {
  background: linear-gradient(90deg, #302f52 0%, #322a57 50%, #4b3072 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  height: 10%;
}

@media (max-width: 500px) {
  .cells-ans {
    grid-template-columns: repeat(3, 75px);
    grid-template-rows: repeat(4, 75px);
    gap: 5px;
  }

  .cells-quest {
    display: grid;
    grid-template-rows: repeat(3, 75px);
    max-width: 75px;
    gap: 5px;
    margin-top: 105px;
    margin-right: 10px;
  }

  .cell-item-quest {
    border-radius: 5px;
    min-width: 75px;
    min-height: 75px;
    font-size: x-small;
    margin: 0;
    padding: 5px;
    gap: 5px;
  }

  .cell-item {
    gap: 5px;
    border-radius: 5px;
    min-width: 75px;
    min-height: 75px;
    font-size: xx-small;
  }
}
</style>
