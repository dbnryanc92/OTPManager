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
            @change="
              updateThemeColor();
              store.saveSettings();
            "
            color="primary"
            hide-details
            inset
          ></v-switch>
        </v-list-item-action>
      </v-list-item>

      <!-- 主題顏色 -->
      <v-list-item lines="two">
        <v-list-item-header>
          <v-list-item-title>
            主題顏色：{{ store.themeColor ? "自訂" : "默認" }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption">
            自訂主題顏色，套用在按鈕、更新條等組件上
          </v-list-item-subtitle>
        </v-list-item-header>
        <v-list-item-action>
          <v-btn
            flat
            class="settingsBtn"
            @click="showColorPicker = !showColorPicker"
            min-width="122"
          >
            <v-sheet
              :color="store.themeColor"
              class="d-flex align-center justify-center h-100 w-100 px-4 py-1"
            >
              <span style="line-height: 20px">
                {{ store.themeColor ? store.themeColor : "默認" }}
              </span>
            </v-sheet>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <Transition name="drawer">
        <v-list-item v-if="showColorPicker">
          <div class="w-100 d-flex flex-wrap justify-center align-center">
            <v-color-picker
              v-model="store.themeColor"
              v-if="!display.xs.value"
              mode="rgb"
              hide-inputs
              elevation="0"
              canvas-height="142"
              @update:model-value="updateThemeColor"
            ></v-color-picker>
            <div>
              <v-color-picker
                v-model="store.themeColor"
                mode="rgb"
                hide-inputs
                hide-canvas
                hide-sliders
                show-swatches
                elevation="0"
                swatches-max-height="142"
                @update:model-value="updateThemeColor"
              ></v-color-picker>
              <v-btn
                flat
                text
                class="mt-2 mb-1 ml-3 mr-7"
                variant="outlined"
                width="260"
                @click="
                  store.themeColor = '#FCB43A';
                  updateThemeColor();
                "
              >
                重置為默認配色
              </v-btn>
            </div>
          </div>
        </v-list-item>
      </Transition>

      <!-- 傳統介面 -->
      <v-list-item lines="two">
        <v-list-item-header>
          <v-list-item-title>
            傳統介面：{{ store.useDarkMode ? "開啟" : "關閉" }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption">
            使用舊版OTP管理大師介面（<strong>不推薦啟用</strong>，大部份功能將失效）
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
            設定頁面中的帳號列表將顯示OTP金鑰
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
            按任何鍵盤鍵時將觸發篩選欄，可以在帳號列表中進行篩選
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
            帳號設定中，匯入JSON檔時，現有帳號的處理方式
          </v-list-item-subtitle>
        </v-list-item-header>
        <v-list-item-action>
          <v-btn
            flat
            class="settingsBtn"
            @click="store.importAppend = !store.importAppend"
            min-width="64"
          >
            <v-sheet
              :color="store.themeColor"
              class="d-flex align-center justify-center h-100 w-100 px-4 py-1"
            >
              <span style="line-height: 20px">
                {{ store.importAppend ? "加入" : "取代" }}
              </span>
            </v-sheet>
          </v-btn>
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
            即時查詢角色的上線狀態，<strong
              >帳號標籤須設定為劍靈角色名稱</strong
            >
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
import { ref } from "vue";
import { useDisplay, useTheme } from "vuetify";
import { useStore } from "../stores/store";

const display = useDisplay();
const store = useStore();
const theme = useTheme();

const showColorPicker = ref(false);

const updateThemeColor = function () {
  if (store.themeColor.length > 7) {
    store.themeColor = store.themeColor.substring(0, 7);
  }
  let darkTheme = theme.getTheme("dark");
  let lightTheme = theme.getTheme("light");
  darkTheme.colors.primary = store.themeColor;
  lightTheme.colors.primary = store.themeColor;
  theme.setTheme("dark", darkTheme);
  theme.setTheme("light", lightTheme);
  store.saveSettings();
};
</script>

<style lang="scss">
.settingsBtn {
  border: 1px solid #777;
  border-radius: 0;
  padding: 3px;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.3s ease-out;
}

.drawer-enter-from {
  opacity: 0;
}
.drawer-leave-to {
  opacity: 0;
}

.v-color-picker__controls {
  padding: 8px !important;
}
.v-color-picker-preview--hide-alpha {
  margin: 0 !important;
}
.v-color-picker-swatches > div {
  padding: 0 8px !important;
}
</style>
