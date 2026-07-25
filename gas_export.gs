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
 *  ・シート名を「分」単位→「秒」単位に変更し、
 *    同じ分内の複数送信で名前が衝突しないようにした。
 *  ・それでも名前が衝突した場合は "-2" "-3" ... の連番を
 *    付けて別シートとして必ず作成する（既存シートの削除・
 *    上書きは行わない）。
 *  ・LockService でシート作成処理を排他制御し、複数の
 *    リクエストがほぼ同時に届いても取りこぼさないようにした。
 * =====================================================
 */

function doPost(e) {
  try {
    /* フォームデータ形式（application/x-www-form-urlencoded）で受け取る */
    const raw = e.parameter.payload || e.postData.contents || "{}";
    const payload = JSON.parse(raw);
    const history = payload.history || [];  /* 診断履歴の配列 */
    const likes   = payload.likes   || {};  /* いいねデータのオブジェクト */
    const sentAt  = payload.sentAt  || new Date().toISOString();

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    /* ══ シート名の重複を避けて確保する（排他制御つき） ══
       複数のリクエストがほぼ同時に届いても、ロックを取ってから
       名前を決めて作成するところまでを1件ずつ行うので、
       名前の衝突や上書きが起きない。 */
    const lock = LockService.getScriptLock();
    lock.waitLock(30000); /* 最大30秒、順番待ちする */

    let sheet;
    try {
      const sheetName = makeUniqueSheetName(ss, sentAt);
      sheet = ss.insertSheet(sheetName);
    } finally {
      lock.releaseLock();
    }

    /* ══ ① 診断履歴シートを書き込む ══ */

    sheet.appendRow([
      "子どもの名前", "診断日時",
      "気持ち", "元気度", "社交性", "体調", "したいこと"
    ]);

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

    const sortedHistory = history.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
    sortedHistory.forEach(rec => {
      const ans = rec.ans || {};
      sheet.appendRow([
        rec.name   || "",
        fmtDate(rec.date),
        LABEL.mood  [ans.mood   ] || ans.mood    || "",
        LABEL.energy[ans.energy ] || ans.energy  || "",
        LABEL.social[ans.social ] || ans.social  || "",
        LABEL.body  [ans.body   ] || ans.body    || "",
        LABEL.wish  [ans.wish   ] || ans.wish    || ""
      ]);
    });

    const headerRange = sheet.getRange(1, 1, 1, 7);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#fff0dc");
    sheet.autoResizeColumns(1, 7);

    sheet.appendRow([]);

    /* ══ ② いいねデータを追記 ══ */
    sheet.appendRow(["【いいねした特効薬】"]);
    const likesHeader = sheet.getRange(sheet.getLastRow(), 1);
    likesHeader.setFontWeight("bold");
    likesHeader.setBackground("#e4f7e4");

    sheet.appendRow(["子どもの名前", "特効薬タイトル", "ジャンル", "解説"]);
    const likesHeaderRange = sheet.getRange(sheet.getLastRow(), 1, 1, 4);
    likesHeaderRange.setFontWeight("bold");
    likesHeaderRange.setBackground("#fff0dc");

    const nameMap = {};
    history.forEach(rec => { if(rec.nameId && rec.name) nameMap[rec.nameId] = rec.name; });

    Object.entries(likes).forEach(([nameId, items]) => {
      const kidName = nameMap[nameId] || nameId;
      (items || []).forEach(item => {
        sheet.appendRow([
          kidName,
          item.title || "",
          item.genre || "",
          item.desc  || ""
        ]);
      });
    });

    sheet.autoResizeColumns(1, 4);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok", sheet: sheet.getName() }))
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
 * （この関数はLockService内で呼ばれるので、複数リクエストが
 *   同時に来ても名前が重複することはない）
 */
function makeUniqueSheetName(ss, sentAt) {
  const d = new Date(sentAt);
  const base = Utilities.formatDate(d, "Asia/Tokyo", "yyyy-MM-dd HH:mm:ss");

  if (!ss.getSheetByName(base)) {
    return base;
  }
  /* 秒まで含めても衝突した場合（同一秒内の複数送信）は連番を付与 */
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
