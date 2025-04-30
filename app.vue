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
        <UiAppConfirmDialog />
        <UiAppSnackbar />
        <UiAppToast />

        <NuxtPage />
      </v-container>
    </v-main>
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
