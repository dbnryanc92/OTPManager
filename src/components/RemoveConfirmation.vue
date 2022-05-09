<template>
  <v-dialog
    v-model="store.showRemoveConfirmation"
    :retain-focus="false"
    persistent
  >
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title class="px-6 pt-4" primary-title>
          你確定要移除{{
            store.otpProfiles[store.profileIndexToBeDeleted].name
          }}嗎？
        </v-card-title>

        <v-card-subtitle class="px-6">移除後將無法復原。</v-card-subtitle>

        <v-divider class="mt-4"></v-divider>

        <v-card-actions height="36" class="pa-0">
          <v-btn
            text
            class="w-50"
            size="x-large"
            @click="store.resetRemoveConfirmation()"
          >
            <span class="text-subtitle-1">保留</span>
          </v-btn>
          <v-divider vertical />
          <v-btn
            color="red"
            text
            size="x-large"
            class="ma-0 w-50"
            @click="store.removeOtpProfile(store.profileIndexToBeDeleted)"
          >
            <span class="text-subtitle-1 font-weight-bold">移除</span>
          </v-btn>
        </v-card-actions>
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
