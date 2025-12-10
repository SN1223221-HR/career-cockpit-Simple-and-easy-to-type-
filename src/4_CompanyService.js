// 4_CompanyService.gs
const CompanyService = {
  /**
   * URLから情報を取得してセルを埋める
   */
  fillCompanyInfo: function(sheet, row, url) {
    // 処理中トースト表示
    SpreadsheetApp.getActiveSpreadsheet().toast("企業情報を取得中...", "Processing");

    let title = "";
    let domain = "";

    try {
      // 1. ドメイン抽出
      const match = url.match(/^https?:\/\/(?:www\.)?([^\/]+)/i);
      if (match) domain = match[1];

      // 2. HTML取得（スクレイピング）
      const response = UrlFetchApp.fetch(url, {muteHttpExceptions: true});
      const html = response.getContentText("UTF-8");
      
      // titleタグ抽出
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      if (titleMatch) {
        title = titleMatch[1]
          .replace(/\|.*$/, "") // "| Wantedly" などを削除
          .replace(/-.*$/, "")
          .trim();
      } else {
        title = domain; // 取得できない場合はドメイン名
      }

    } catch (e) {
      title = "情報取得失敗";
      console.error(e);
    }

    // 3. ID生成 (UUID)
    const id = Utilities.getUuid();

    // 4. セル書き込み
    // ID, Status, Platform(skip), Name, Url(skip), Domain
    sheet.getRange(row, CONFIG.SHEETS.MAIN.COLS.ID).setValue(id);
    sheet.getRange(row, CONFIG.SHEETS.MAIN.COLS.NAME).setValue(title);
    sheet.getRange(row, CONFIG.SHEETS.MAIN.COLS.DOMAIN).setValue(domain);
    
    // Statusが空なら「未応募」を入れる
    const statusCell = sheet.getRange(row, CONFIG.SHEETS.MAIN.COLS.STATUS);
    if (!statusCell.getValue()) statusCell.setValue("未応募");

    SpreadsheetApp.getActiveSpreadsheet().toast(`[${title}] を登録しました`, "完了");
  }
};
