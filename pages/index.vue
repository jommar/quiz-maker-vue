<template>
  <v-container>
    <v-row class="mb-4" justify="start" align="center">
      <v-spacer></v-spacer>
      <v-btn
        color="error"
        class="ml-2"
        @click="clearAllBestScores"
        v-if="hasBestScores"
      >
        Clear All Best Scores
      </v-btn>
      <v-btn color="secondary" class="mx-2" @click="exportDialog = true"
        >Export</v-btn
      >
      <v-btn color="primary" class="mx-2" @click="importing = true"
        >Import</v-btn
      >
    </v-row>

    <v-row justify="space-between" align="center">
      <v-col>
        <h1 class="text-h4 font-weight-bold">My Quizzes</h1>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="goToCreate">Create New Quiz</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="quiz in quizzes" :key="quiz.title" cols="12" sm="6" md="4">
        <v-card>
          <v-card-title>{{ quiz.title }}</v-card-title>

          <v-card-subtitle>
            Best Score: {{ getBestScoreForQuiz(quiz.title) || "N/A" }}
          </v-card-subtitle>

          <v-card-actions class="d-flex flex-column align-end">
            <div>
              <v-btn text color="primary" @click="takeQuiz(quiz.title)">
                Take
              </v-btn>
              <v-btn text color="secondary" @click="editQuiz(quiz.title)">
                Edit
              </v-btn>
              <v-btn text color="red" @click="deleteQuiz(quiz.title)">
                Delete
              </v-btn>
            </div>
            <div>
              <v-btn text color="error" @click="clearScore(quiz.title)">
                Clear Best Score
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="importing" max-width="600">
      <v-card>
        <v-card-title>Import Quiz JSON</v-card-title>
        <v-card-text>
          <v-textarea
            v-model="importJson"
            label="Paste JSON here"
            auto-grow
            rows="5"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="importing = false">Cancel</v-btn>
          <v-btn color="primary" @click="doImport">Import</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="exportDialog" max-width="600">
      <v-card>
        <v-card-title>Select Quizzes to Export</v-card-title>

        <v-card-text>
          <v-checkbox
            v-for="quiz in quizzes"
            :key="quiz.title"
            :label="quiz.title"
            :value="quiz.title"
            v-model="selectedToExport"
            hide-details
            dense
          />
          <section>
            <v-textarea
              v-if="!!exportJsonText"
              v-model="exportJsonText"
              label="Copy this JSON"
              readonly
              rows="5"
              class="font-mono"
            />

            <v-btn
              v-if="!!exportJsonText"
              color="primary"
              size="small"
              class="mt-2"
              @click="copyExportJson"
            >
              Copy to Clipboard
            </v-btn>
          </section>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="exportDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="doExport">Export</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  getQuizzes,
  exportQuizzes,
  importQuizzes,
  saveQuizzes,
} from "~/utils/storageService";
import {
  getBestScoreForQuiz,
  clearBestScores,
  getBestScores,
} from "~/utils/bestScoreService";

const { $confirm, $toast } = useNuxtApp();

const router = useRouter();
const quizzes = ref([]);
const importing = ref(false);
const importJson = ref("");
const exportDialog = ref(false);
const selectedToExport = ref([]);
const bestScores = ref({});
const exportJsonText = ref("");

const copyExportJson = () => {
  navigator.clipboard.writeText(exportJsonText.value);
  $toast("Export data copied to clipboard ✅");
};

const hasBestScores = computed(() => {
  return Object.keys(bestScores.value).length > 0;
});

const deleteQuiz = async (title) => {
  const ok = await $confirm(`Are you sure you want to delete "${title}"?`);
  if (ok) {
    const allQuizzes = getQuizzes();
    const updatedQuizzes = allQuizzes.filter((q) => q.title !== title);
    saveQuizzes(updatedQuizzes);
    $toast(`Quiz "${title}" deleted successfully!`);
    refreshView();
  }
};

const refreshView = () => {
  quizzes.value = getQuizzes();
  bestScores.value = getBestScores();
};

const clearAllBestScores = async () => {
  const ok = await $confirm("Are you sure you want to clear all best scores?");
  if (ok) {
    clearBestScores();
    $toast("All best scores cleared ✅");
    refreshView();
  }
};

const clearScore = async (quizTitle) => {
  const ok = await $confirm(`Clear best score for "${quizTitle}"?`);
  if (ok) {
    const scores = getBestScores();
    if (scores[quizTitle]) {
      delete scores[quizTitle];
      localStorage.setItem("bestScores", JSON.stringify(scores));
      $toast(`Best score for "${quizTitle}" cleared ✅`);
      refreshView();
    } else {
      $toast(`No best score found for "${quizTitle}"`);
    }
  }
};

const doImport = () => {
  const ok = importQuizzes(importJson.value);
  if (ok) {
    $toast("Import successful ✅");
    importing.value = false;
    quizzes.value = getQuizzes();
  } else {
    $toast("Import failed ❌");
  }
};

const loadQuizzes = () => {
  quizzes.value = getQuizzes();
};

const doExport = () => {
  const all = getQuizzes();
  const filtered = all.filter((q) => selectedToExport.value.includes(q.title));
  const json = JSON.stringify(filtered);

  navigator.clipboard.writeText(json);
  $toast(`Exported ${filtered.length} quiz(es) to clipboard ✅`);
  exportDialog.value = false;
};

const goToCreate = () => {
  router.push("/quizzes/create");
};

const editQuiz = (title) => {
  router.push(`/quizzes/${encodeURIComponent(title)}/edit`);
};

const takeQuiz = (title) => {
  router.push(`/quizzes/${encodeURIComponent(title)}/take`);
};

watch(selectedToExport, () => {
  const all = getQuizzes();
  const filtered = all.filter((q) => selectedToExport.value.includes(q.title));
  exportJsonText.value = selectedToExport.value.length
    ? JSON.stringify(filtered)
    : "";
});

onMounted(() => {
  loadQuizzes();
  bestScores.value = getBestScores();
});
</script>
