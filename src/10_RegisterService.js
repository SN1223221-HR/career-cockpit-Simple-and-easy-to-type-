// 10_RegisterService.gs

/**
 * サイドバーからの企業登録処理
 */
function apiRegisterCompany(form) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const mainSheet = ss.getSheetByName(CONFIG.SHEETS.MAIN.NAME);
  const prepSheet = ss.getSheetByName(CONFIG.SHEETS.PREP.NAME);

  // 1. ID生成
  const newId = Utilities.getUuid();
  const timestamp = new Date();

  // 2. ドメイン抽出（簡易）
  let domain = "";
  if (form.url) {
    const match = form.url.match(/^https?:\/\/(?:www\.)?([^\/]+)/i);
    if (match) domain = match[1];
  }

  // 3. Mainシートへの保存
  // HEADERS: ["ID", "Status", "Platform", "CompanyName", "Url", "Domain", "Priority", "NextAction", "UnfinishedTasks", "LastMailDate"]
  // ※Priority以降は初期値
  mainSheet.appendRow([
    newId,
    "書類選考中", // インポート時は「書類選考中」または「未応募」
    "Direct",    // 仮置き
    form.name,
    form.url,
    domain,
    "", "", "", ""
  ]);

  // 4. Prepシートへの保存（詳細情報をBusinessContentにまとめる）
  // HEADERS: ["CompanyId", "CompanyName", "BusinessContent", "Motivation", "SpeakingTime", "Questions", "UpdatedAt"]
  
  // 詳細情報を読みやすいテキスト形式に整形
  const formattedContent = 
    `【求人タイトル】\n${form.jobTitle}\n\n` +
    `【想定年収】\n${form.salary}\n\n` +
    `【仕事内容】\n${form.jobDescription}\n\n` +
    `【求める人物像・スキル】\n${form.persona}`;

  prepSheet.appendRow([
    newId,
    form.name,
    formattedContent, // 整形したテキストを「事業内容/特徴」欄に保存
    "", // Motivation
    "", // SpeakingTime
    "", // Questions
    timestamp
  ]);

  return { success: true, name: form.name };
}

/**
 * URLからOGP情報のタイトルだけ取得（入力補助用）
 */
function apiFetchTitle(url) {
  try {
    const response = UrlFetchApp.fetch(url, {muteHttpExceptions: true});
    const html = response.getContentText("UTF-8");
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch) {
      return titleMatch[1].trim();
    }
  } catch(e) {
    return "";
  }
  return "";
}
