import { defineStore } from "pinia";
import { toDataURL } from "qrcode";

interface OTPProfile {
  name: string;
  secret: string;
  bnsAccount?: true | undefined;
}

export const useStore = defineStore({
  id: "store",
  state: () => ({
    // OTP Profiles
    otpProfiles: [] as Array<OTPProfile>,
    // Display settings
    useDarkMode: true,
    themeColor: "#FCB43A",
    useLegacy: false,
    showSecret: false,
    useQuickFilterBar: false,
    importAppend: true,
    useBns: false,

    // Settings dialog
    showSettings: false,
    // Remove confirmation dialog
    showRemoveConfirmation: false,
    profileIndexToBeDeleted: -1 as number,
    // QR code dialog
    showQrCode: false,
    qrCodeProfileIndex: -1 as number,
    qrCodeDataUri: "",
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
      this.themeColor = localStorage.getItem("themeColor") || "#FCB43A"; // Default "#FCB43A"
      this.useLegacy = localStorage.getItem("useLegacy") === "true"; // Default false
      this.showSecret = localStorage.getItem("showSecret") === "true"; // Default false
      this.useQuickFilterBar =
        localStorage.getItem("useQuickFilterBar") === "true"; // Default false
      this.importAppend = localStorage.getItem("importAppend") !== "false"; // Default true
      this.useBns = localStorage.getItem("useBns") === "true"; // Default false
      return;
    },
    saveSettings() {
      localStorage.setItem("useDarkMode", JSON.stringify(this.useDarkMode));
      localStorage.setItem("themeColor", this.themeColor);
      localStorage.setItem("useLegacy", JSON.stringify(this.useLegacy));
      localStorage.setItem("showSecret", JSON.stringify(this.showSecret));
      localStorage.setItem(
        "useQuickFilterBar",
        JSON.stringify(this.useQuickFilterBar)
      );
      localStorage.setItem("importAppend", JSON.stringify(this.importAppend));
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

    importOtpJSON(
      file: File
    ): Promise<{ success: boolean; profileCount: number }> {
      return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = (e) => {
          const jsonStr = e.target?.result?.toString();
          let resultLength = 0;
          if (!jsonStr) return;
          try {
            const importJson = JSON.parse(jsonStr);
            const parsedJson = this.parseImportJson(importJson);
            if (this.importAppend) {
              this.otpProfiles = [...this.otpProfiles, ...parsedJson];
            } else {
              this.otpProfiles = parsedJson;
            }
            resultLength = parsedJson.length;
          } catch (e) {
            resolve({
              success: false,
              profileCount: 0,
            });
          } finally {
            this.saveOtpProfiles();
            resolve({
              success: true,
              profileCount: resultLength,
            });
          }
        };
        fr.readAsText(file);
      });
    },
    parseImportJson(json: object) {
      // Check if JSON is array
      if (!Array.isArray(json)) {
        throw new Error("Not an array");
      }
      let parsedList: Array<OTPProfile> = [];
      json.forEach((obj) => {
        // Check if object has name and secret
        if (!obj.name || !obj.secret) return;
        // Add object to list
        parsedList.push({
          name: obj.name,
          secret: obj.secret,
          bnsAccount: obj.bnsAccount === true ? true : undefined,
        });
      });
      return parsedList;
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

    // Remove confirmation
    requestRemoveOtpProfile(index: number) {
      this.profileIndexToBeDeleted = index;
      this.showRemoveConfirmation = true;
    },
    resetRemoveConfirmation() {
      this.showRemoveConfirmation = false;
      this.profileIndexToBeDeleted = -1;
    },

    // QR code
    async showOtpQrCode(index: number) {
      let name = this.otpProfiles[index].name;
      let secret = this.otpProfiles[index].secret;
      let key = `otpauth://totp/${name}?secret=${secret}`;
      try {
        this.qrCodeDataUri = await toDataURL(key);
        this.qrCodeProfileIndex = index;
        this.showQrCode = true;
      } catch (err) {
        console.error(err);
      }
      return;
    },
  },
});
