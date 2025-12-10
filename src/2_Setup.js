/**
 * スプレッドシートを開いた時に実行される
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Career Menu')
    .addItem('📊 KPIダッシュボード更新', 'menuUpdateDashboard')
    .addItem('📥 メールからタスクを取得', 'menuScanMails')
    .addItem('🗓 面接支援コックピット', 'menuShowScheduler') // 名称統一
    .addSeparator()
    .addItem('⚙️ 初回セットアップ', 'setupSheets')
    .addToUi();
}

/**
 * 初回セットアップ：必要な全シートを作成し、初期設定を行う
 */
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Main Sheet (進捗管理)
  _createSheet(ss, CONFIG.SHEETS.MAIN.NAME, CONFIG.SHEETS.MAIN.HEADERS);
  // プルダウン設定 (Status, Platform)
  _setValidation(ss, CONFIG.SHEETS.MAIN.NAME, CONFIG.SHEETS.MAIN.COLS.STATUS, CONFIG.STATUS_LIST);
  _setValidation(ss, CONFIG.SHEETS.MAIN.NAME, 3, CONFIG.PLATFORMS); // 3列目=Platformと仮定

  // 2. Task Sheet (ToDo管理)
  _createSheet(ss, CONFIG.SHEETS.TASKS.NAME, CONFIG.SHEETS.TASKS.HEADERS);
  
  // 3. Settings Sheet (設定・定数)
  const settingSheet = _createSheet(ss, CONFIG.SHEETS.SETTINGS.NAME, CONFIG.SHEETS.SETTINGS.HEADERS);
  if (settingSheet.getLastRow() === 1) {
    // デフォルト値を流し込む
    settingSheet.getRange(2, 1, CONFIG.SHEETS.SETTINGS.DEFAULTS.length, 4)
      .setValues(CONFIG.SHEETS.SETTINGS.DEFAULTS);
      
    // 見やすくするために列幅調整
    settingSheet.setColumnWidth(2, 150); // Key
    settingSheet.setColumnWidth(3, 300); // Value
    settingSheet.setColumnWidth(4, 300); // Description
  }

  // 4. Prep Sheet (面接準備・カンペ用)
  _createSheet(ss, CONFIG.SHEETS.PREP.NAME, CONFIG.SHEETS.PREP.HEADERS);

  // 5. Minutes Sheet (面接議事録用)
  _createSheet(ss, CONFIG.SHEETS.MINUTES.NAME, CONFIG.SHEETS.MINUTES.HEADERS);

  // 6. Offers Sheet (オファー比較用) [NEW!]
  _createSheet(ss, CONFIG.SHEETS.OFFERS.NAME, CONFIG.SHEETS.OFFERS.HEADERS);

  // 7. Dashboard Sheet (KPI可視化)
  const dashSheet = _createSheet(ss, "Dashboard", ["Metric", "Value", "Gap", "Advice"]);
  if (dashSheet.getLastRow() === 1) {
    try {
      if (typeof updateDashboard === 'function') {
        updateDashboard(ss); 
      }
    } catch (e) {
      console.warn("Dashboard update skipped during setup:", e);
    }
  }

  Browser.msgBox("セットアップ完了。オファー比較用シートを含む全てのシートを作成しました。");
}

/**
 * 内部関数: シート作成
 */
function _createSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    // ヘッダー行の装飾
    sheet.getRange(1, 1, 1, headers.length)
      .setBackground("#e5e7eb")
      .setFontWeight("bold")
      .setBorder(false, false, true, false, false, false);
  }
  return sheet;
}

/**
 * 内部関数: プルダウン作成
 */
function _setValidation(ss, sheetName, colIndex, list) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return;
  
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(list)
    .setAllowInvalid(true) // 柔軟性のため警告のみ
    .build();
    
  // 2行目から1000行目まで設定
  sheet.getRange(2, colIndex, 999, 1).setDataValidation(rule);
}
