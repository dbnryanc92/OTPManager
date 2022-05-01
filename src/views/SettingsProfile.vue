<template>
  <v-card-title>
    <div>
      <div class="text-h5">帳號設定</div>
      <div class="text-caption">設定將自動儲存，但只套用到這個瀏覽器</div>
      <div class="text-caption">
        若想顯示OTP金鑰，請到「顯示」設定分頁中開啟。
      </div>
    </div>
  </v-card-title>
  <v-card-content class="pa-0">
    <v-list density="comfortable">
      <v-list-item class="flex-wrap">
        <v-list-item-action class="pb-1" start>
          <v-btn
            color="primary"
            variant="outlined"
            :size="display.xs.value ? 'small' : undefined"
            :prepend-icon="exportingOtp ? 'mdi-sync' : 'mdi-download'"
            :disabled="exportingOtp"
            @click="exportOtp"
          >
            匯出(備份)
          </v-btn>
        </v-list-item-action>
        <v-list-item-action class="pb-1" start>
          <v-btn
            color="primary"
            variant="outlined"
            :size="display.xs.value ? 'small' : undefined"
            :prepend-icon="importingOtp ? 'mdi-sync' : 'mdi-upload'"
            :disabled="importingOtp"
            @click="importOtp"
          >
            匯入(還原)
          </v-btn>
          <input
            ref="importOtpUploader"
            class="d-none"
            type="file"
            accept="application/json"
            @change="onUploaderFileChanged"
          />
        </v-list-item-action>
        <v-spacer />
        <v-list-item-action class="pb-1">
          <v-btn
            v-if="!showAddProfile"
            color="primary"
            :size="display.xs.value ? 'small' : undefined"
            @click="showAddProfile = true"
          >
            新增帳號
          </v-btn>
        </v-list-item-action>
      </v-list-item>

      <!-- Add OTP profile -->
      <v-list-item v-if="showAddProfile" :class="{ 'pr-1': display.xs.value }">
        <div class="d-flex flex-grow-1 flex-wrap">
          <v-text-field
            v-model="addProfileName"
            :rules="[() => !!addProfileName || 'This field is required']"
            label="標籤"
            density="compact"
            :variant="display.xs.value ? 'underlined' : 'outlined'"
            hide-details
            clearable
            class="profileNameInput mr-2 mt-2"
            @keypress.enter="addProfile()"
          ></v-text-field>
          <v-text-field
            v-model="addProfileSecret"
            :rules="[() => !!addProfileSecret || 'This field is required']"
            label="金鑰"
            density="compact"
            :variant="display.xs.value ? 'underlined' : 'outlined'"
            hide-details
            clearable
            class="profileSecretInput mr-2 mt-2"
            @keypress.enter="addProfile()"
          ></v-text-field>
          <v-list-item-action class="mt-2">
            <v-btn
              color="primary"
              :size="display.xs.value ? 'small' : undefined"
              :disabled="!addProfileName || !addProfileSecret"
              @click="addProfile()"
            >
              新增帳號
            </v-btn>
            <v-btn
              icon
              flat
              :size="display.xs.value ? 'x-small' : 'small'"
              @click="showAddProfile = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-list-item-action>
        </div>
      </v-list-item>

      <!-- OTP Profile List -->
      <v-list-item
        v-for="(profile, i) in store.otpProfiles"
        :key="i"
        :prepend-icon="display.xs.value ? undefined : 'mdi-account-circle'"
        :class="{ 'pr-1': display.xs.value }"
      >
        <!-- Show OTP Profile -->
        <v-list-item-header v-if="i !== editingProfileIndex">
          <v-list-item-title>
            {{ profile.name }}
          </v-list-item-title>
          <v-list-item-subtitle v-if="store.showSecret">
            {{ profile.secret }}
          </v-list-item-subtitle>
        </v-list-item-header>

        <!-- Edit OTP Profile -->
        <div v-else class="d-flex flex-grow-1 flex-wrap align-end">
          <v-text-field
            v-model="editProfileName"
            :rules="[() => !!editProfileName || 'This field is required']"
            label="標籤"
            density="compact"
            :variant="display.xs.value ? 'underlined' : 'outlined'"
            hide-details
            filled=""
            class="profileNameInput mr-2 mt-2"
            @keypress.enter="editProfileConfirm"
          ></v-text-field>
          <v-text-field
            v-model="editProfileSecret"
            :rules="[() => !!editProfileSecret || 'This field is required']"
            label="金鑰"
            density="compact"
            :variant="display.xs.value ? 'underlined' : 'outlined'"
            hide-details
            class="profileSecretInput mr-2 mt-2"
            @keypress.enter="editProfileConfirm"
          ></v-text-field>
          <v-list-item-action>
            <v-btn
              icon
              color="success"
              variant="outlined"
              :size="display.xs.value ? 'x-small' : 'small'"
              :disabled="!editProfileName || !editProfileSecret"
              @click="editProfileConfirm"
            >
              <v-icon>mdi-check</v-icon>
            </v-btn>
            <v-btn
              icon
              color="error"
              variant="outlined"
              :size="display.xs.value ? 'x-small' : 'small'"
              @click="editingProfileIndex = -1"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-list-item-action>
        </div>

        <!--v-list-item-action end class="ma-0">
          <v-btn
            variant="text"
            icon="mdi-qrcode"
            size="small"
            :density="display.xs.value ? 'comfortable' : undefined"
            @click="store.showOtpQrCode(i)"
          ></v-btn>
        </v-list-item-action-->
        <v-list-item-action
          end
          class="ma-0"
          v-show="editingProfileIndex === -1"
        >
          <v-btn
            variant="text"
            icon="mdi-pencil"
            size="small"
            :density="display.xs.value ? 'comfortable' : undefined"
            @click="editProfileStart(i)"
          ></v-btn>
          <v-btn
            variant="text"
            icon="mdi-arrow-up"
            size="small"
            :density="display.xs.value ? 'comfortable' : undefined"
            :disabled="i === 0"
            @click="store.moveOtpProfile(i, 'up')"
          ></v-btn>
          <v-btn
            variant="text"
            icon="mdi-arrow-down"
            size="small"
            :density="display.xs.value ? 'comfortable' : undefined"
            :disabled="i === store.otpProfiles.length - 1"
            @click="store.moveOtpProfile(i, 'down')"
          ></v-btn>
          <v-btn
            variant="text"
            color="red lighten-1"
            icon="mdi-delete"
            size="small"
            :density="display.xs.value ? 'comfortable' : undefined"
            @click="store.requestRemoveOtpProfile(i)"
          ></v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-card-content>

  <!-- Export / import success / failure message -->
  <v-snackbar
    v-model="exportOtpSuccessMsg"
    color="success"
    timeout="1500"
    absolute
    top
    content-class="text-center"
  >
    <div class="d-flex align-center justify-space-between">
      <v-icon large>mdi-download</v-icon>
      <div class="flex-grow-1">
        匯出{{ store.otpProfiles.length }}項OTP帳號成功
      </div>
    </div>
  </v-snackbar>
  <v-snackbar
    v-model="importOtpSuccessMsg"
    color="success"
    timeout="1500"
    absolute
    top
    content-class="text-center"
  >
    <div class="d-flex align-center justify-space-between">
      <v-icon large>mdi-upload</v-icon>
      <div class="flex-grow-1">
        匯入{{ store.otpProfiles.length }}項OTP帳號成功
      </div>
    </div>
  </v-snackbar>
  <v-snackbar
    v-model="importOtpFailMsg"
    color="error"
    timeout="1500"
    absolute
    top
    content-class="text-center"
  >
    <div class="d-flex align-center justify-space-between">
      <v-icon large>mdi-upload</v-icon>
      <div class="flex-grow-1">匯入帳號失敗，請檢查檔案是否正確</div>
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useDisplay } from "vuetify";
import { useStore } from "../stores/store";

const display = useDisplay();
const store = useStore();

// JSON import / export
const exportingOtp = ref(false);
const exportOtpSuccessMsg = ref(false);
const exportOtp = function () {
  exportingOtp.value = true;
  store.exportOtpJSON();
  exportOtpSuccessMsg.value = true;
  setTimeout(() => {
    exportingOtp.value = false;
  }, 1000);
};

const importingOtp = ref(false);
const importOtpSuccessMsg = ref(false);
const importOtpFailMsg = ref(false);
const importOtpUploader = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const importOtp = function () {
  importingOtp.value = true;
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
const onUploaderFileChanged = async function (e: Event) {
  const target = e.target as HTMLInputElement;
  const file: File = (target.files as FileList)[0];
  selectedFile.value = file;
  let res = await store.importOtpJSON(selectedFile.value);
  if (res) {
    importOtpSuccessMsg.value = true;
  } else {
    importOtpFailMsg.value = true;
  }
  selectedFile.value = null;
};

// Add OTP profile
const showAddProfile = ref(false);
const addProfileName = ref("");
const addProfileSecret = ref("");
const addProfile = function () {
  if (addProfileName.value && addProfileSecret.value) {
    store.addOtpProfile(addProfileName.value, addProfileSecret.value);
    addProfileName.value = "";
    addProfileSecret.value = "";
    showAddProfile.value = false;
  }
};

// Edit OTP profile
const editingProfileIndex = ref(-1);
const editProfileName = ref("");
const editProfileSecret = ref("");
const editProfileStart = function (index: number) {
  editingProfileIndex.value = index;
  editProfileName.value = store.otpProfiles[index].name;
  editProfileSecret.value = store.otpProfiles[index].secret;
};
const editProfileConfirm = function () {
  if (editingProfileIndex.value !== -1) {
    store.editOtpProfile(
      editingProfileIndex.value,
      editProfileName.value,
      editProfileSecret.value
    );
    editingProfileIndex.value = -1;
    editProfileName.value = "";
    editProfileSecret.value = "";
  }
};
</script>

<style lang="scss">
.profileNameInput,
.profileSecretInput {
  input,
  label {
    font-size: 14px;
  }
}
.profileNameInput {
  min-width: 100px;
}
.profileSecretInput {
  min-width: 160px;
}
</style>
