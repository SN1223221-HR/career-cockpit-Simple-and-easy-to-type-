// 8_InterviewAssistant.gs

/**
 * サイドバー初期化用：企業リストと基本設定を取得
 */
function apiGetInitData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const mainSheet = ss.getSheetByName(CONFIG.SHEETS.MAIN.NAME);
  
  // 企業リスト作成 (IDと名前だけ)
  const data = mainSheet.getDataRange().getValues().slice(1);
  const companies = data.map(r => ({
    id: r[CONFIG.SHEETS.MAIN.COLS.ID - 1],
    name: r[CONFIG.SHEETS.MAIN.COLS.NAME - 1]
  })).filter(c => c.name); // 名前があるものだけ

  // 設定取得
  const settings = _getCalendarSettings(ss); // 5_CalendarServiceにある共通関数を利用

  return {
    companies: companies,
    commonReason: settings['Reason_For_Change']
  };
}

/**
 * 企業選択時：準備データ（カンペ）を取得
 */
function apiGetPrepData(companyId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const prepSheet = ss.getSheetByName(CONFIG.SHEETS.PREP.NAME);
  const data = prepSheet.getDataRange().getValues();
  
  // CompanyIdで検索
  const row = data.find(r => r[0] === companyId);
  
  if (row) {
    return {
      businessContent: row[2],
      motivation: row[3],
      questions: row[5]
    };
  } else {
    // データがない場合は、MainシートのURLから情報を取ってきたり、初期値を返す
    return {
      businessContent: "（未調査）公式サイト等を確認して記入してください。",
      motivation: "",
      questions: ""
    };
  }
}

/**
 * カンペデータの保存
 */
function apiSavePrepData(form) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const prepSheet = ss.getSheetByName(CONFIG.SHEETS.PREP.NAME);
  const data = prepSheet.getDataRange().getValues();
  
  // 既存データがあるか検索
  let rowIndex = -1;
  for(let i=1; i<data.length; i++) {
    if(data[i][0] === form.companyId) {
      rowIndex = i + 1;
      break;
    }
  }

  // スピーキング時間の計算 (300文字/分)
  const speakingTime = (form.motivation.length / 300).toFixed(1);
  const timestamp = new Date();

  const rowData = [
    form.companyId,
    form.companyName,
    form.businessContent,
    form.motivation,
    speakingTime,
    form.questions,
    timestamp
  ];

  if (rowIndex > 0) {
    // Update
    prepSheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  } else {
    // Insert
    prepSheet.appendRow(rowData);
  }
  
  return { success: true, time: speakingTime };
}

/**
 * 議事録（ライブメモ）の保存
 */
function apiSaveMinutes(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const minSheet = ss.getSheetByName(CONFIG.SHEETS.MINUTES.NAME);
  
  minSheet.appendRow([
    Utilities.getUuid(),
    data.companyId,
    new Date(),
    "面接", // 形式は仮置き
    data.interviewer,
    JSON.stringify(data.qaLog), // QAログはJSON文字列として保存（後で加工しやすくするため）
    data.impression,
    data.nextSteps
  ]);
  
  return { success: true };
}
