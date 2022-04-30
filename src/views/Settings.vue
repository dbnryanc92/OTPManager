<template>
  <v-dialog
    v-model="store.showSettings"
    :fullscreen="display.xs.value"
    transition="dialog-bottom-transition"
  >
    <template v-slot:default="{ isActive }">
      <v-card
        :width="display.xs.value ? undefined : '80vw'"
        :min-width="display.xs.value ? undefined : '600'"
        max-width="900"
        class="h-screen"
      >
        <v-tabs fixed-tabs v-model="tab">
          <v-tab value="SettingsProfile">帳號</v-tab>
          <v-tab value="SettingsDisplay">顯示</v-tab>
          <v-tab value="SettingsAbout">關於</v-tab>
          <v-spacer />
          <v-btn height="48" flat @click="store.showSettings = false">
            <v-icon size="24" color="primary">mdi-close</v-icon>
          </v-btn>
        </v-tabs>
        <v-window v-model="tab" class="overflow-y-auto" id="settingsWindow">
          <v-window-item value="SettingsProfile">
            <SettingsProfile />
          </v-window-item>
          <v-window-item value="SettingsDisplay">
            <SettingsDisplay />
          </v-window-item>
          <v-window-item value="SettingsAbout">
            <SettingsAbout />
          </v-window-item>
        </v-window>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useDisplay } from "vuetify";
import { useStore } from "../stores/store";
import SettingsProfile from "./SettingsProfile.vue";
import SettingsDisplay from "./SettingsDisplay.vue";
import SettingsAbout from "./SettingsAbout.vue";

const display = useDisplay();
const store = useStore();

const tab = ref("SettingsProfile");

watch(tab, (curTab, prevTab) => {
  const window = document.getElementById("settingsWindow");
  if (!window) return;
  window.scrollTop = 0;
});
</script>
