import { defineStore, storeToRefs } from "pinia";

interface OTPProfile {
  name: string;
  secret: string;
}

export const useStore = defineStore({
  id: "store",
  state: () => ({
    // OTP Profiles
    otpProfiles: [] as Array<OTPProfile>,
    // Display settings
    useDarkMode: true,
    useLegacy: false,
    showSecret: false,
    useQuickFilterBar: true,
    useBns: false,

    // Settings dialog
    showSettings: false,
    // Remove confirmation dialog
    showRemoveConfirmation: false,
    profileIndexToBeDeleted: -1 as number,
  }),

  getters: {
    getTheme: (state) => (state.useDarkMode ? "dark" : "light"),
  },

  actions: {
    // Init
    init() {
      this.loadSettings();
      this.loadOtpProfiles();
    },

    // Display settings
    loadSettings() {
      this.useDarkMode = localStorage.getItem("useDarkMode") !== "false"; // Default true
      this.useLegacy = localStorage.getItem("useLegacy") === "true"; // Default false
      this.showSecret = localStorage.getItem("showSecret") === "true"; // Default false
      this.useQuickFilterBar =
        localStorage.getItem("useQuickFilterBar") === "true"; // Default false
      this.useBns = localStorage.getItem("useBns") === "true"; // Default false
      return;
    },
    saveSettings() {
      localStorage.setItem("useDarkMode", JSON.stringify(this.useDarkMode));
      localStorage.setItem("useLegacy", JSON.stringify(this.useLegacy));
      localStorage.setItem("showSecret", JSON.stringify(this.showSecret));
      localStorage.setItem(
        "useQuickFilterBar",
        JSON.stringify(this.useQuickFilterBar)
      );
      localStorage.setItem("useBns", JSON.stringify(this.useBns));
      return;
    },

    // OTP Profiles
    loadOtpProfiles() {
      this.otpProfiles = JSON.parse(localStorage.getItem("keys") || "[]");
      return;
    },
    saveOtpProfiles() {
      localStorage.setItem("keys", JSON.stringify(this.otpProfiles));
      return;
    },

    // JSON import / export
    exportOtpJSON() {
      const exportName = "export-otp.json";
      const jsonStr = JSON.stringify(this.otpProfiles);
      let element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(jsonStr)
      );
      element.setAttribute("download", exportName);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },

    importOtpJSON(file: File) {
      return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = (e) => {
          const jsonStr = e.target?.result?.toString();
          if (!jsonStr) return;
          try {
            const importJson = JSON.parse(jsonStr);
            // TODO: Handle append or replace decision
            this.otpProfiles = importJson;
          } catch (e) {
            resolve(false);
          } finally {
            this.saveOtpProfiles();
            resolve(true);
          }
        };
        fr.readAsText(file);
      });
    },

    addOtpProfile(name: string, secret: string) {
      this.otpProfiles.push({ name, secret });
      this.saveOtpProfiles();
    },
    removeOtpProfile(index: number) {
      this.otpProfiles.splice(index, 1);
      this.saveOtpProfiles();
      this.resetRemoveConfirmation();
    },
    editOtpProfile(index: number, name: string, secret: string) {
      this.otpProfiles[index] = { name, secret };
      this.saveOtpProfiles();
    },
    moveOtpProfile(index: number, direction: "up" | "down") {
      let target = index + (direction === "up" ? -1 : 1);
      [this.otpProfiles[index], this.otpProfiles[target]] = [
        this.otpProfiles[target],
        this.otpProfiles[index],
      ];
      this.saveOtpProfiles();
    },
    showOtpQrCode(index: number) {
      // TODO: Show QR code
      return;
    },

    // Remove confirmation
    requestRemoveOtpProfile(index: number) {
      this.profileIndexToBeDeleted = index;
      this.showRemoveConfirmation = true;
    },
    resetRemoveConfirmation() {
      this.showRemoveConfirmation = false;
      this.profileIndexToBeDeleted = -1;
    },
  },
});
