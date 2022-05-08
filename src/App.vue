<template>
  <v-app :theme="store.getTheme">
    <v-main>
      <!-- Register SW & Handle updates /-->
      <SWUpdate />

      <!-- Main OTP display -->
      <OTPDisplay v-if="!store.useLegacy" />
      <OTPDisplayLegacy v-else />

      <!-- FAB to open settings page -->
      <v-btn
        icon="mdi-cog"
        color="primary"
        position="absolute"
        bottom="16"
        right="16"
        :size="display.xs.value ? 'small' : undefined"
        @click="store.showSettings = !store.showSettings"
      >
      </v-btn>

      <!-- Settings page dialog -->
      <Settings />
      <!-- Delete confirmation dialog -->
      <RemoveConfirmation v-if="store.showRemoveConfirmation" />
      <!-- QR Code display -->
      <QRCodeDisplay v-if="store.showQrCode" />
    </v-main>
    <v-footer height="24" max-height="24" class="footer py-1">
      © dbnryanc92 {{ new Date().getFullYear() }}
      <v-spacer />
      v{{ latestVersion }}
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import OTPDisplay from "@/views/OTPDisplay.vue";
import OTPDisplayLegacy from "@/views/OTPDisplayLegacy.vue";
import Settings from "@/views/Settings.vue";
import RemoveConfirmation from "@/components/RemoveConfirmation.vue";
import QRCodeDisplay from "@/components/QRCodeDisplay.vue";
import SWUpdate from "./components/SWUpdate.vue";

import { useDisplay, useTheme } from "vuetify";
import { useStore } from "./stores/store";

import { updateLog } from "./data/updateLog";

const display = useDisplay();
const theme = useTheme();
const store = useStore();
store.init();

const latestVersion = updateLog[0].v;

// Detech & watch for app height
const setAppHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty("--doc-height", `${window.innerHeight}px`);
};
window.addEventListener("resize", setAppHeight);
setAppHeight();

// Init custom theme color
let darkTheme = theme.getTheme("dark");
let lightTheme = theme.getTheme("light");
darkTheme.colors.primary = store.themeColor;
lightTheme.colors.primary = store.themeColor;
theme.setTheme("dark", darkTheme);
theme.setTheme("light", lightTheme);
store.saveSettings();

// Disable auto zoom in input (iOS devices)
const addMaximumScaleToMetaViewport = () => {
  const el = document.querySelector("meta[name=viewport]");
  if (!el) return;
  let content = el.getAttribute("content");
  if (!content) return;

  let re = /maximum\-scale=[0-9\.]+/g;
  if (re.test(content)) {
    content = content.replace(re, "maximum-scale=1.0");
  } else {
    content = [content, "maximum-scale=1.0"].join(", ");
  }
  el.setAttribute("content", content);
};

const isIOSDevice = function () {
  return (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
};

if (isIOSDevice()) {
  addMaximumScaleToMetaViewport();
}
</script>

<style lang="scss">
:root {
  --doc-height: 100%;
}

html {
  overflow-y: hidden !important;
}

.v-application__wrap {
  min-height: var(--doc-height) !important;
}

.v-main__wrap {
  display: flex;
  flex-direction: column;
}

.footer {
  font-size: 13px;
  line-height: 16px;
  z-index: 2002;
}
</style>
