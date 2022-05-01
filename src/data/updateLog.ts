interface Update {
  v: string;
  date: string;
  details: Array<string>;
}

interface UpdateLog extends Array<Update> {}

const updateLog: UpdateLog = [
  {
    v: "2.0.3",
    date: "20220501",
    details: [
      "介面：移動裝置上新增啟動篩選功能的浮動按鈕",
      "功能：移動裝置上刪除快速啟動篩選設定（改以浮動按鈕啟動）",
      "修正：電腦版上關閉篩選功能的快捷鍵固定為連按Esc鍵兩次",
      "修正：移動裝置上能正確以滑動手勢切換到下一個頁面",
      "修正：iOS上點選輸入框時將不再自動放大頁面",
    ],
  },
  {
    v: "2.0.2",
    date: "20220501",
    details: [
      "介面：調整主畫面及設定按鈕樣式，避免設定按鈕遮擋畫面下方的OTP",
      "功能：新增及編輯帳號時，在輸入中按Enter鍵會自動提交",
      "修正：切換設定頁面時，將不會再出現奇怪的滾動狀況",
      "修正：Esc鍵將不再觸發篩選功能（連按Esc鍵可關閉篩選）",
    ],
  },
  {
    v: "2.0.1",
    date: "20220430",
    details: [
      "修正：Esc鍵將不再關閉設定頁面",
      "修正：瀏覽器滾動條將不再在OTP更新動畫時（特定螢幕寬度下）異常出現",
    ],
  },
  {
    v: "2.0",
    date: "20220430",
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
