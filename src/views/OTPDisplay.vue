<template>
  <!-- Next update timer bar -->
  <v-progress-linear
    :modelValue="cdTillNextUpdate"
    :max="updateInterval"
    :color="store.themeColor"
    striped
    height="12"
  >
    <template v-slot:default="{ value }">
      <div class="text-caption">
        {{ Math.round(cdTillNextUpdate / 1000) }}秒後更新
      </div>
    </template>
  </v-progress-linear>

  <!-- Filter bar -->
  <div v-show="showFilterBar && store.otpProfiles.length !== 0">
    <v-sheet class="d-flex align-center">
      <v-text-field
        v-model="filterBarInput"
        id="filterBarInputId"
        hide-details
        single-line
        variant="plain"
        density="compact"
        prepend-icon="mdi-magnify"
        class="ml-2"
      ></v-text-field>
      <v-btn icon flat @click="resetFilterBar" density="comfortable">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-sheet>
  </div>

  <!-- Table to display OTPs -->
  <v-table
    v-if="store.otpProfiles.length > 0"
    fixed-header
    density="comfortable"
    class="flex-grow-1 overflow-y-auto"
    style="height: 1px"
  >
    <thead>
      <tr>
        <th
          class="text-subtitle-1 text-center"
          style="z-index: 1; background: unset"
        >
          標籤
        </th>
        <th
          class="text-subtitle-1 text-center"
          style="z-index: 1; background: unset"
          colspan="4"
        >
          OTP
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, i) in filteredOtpProfiles" :key="i">
        <td class="text-center">
          {{ item.name }}
          <BnsOnlineStatusTag
            v-if="store.useBns"
            :online="bnsOnlineStatus[item.name]"
          />
        </td>
        <td class="text-center" v-if="display.width.value >= 420">
          <Transition
            name="shift-drop"
            @click="copyToClipboard(getOtp(item.secret, curTimegroup - 1))"
          >
            <div v-if="showOtp" class="otpLast">
              {{ getOtp(item.secret, curTimegroup - 1) }}
            </div>
          </Transition>
        </td>
        <td
          class="text-center"
          @click="copyToClipboard(getOtp(item.secret, curTimegroup))"
        >
          <Transition
            :name="
              display.width.value >= 420
                ? 'shift'
                : display.width.value >= 340
                ? 'shift-drop'
                : 'fade'
            "
          >
            <div v-if="showOtp" class="otpCur">
              {{ getOtp(item.secret, curTimegroup) }}
            </div>
          </Transition>
        </td>
        <td
          class="text-center"
          v-if="display.width.value >= 340"
          @click="copyToClipboard(getOtp(item.secret, curTimegroup + 1))"
        >
          <Transition :name="!display.xs.value ? 'shift' : 'add-shift'">
            <div v-if="showOtp" class="otpNext">
              {{ getOtp(item.secret, curTimegroup + 1) }}
            </div>
          </Transition>
        </td>
        <td
          class="text-center"
          v-if="!display.xs.value"
          @click="copyToClipboard(getOtp(item.secret, curTimegroup + 2))"
        >
          <Transition name="add-shift">
            <div v-if="showOtp" class="otpNext2">
              {{ getOtp(item.secret, curTimegroup + 2) }}
            </div>
          </Transition>
        </td>
      </tr>

      <!-- Empty filter result message -->
      <tr v-if="filteredOtpProfiles.length === 0">
        <td colspan="5" class="text-center">
          <v-icon size="large" class="mr-2"
            >mdi-account-question-outline</v-icon
          >
          <span class="text-caption">沒有符合篩選條件的OTP帳號</span>
        </td>
      </tr>

      <!-- Empty row to avoid settings FAB blocking any OTPs -->
      <tr style="height: 56px"></tr>
    </tbody>
  </v-table>

  <!-- Intro message if no active OTP profiles -->
  <div
    v-if="store.otpProfiles.length === 0"
    class="d-flex flex-column align-center justify-center flex-grow-1"
  >
    <Intro />
  </div>

  <!-- Copy success message -->
  <v-snackbar
    v-model="showCopySuccessMsg"
    color="success"
    timeout="1000"
    absolute
    :top="!display.xs.value"
    :bottom="display.xs.value"
    content-class="text-center"
  >
    <div class="d-flex align-center justify-space-between">
      <v-icon>mdi-content-copy</v-icon>
      <div class="flex-grow-1">已複製到剪貼簿：{{ copiedToClipboard }}</div>
    </div>
  </v-snackbar>

  <!-- FAB to open settings page (for Mobile) -->
  <v-btn
    v-if="display.xs.value && !showFilterBar && store.otpProfiles.length !== 0"
    icon="mdi-magnify"
    color="primary"
    position="absolute"
    bottom="16"
    right="64"
    size="small"
    @click="activateFilterBar"
  >
  </v-btn>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useDisplay } from "vuetify";
import { useStore } from "../stores/store";
import TOTP from "../utils/totp";
import { bnsCheckOnline } from "../utils/bnsApi";
import Intro from "@/views/Intro.vue";
import BnsOnlineStatusTag from "@/components/BnsOnlineStatusTag.vue";

const display = useDisplay();
const store = useStore();

// Timers
const now = ref(new Date().getTime());
const updateInterval = ref(30 * 1000); // Expire in 30 seconds

const updatedTimegroup = ref(0);
const curTimegroup = computed(() => {
  return Math.floor(now.value / updateInterval.value);
});

const nextUpdateTime = computed(() => {
  return (curTimegroup.value + 1) * updateInterval.value;
});
const cdTillNextUpdate = computed(() => {
  return nextUpdateTime.value - now.value;
});

// 0.1s interval timer to update now and OTPs
setInterval(() => {
  now.value = new Date().getTime();

  if (curTimegroup.value > updatedTimegroup.value) {
    updateOTP();
  }
  if (store.useBns) {
    if (curTimegroup.value > bnsOnlineUpdatedTimegroup.value) {
      updateBnsOnlineStatus();
    }
  }
}, 100);
const showOtp = ref(true);
const updateOTP = async () => {
  showOtp.value = false;
  updatedTimegroup.value = curTimegroup.value;
  setTimeout(() => {
    showOtp.value = true;
  }, 100);
};

const getOtp = (secret: string, timegroup: number) => {
  return TOTP.get(secret, 30, 6, updateInterval.value * timegroup);
};

// Filter bar
const showFilterBar = ref(false);
const filterBarInput = ref("");
let consecutiveEscPressed = 0;

const activateFilterBar = () => {
  if (store.otpProfiles.length === 0) return;
  if (showFilterBar.value) return;
  showFilterBar.value = true;

  let filterBarInputEl = document.getElementById("filterBarInputId");
  if (!filterBarInputEl) return;
  var __tempEl__ = document.createElement("input");
  __tempEl__.style.position = "absolute";
  __tempEl__.style.height = "0";
  __tempEl__.style.opacity = "0";
  document.body.appendChild(__tempEl__);
  __tempEl__.focus();

  // The keyboard is open. Now do a delayed focus on the target element
  setTimeout(function () {
    if (!filterBarInputEl) return;
    filterBarInputEl.focus();
    filterBarInputEl.click();
    document.body.removeChild(__tempEl__);
  }, 1);
};

const resetFilterBar = function () {
  showFilterBar.value = false;
  filterBarInput.value = "";
  consecutiveEscPressed = 0;
};

window.addEventListener("keydown", function (e) {
  // Not to trigger filterbar if settings is open
  if (store.showSettings) {
    if (e.key === "Escape") {
      e.stopImmediatePropagation();
    }
    return;
  }

  // Handle Escape
  if (e.key === "Escape") {
    // Hide filter bar when Escape is pressed 2 times
    consecutiveEscPressed++;
    if (consecutiveEscPressed === 2) {
      resetFilterBar();
      return;
    }
    return;
  }
  consecutiveEscPressed = 0;

  // Handle F3 or Ctrl+F
  if (e.key === "F3" || (e.ctrlKey && e.key === "f")) {
    // Disable native search
    e.preventDefault();
    activateFilterBar();
    return;
  }
  if (!store.useQuickFilterBar) return;
  activateFilterBar();
});

const filteredOtpProfiles = computed(() => {
  if (filterBarInput.value === "") return store.otpProfiles;
  return store.otpProfiles.filter((item) => {
    return item.name.toLowerCase().includes(filterBarInput.value.toLowerCase());
  });
});

// Click OTP to copy to clipboard
const showCopySuccessMsg = ref(false);
const copiedToClipboard = ref("");
const copyToClipboard = (otp: string) => {
  const el = document.createElement("textarea");
  el.value = otp;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  copiedToClipboard.value = otp;
  showCopySuccessMsg.value = true;
};

// Bns Online Status
interface BnsOnlineStatus {
  [key: string]: boolean;
}
const bnsOnlineStatus = ref({} as BnsOnlineStatus);
const bnsOnlineUpdatedTimegroup = ref(0);
const updateBnsOnlineStatus = async () => {
  bnsOnlineUpdatedTimegroup.value = curTimegroup.value;
  const ids = store.otpProfiles.map((profile) => {
    return profile.name;
  });
  bnsOnlineStatus.value = await bnsCheckOnline(ids);
};
</script>

<style lang="scss">
// OTP fonts
.otpLast {
  font-size: 14px;
  opacity: 0.5;
}
.otpCur {
  font-size: 18px;
  font-weight: 500;
}
.otpNext {
  font-size: 16px;
  opacity: 0.8;
}
.otpNext2 {
  font-size: 16px;
  opacity: 0.6;
}

// OTP update animation
.fade-enter-active,
.fade-leave-active,
.add-shift-leave-active,
.shift-enter-active,
.shift-leave-active,
.shift-drop-enter-active,
.shift-drop-leave-active {
  transition: all 0.3s ease-out;
}

.add-shift-enter-active {
  transition: all 0.7s ease-out;
}

.shift-enter-from,
.shift-drop-enter-from {
  transform: translateX(60px);
  opacity: 0;
}
.add-shift-leave-to,
.shift-leave-to {
  transform: translateX(-60px);
  opacity: 0;
}
.fade-enter-from,
.fade-leave-to,
.add-shift-enter-from,
.shift-drop-leave-to {
  opacity: 0;
}
</style>
