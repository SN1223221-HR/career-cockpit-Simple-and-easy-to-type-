// 3_Triggers.gs

/**
 * セル編集時に発火
 */
function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  const range = e.range;
  
  // Mainシート以外は無視
  if (sheet.getName() !== CONFIG.SHEETS.MAIN.NAME) return;
  // 1行目（ヘッダー）は無視
  if (range.getRow() === 1) return;

  // URL列が編集された場合
  if (range.getColumn() === CONFIG.SHEETS.MAIN.COLS.URL) {
    const url = range.getValue();
    if (url && url.toString().startsWith("http")) {
      CompanyService.fillCompanyInfo(sheet, range.getRow(), url);
    }
  }
}
