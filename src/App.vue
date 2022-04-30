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
    </v-main>
    <v-footer height="24" max-height="24" class="footer py-1">
      © dbnryanc92 {{ new Date().getFullYear() }}
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import OTPDisplay from "@/views/OTPDisplay.vue";
import OTPDisplayLegacy from "@/views/OTPDisplayLegacy.vue";
import Settings from "@/views/Settings.vue";
import RemoveConfirmation from "@/components/RemoveConfirmation.vue";
import SWUpdate from "./components/SWUpdate.vue";

import { useDisplay } from "vuetify";
import { useStore } from "./stores/store";

const display = useDisplay();
const store = useStore();
store.init();
</script>

<style>
html {
  overflow-y: hidden !important;
}

.footer {
  font-size: 13px;
  line-height: 16px;
}
</style>
