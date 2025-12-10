// 1_Config.gs

const CONFIG = {
  APP_NAME: "Career Cockpit Pro",
  SHEETS: {
    MAIN: {
      NAME: "Main_Progress",
      HEADERS: ["ID", "Status", "Platform", "CompanyName", "Url", "Domain", "Priority", "NextAction", "UnfinishedTasks", "LastMailDate"],
      COLS: { ID: 1, STATUS: 2, NAME: 4, URL: 5, DOMAIN: 6 }
    },
    TASKS: { NAME: "Sub_Tasks", HEADERS: ["TaskId", "CompanyId", "CompanyName", "Type", "Subject", "Link", "Status", "Date"] },
    SETTINGS: { 
      NAME: "Settings", 
      HEADERS: ["Category", "Key", "Value", "Description"],
      DEFAULTS: [
        // ... (以前の設定はそのまま保持) ...
        ["基本", "KGI_Target_Date", "2025/12/31", "転職活動終了目標日"],
        ["基本", "Target_Offers", "1", "欲しい内定の数"],
        ["基本", "Reason_For_Change", "現職では技術的な意思決定に関われず...", "転職理由"],
        ["日程", "Available_Start", "10:00", "面接可能開始時間"],
        ["日程", "Available_End", "19:00", "面接可能終了時間"],
        ["日程", "Meeting_Duration", "60", "基本面接時間(分)"],
        // 【New!】オファー比較の重みづけ (合計10になるように設定推奨)
        ["比較重み", "Weight_Salary", "4", "給与の重要度(1-5)"],
        ["比較重み", "Weight_WorkStyle", "3", "働き方の重要度(1-5)"],
        ["比較重み", "Weight_TechEnv", "2", "技術環境の重要度(1-5)"],
        ["比較重み", "Weight_Culture", "1", "カルチャーの重要度(1-5)"]
      ]
    },
    PREP: { NAME: "Sub_Preparation", HEADERS: ["CompanyId", "CompanyName", "BusinessContent", "Motivation", "SpeakingTime", "Questions", "UpdatedAt"] },
    MINUTES: { NAME: "Sub_InterviewMinutes", HEADERS: ["MinutesId", "CompanyId", "Date", "Type", "Interviewer", "QA_Log_JSON", "Impression", "NextSteps"] },
    
    // 【New!】オファー比較用シート
    OFFERS: {
      NAME: "Sub_Offers",
      HEADERS: ["CompanyId", "CompanyName", "AnnualSalary", "WorkStyle", "TechEnv_Score", "Culture_Score", "Pros_Memo", "Cons_Memo", "TotalScore", "UpdatedAt"]
    }
  },
  // 【Update!】カジュアル面談とオファー面談を追加
  STATUS_LIST: ["未応募", "カジュアル面談", "書類選考中", "一次面接", "二次面接", "最終面接", "オファー面談", "内定承諾", "辞退/不採用"],
  PLATFORMS: ["Wantedly", "Green", "LinkedIn", "BizReach", "Direct", "Agent", "Referral"]
};
