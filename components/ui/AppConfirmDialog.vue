<template>
  <v-dialog v-model="dialog.visible" max-width="400">
    <v-card>
      <v-card-title class="text-h6">{{ dialog.message }}</v-card-title>
      <v-card-actions>
        <v-spacer />
        <v-btn text color="grey" @click="resolve(false)">Cancel</v-btn>
        <v-btn text color="red" @click="resolve(true)">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { reactive } from "vue";
import { useNuxtApp } from "#app";

const dialog = reactive({
  visible: false,
  message: "",
});
let resolver = null;

const confirm = (message) => {
  dialog.message = message;
  dialog.visible = true;

  return new Promise((resolve) => {
    resolver = resolve;
  });
};

const resolve = (result) => {
  dialog.visible = false;
  resolver?.(result);
};

useNuxtApp().provide("confirm", confirm);
</script>
