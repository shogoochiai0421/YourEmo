/* =====================================================
   名前データの共通処理（index.html と names.html で共用）
   - 名前一覧は localStorage の "kimochi_names" に保存
   - 各データ: { id, name, icon? }
   ===================================================== */

const NAMES_KEY = "kimochi_names"; /* localStorageのキー */

/* 名前一覧をlocalStorageから取得 */
function loadNames(){
  try { return JSON.parse(localStorage.getItem(NAMES_KEY)) || []; }
  catch(e){ return []; }
}
/* 名前一覧をlocalStorageに保存 */
function saveNames(list){
  localStorage.setItem(NAMES_KEY, JSON.stringify(list));
}

/* HTMLエスケープ */
function escHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
/* マーク画像タグ（マーク未設定なら空文字。画像が読めない場合は非表示） */
function iconHtml(icon){
  return icon ? `<img class="name-icon" src="${escHtml(icon)}" alt="" onerror="this.style.display='none'">` : "";
}
/* 「マーク＋名前」のHTML */
function nameHtml(user){
  return iconHtml(user.icon) + escHtml(user.name);
}
