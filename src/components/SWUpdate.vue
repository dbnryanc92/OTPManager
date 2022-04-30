<template>
  <!-- SW Updating -->
  <v-snackbar
    v-model="swUpdating"
    color="info"
    timeout="-1"
    absolute
    top
    right
    content-class="text-center"
  >
    <div class="d-flex align-center justify-space-between">
      <v-icon large>mdi-cloud-download-outline</v-icon>
      <div class="flex-grow-1">偵測到新版本，正在更新...</div>
    </div>
  </v-snackbar>

  <!-- SW Updated -->
  <v-snackbar
    v-model="swUpdated"
    color="info"
    timeout="3000"
    absolute
    top
    right
    content-class="text-center"
  >
    <div class="d-flex align-center justify-space-between">
      <v-icon large>mdi-check-outline</v-icon>
      <div class="flex-grow-1">已準備好最新版本 v{{ latestVersion }}</div>
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
// @ts-ignore
import { useRegisterSW } from "virtual:pwa-register/vue";
import { updateLog } from "../data/updateLog";

// Setup periodic SW update
const updateSWInterval = 60 * 60 * 1000; // 1 hour
const updateSW = useRegisterSW({
  onNeedRefresh() {},
  onOfflineReady() {},
  onRegistered(r: ServiceWorkerRegistration) {
    if (!r) return;
    setInterval(() => {
      r.update();
    }, updateSWInterval);
  },
});

// Updaing SW
const swUpdating = ref(false);

const checkSWUpdate = () => {
  if (updateSW.needRefresh.value) {
    swUpdating.value = true;
    setTimeout(() => {
      updateSW.updateServiceWorker();
    }, 3000);
  }
};

setInterval(() => {
  checkSWUpdate();
}, 5000);

// Show update complete message
const swUpdated = ref(false);
const latestVersion = computed(() => {
  return updateLog[0].v;
});

const lastVersion = localStorage.getItem("lastVersion") || "0.0";

if (lastVersion != latestVersion.value) {
  localStorage.setItem("lastVersion", latestVersion.value);
  swUpdated.value = true;
}
</script>
