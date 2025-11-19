<!--

Данный файл представляет версию App.vue с проверкой возможных ответов (possibleAnswers) на пустоту

То есть если для ячейки нет возмоных ответов, то алгоритм пытается найти новую комбинацию ответов
Минус данного алгоритма: большой размер и сложность

Данный способ - запасной, 
если не будет более рациональных решений проблемы "пустого элемента у possibleAnswers"


-->


<script setup>
import { ref, computed } from "vue";
import { questions } from "./data/questions";
import CountryInput from "./components/CountryInput.vue";

const rows = 3;
const cols = 3;
const cells = rows * cols;
const answers = ref(Array(cells).fill(""));

const selectedCell = ref(null);
const showModal = ref(false);
const selectedCountry = ref("");

// --- Утилиты ---
function shuffleCopy(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Возвращает массив возможных ответов (length = rows*cols) для переданных top/bottom
function possibleAnswersForSet(top, bottom) {
  const arr = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const hor = bottom[r][1]; // bottom = horizontal вопросы (каждый вопрос: [text, [countries]])
      const ver = top[c][1];    // top = vertical вопросы
      // пересечение
      const possible = hor.filter(country => ver.includes(country));
      arr.push(possible);
    }
  }
  return arr;
}

// Проверка: есть ли в possibleAnswers хоть один пустой элемент
function hasEmptyPossible(possibleArr) {
  return possibleArr.some(a => !a || a.length === 0);
}

// Попытка починить проблемные вопросы локально.
// При успехе возвращаем { top, bottom } (массивы вопросов), при неудаче — null.
function tryFixProblems(top, bottom, allQuestions) {
  // будем работать с копиями
  const topCopy = [...top];
  const bottomCopy = [...bottom];

  // индекс выбранных вопросов в исходном списке (чтобы избегать повторов) — используем объекты вопросов как уникальные
  const used = new Set([...topCopy, ...bottomCopy]);

  // текущие возможные
  let possible = possibleAnswersForSet(topCopy, bottomCopy);

  // если всё ок — возвращаем сразу
  if (!hasEmptyPossible(possible)) return { top: topCopy, bottom: bottomCopy };

  // список кандидатов — все вопросы, которые не используются сейчас
  const candidates = allQuestions.filter(q => !used.has(q));

  // Попытка исправлять проблемные ячейки одну за другой
  // Для стабильности, ограничим число итераций
  const maxFixAttempts = 200;

  let attempts = 0;
  // Найдём индексы проблемных ячеек
  while (hasEmptyPossible(possible) && attempts < maxFixAttempts) {
    attempts++;

    // Найдем индекс первой проблемной ячейки
    const badIndex = possible.findIndex(a => !a || a.length === 0);
    if (badIndex === -1) break;

    const badRow = Math.floor(badIndex / cols);
    const badCol = badIndex % cols;

    let fixed = false;

    // Сначала попробуем заменить вертикальный вопрос (top[col])
    for (const candidate of candidates) {
      if (used.has(candidate)) continue; // safety
      // candidate должен не дублировать уже выбранные
      // проверим: если заменить top[col] на candidate, не появятся ли пустые пересечения для этого столбца с текущими bottom
      const newTop = [...topCopy];
      newTop[badCol] = candidate;

      const newPossible = possibleAnswersForSet(newTop, bottomCopy);
      // проверяем, что все ячейки остаются ненулевыми (особенно те, которые затрагивает новый top: все rows for that column)
      const columnOk = (() => {
        for (let r = 0; r < rows; r++) {
          const idx = r * cols + badCol;
          if (!newPossible[idx] || newPossible[idx].length === 0) return false;
        }
        return true;
      })();

      if (columnOk) {
        // заменяем
        // обновляем used/candidates
        used.delete(topCopy[badCol]);
        used.add(candidate);
        // update topCopy and recalc possible
        topCopy[badCol] = candidate;
        possible = newPossible;
        fixed = true;
        break;
      }
    }

    if (fixed) continue;

    // Если не получилось вертикальной заменой, попробуем заменить горизонтальный вопрос (bottom[row])
    for (const candidate of candidates) {
      if (used.has(candidate)) continue;
      const newBottom = [...bottomCopy];
      newBottom[badRow] = candidate;

      const newPossible = possibleAnswersForSet(topCopy, newBottom);

      const rowOk = (() => {
        for (let c = 0; c < cols; c++) {
          const idx = badRow * cols + c;
          if (!newPossible[idx] || newPossible[idx].length === 0) return false;
        }
        return true;
      })();

      if (rowOk) {
        used.delete(bottomCopy[badRow]);
        used.add(candidate);
        bottomCopy[badRow] = candidate;
        possible = newPossible;
        fixed = true;
        break;
      }
    }

    if (fixed) continue;

    // Если ни вертикальная, ни горизонтальная замена для этой проблемной ячейки не работает,
    // попробуем заменить любую из затрагиваемых строк/столбцов, перебирая кандидатов и проверяя всю сетку.
    // Попробуем заменить каждую позиции top[col] подряд перебирая кандидатов:
    let globalFixed = false;
    for (let replaceTopIdx = 0; replaceTopIdx < cols && !globalFixed; replaceTopIdx++) {
      for (const candidate of candidates) {
        if (used.has(candidate)) continue;
        const newTop = [...topCopy];
        newTop[replaceTopIdx] = candidate;
        const newPossibleAll = possibleAnswersForSet(newTop, bottomCopy);
        if (!hasEmptyPossible(newPossibleAll)) {
          used.delete(topCopy[replaceTopIdx]);
          used.add(candidate);
          topCopy[replaceTopIdx] = candidate;
          possible = newPossibleAll;
          globalFixed = true;
          break;
        }
      }
    }
    if (globalFixed) continue;

    // То же для bottom
    for (let replaceBottomIdx = 0; replaceBottomIdx < rows && !globalFixed; replaceBottomIdx++) {
      for (const candidate of candidates) {
        if (used.has(candidate)) continue;
        const newBottom = [...bottomCopy];
        newBottom[replaceBottomIdx] = candidate;
        const newPossibleAll = possibleAnswersForSet(topCopy, newBottom);
        if (!hasEmptyPossible(newPossibleAll)) {
          used.delete(bottomCopy[replaceBottomIdx]);
          used.add(candidate);
          bottomCopy[replaceBottomIdx] = candidate;
          possible = newPossibleAll;
          globalFixed = true;
          break;
        }
      }
    }

    if (globalFixed) continue;

    // Если ничего не помогло за эту итерацию — выйдем и дадим сигнал неуспеха
    break;
  }

  // Финальная проверка
  if (!hasEmptyPossible(possible)) {
    return { top: topCopy, bottom: bottomCopy };
  }
  return null;
}

// Основная функция: выбирать 6 вопросов корректно.
// Сначала пробуем несколько раз (random), потом пробуем фиксы, если не получилось — полный ресет.
function pickValidQuestions(maxTotalAttempts = 300) {
  const allQ = [...questions];
  let attempts = 0;

  while (attempts < maxTotalAttempts) {
    attempts++;
    // Выбираем 6 случайных и уникальных вопросов
    const candidate6 = shuffleCopy(allQ).slice(0, 6);
    const top = candidate6.slice(0, 3);
    const bottom = candidate6.slice(3, 6);

    // Если сразу без пустых — отлично
    const possible = possibleAnswersForSet(top, bottom);
    if (!hasEmptyPossible(possible)) {
      return { top, bottom };
    }

    // Попробуем починить локально
    const fixed = tryFixProblems(top, bottom, allQ);
    if (fixed) {
      return { top: fixed.top, bottom: fixed.bottom };
    }

    // иначе повторяем - допустим несколько раз
  }

  // Если не удалось подобрать корректный набор — как fallback: будем пытаться многократно переработать,
  // но если и это не помогло — всё равно вернём последний случайный набор (чтобы не блокировать UI).
  // (В реальном приложении можно поднять предупреждение пользователю.)
  console.warn("Не удалось найти полностью валидный набор вопросов за лимит попыток. Использую последний набор (могут быть пустые пересечения).");
  const last = shuffleCopy(questions).slice(0, 6);
  return { top: last.slice(0, 3), bottom: last.slice(3, 6) };
}

// Инициализация вопросов
const picked = pickValidQuestions();
const randomQuestionsTop = ref(picked.top);
const randomQuestionsBottom = ref(picked.bottom);

// вычисляемые возможные ответы для текущих наборов
const possibleAnswers = computed(() => possibleAnswersForSet(randomQuestionsTop.value, randomQuestionsBottom.value));

// --- UI handlers ---
function handleClick(cell) {
  // если в ячейке уже есть ответ — ничего не делаем
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
  const validCountries = possibleAnswers.value[idx] || [];

  if (validCountries.includes(country)) {
    answers.value[idx] = country; // верно
  } else {
    answers.value[idx] = `❌ ${country}`; // неверно
  }

  showModal.value = false;
}

// Обновить вопросы (явно через кнопку)
function refreshQuestions() {
  const picked2 = pickValidQuestions();
  randomQuestionsTop.value = picked2.top;
  randomQuestionsBottom.value = picked2.bottom;
  answers.value = Array(cells).fill("");
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
