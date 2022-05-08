<template>
  <v-dialog
    v-model="store.showQrCode"
    :retain-focus="false"
    :style="display.xs.value ? 'z-index: 2003' : ''"
  >
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title class="pa-0 pl-4" primary-title>
          <span>{{ store.otpProfiles[store.qrCodeProfileIndex].name }}</span>
          <v-spacer />
          <v-btn height="56" flat @click="store.showQrCode = false">
            <v-icon size="24" color="primary">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-img :src="store.qrCodeDataUri" width="256" contain />
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import { useStore } from "../stores/store";

const display = useDisplay();
const store = useStore();
</script>

<style lang="scss"></style>
