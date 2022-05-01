<template>
  <div class="d-flex flex-column align-center">
    <v-img
      src="/img/pwa-512x512.png"
      :width="display.xs.value ? 96 : 128"
      contain
      class="mb-2"
    />
    <div class="text-h5">OTP管理大師</div>
    <div class="text-subtitle-1 d-flex flex-wrap justify-center align-center">
      <span class="mr-2"
        >v{{ latestVersion }} © {{ new Date().getFullYear() }}</span
      >
      <v-btn
        href="https://github.com/dbnryanc92/OTPManager"
        target="_blank"
        append-icon="mdi-github"
        variant="outlined"
        style="text-transform: unset"
      >
        dbnryanc92
      </v-btn>
    </div>
    <div class="d-flex flex-wrap justify-center">
      <v-chip color="error" variant="outlined" size="small" class="ma-1">
        <v-icon start icon="mdi-clock"></v-icon>
        方便
      </v-chip>
      <v-chip color="info" variant="outlined" size="small" class="ma-1">
        <v-icon start icon="mdi-table-of-contents"></v-icon>
        整齊
      </v-chip>
      <v-chip color="green" variant="outlined" size="small" class="ma-1">
        <v-icon start icon="mdi-lock"></v-icon>
        安全
      </v-chip>
      <v-chip color="cyan" variant="outlined" size="small" class="ma-1">
        <v-icon start icon="mdi-flash"></v-icon>
        輕量
      </v-chip>
    </div>
    <!-- 簡介 -->
    <div class="mt-2">
      <div class="d-flex align-center text-subtitle-2">
        <span class="introEmoji">📋</span>
        <span>點擊OTP可以直接複製到剪貼簿</span>
      </div>
      <div class="d-flex align-center text-subtitle-2">
        <span class="introEmoji">☁️</span>
        <span>可以安裝應用程式離線使用</span>
      </div>
      <div class="d-flex align-center text-subtitle-2">
        <span class="introEmoji">🔎</span>
        <span>按Ctrl+F可以啟動篩選功能</span>
      </div>
    </div>
    <v-btn text color="primary" class="mt-2" @click="store.showSettings = true">
      馬上開始
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import { useStore } from "../stores/store";
import { updateLog } from "../data/updateLog";

const display = useDisplay();
const store = useStore();
const latestVersion = updateLog[0].v;
</script>

<style lang="scss" scoped>
.introEmoji {
  font-size: 1.25rem;
  line-height: 1.75rem;
  text-align: center;
  min-width: 32px;
  margin-right: 4px;
}
</style>
