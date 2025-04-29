<template>
  <v-container v-if="quiz">
    <h1 class="text-h5 font-weight-bold mb-4">{{ quiz.title }} - Results</h1>

    <v-card
      class="mb-4"
      v-for="(question, qIndex) in quiz.questions"
      :key="qIndex"
    >
      <v-card-text>
        <div class="text-subtitle-1 mb-2">
          {{ qIndex + 1 }}. {{ question.question }}
        </div>

        <v-chip
          v-for="(option, oIndex) in question.options"
          :key="oIndex"
          class="ma-1"
          small
          :color="getOptionStatus(qIndex, oIndex).color"
          :variant="
            getOptionStatus(qIndex, oIndex).color === 'default'
              ? 'outlined'
              : 'tonal'
          "
        >
          <v-icon
            v-if="getOptionStatus(qIndex, oIndex).icon"
            start
            :icon="getOptionStatus(qIndex, oIndex).icon"
          />
          {{ option }}
          <span v-if="getOptionStatus(qIndex, oIndex).label">
            - {{ getOptionStatus(qIndex, oIndex).label }}
          </span>
        </v-chip>
      </v-card-text>
    </v-card>

    <v-divider class="my-6" />

    <h2 class="text-h5 font-weight-bold mb-4">
      Score: {{ score }} / {{ quiz.questions.length }}
    </h2>

    <v-btn color="primary" @click="goHome"> Go Back to Quizzes </v-btn>
  </v-container>

  <v-container v-else>
    <h2>Quiz not found or missing answers.</h2>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getQuizByTitle } from "~/utils/storageService";
import { saveBestScore } from "~/utils/bestScoreService";

const route = useRoute();
const router = useRouter();

const quiz = ref(null);
const selectedAnswers = ref([]);

const saveScoreIfBest = () => {
  if (quiz.value) {
    saveBestScore(quiz.value.title, score.value);
  }
};

const loadQuizAndAnswers = () => {
  const quizTitle = decodeURIComponent(route.params.id);
  quiz.value = getQuizByTitle(quizTitle);

  const answers = route.query.answers;
  if (answers) {
    selectedAnswers.value = JSON.parse(answers);
  }
};

const getOptionStatus = (qIndex, oIndex) => {
  const correct = quiz.value.questions[qIndex].answer;
  const selected = selectedAnswers.value[qIndex];

  if (oIndex === correct && oIndex === selected) {
    return {
      color: "success",
      icon: "mdi-check-circle",
      label: "Correct (Selected)",
    };
  }

  if (oIndex === correct) {
    return { color: "info", icon: "mdi-check", label: "Correct Answer" };
  }

  if (oIndex === selected) {
    return {
      color: "error",
      icon: "mdi-close-circle",
      label: "Your Answer (Incorrect)",
    };
  }

  return { color: "default", icon: "", label: "" };
};

const score = computed(() => {
  if (!quiz.value) return 0;
  return quiz.value.questions.reduce((total, question, index) => {
    return total + (question.answer === selectedAnswers.value[index] ? 1 : 0);
  }, 0);
});

const goHome = () => {
  router.push("/");
};

onMounted(() => {
  loadQuizAndAnswers();
  saveScoreIfBest();
});
</script>
