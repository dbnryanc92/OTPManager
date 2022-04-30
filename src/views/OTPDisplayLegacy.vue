<template>
  <div class="legacyBackground">
    <div class="header">
      OTP管理大師
      <button class="showOptions" @click="showOptions = !showOptions">
        {{ showOptions ? "隱藏選項" : "顯示選項" }}
      </button>
      <div class="updateTimer">{{ Math.round(cdTillNextUpdate / 1000) }}</div>
    </div>

    <div class="options" v-if="showOptions">
      <div class="option">
        <input
          type="checkbox"
          v-model="store.showSecret"
          @change="store.saveSettings()"
        />
        <label for="showSecret" class="optionHeader">顯示金鑰</label>
      </div>
      <div class="option">
        <input type="checkbox" v-model="showModify" />
        <label for="showModify" class="optionHeader"
          >顯示編輯介面(增加/刪除OTP)</label
        >
      </div>
      <div class="option">
        <div class="optionHeader"><strong>備份</strong>（匯出OTP為JSON檔）</div>
        <button @click="store.exportOtpJSON">匯出OTP</button>
      </div>
      <div class="option">
        <div class="optionHeader"><strong>還原</strong>（從JSON檔匯入OTP）</div>
        <button @click="importOtp">選擇檔案</button>
        <input
          ref="importOtpUploader"
          class="d-none"
          type="file"
          @change="onUploaderFileChanged"
        />
        <div class="optionNote">注意：將取代目前所有已輸入之OTP項目</div>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th v-if="showModify" class="modifyCol">編輯</th>
          <th>標籤</th>
          <th class="otpCol">OTP</th>
          <th class="otpCol">下一組</th>
          <th class="secretCol" :class="{ expand: store.showSecret }">金鑰</th>
        </tr>
      </thead>
      <tbody class="otpDisplayBody">
        <tr v-for="(profile, i) in store.otpProfiles" :key="i">
          <td v-if="showModify">
            <input
              type="submit"
              value="刪除"
              @click="store.removeOtpProfile(i)"
            />
          </td>
          <td>
            {{ profile.name }}
          </td>
          <td @click="copyToClipboard(getOtp(profile.secret, curTimegroup))">
            {{ getOtp(profile.secret, curTimegroup) }}
          </td>
          <td
            @click="copyToClipboard(getOtp(profile.secret, curTimegroup + 1))"
          >
            {{ getOtp(profile.secret, curTimegroup + 1) }}
          </td>
          <td>{{ store.showSecret ? profile.secret : "***" }}</td>
        </tr>
        <tr v-if="showModify">
          <td><input type="submit" value="新增" @click="addOtpItem" /></td>
          <td>
            <input type="text" placeholder="標籤" v-model="addLabel" />
          </td>
          <td>-</td>
          <td>-</td>
          <td>
            <input type="text" placeholder="金鑰" v-model="addSecret" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useDisplay } from "vuetify";
import { useStore } from "../stores/store";
import TOTP from "../utils/totp";

const display = useDisplay();
const store = useStore();

// Helper functions
const $ = function (selector: string) {
  return document.querySelector(selector);
};

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

// Options
const showOptions = ref(false);
const showModify = ref(false);

// JSON import
const importingOtp = ref(false);
const importOtpUploader = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const importOtp = function () {
  importingOtp.value = true;
  setTimeout(() => {
    importingOtp.value = false;
  }, 1000);
  window.addEventListener(
    "focus",
    () => {
      importingOtp.value = false;
    },
    { once: true }
  );
  if (importOtpUploader.value) {
    importOtpUploader.value.click();
  }
};
const onUploaderFileChanged = function (e: Event) {
  const target = e.target as HTMLInputElement;
  const file: File = (target.files as FileList)[0];
  selectedFile.value = file;
  store.importOtpJSON(selectedFile.value);
};

// Add OTP profiles
const addLabel = ref("");
const addSecret = ref("");

const addOtpItem = () => {
  if (addLabel.value && addSecret.value) {
    store.addOtpProfile(addLabel.value, addSecret.value);
    addLabel.value = "";
    addSecret.value = "";
  }
};

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
</script>

<style lang="scss" scoped>
.legacyBackground {
  font-family: "Microsoft JhengHei", sans-serif;
  background-color: #1e1e1e;
  line-height: initial;
  min-height: calc(100vh - 24px);
  box-sizing: border-box;
}
.header {
  padding: 12px 6px 12px 24px;
  background: #272727;
}
.updateTimer {
  float: right;
  margin-right: 6px;
  width: 36px;
  border: 1px solid #aaa;
  border-radius: 3px;
  text-align: center;
}
.showOptions {
  float: right;
  width: 70px;
  height: 23px;
  border: 1px solid #aaa;
  border-radius: 3px;
  text-align: center;
  margin: 0 6px;
}
button {
  background-color: rgb(239, 239, 239);
  color: black;
  font-size: 13.33px;
  padding: 1px 6px;

  font-family: "Microsoft JhengHei", sans-serif;
}
.options input {
  margin: 3px 7px 3px 4px;
}
.options {
  padding: 2px 24px;
  background: #363636;
}
.option {
  margin: 10px 0;
}
.option .optionHeader {
  margin-bottom: 2px;
  font-size: 14px;
}
.option .optionNote {
  font-size: 14px;
}
.option button {
  border: 1px solid #aaa;
  margin: 1px;
}
table {
  margin-top: 15px;
  width: 100%;
  box-sizing: unset;
}
th {
  padding: 10px;
  background: #2c2c2c;
}
tr {
  text-align: center;
  height: 36px;
}
tbody > tr {
  background: #3d3d3d;
}
tbody > tr:nth-child(even) {
  background: #2f2f2f;
}
tbody > tr:hover {
  background: #616161;
}

.otpCol {
  min-width: 60px;
}
.secretCol.expand {
  min-width: 180px;
}
.modifyCol {
  min-width: 40px;
}
.otpDisplayBody input {
  color: initial;
  background-color: white;
  border: 2px inset;
  font-size: 13.3333px;
  padding: 1px 6px;
}

input[type="text"] {
  padding: 5px;
  border: 1px solid #aaa;
  border-radius: 5px;
}
</style>
