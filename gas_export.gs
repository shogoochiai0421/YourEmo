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
 * 【今回の変更点（速度改善）】
 *  ・appendRow を1件ずつ呼ぶループをやめ、
 *    全データをJS配列にまとめてから setValues で
 *    1回の通信で一括書き込みするように変更。
 *    → 件数が増えても書き込み時間はほぼ一定になる。
 *  ・シート名は秒単位＋衝突時連番、LockServiceによる
 *    排他制御は従来どおり維持。
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

    /* ══ ① 診断履歴：書き込む行を配列にまとめる ══ */
    const historyHeader = ["子どもの名前", "診断日時", "気持ち", "元気度", "社交性", "体調", "したいこと"];

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

    /* ══ ② いいねデータ：書き込む行を配列にまとめる ══ */
    const nameMap = {};
    history.forEach(rec => { if(rec.nameId && rec.name) nameMap[rec.nameId] = rec.name; });

    const likesRows = [];
    Object.entries(likes).forEach(([nameId, items]) => {
      const kidName = nameMap[nameId] || nameId;
      (items || []).forEach(item => {
        likesRows.push([kidName, item.title || "", item.genre || "", item.desc || ""]);
      });
    });

    /* ══ 全体を1枚の2次元配列にまとめて、setValuesで一括書き込み ══
       列数がまちまち（履歴7列／いいね4列）なので、最大列数(7)に
       右側を空文字で揃えてから1回のsetValuesで流し込む。 */
    const COLS = 7;
    const padRow = (row) => {
      const r = row.slice();
      while (r.length < COLS) r.push("");
      return r;
    };

    const allRows = [];
    allRows.push(padRow(historyHeader));
    historyRows.forEach(r => allRows.push(padRow(r)));
    allRows.push(padRow([]));                                 /* 空行区切り */
    allRows.push(padRow(["【いいねした特効薬】"]));
    allRows.push(padRow(["子どもの名前", "特効薬タイトル", "ジャンル", "解説"]));
    likesRows.forEach(r => allRows.push(padRow(r)));

    /* ── ここが唯一の書き込み通信（件数に関わらず1回） ── */
    if (allRows.length > 0) {
      sheet.getRange(1, 1, allRows.length, COLS).setValues(allRows);
    }

    /* ══ 書式設定（行位置が分かっているので範囲指定で一括適用） ══ */
    /* 履歴ヘッダー行 */
    sheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#fff0dc");

    /* いいねセクションの見出し行・ヘッダー行の位置を計算 */
    const likesSectionHeaderRow = 1 + historyRows.length + 1 + 1; /* 履歴ヘッダー+履歴件数+空行+「いいね」見出し行 */
    const likesHeaderRow        = likesSectionHeaderRow;          /* ↑の行番号を指す */
    const likesTitleRow         = 1 + historyRows.length + 2;     /* 【いいねした特効薬】の行 */

    sheet.getRange(likesTitleRow, 1).setFontWeight("bold").setBackground("#e4f7e4");
    sheet.getRange(likesTitleRow + 1, 1, 1, 4).setFontWeight("bold").setBackground("#fff0dc");

    /* 列幅を自動調整（これも呼び出し回数は列数分だけで、行数には依存しない） */
    sheet.autoResizeColumns(1, 7);

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
