<template>
  <v-card-title>
    <div>
      <div class="text-h5">偏好設定</div>
      <div class="text-caption">設定將自動儲存，但只套用到這個瀏覽器</div>
    </div>
  </v-card-title>
  <v-card-content class="pa-0">
    <v-list density="comfortable">
      <v-list-subheader>顯示</v-list-subheader>

      <!-- 黑夜模式 -->
      <v-list-item lines="two">
        <v-list-item-header>
          <v-list-item-title>
            黑夜模式：{{ store.useDarkMode ? "開啟" : "關閉" }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption">
            頁面配色改成深色，方便在夜間瀏覽
          </v-list-item-subtitle>
        </v-list-item-header>
        <v-list-item-action>
          <v-switch
            v-model="store.useDarkMode"
            @change="store.saveSettings()"
            color="primary"
            hide-details
            inset
          ></v-switch>
        </v-list-item-action>
      </v-list-item>

      <!-- 傳統介面 -->
      <v-list-item lines="two">
        <v-list-item-header>
          <v-list-item-title>
            傳統介面：{{ store.useDarkMode ? "開啟" : "關閉" }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption">
            使用舊版OTP管理大師介面（不推薦啟用，大部份功能將失效）
          </v-list-item-subtitle>
        </v-list-item-header>
        <v-list-item-action>
          <v-switch
            v-model="store.useLegacy"
            @change="store.saveSettings()"
            color="primary"
            hide-details
            inset
          ></v-switch>
        </v-list-item-action>
      </v-list-item>

      <v-list-subheader>安全</v-list-subheader>

      <!-- 顯示OTP金鑰 -->
      <v-list-item lines="two">
        <v-list-item-header>
          <v-list-item-title>
            顯示OTP金鑰：{{ store.showSecret ? "開啟" : "關閉" }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption">
            設定畫面的帳號分頁中顯示OTP金鑰
          </v-list-item-subtitle>
        </v-list-item-header>
        <v-list-item-action>
          <v-switch
            v-model="store.showSecret"
            @change="store.saveSettings()"
            color="primary"
            hide-details
            inset
          ></v-switch>
        </v-list-item-action>
      </v-list-item>

      <v-list-subheader>功能</v-list-subheader>

      <!-- 快速啟動篩選 -->
      <v-list-item lines="two" v-if="!display.xs.value">
        <v-list-item-header>
          <v-list-item-title>
            快速啟動篩選：{{
              store.useQuickFilterBar
                ? "開啟 (任意鍵盤鍵觸發篩選)"
                : "關閉 (CTRL+F或F3觸發篩選)"
            }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption">
            按任何鍵盤鍵時將顯示篩選欄，可以在帳號列表中篩選出符合的帳號
          </v-list-item-subtitle>
        </v-list-item-header>
        <v-list-item-action>
          <v-switch
            v-model="store.useQuickFilterBar"
            @change="store.saveSettings()"
            color="primary"
            hide-details
            inset
          ></v-switch>
        </v-list-item-action>
      </v-list-item>

      <!-- 帳號匯入模式 -->
      <v-list-item lines="two">
        <v-list-item-header>
          <v-list-item-title>
            帳號匯入模式：{{ store.importAppend ? "加入" : "取代" }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption">
            帳號設定中，匯入JSON檔時，可以選擇加入或取代已有帳號列表
          </v-list-item-subtitle>
        </v-list-item-header>
        <v-list-item-action>
          <v-switch
            v-model="store.importAppend"
            @change="store.saveSettings()"
            color="primary"
            hide-details
            inset
          ></v-switch>
        </v-list-item-action>
      </v-list-item>

      <v-list-subheader>劍靈 Blade & Soul (TW)</v-list-subheader>

      <!-- 劍靈顯示角色上線狀態 -->
      <v-list-item lines="two">
        <v-list-item-header>
          <v-list-item-title>
            顯示角色上線狀態：{{ store.useBns ? "開啟" : "關閉" }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption">
            即時查詢角色的上線狀態，標籤須設定為角色名稱
          </v-list-item-subtitle>
        </v-list-item-header>
        <v-list-item-action>
          <v-switch
            v-model="store.useBns"
            @change="store.saveSettings()"
            color="primary"
            hide-details
            inset
          ></v-switch>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-card-content>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import { useStore } from "../stores/store";

const display = useDisplay();
const store = useStore();
</script>

<style lang="scss" scoped></style>
