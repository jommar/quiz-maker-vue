<template>
  <v-container v-if="quiz">
    <h1 class="text-h5 font-weight-bold mb-4">{{ quiz.title }}</h1>

    <v-card class="mb-4" v-if="currentQuestion">
      <v-card-text>
        <div class="text-h6 mb-4">
          Question {{ currentQuestionIndex + 1 }} of {{ quiz.questions.length }}
        </div>
        <div class="text-subtitle-1 mb-4">{{ currentQuestion.question }}</div>

        <v-radio-group
          v-model="selectedAnswers[currentQuestionIndex]"
          @change="onAnswerSelected"
        >
          <v-radio
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            :label="option"
            :value="index"
          />
        </v-radio-group>
      </v-card-text>

      <v-card-actions>
        <v-btn text @click="prevQuestion" :disabled="currentQuestionIndex === 0"
          >Previous</v-btn
        >
        <v-spacer />
        <v-btn
          text
          @click="nextQuestion"
          :disabled="currentQuestionIndex === quiz.questions.length - 1"
          >Next</v-btn
        >
        <v-btn
          color="primary"
          @click="submitQuiz"
          v-if="currentQuestionIndex === quiz.questions.length - 1"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar v-model="snackbar" timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>

  <v-container v-else>
    <h2>Quiz not found.</h2>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getQuizByTitle } from "~/utils/storageService";

const route = useRoute();
const router = useRouter();

const quiz = ref(null);
const currentQuestionIndex = ref(0);
const selectedAnswers = ref([]);

const snackbar = ref(false);
const snackbarMessage = ref("");
const showSnackbar = (msg) => {
  snackbarMessage.value = msg;
  snackbar.value = true;
};

const shuffleArray = (array) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

const loadQuiz = () => {
  const quizTitle = route.params.id;
  const loadedQuiz = getQuizByTitle(decodeURIComponent(quizTitle));

  if (loadedQuiz) {
    // Clone the quiz deeply to avoid modifying localStorage data directly
    quiz.value = JSON.parse(JSON.stringify(loadedQuiz));

    // Apply randomization if enabled
    if (quiz.value.config?.randomizeQuestions) {
      quiz.value.questions = shuffleArray(quiz.value.questions);
    }

    if (quiz.value.config?.randomizeOptions) {
      quiz.value.questions.forEach((q) => {
        q.options = shuffleArray(q.options);
      });
    }

    selectedAnswers.value = new Array(quiz.value.questions.length).fill(null);
  }
};

const currentQuestion = computed(() => {
  return quiz.value ? quiz.value.questions[currentQuestionIndex.value] : null;
});

const onAnswerSelected = () => {
  const correctAnswer = currentQuestion.value.answer;
  const selected = selectedAnswers.value[currentQuestionIndex.value];

  if (
    quiz.value.config?.showCorrectAnswersWhileAnswering &&
    selected !== correctAnswer
  ) {
    showSnackbar(
      `Wrong! Correct answer is: ${currentQuestion.value.options[correctAnswer]}`
    );
  }

  if (currentQuestionIndex.value < quiz.value.questions.length - 1) {
    nextQuestion();
  }
};

const nextQuestion = () => {
  if (currentQuestionIndex.value < quiz.value.questions.length - 1) {
    currentQuestionIndex.value++;
  }
};

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
};

const submitQuiz = () => {
  router.push({
    path: `/quizzes/${encodeURIComponent(route.params.id)}/result`,
    query: { answers: JSON.stringify(selectedAnswers.value) },
  });
};

onMounted(() => {
  loadQuiz();
});
</script>
