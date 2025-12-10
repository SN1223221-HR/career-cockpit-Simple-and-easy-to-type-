// 9_OfferService.gs

/**
 * オファー比較データの保存と計算
 */
function apiSaveOffer(form) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const offerSheet = ss.getSheetByName(CONFIG.SHEETS.OFFERS.NAME);
  const settings = _getCalendarSettings(ss); // 既存のヘルパー利用 (5_CalendarService.gs)
  
  // 重み設定の取得
  const wSalary = parseInt(settings['Weight_Salary'] || 3);
  const wWork = parseInt(settings['Weight_WorkStyle'] || 3);
  const wTech = parseInt(settings['Weight_TechEnv'] || 2);
  const wCult = parseInt(settings['Weight_Culture'] || 2);

  // スコア計算ロジック (独自アルゴリズム)
  // 年収は 100万円単位を1ポイントとして計算 + 他の5段階評価 * 重み
  const salaryPoint = (parseInt(form.salary) / 1000000) * wSalary;
  const workPoint = parseInt(form.workStyleScore) * wWork;
  const techPoint = parseInt(form.techEnvScore) * wTech;
  const cultPoint = parseInt(form.cultureScore) * wCult;
  
  const totalScore = Math.round(salaryPoint + workPoint + techPoint + cultPoint);

  const timestamp = new Date();
  
  // 保存データ構築
  const rowData = [
    form.companyId,
    form.companyName,
    form.salary,          // 年収(円)
    form.workStyleText,   // 働き方メモ(フルリモート等)
    form.techEnvScore,    // 技術スコア(1-5)
    form.cultureScore,    // 文化スコア(1-5)
    form.pros,            // 魅力Q&A
    form.cons,            // 懸念Q&A
    totalScore,
    timestamp
  ];

  // Upsert処理 (既存があれば更新)
  const data = offerSheet.getDataRange().getValues();
  let rowIndex = -1;
  for(let i=1; i<data.length; i++) {
    if(data[i][0] === form.companyId) {
      rowIndex = i + 1;
      break;
    }
  }

  if (rowIndex > 0) {
    offerSheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  } else {
    offerSheet.appendRow(rowData);
  }
  
  return { success: true, score: totalScore };
}

/**
 * 比較用データの取得 (グラフ描画用)
 */
function apiGetOfferComparison() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const offerSheet = ss.getSheetByName(CONFIG.SHEETS.OFFERS.NAME);
  
  const data = offerSheet.getDataRange().getValues().slice(1); // ヘッダー除く
  if(data.length === 0) return [];

  // ソートして返す (スコア高い順)
  const result = data.map(r => ({
    name: r[1],
    salary: r[2],
    score: r[8],
    pros: r[6]
  })).sort((a, b) => b.score - a.score);

  return result;
}

/**
 * 特定企業のオファー情報を取得 (編集用)
 */
function apiGetOfferDetail(companyId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const offerSheet = ss.getSheetByName(CONFIG.SHEETS.OFFERS.NAME);
  const data = offerSheet.getDataRange().getValues();
  
  const row = data.find(r => r[0] === companyId);
  if(row) {
    return {
      salary: row[2],
      workStyleText: row[3],
      techEnvScore: row[4],
      cultureScore: row[5],
      pros: row[6],
      cons: row[7]
    };
  }
  return null;
}
