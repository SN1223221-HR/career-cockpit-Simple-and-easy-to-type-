/**
 * メニューから呼ばれる関数：サイドバーを表示
 */
function menuShowScheduler() {
  const html = HtmlService.createHtmlOutputFromFile('sidebar')
    .setTitle('🗓 面接支援コックピット');
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Settingsシートから設定を取得
 */
function _getCalendarSettings(ss) {
  const sheet = ss.getSheetByName("Settings");
  if (!sheet) return {};
  const data = sheet.getDataRange().getValues();
  const map = {};
  for (let i = 1; i < data.length; i++) {
    map[data[i][1]] = data[i][2]; 
  }
  return map;
}

/**
 * 空き時間を検索 (期間指定対応版)
 * @param {string} startDateStr - "YYYY-MM-DD"
 * @param {string} endDateStr - "YYYY-MM-DD"
 * @param {number} durationMin - 所要時間(分)
 */
function apiGetFreeSlots(startDateStr, endDateStr, durationMin) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const settings = _getCalendarSettings(ss);
  
  // Settingsから開始・終了時間を取得（なければデフォルト）
  const startHourConf = parseInt((settings['Available_Start'] || "10:00").split(":")[0], 10);
  const endHourConf = parseInt((settings['Available_End'] || "19:00").split(":")[0], 10);

  const calendar = CalendarApp.getDefaultCalendar();
  const slots = [];
  
  // 日付オブジェクトの生成
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  
  // ループ用変数の初期化
  let currentDate = new Date(startDate);

  // 指定期間の日付をループ (終了日まで)
  while (currentDate <= endDate) {
    // 土日スキップ判定 (0=Sun, 6=Sat)
    const day = currentDate.getDay();
    if (day === 0 || day === 6) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    // その日の検索範囲を設定 (例: 10:00 - 19:00)
    const dailyStart = new Date(currentDate);
    dailyStart.setHours(startHourConf, 0, 0);
    
    const dailyEnd = new Date(currentDate);
    dailyEnd.setHours(endHourConf, 0, 0);

    // Googleカレンダーからその日の予定を取得
    const events = calendar.getEvents(dailyStart, dailyEnd);
    
    // 空き時間探索ロジック
    let checkTime = new Date(dailyStart);
    
    // 終了時刻をはみ出さない範囲でループ
    while (checkTime.getTime() + durationMin * 60000 <= dailyEnd.getTime()) {
      const slotEnd = new Date(checkTime.getTime() + durationMin * 60000);
      
      // 衝突チェック
      const isBusy = events.some(e => {
        // イベントがスロットと被っているか (開始か終了が重なる、または内包される)
        return (e.getStartTime() < slotEnd && e.getEndTime() > checkTime);
      });

      if (!isBusy) {
        slots.push(_formatDate(checkTime, slotEnd));
      }
      
      // 30分刻みで次へ (スロット開始時間をずらす)
      checkTime.setMinutes(checkTime.getMinutes() + 30);
    }
    
    // 次の日へ
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return slots;
}

/**
 * おまけ：サイドバー初期化データ取得
 */
function apiGetCheatsheetData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const settings = _getCalendarSettings(ss);
  return {
    reason: settings['Reason_For_Change'],
    kgi: settings['KGI_Target_Date']
  };
}

/**
 * 内部関数: 日付フォーマット整形
 */
function _formatDate(start, end) {
  const dayMap = ["日", "月", "火", "水", "木", "金", "土"];
  const m = start.getMonth() + 1;
  const d = start.getDate();
  const w = dayMap[start.getDay()];
  const sTime = Utilities.formatDate(start, Session.getScriptTimeZone(), "HH:mm");
  const eTime = Utilities.formatDate(end, Session.getScriptTimeZone(), "HH:mm");
  
  return `${m}/${d}(${w}) ${sTime}-${eTime}`;
}
