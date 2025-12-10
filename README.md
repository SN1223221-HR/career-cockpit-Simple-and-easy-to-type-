# 🚀 Career Cockpit Pro
> **転職活動を「管理」から「戦略」へ昇華させる、エンジニアのための統合コックピット**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Google%20Apps%20Script-green.svg)
![Status](https://img.shields.io/badge/status-Stable-brightgreen.svg)

## 📖 概要 (Overview)
**Career Cockpit Pro** は、Google Spreadsheet と Google Apps Script (GAS) を活用した、転職活動支援プラットフォームです。

単なる応募管理にとどまらず、**「KPIからの逆算」「面接中のリアルタイム支援」「オファーの定量的比較」** など、エンジニアが納得感を持って次のキャリアを選ぶための意思決定支援機能（DSS）を搭載しています。

## ✨ 主な機能 (Features)

### 1. 📊 戦略的KPIダッシュボード
* 目標内定数と期限（KGI）を設定すると、市場の歩留まり率に基づき **「必要な応募数」を逆算**。
* 「あと何社応募すべきか」が数値で可視化され、行動量を最適化します。

### 2. 🗓 スマート日程調整
* Googleカレンダーと連携し、指定した期間（例：来週の水〜金）から**空き枠を自動抽出**。
* ビジネスメール形式の候補日リストを一瞬で生成・コピーできます。

### 3. 🎙 面接支援コックピット (Live Assistant)
* **カンペ機能**: 企業ごとの志望動機や、自分の「転職軸」をサイドバーに常駐表示。
* **スピーキングタイマー**: 入力した志望動機が「話すと何分になるか」をリアルタイム計算。
* **ライブ議事録**: 面接中に「聞かれたこと(Q)」「答えたこと(A)」をチャット形式で記録し、構造化データとして保存。

### 4. 📥 求人情報の構造化インポート
* URLを入力するだけで、企業名やドメインを自動取得。
* 仕事内容や必須スキルをフォームから登録し、面接準備シートへ自動振り分け。

### 5. ⚖️ オファー比較マトリクス
* 内定が出た企業の「年収」「働き方」「技術環境」などを入力。
* 個人の価値観に基づいた**「重み付けスコア」**で総合点を算出し、感情に流されない意思決定をサポート。

## 🛠 技術スタック (Tech Stack)
* **Backend**: Google Apps Script (ES6+)
* **Frontend**: HTML5, Bootstrap 5 (Sidebar UI)
* **Database**: Google Spreadsheet
* **Architecture**: MVC-like separation (Service / Controller / Repository pattern)

## 📦 インストール手順 (Installation)

1.  **スプレッドシートの作成**
    * 新規のGoogle Spreadsheetを作成します。

2.  **スクリプトの配置**
    * 「拡張機能」>「Apps Script」を開きます。
    * `src/` フォルダ内のファイルをすべてコピー＆ペーストします。
    * ※ ファイル名は `1_Config.gs` のように番号順にすることを推奨しますが、GAS上では順不同でも動作します。

3.  **初回セットアップ**
    * スプレッドシートをリロードすると、メニューバーに **「⚡ Career Menu」** が表示されます。
    * `⚙️ 初回セットアップ` を実行してください。必要なシート（Main, Tasks, Prep, Minutes, Offers, Settings）が自動生成されます。

4.  **設定 (Config)**
    * 生成された `Settings` シートにて、自身の「転職理由」「KPI目標値」「オファー比較の重み」を入力してください。

## 📖 使い方 (Usage)

### 準備フェーズ
1.  サイドバーの **「📥 登録」** タブから、気になる求人を登録。
2.  **「📝 準備」** タブで、その企業専用の志望動機や逆質問を練る（文字数タイマー活用）。

### 面接調整
1.  **「🗓 日程」** タブで、`From` `To` と `所要時間` を入力して検索。
2.  空き枠をクリックしてコピーし、メールで返信。

### 面接本番
1.  Zoom/Meet の横でサイドバーを開く。
2.  **「🎙 本番」** タブで、カンペを見ながら回答。
3.  聞かれた質問をその場でメモし、終了後に「保存」。

### 内定後
1.  **「⚖️ オファー」** タブに条件を入力。
2.  ランキングを見て、最もスコアの高い企業を選択する。

## 📄 ライセンス
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
