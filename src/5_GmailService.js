// 5_GmailService.gs

function menuScanMails() {
  GmailService.scanAndRegisterTasks();
}

const GmailService = {
  scanAndRegisterTasks: function() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const mainSheet = ss.getSheetByName(CONFIG.SHEETS.MAIN.NAME);
    const taskSheet = ss.getSheetByName(CONFIG.SHEETS.TASKS.NAME);
    
    // 全企業データの取得
    const companies = mainSheet.getDataRange().getValues().slice(1); // ヘッダー除く
    
    let newTasksCount = 0;

    // 各企業ごとにメール検索
    companies.forEach((row, index) => {
      const companyId = row[CONFIG.SHEETS.MAIN.COLS.ID - 1];
      const name = row[CONFIG.SHEETS.MAIN.COLS.NAME - 1];
      const domain = row[CONFIG.SHEETS.MAIN.COLS.DOMAIN - 1];
      
      if (!domain) return;

      // 検索クエリ: ドメイン一致 AND (キーワード OR キーワード...) AND 3日以内
      const keywordQuery = `(${CONFIG.MAIL_KEYWORDS.join(" OR ")})`;
      const query = `from:${domain} ${keywordQuery} newer_than:3d`;
      
      const threads = GmailApp.search(query);
      
      threads.forEach(thread => {
        const msgs = thread.getMessages();
        const latestMsg = msgs[msgs.length - 1]; // 最新のメッセージ
        const subject = latestMsg.getSubject();
        const date = latestMsg.getDate();
        const msgId = latestMsg.getId();

        // 重複チェック（簡易的：TaskSheetに同じSubjectとCompanyIDがあればスキップ）
        if (!_isTaskExists(taskSheet, companyId, subject)) {
          // タスク追加
          taskSheet.appendRow([
            Utilities.getUuid(),
            companyId,
            name,
            "MailCheck",
            subject,
            `https://mail.google.com/mail/u/0/#inbox/${thread.getId()}`, // メールリンク
            "未完了",
            date
          ]);
          newTasksCount++;
        }
      });
      
      // MainシートのLastMailDate更新
      if (threads.length > 0) {
        mainSheet.getRange(index + 2, 10).setValue(new Date()); // 10列目と仮定
      }
    });
    
    // タスク集計の更新（MainシートのUnfinishedTasks列）
    _updateTaskCounts(ss);

    Browser.msgBox(`${newTasksCount} 件の新規関連メール・タスクを発見しました。`);
  }
};

function _isTaskExists(sheet, cid, subject) {
  // ※実運用では重くなるのでCacheServiceやデータ構造の工夫推奨だが、まずはシンプルに
  const data = sheet.getDataRange().getValues();
  for(let i=1; i<data.length; i++) {
    if(data[i][1] == cid && data[i][4] == subject) return true;
  }
  return false;
}

function _updateTaskCounts(ss) {
  // Taskシートを集計してMainシートに反映する処理（省略可能だが推奨）
  // 簡易実装として割愛。必要ならCOUNTIFロジックを入れる。
}
