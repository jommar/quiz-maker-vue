<template>
  <v-snackbar
    v-model="visible"
    :timeout="timeout"
    :color="color"
    location="top end"
    class="mb-4"
  >
    {{ message }}
    <template #actions>
      <v-btn icon @click="visible = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref } from "vue";
import { useNuxtApp } from "#app";

const visible = ref(false);
const message = ref("");
const color = ref("primary");
const timeout = ref(3000);

const toast = (input) => {
  const config = typeof input === "string" ? { text: input } : input;

  message.value = config.text || "";
  color.value =
    config.type === "success"
      ? "green"
      : config.type === "error"
      ? "red"
      : config.type === "warning"
      ? "orange"
      : "primary";

  timeout.value = config.duration || 3000;
  visible.value = true;
};

useNuxtApp().provide("toast", toast);
</script>
