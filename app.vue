<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Quiz Maker</v-toolbar-title>

      <v-spacer />

      <v-btn v-if="!isOnQuizzesPage" text @click="goHome">
        Back to Quizzes
      </v-btn>

      <v-btn icon @click="toggleTheme">
        <v-icon :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'" />
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="pa-4">
        <NuxtPage />
      </v-container>
    </v-main>

    <v-snackbar v-model="snackbar" timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>

    <v-dialog v-model="confirmDialog.visible" max-width="400">
      <v-card>
        <v-card-title class="text-h6">{{ confirmDialog.message }}</v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="grey" @click="resolveConfirm(false)">Cancel</v-btn>
          <v-btn text color="red" @click="resolveConfirm(true)">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { useTheme } from "vuetify";
import { HOME_ROUTE } from "~/constants";
import { useNuxtApp } from "#app";

const router = useRouter();
const route = useRoute();
const nuxtApp = useNuxtApp();

const theme = useTheme();
const isDark = computed(() => theme.global.name.value === "dark");

const snackbar = ref(false);
const snackbarMessage = ref("");
const showSnackbar = (message) => {
  snackbarMessage.value = message;
  snackbar.value = true;
};
nuxtApp.provide("showSnackbar", showSnackbar);

const confirmDialog = reactive({
  visible: false,
  message: "",
});
let confirmResolver = null;

const showConfirm = (message) => {
  confirmDialog.message = message;
  confirmDialog.visible = true;

  return new Promise((resolve) => {
    confirmResolver = resolve;
  });
};

const resolveConfirm = (result) => {
  confirmDialog.visible = false;
  confirmResolver?.(result);
};

nuxtApp.provide("confirm", showConfirm);

const toggleTheme = () => {
  theme.global.name.value = isDark.value ? "light" : "dark";
};

const goHome = () => {
  router.push("/");
};

const isOnQuizzesPage = computed(() => {
  return route.path === HOME_ROUTE;
});
</script>
