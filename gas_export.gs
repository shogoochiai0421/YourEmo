/**
 * =====================================================
 *  きもちチェック － データ受信 & スプレッドシート書き込み
 * =====================================================
 *
 * 【設置手順】
 *  1. Googleドライブで「新しいスプレッドシート」を作成する
 *  2. スプレッドシートのメニューから
 *     「拡張機能」→「Apps Script」を開く
 *  3. このファイルの内容をエディタに貼り付けて保存
 *  4. 上部メニューの「デプロイ」→「新しいデプロイ」
 *     種類：「ウェブアプリ」
 *     アクセス：「全員」
 *  5. デプロイ後に表示される「ウェブアプリのURL」を
 *     history.html の GAS_URL に貼り付ける
 *
 * 【今回の変更点】
 *  ・いいねした特効薬リストの受信・書き込み処理を完全に削除。
 *    このスプレッドシートには診断履歴（気持ち・元気度・
 *    社交性・体調・したいこと）のみを蓄積する。
 *  ・setValues による一括書き込み、シート名の秒単位＋
 *    衝突時連番、LockServiceによる排他制御は従来どおり維持。
 * =====================================================
 */

function doPost(e) {
  try {
    /* フォームデータ形式（application/x-www-form-urlencoded）で受け取る */
    const raw = e.parameter.payload || e.postData.contents || "{}";
    const payload = JSON.parse(raw);
    const history = payload.history || [];  /* 診断履歴の配列（likesは受け取っても使用しない） */
    const sentAt  = payload.sentAt  || new Date().toISOString();

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    /* ══ シート名の重複を避けて確保する（排他制御つき） ══ */
    const lock = LockService.getScriptLock();
    lock.waitLock(30000);

    let sheet;
    try {
      const sheetName = makeUniqueSheetName(ss, sentAt);
      sheet = ss.insertSheet(sheetName);
    } finally {
      lock.releaseLock();
    }

    /* ══ ラベル変換マップ ══ */
    const LABEL = {
      mood:   { happy:"たのしいきもち", sad:"かなしいきもち", angry:"いらいらする", anxious:"なんだかこわいきもち" },
      energy: { high:"げんきいっぱい", mid:"ふつうかな", low:"つかれたな", verylow:"ぐったり…" },
      social: { social:"いっしょにいたい", alone:"ひとりがいいな", neutral:"どちらでも", unsure:"わからない" },
      body:   { fine:"げんき", heart:"ドキドキしてる", breath:"いきぐるしい", bad:"きもちわるい" },
      wish:   { play:"あそびたい", sleep:"ねむりたい", talk:"はなしたい", nothing:"なにもしたくない" }
    };

    function fmtDate(iso) {
      try {
        const d = new Date(iso);
        return Utilities.formatDate(d, "Asia/Tokyo", "yyyy/MM/dd HH:mm:ss");
      } catch(e) { return iso; }
    }

    /* ══ 診断履歴：書き込む行を配列にまとめる ══ */
    const header = ["子どもの名前", "診断日時", "気持ち", "元気度", "社交性", "体調", "したいこと"];

    const sortedHistory = history.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
    const historyRows = sortedHistory.map(rec => {
      const ans = rec.ans || {};
      return [
        rec.name   || "",
        fmtDate(rec.date),
        LABEL.mood  [ans.mood   ] || ans.mood    || "",
        LABEL.energy[ans.energy ] || ans.energy  || "",
        LABEL.social[ans.social ] || ans.social  || "",
        LABEL.body  [ans.body   ] || ans.body    || "",
        LABEL.wish  [ans.wish   ] || ans.wish    || ""
      ];
    });

    /* ══ 1回のsetValuesで一括書き込み（診断履歴のみ） ══ */
    const allRows = [header, ...historyRows];
    sheet.getRange(1, 1, allRows.length, header.length).setValues(allRows);

    /* ヘッダー行の書式 */
    sheet.getRange(1, 1, 1, header.length).setFontWeight("bold").setBackground("#fff0dc");

    /* 列幅を自動調整 */
    sheet.autoResizeColumns(1, header.length);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok", sheet: sheet.getName(), rows: allRows.length }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 送信日時から一意なシート名を作る。
 * 1. まず「秒」まで含めた名前（例：2025-06-01 10:30:05）を試す
 * 2. それでも既存シートと衝突する場合は "-2" "-3" ... と
 *    連番を付けて、必ず未使用の名前を返す
 */
function makeUniqueSheetName(ss, sentAt) {
  const d = new Date(sentAt);
  const base = Utilities.formatDate(d, "Asia/Tokyo", "yyyy-MM-dd HH:mm:ss");

  if (!ss.getSheetByName(base)) {
    return base;
  }
  let n = 2;
  while (ss.getSheetByName(base + "-" + n)) {
    n++;
  }
  return base + "-" + n;
}

/* GETアクセス時の簡易確認用（ブラウザで直接URLを開いたとき） */
function doGet(e) {
  return ContentService
    .createTextOutput("きもちチェック GAS受信スクリプト 動作中")
    .setMimeType(ContentService.MimeType.TEXT);
}
