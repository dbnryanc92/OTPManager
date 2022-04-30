interface Update {
  v: string;
  date: string;
  details: Array<string>;
}

interface UpdateLog extends Array<Update> {}

const updateLog: UpdateLog = [
  {
    v: "2.0.1",
    date: "20220429",
    details: [
      "修正：修正按Esc鍵會關閉設定頁面的錯誤",
      "修正：修正特定寬度下，OTP更新動畫會導致瀏覽器滾動條異常出現情況",
    ],
  },
  {
    v: "2.0",
    date: "20220429",
    details: [
      "重點：全新重製v2.0版本，加入更多功能，改用Vue3 + TypeScript編寫",
      "介面：畫面完全重新設計",
      "介面：支援螢幕寬度不同的情況",
      "功能：按螢幕寬度最多可以顯示4組OTP",
      "功能：新增帳號編輯、排序功能",
      "功能：相容v1.0的OTP記錄及匯入匯出功能",
      "功能：新增黑夜模式開關",
      "功能：新增劍靈(台服)即時查詢角色上線狀態功能",
      "功能：新增說明頁面及更新日誌",
    ],
  },
  {
    v: "1.0",
    date: "20210508",
    details: [
      "推出：第一個正式版本",
      "功能：點擊OTP時自動複製到剪貼簿",
      "功能：自動本地儲存OTP記錄",
      "功能：匯出/匯入OTP記錄至/自JSON檔案",
    ],
  },
];

export { updateLog };
