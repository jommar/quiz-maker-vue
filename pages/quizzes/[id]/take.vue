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
        <v-btn
          text
          @click="prevQuestion"
          :disabled="currentQuestionIndex === 0"
        >
          Previous
        </v-btn>
        <v-spacer />
        <v-btn
          text
          @click="nextQuestion"
          :disabled="currentQuestionIndex === quiz.questions.length - 1"
        >
          Next
        </v-btn>
        <v-btn
          color="primary"
          @click="submitQuiz"
          v-if="currentQuestionIndex === quiz.questions.length - 1"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>

  <v-container v-else>
    <h2>Quiz not found.</h2>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getQuizByTitle } from "~/utils/storageService";

const { $toast } = useNuxtApp();
const route = useRoute();
const router = useRouter();

const quiz = ref(null);
const currentQuestionIndex = ref(0);
const selectedAnswers = ref([]);

// Utility: shuffle array
const shuffleArray = (array) =>
  array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

// Randomize options while preserving the correct answer
const shuffleOptionsPreserveAnswer = (question) => {
  const correctAnswerText = question.options[question.answer];
  question.options = shuffleArray([...question.options]);
  question.answer = question.options.findIndex(
    (option) => option === correctAnswerText
  );
};

const loadQuiz = () => {
  const quizTitle = route.params.id;
  const loadedQuiz = getQuizByTitle(decodeURIComponent(quizTitle));

  if (loadedQuiz) {
    quiz.value = JSON.parse(JSON.stringify(loadedQuiz)); // deep clone

    if (quiz.value.config?.randomizeQuestions) {
      quiz.value.questions = shuffleArray(quiz.value.questions);
    }

    if (quiz.value.config?.randomizeOptions) {
      quiz.value.questions.forEach(shuffleOptionsPreserveAnswer);
    }

    selectedAnswers.value = new Array(quiz.value.questions.length).fill(null);
  }
};

const currentQuestion = computed(() =>
  quiz.value ? quiz.value.questions[currentQuestionIndex.value] : null
);

const onAnswerSelected = () => {
  const selected = selectedAnswers.value[currentQuestionIndex.value];
  const correctAnswer = currentQuestion.value.answer;

  if (
    quiz.value.config?.showCorrectAnswersWhileAnswering &&
    selected !== correctAnswer
  ) {
    $toast(
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
  sessionStorage.setItem("activeQuiz", JSON.stringify(quiz.value));

  router.push({
    path: `/quizzes/${encodeURIComponent(route.params.id)}/result`,
    query: {
      answers: JSON.stringify(selectedAnswers.value),
    },
  });
};

onMounted(() => {
  loadQuiz();
});
</script>
