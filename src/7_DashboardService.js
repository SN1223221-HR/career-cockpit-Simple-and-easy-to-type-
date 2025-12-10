// 7_DashboardService.gs

function menuUpdateDashboard() {
  updateDashboard(SpreadsheetApp.getActiveSpreadsheet());
}

function updateDashboard(ss) {
  const settings = _getSettingsMap(ss);
  const mainSheet = ss.getSheetByName(CONFIG.SHEETS.MAIN.NAME);
  const data = mainSheet.getDataRange().getValues().slice(1);
  
  // 1. 実績集計
  const actual = {
    applied: data.filter(r => r[1] !== "未応募").length,
    docPassed: data.filter(r => ["一次面接", "二次面接", "最終面接", "内定"].some(s => r[1].includes(s))).length,
    offers: data.filter(r => r[1] === "内定" || r[1] === "内定承諾").length
  };

  // 2. 目標と係数取得
  const targetOffers = parseInt(settings['Target_Offers'] || 1);
  const rateDoc = parseFloat(settings['Rate_Document']) / 100 || 0.3;
  const rate1st = parseFloat(settings['Rate_1st_Interview']) / 100 || 0.3;
  const rateFinal = parseFloat(settings['Rate_Final_Interview']) / 100 || 0.5;

  // 3. 逆算ロジック (Reverse Engineering)
  // 必要最終面接数 = 目標内定 / 最終通過率
  // 必要一次面接数 = 必要最終 / 一次通過率
  // 必要応募数 = 必要一次 / 書類通過率
  const reqFinal = Math.ceil(targetOffers / rateFinal);
  const req1st = Math.ceil(reqFinal / rate1st);
  const reqApplied = Math.ceil(req1st / rateDoc);

  // 4. KGI（期限）管理
  const targetDate = new Date(settings['KGI_Target_Date']);
  const today = new Date();
  const daysLeft = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));

  // 5. ダッシュボード出力データ生成
  const dashboardData = [
    ["KPI分析結果", "現在値 / 目標値", "ギャップ", "AIアドバイス"], // Header
    ["📅 残り日数", `${daysLeft}日`, "-", daysLeft < 30 ? "ラストスパートです！" : "計画的に進めましょう。"],
    ["📮 総応募数", `${actual.applied} / ${reqApplied}社`, `${actual.applied - reqApplied}`, actual.applied < reqApplied ? `あと${reqApplied - actual.applied}社応募が必要です。` : "応募数は十分です。質を高めましょう。"],
    ["📄 書類通過数", `${actual.docPassed} / ${req1st}社`, `${actual.docPassed - req1st}`, "-"],
    ["🎉 内定数", `${actual.offers} / ${targetOffers}社`, `${actual.offers - targetOffers}`, "-"],
    ["📊 現在の市場通過率設定", `書類:${settings['Rate_Document']} / 一次:${settings['Rate_1st_Interview']}`, "設定変更可", "実績と乖離がある場合はSettingsを修正してください。"]
  ];

  // シートに書き出し
  const dashSheet = ss.getSheetByName("Dashboard");
  dashSheet.clearContents();
  dashSheet.getRange(1, 1, dashboardData.length, 4).setValues(dashboardData);
  
  // 装飾
  dashSheet.setColumnWidth(1, 150);
  dashSheet.setColumnWidth(2, 150);
  dashSheet.setColumnWidth(4, 400);
}

// Helper: Settingsを連想配列化
function _getSettingsMap(ss) {
  const sheet = ss.getSheetByName(CONFIG.SHEETS.SETTINGS.NAME);
  const data = sheet.getDataRange().getValues();
  const map = {};
  for (let i = 1; i < data.length; i++) {
    map[data[i][1]] = data[i][2]; // Key -> Value
  }
  return map;
}
