<template>
  <div class="legacyBackground">
    <div class="header">
      OTP管理大師
      <div class="updateTimer">{{ Math.round(cdTillNextUpdate / 1000) }}</div>
    </div>
    <table>
      <thead>
        <tr>
          <th>標籤</th>
          <th class="otpCol">OTP</th>
          <th class="otpCol">下一組</th>
          <th class="secretCol" :class="{ expand: store.showSecret }">金鑰</th>
        </tr>
      </thead>
      <tbody class="otpDisplayBody">
        <tr v-for="(profile, i) in store.otpProfiles" :key="i">
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
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useStore } from "../stores/store";
import TOTP from "../utils/totp";

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
  color: rgba(255, 255, 255, 0.87);
  line-height: initial;
  flex-grow: 1;
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
.otpDisplayBody input {
  color: initial;
  background-color: white;
  border: 2px inset;
  font-size: 13.3333px;
  padding: 1px 6px;
}
</style>
