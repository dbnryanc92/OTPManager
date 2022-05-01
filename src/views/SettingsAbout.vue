<template>
  <v-card-title>
    <div>
      <div class="text-h5">關於OTP管理大師</div>
      <div class="text-subtitle-1 d-flex flex-wrap align-center">
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
      <div>
        <v-chip color="error" variant="outlined" size="small" class="mr-2">
          <v-icon start icon="mdi-clock"></v-icon>
          方便
        </v-chip>
        <v-chip color="info" variant="outlined" size="small" class="mr-2">
          <v-icon start icon="mdi-table-of-contents"></v-icon>
          整齊
        </v-chip>
        <v-chip color="green" variant="outlined" size="small" class="mr-2">
          <v-icon start icon="mdi-lock"></v-icon>
          安全
        </v-chip>
        <v-chip color="cyan" variant="outlined" size="small" class="mr-2">
          <v-icon start icon="mdi-flash"></v-icon>
          輕量
        </v-chip>
      </div>
    </div>
  </v-card-title>
  <v-card-content class="pa-0">
    <!-- 簡介 -->
    <v-list density="comfortable">
      <v-list-subheader>簡介</v-list-subheader>
      <v-list-item class="d-flex flex-column align-start">
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
      </v-list-item>
    </v-list>
    <!-- 更新日誌 -->
    <v-list density="comfortable">
      <v-list-subheader>更新日誌</v-list-subheader>
      <v-list-item v-for="(update, i) in updateLog" :key="i">
        <div>
          <div class="text-subtitle-2">v{{ update.v }} /{{ update.date }}</div>
          <div class="text-caption">
            <div v-for="(line, j) in update.details" :key="j">{{ line }}</div>
          </div>
        </div>
      </v-list-item>
    </v-list>
  </v-card-content>
</template>

<script setup lang="ts">
import { updateLog } from "../data/updateLog";

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
