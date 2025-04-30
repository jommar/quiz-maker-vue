<template>
  <v-snackbar v-model="visible" timeout="3000">
    {{ message }}
  </v-snackbar>
</template>

<script setup>
import { ref } from "vue";
import { useNuxtApp } from "#app";

const visible = ref(false);
const message = ref("");

const showSnackbar = (msg) => {
  message.value = msg;
  visible.value = true;
};

useNuxtApp().provide("showSnackbar", showSnackbar);
</script>
