<template>
  <v-container>
    <h1 class="text-h5 font-weight-bold mb-4">Create New Quiz</h1>

    <v-text-field
      v-model="quiz.title"
      label="Quiz Title"
      outlined
      dense
      class="mb-4"
    />

    <v-switch
      v-model="quiz.config.randomizeQuestions"
      label="Randomize Questions"
      inset
      color="primary"
      density="compact"
    />
    <v-switch
      v-model="quiz.config.randomizeOptions"
      label="Randomize Options"
      inset
      color="primary"
      density="compact"
    />
    <v-switch
      v-model="quiz.config.showCorrectAnswersWhileAnswering"
      label="Show Correct Answer Immediately"
      inset
      color="primary"
      density="compact"
    />

    <v-divider class="my-4" />

    <div
      v-for="(question, qIndex) in quiz.questions"
      :key="qIndex"
      class="mb-8"
    >
      <v-text-field
        v-model="question.question"
        :label="`Question ${qIndex + 1}`"
        outlined
        dense
        class="mb-2"
      />

      <v-row dense>
        <v-col
          v-for="(option, oIndex) in question.options"
          :key="oIndex"
          cols="12"
          md="6"
          class="d-flex align-center"
        >
          <v-text-field
            v-model="question.options[oIndex]"
            :label="`Option ${oIndex + 1}`"
            outlined
            dense
            class="flex-grow-1"
          >
            <template #append-inner>
              <v-btn
                icon
                color="error"
                size="small"
                @click="removeOption(qIndex, oIndex)"
                density="compact"
              >
                <v-icon :icon="'mdi-close'" />
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
      </v-row>

      <v-btn text color="primary" class="mt-2" @click="addOption(qIndex)">
        Add Option
      </v-btn>

      <v-select
        v-model="question.answer"
        :items="
          question.options.map((opt, index) => ({ title: opt, value: index }))
        "
        item-title="title"
        item-value="value"
        label="Correct Answer"
        outlined
        dense
      />

      <v-btn text color="error" class="mt-2" @click="removeQuestion(qIndex)">
        Remove Question
      </v-btn>

      <v-divider class="my-4" />
    </div>

    <v-btn color="primary" @click="addQuestion" :disabled="!quiz.title"> Add Question </v-btn>

    <v-btn color="success" @click="saveQuiz" :disabled="!quiz.questions.length"> Save Quiz </v-btn>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { addQuiz } from "~/utils/storageService";
import { useRouter } from "vue-router";
import { HOME_ROUTE } from "~/constants";

const { $toast } = useNuxtApp();

const router = useRouter();

const quiz = ref({
  title: "",
  questions: [],
  config: {
    randomizeQuestions: false,
    randomizeOptions: true,
    showCorrectAnswersWhileAnswering: false,
  },
});

const addOption = (qIndex) => {
  quiz.value.questions[qIndex].options.push("");
};

const removeOption = (qIndex, oIndex) => {
  if (quiz.value.questions[qIndex].options.length > 2) {
    quiz.value.questions[qIndex].options.splice(oIndex, 1);
  } else {
    $toast("A question must have at least 2 options.");
  }
};

const addQuestion = () => {
  quiz.value.questions.push({
    question: "",
    options: ["", "", "", ""],
    answer: 0,
  });
};

const removeQuestion = (index) => {
  quiz.value.questions.splice(index, 1);
};

const saveQuiz = () => {
  if (!quiz.value.title.trim()) {
    $toast("Quiz title is required!");
    return;
  }
  if (quiz.value.questions.length === 0) {
    $toast("Add at least one question!");
    return;
  }
  addQuiz(quiz.value);
  $toast("Quiz created successfully ✅");
  router.push(HOME_ROUTE);
};
</script>
