/* ==============================================
   data.js
   きもちチェックのデータファイル
   ・BUBBLES : 特効薬バブルの一覧
   ・MD      : きもちごとの見出し・説明・アイコン設定
   ============================================== */


/* ── バブルのジャンル別カラー定義 ── */
const BC = {
  発散:       {c:"#FBEAF0", tc:"#72243E"},  /* ピンク系 */
  落ち着き:   {c:"#E1F5EE", tc:"#085041"},  /* 緑系 */
  気分転換:   {c:"#FAEEDA", tc:"#633806"},  /* 黄色系 */
  人とつながる:{c:"#E6F1FB", tc:"#0C447C"},  /* 青系 */
  からだ:     {c:"#EAF3DE", tc:"#27500A"},  /* 薄緑系 */
  表現:       {c:"#EEEDFE", tc:"#3C3489"},  /* 紫系 */
};



/* ==============================================
   場所タグ・地図・採点の設定
   ============================================== */

/* ── 場所タグの語彙 ──
   s = 画面表示用の短い名前(ゾーンエディタ・デバッグ表示で使う)
   ゾーン(ZONES)とカード(BUBBLES.tags.place)で共通に使う。
   作業用 zone-editor.html もこの定義を読み込んで使う。 */
const PLACE_TAGS = {
  groups: [
    {id:"setting", label:"屋内外", tags:[
      {id:"indoor", s:"屋内", label:"屋内"},
      {id:"outdoor", s:"屋外", label:"屋外"}]},
    {id:"tempo", label:"動静", tags:[
      {id:"active", s:"動", label:"動(にぎやか・からだを動かす)"},
      {id:"calm", s:"静", label:"静(しずか・おちつく)"}]},
    {id:"people", label:"人", tags:[
      {id:"alone", s:"ひとり", label:"ひとり"},
      {id:"friends", s:"友だち", label:"友だち"},
      {id:"teacher", s:"先生", label:"先生"}]},
    {id:"theme", label:"テーマ", tags:[
      {id:"build", s:"組み立て", label:"組み立て(積み木・レゴ)"},
      {id:"desk", s:"机上", label:"机上の遊び(工作・絵)"},
      {id:"book", s:"絵本", label:"絵本"},
      {id:"rest", s:"休む", label:"休む場所"},
      {id:"nature", s:"自然", label:"自然"},
      {id:"family", s:"家族", label:"家族"},
      {id:"move", s:"運動", label:"運動"},
      {id:"music", s:"音楽", label:"音楽"}]}
  ]
};

/* ── 地図メタ情報 ──
   index.html の地図領域は 960x460 (座標系)。背景画像は object-fit:contain で
   中央に収まる。ZONES の座標は「画像全体を 0〜1 に正規化した値」で持つので、
   地図領域のサイズを変えてもズレない。
     地図x = 画像左端x + 正規化x * 画像幅 (画像高さ = 地図の高さ、幅 = 高さ*imgAspect) */
const MAP_META = {w: 1679, h: 937, imgAspect:1679/937,
  imgUrl:"https://raw.githubusercontent.com/shogoochiai0421/YourEmo/main/images/room/room.png"};

/* ── げんき度 ──
   メーターは 0〜100% (なめらか) で受け取り、内部では20%刻みの5段階に丸める。
   ENERGY_LEVELS の並びは げんき→ぐったり。 */
const ENERGY_LEVELS = ["veryhigh","high","mid","low","verylow"];

/* ── 採点の設定(ここを変えるだけで調整できる) ── */
const SCORE_CFG = {
  mood: 3,                          // きもちが合う
  body: 2,                          // からだが合う
  wish: 2,                          // したいことが合う
  energyByDist: [2, 1, 0, -1, -2],  // 互換用（現在は連続関数を使用）
  placePerPoint: 1,                 // 場所タグ1点あたりの加点
  placeCap: 4,                      // 場所による加点の上限
  weightBase: 2,                    // 抽選の重み = weightBase ^ スコア
  minScore: 1,                      // 初回抽選の候補に入れる最低スコア
  shufflePool: 30,                  // シャッフル時に「スコア上位 何枚」から選ぶか

  /* ── 追加：スコアの細分化・正規化 ── */
  moodBonus: 0.5,        // moodタグが複数ある場合の一致率ボーナス
  bodyBonus: 0.5,        // bodyタグが複数ある場合の一致率ボーナス
  wishBonus: 0.5,        // wishタグが複数ある場合の一致率ボーナス
  wishNothingBonus: 0,   // 「なにもしたくない」選択時のwish加点（0で実質無効化）
  energyWeight: 2.5,     // energyの最大加点
  energyDecay: 1.2,      // energyの距離による減衰係数
  placeNormalize: true,  // placeタグ数で加点を正規化する
};

/* ── 全特効薬バブルのデータ ──
   フィールドの説明：
     t    : 表示テキスト
     g    : ジャンル（色の種類）
     img  : 画像ファイル名（acts/フォルダ内）
     desc : 詳細画面に表示する解説文（50文字程度）
     tags : スコアリング用タグ
            mood   : 合う気持ち (happy/sad/angry/anxious)
            energy : 合うげんき度 (veryhigh/high/mid/low/verylow の5段階・複数可)
            place  : 出やすくしたい「場所タグ」(下の PLACE_TAGS 参照。空[]ならどこでも可)
            body   : 合うからだの状態 (fine/heart/breath/bad)
            wish   : 合うしたいこと (play/sleep/talk/nothing)
   ============================================== */
const BUBBLES = [
  {t:"そとでジャンプしてみる",
   g:"発散",
   img:"act-jump-happy.png",
   desc:"たかく ジャンプして、もやもや エネルギーを そとに だしちゃおう！",
   tags:{mood:["angry","happy"], energy:["veryhigh","high"], place:["outdoor","active","move"], body:"fine", wish:"play"}},
  {t:"そのばではしってみる",
   g:"発散",
   img:"act-jump-happy.png",
   desc:"そのばで こばしりするだけでも、からだが すっきりしちゃうかもね。",
   tags:{mood:["angry","happy"], energy:["veryhigh","high","mid"], place:["active","move"], body:"fine", wish:"play"}},
  {t:"かみをビリビリやぶいてみる",
   g:"発散",
   img:"act-tear-paper.png",
   desc:"やぶってもいい かみを ビリビリ やぶくと、きもちが すっきりするのさ！",
   tags:{mood:"angry", energy:["veryhigh","high","mid"], place:["alone","desk"], body:["fine","heart"], wish:"play"}},
  {t:"まくらにさけんでみる",
   g:"発散",
   img:"act-scream-in-pillow.png",
   desc:"まくらに かおを うずめて、「わーっ！」と おおごえで さけんでみよう。",
   tags:{mood:"angry", energy:["veryhigh","high","mid"], place:["indoor","alone"], body:["fine","breath","heart"], wish:"play"}},
  {t:"ぎゅーっててをにぎってみる",
   g:"発散",
   img:"act-hold-hand.png",
   desc:"こぶしを ギュッと にぎって、 パワーを ためよう。",
   tags:{mood:["angry","anxious"], energy:["veryhigh","high","mid","low"], place:[], body:"heart", wish:"nothing"}},
  {t:"おもいきりのびをしてみる",
   g:"発散",
   img:"act-stretch.png",
   desc:"うえに おおきく のびをして、ゆ～っくり いきを はきだす。",
   tags:{mood:["angry","anxious","sad"], energy:["veryhigh","high","mid","low"], place:["move"], body:["breath","fine"], wish:"nothing"}},
  {t:"おもいっきりわらってみる",
   g:"発散",
   img:"act-laugh-hardly.png",
   desc:"たのしいことを おもいだして、こえにだして わらってみるのだ！ ガハハハハ！",
   tags:{mood:"happy", energy:["veryhigh","high","mid"], place:[], body:"fine", wish:"play"}},
  {t:"トイレでゆっくりいきをはいてみる",
   g:"落ち着き",
   img:"act-deepbreath-in-bathroom.png",
   desc:"おちつける トイレへ いって、いきを「はー」って だしてみる。",
   tags:{mood:["angry","anxious"], energy:["veryhigh","high","mid","low"], place:["indoor","calm","alone"], body:["breath","heart"], wish:"nothing"}},
  {t:"ゆっくりしんこきゅうしてみる",
   g:"落ち着き",
   img:"act-deepbreath.png",
   desc:"むねに てをあてて、ふくらませながら ふかーく すって はいてみるのだ。",
   tags:{mood:["anxious","angry","sad"], energy:["veryhigh","high","mid","low"], place:["calm"], body:["breath","heart"], wish:"nothing"}},
  {t:"めをとじて100かぞえてみる",
   g:"落ち着き",
   img:"act-closeeyes-char.png",
   desc:"めを とじて、ゆっくり 100まで かぞえながら おちつこう。",
   tags:{mood:["anxious","angry"], energy:["veryhigh","high","mid","low"], place:["calm"], body:["heart","breath"], wish:"nothing"}},
  {t:"すわってめをとじてみる",
   g:"落ち着き",
   img:"act-closeeyes-char.png",
   desc:"らくな しせいで すわって、めを とじて しばらく やすむのも いいよね。",
   tags:{mood:["sad","anxious"], energy:["low","verylow"], place:["calm","alone","rest"], body:["fine","bad"], wish:"nothing"}},
  {t:"しばらくひとりでいてみる",
   g:"落ち着き",
   img:"act-laydown.png",
   desc:"しずかな ばしょで、ひとりぼっちの じかんを つくってみよう。",
   tags:{mood:["angry","sad","anxious"], energy:["mid","low"], place:["calm","alone","rest"], body:["fine","breath"], wish:"nothing"}},
  {t:"すきなばしょですわってみる",
   g:"落ち着き",
   img:"act-sitting-fav-place.png",
   desc:"きみが いちばん おちつける ばしょは どこかな？ そこにいって じっとしてみよう。",
   tags:{mood:["anxious","sad"], energy:["mid","low"], place:["calm","alone","rest"], body:["fine","bad"], wish:"nothing"}},
  {t:"めをとじてやすんでみる",
   g:"落ち着き",
   img:"act-laydown-rest.png",
   desc:"めを とじて、からだの ちからを ぬいて ゆっくり やすもうぜ。",
   tags:{mood:["sad","anxious"], energy:["low","verylow"], place:["indoor","calm","rest"], body:["fine","bad"], wish:"sleep"}},
  {t:"きょうはゆっくりやすんでみる",
   g:"落ち着き",
   img:"act-laydown-rest.png",
   desc:"きょうは むりせず、のんびり すごして みるってのはどう？",
   tags:{mood:["sad","anxious"], energy:["low","verylow"], place:["indoor","calm","rest"], body:["fine","bad"], wish:"sleep"}},
  {t:"ゆっくりあるいてみる",
   g:"落ち着き",
   img:"act-walk-with-adult.png",
   desc:"いそがず ゆっくり あるいて、あしのうらを かんじてみるのさ。なめくじさんより おそくなれるかい？",
   tags:{mood:["sad","anxious"], energy:["mid","low"], place:["calm","move"], body:["fine","bad","breath"], wish:["nothing","sleep"]}},
  {t:"そとではしってみる",
   g:"落ち着き",
   img:"act-run-plain.png",
   desc:"そとで すこし はしってみると、きもちが スッキリするかも！！",
   tags:{mood:["happy","angry"], energy:["veryhigh","high"], place:["outdoor","active","move"], body:"fine", wish:"play"}},
  {t:"すきなうたをきいてみる",
   g:"気分転換",
   img:"act-listen-music.png",
   desc:"すきな きょくを きいてみよう。ちなみに わたしの マイブームは、『さっちゃん』。",
   tags:{mood:["sad","anxious","angry"], energy:["mid","low"], place:["calm","music"], body:["fine","bad","breath"], wish:["nothing","sleep"]}},
  {t:"すきなどうがをみてみる",
   g:"気分転換",
   img:"act-using-tablet.png",
   desc:"すきな どうがや アニメを みて、きぶんを かえちゃうのさ。",
   tags:{mood:["sad","anxious"], energy:["mid","low"], place:["indoor","calm"], body:["fine","bad"], wish:"nothing"}},
  {t:"すきなうたにあわせておどってみる",
   g:"気分転換",
   img:"act-dance.png",
   desc:"すきな きょくに あわせて、からだを うごかして たのしもう！ ずんちゃっちゃ ずんちゃっちゃ。",
   tags:{mood:"happy", energy:["veryhigh","high"], place:["active","move","music"], body:"fine", wish:"play"}},
  {t:"すきなほんをよんでみる",
   g:"気分転換",
   img:"act-read-book.png",
   desc:"すきな ほんを ひらいて、ものがたりの せかいへ レッツらゴー！",
   tags:{mood:["sad","anxious"], energy:["mid","low"], place:["indoor","calm","book"], body:["fine","bad"], wish:"nothing"}},
  {t:"すきなキャラクターをながめてみる",
   g:"気分転換",
   img:"act-play-with-dolls.png",
   desc:"すきな キャラクターの グッズや えを、じっくり ながめてみよう。",
   tags:{mood:["sad","anxious"], energy:["mid","low"], place:["calm"], body:["fine","bad"], wish:"nothing"}},
  {t:"すきなキャラクターのえをかいてみる",
   g:"気分転換",
   img:"act-paint.png",
   desc:"すきな キャラクターの えを、じゆうに かいてみるのさ。",
   tags:{mood:["happy","sad"], energy:["veryhigh","high","mid"], place:["indoor","alone","desk"], body:"fine", wish:"play"}},
  {t:"あたらしいあそびをためしてみる",
   g:"気分転換",
   img:"act-play-with-friends.png",
   desc:"やったことがない あそびを、ひとつ ためしてみよう。",
   tags:{mood:"happy", energy:["veryhigh","high","mid"], place:["active","build"], body:"fine", wish:"play"}},
  {t:"おりがみをおる",
   g:"気分転換",
   img:"act-origami.png",
   desc:"おりがみを おることに しゅうちゅうすると、きもちが おちつくよ。",
   tags:{mood:["sad","anxious"], energy:["mid","low"], place:["indoor","calm","desk"], body:["fine","bad"], wish:"nothing"}},
  {t:"ちょっとかたづけをしてみる",
   g:"気分転換",
   img:"act-cleanup.png",
   desc:"みの まわりを ちょびっと かたづけると、あたまも きもちも ちょびっと スッキリ！",
   tags:{mood:["sad","angry"], energy:["mid","low"], place:["indoor","calm"], body:"fine", wish:"nothing"}},
  {t:"たいようのひかりをあびてみる",
   g:"気分転換",
   img:"act-sunbathing.png",
   desc:"そとに でて、たいようの ひかりを からだじゅうで あびてみよう。くもってたら ごめんね。",
   tags:{mood:["sad","anxious"], energy:["mid","low"], place:["outdoor","calm","nature"], body:["fine","bad","breath"], wish:["nothing","sleep"]}},
  {t:"そとのそらをみあげてみる",
   g:"気分転換",
   img:"act-looking-at-clouds.png",
   desc:"そらを みあげて、くもを ながめてみるのも いいね。くもがひとつもなかったら...... それもステキ。",
   tags:{mood:["anxious","sad"], energy:["mid","low"], place:["outdoor","calm","nature"], body:["breath","fine"], wish:["nothing","sleep"]}},
  {t:"しんらいできるひとにはなしてみる",
   g:"人とつながる",
   img:"act-talk-concern.png",
   desc:"いまのきもちを、だれか しんらいできるひとに はなしてみる。",
   tags:{mood:["sad","anxious","angry"], energy:["mid","low","verylow"], place:["calm","teacher"], body:["fine","heart","bad"], wish:"talk"}},
  {t:"せんせいにはなしかけてみる",
   g:"人とつながる",
   img:"act-talk-to-adult-02.png",
   desc:"しんらいできる おとなのひとに、「ちょっと いい？ かわいいかわいい ぼくちゃんが はなしたいこと あるんだけど」と、いってみる。",
   tags:{mood:["sad","anxious"], energy:["mid","low","verylow"], place:["teacher"], body:["fine","bad"], wish:"talk"}},
  {t:"だれかにそばにいてもらう",
   g:"人とつながる",
   img:"act-stay-with-adult.png",
   desc:"だれかに ちかくに いてもらうだけで あんしんしちゃうかも。",
   tags:{mood:["sad","anxious"], energy:["low","verylow"], place:["teacher","family"], body:["fine","bad","heart"], wish:["nothing","sleep"]}},
  {t:"やさしいひとのそばにいてみる",
   g:"人とつながる",
   img:"act-stay-with-adult.png",
   desc:"やさしい ひとの ちかくに いるだけで、きもちが らくに なるよ。",
   tags:{mood:["sad","anxious"], energy:["low","verylow"], place:["calm","teacher","family"], body:["fine","bad","heart"], wish:["nothing","sleep"]}},
  {t:"おともだちにはなしかけてみる",
   g:"人とつながる",
   img:"act-talk-with-friend.png",
   desc:"ともだちに、「さいきん どう？」と はなしかけてみるのさ。",
   tags:{mood:["sad","anxious","angry"], energy:["mid","low"], place:["friends"], body:["fine","heart"], wish:"talk"}},
  {t:"ともだちをあそびにさそってみる",
   g:"人とつながる",
   img:"act-talk-with-friend.png",
   desc:"ともだちを、「いっしょに へのへのもへじ かこ！」と さそってみよう。",
   tags:{mood:"happy", energy:["veryhigh","high","mid"], place:["active","friends"], body:"fine", wish:"play"}},
  {t:"だれかにえがおをむけてみる",
   g:"人とつながる",
   img:"act-laugh.png",
   desc:"あった ひとに えがおを むけてみて。じぶんも きもちが よくなるよ。",
   tags:{mood:"happy", energy:["veryhigh","high","mid"], place:["friends"], body:"fine", wish:["play","talk"]}},
  {t:"だれかにありがとうをつたえてみる",
   g:"人とつながる",
   img:"act-talk-with-friend.png",
   desc:"だれかに 「ありがとう」を つたえると、ふたりとも ハッピー！",
   tags:{mood:"happy", energy:["veryhigh","high","mid"], place:["friends"], body:"fine", wish:"talk"}},
  {t:"たのしいきもちをだれかにつたえてみる",
   g:"人とつながる",
   img:"act-talk-to-adult-02.png",
   desc:"「たのしかったこと」を だれかに はなすと、もっともっと うれしく なるよ。",
   tags:{mood:"happy", energy:["veryhigh","high","mid"], place:["friends"], body:"fine", wish:"talk"}},
  {t:"おともだちのそばにいてみる",
   g:"人とつながる",
   img:"act-play-with-friends.png",
   desc:"おともだちの ちかくに いるだけで、しんぱいが やわらぐかもね。",
   tags:{mood:["anxious","sad"], energy:["mid","low"], place:["calm","friends"], body:["fine","heart","bad"], wish:["nothing","talk"]}},
  {t:"みずをゴクっとのんでみる",
   g:"からだ",
   img:"act-drink.png",
   desc:"のみものを ひとくち ゴクッと のんでみて、おちつこう。",
   tags:{mood:"angry", energy:["veryhigh","high","mid","low"], place:[], body:["fine","heart","bad"], wish:"nothing"}},
  {t:"てをあらってすっきりしてみる",
   g:"からだ",
   img:"act-sunbathing.png",
   desc:"てを ていねいに あらって、きもちを すっきり させてみよう。",
   tags:{mood:["sad","angry"], energy:["veryhigh","high","mid","low"], place:["indoor"], body:["bad","fine"], wish:"nothing"}},
  {t:"あしのうらをかんじてみる",
   g:"からだ",
   img:"act-sitting-fav-chair.png",
   desc:"あしのうらに ふれているものを、しっかり かんじて みて。",
   tags:{mood:"anxious", energy:["veryhigh","high","mid","low"], place:["calm"], body:["heart","breath"], wish:"nothing"}},
  {t:"おきにいりのものランキングをつくる",
   g:"からだ",
   img:"act-thinking-stand.png",
   desc:"おきにいりのものを ランキングにして はっぴょう！",
   tags:{mood:"anxious", energy:["veryhigh","high","mid","low"], place:["calm"], body:["heart","breath"], wish:"nothing"}},
  {t:"きこえるおとを3つさがしてみる",
   g:"からだ",
   img:"act-eyeclose-seiza.png",
   desc:"いま きこえる おとを 3つ さがしてみて。チクタク...チュンチュン.........パオーン。",
   tags:{mood:"anxious", energy:["veryhigh","high","mid","low"], place:["calm"], body:["heart","breath"], wish:"nothing"}},
  {t:"すきなにおいをかいでみる",
   g:"からだ",
   img:"act-hug-stuffed-bear.png",
   desc:"ちかくにある すきな においに くんくん してみよう。きもちが なごむね。",
   tags:{mood:["sad","anxious"], energy:["mid","low"], place:["calm"], body:["fine","heart","bad"], wish:"nothing"}},
  {t:"ふわふわしたものをさわってみる",
   g:"からだ",
   img:"act-hug-stuffed-bear.png",
   desc:"ふわふわの タオルや ぬいぐるみを、さわって... ウットリ。",
   tags:{mood:["anxious","sad"], energy:["mid","low"], place:["indoor","calm"], body:["heart","breath","fine"], wish:"nothing"}},
  {t:"ぬいぐるみをだっこしてみる",
   g:"からだ",
   img:"act-hug-stuffed-bear.png",
   desc:"かわいい ぬいぐるみを ギュッと だきしめると、ホッとして あんしんするよ。",
   tags:{mood:["sad","anxious"], energy:["mid","low"], place:["indoor","calm","rest"], body:["fine","heart","bad"], wish:"nothing"}},
  {t:"いまのきもちをえにかいてみる",
   g:"表現",
   img:"act-paint.png",
   desc:"いまの きもちを えに かいてみよう。にこにこ？ とげとげ？ ...え、にょろん？",
   tags:{mood:["angry","sad","anxious"], energy:["mid","low"], place:["indoor","calm","desk"], body:["fine","bad"], wish:"nothing"}},
  {t:"えんぴつでぐるぐるかいてみる",
   g:"表現",
   img:"act-paint.png",
   desc:"かみに えんぴつで ぐるぐる かくだけで、きもちが スッキリするよ。ついでに、うでの うんどうにもなる。",
   tags:{mood:["angry","anxious"], energy:["veryhigh","high","mid"], place:["indoor","calm","desk"], body:["fine","heart"], wish:"play"}},
  {t:"きもちをノートにかいてみる",
   g:"表現",
   img:"act-writing-letter.png",
   desc:"いま おもっていることを、ノートに かきだして みるってのは、どう？",
   tags:{mood:["sad","angry","anxious"], energy:["mid","low"], place:["indoor","calm","desk"], body:["fine","bad"], wish:"nothing"}},
  {t:"しんぱいをノートにかいてみる",
   g:"表現",
   img:"act-writing-letter.png",
   desc:"しんぱいなことを ぜんぶ かくと、あたまの なかが スッキリするよ。",
   tags:{mood:"anxious", energy:["mid","low"], place:["indoor","calm","desk"], body:["fine","bad"], wish:"nothing"}},
  {t:"えをかく",
   g:"表現",
   img:"act-paint.png",
   desc:"すきなものでも きもちでも、なんでも じゆうに えに してみよう。もし なにもおもいつかなかったら、わたしの すきなもの、かいてよ。 もぐら。",
   tags:{mood:["sad","anxious"], energy:["mid","low"], place:["indoor","desk"], body:["fine","bad"], wish:"nothing"}},
  {t:"みつけたものをえにかいてみる",
   g:"表現",
   img:"act-paint.png",
   desc:"めのまえに あるものを じっくり みて、えに かいてみよう。",
   tags:{mood:["sad","happy"], energy:["mid","low"], place:["indoor","desk"], body:"fine", wish:"nothing"}},
  {t:"だれかにおてがみをかいてみる",
   g:"表現",
   img:"act-writing-letter.png",
   desc:"だれかに おてがみを かいてみよう。きもちが つたわると いいね！",
   tags:{mood:"happy", energy:["veryhigh","high","mid"], place:["friends","desk","family"], body:"fine", wish:"talk"}},
  {t:"ちいさなこえでうたってみる",
   g:"表現",
   img:"act-sing.png",
   desc:"ちいさな こえで、すきな うたを くちずさむの。きみだけの だいじな コンサート。",
   tags:{mood:["sad","anxious"], energy:["mid","low"], place:["calm","music"], body:["fine","breath","bad"], wish:"nothing"}},
  {t:"おおきなくちであくびしてみる",
   g:"表現",
   img:"act-yawn.png",
   desc:"おもいきり おおきく あくびして、からだを ゆるめて みよう。",
   tags:{mood:["angry","anxious"], energy:["veryhigh","high","mid","low"], place:[], body:["breath","fine"], wish:"nothing"}},
  {t:"きもちをことばにしてみる",
   g:"表現",
   img:"act-talk-concern.png",
   desc:"「かなしい」とか 「つかれた」とか。いまの きもちを こえにだそう。",
   tags:{mood:["sad","anxious"], energy:["mid","low"], place:["calm"], body:["fine","bad","heart"], wish:"talk"}},
  {t:"しんぱいをことばにしてみる",
   g:"表現",
   img:"act-talk-concern.png",
   desc:"なにが しんぱいなんだろう？ くちで いってみるだけで、すこし らくに なるよ。",
   tags:{mood:"anxious", energy:["mid","low"], place:["calm"], body:["fine","heart","breath"], wish:"talk"}},
  {t:"「かなしいな」ってつぶやいてみる",
   g:"表現",
   img:"act-lay-lonely.png",
   desc:"「かなしいな」と ちいさく つぶやくだけで、かなしいきもちが ちょっとだけ おそとにいって くれるのさ。",
   tags:{mood:"sad", energy:["mid","low"], place:["calm"], body:["fine","heart","bad"], wish:"nothing"}},
  {t:"「だいじょうぶ」ってつぶやいてみる",
   g:"表現",
   img:"act-cheer-sheself.png",
   desc:"「だいじょうぶ」って じぶんに いいきかせて みよう。だいじょうぶじゃなかったら、また もどってきてね。",
   tags:{mood:"anxious", energy:["veryhigh","high","mid","low"], place:["calm"], body:["fine","heart","breath"], wish:"nothing"}},
  {t:"100までかぞえてみる",
   g:"表現",
   img:"act-thinking-stand.png",
   desc:"1から 100まで、ゆっくり かぞえて みよう。",
   tags:{mood:["angry","anxious"], energy:["veryhigh","high","mid","low"], place:["calm"], body:["fine","heart"], wish:"nothing"}},
  {t:"てをぎゅっとしてからひらいてみる",
   g:"表現",
   img:"act-hold-hand.png",
   desc:"てを ギュッと にぎって、パッと ひらくのを くりかえして みて。20かいぐらいまでは、おもしろい。30かいぐらい すると、なにしてるんだろうって おもう。100かいやると、てが つかれちゃった......。",
   tags:{mood:["angry","anxious"], energy:["veryhigh","high","mid","low"], place:[], body:["heart","fine"], wish:"nothing"}},
  {t:"やりたいことをリストにかいてみる",
   g:"表現",
   img:"act-writing.png",
   desc:"いま きみがやりたいことを リストに すると、たのしい きぶんに なっちゃうね。わたしはいま、おふとんで いっぱい ねたい。",
   tags:{mood:"happy", energy:["veryhigh","high","mid"], place:["indoor","desk"], body:"fine", wish:"play"}},
  {t:"きょうのことをにっきにしてみる",
   g:"表現",
   img:"act-writing.png",
   desc:"きょう あったことを かいてみよう。",
   tags:{mood:"happy", energy:["mid","low"], place:["indoor","calm","desk"], body:"fine", wish:"nothing"}},
  {t:"きょうのよかったことをひとつかんがえてみる",
   g:"表現",
   img:"act-thinking-stand.png",
   desc:"きょう よかったことを、ひとつ おもいだして みるの。",
   tags:{mood:["sad","anxious"], energy:["mid","low"], place:["calm"], body:["fine","bad"], wish:"nothing"}},
  {t:"きょうよかったことを100こかんがえてみる!",
   g:"表現",
   img:"act-thinking-stand.png",
   desc:"きょう よかったことを、100こ めざして おもいだす。",
   tags:{mood:"happy", energy:["veryhigh","high","mid"], place:["calm","desk"], body:"fine", wish:["nothing","play"]}},
  {t:"ありがとうをつたえてみる",
   g:"表現",
   img:"act-talk-with-friend.png",
   desc:"だれかに「ありがとう」を つたえると、きみも あいても ハッピーせいじん。",
   tags:{mood:"happy", energy:["veryhigh","high","mid"], place:["friends","family"], body:"fine", wish:"talk"}},
  {t:"すきなことにちょうせんしてみる",
   g:"表現",
   img:"act-play-with-friends.png",
   desc:"すきな ことに、おもいきり ちょうせん してみようぜ！",
   tags:{mood:"happy", energy:["veryhigh","high"], place:["active"], body:"fine", wish:"play"}},
  {t:"おきにいりのものをながめてみる",
   g:"表現",
   img:"act-play-with-dolls.png",
   desc:"おきにいりの ものを、じっくり じーっと ながめて みよう。どこがすき？",
   tags:{mood:["sad","anxious"], energy:["mid","low"], place:["calm"], body:["fine","bad","heart"], wish:"nothing"}},
  {t:"すきなものをあつめてみる",
   g:"表現",
   img:"act-play-with-dolls.png",
   desc:"ちかくにある じぶんの すきなものを あつめて ならべてみると、たのしい きぶんに なるんだぜ。",
   tags:{mood:"happy", energy:["veryhigh","high","mid"], place:["build"], body:"fine", wish:"play"}},
  {t:"たのしいことをかんがえてみる",
   g:"表現",
   img:"act-stay-with-adult-2.png",
   desc:"たのしい ことを、あたまの なかで いっぱい そうぞう してみよう！",
   tags:{mood:"happy", energy:["veryhigh","high","mid"], place:["calm"], body:"fine", wish:"play"}},
  {t:"おもしろいかたちのくもをさがしてみる",
   g:"表現",
   img:"act-looking-at-clouds.png",
   desc:"そらの くもの なかに、おもしろい かたちを みつけて みるのさ。あ、あれはマントヒヒ！",
   tags:{mood:["sad","anxious"], energy:["mid","low"], place:["outdoor","calm","nature"], body:["fine","breath"], wish:"nothing"}},
  {t:"あたりをスキップしてみる",
   g:"発散",
   img:"act-jump-happy.png",
   desc:"おなじばしょを ぐるぐる スキップするマン さんじょう！",
   tags:{mood:["happy","angry"], energy:["veryhigh","high"], place:["active","move"], body:"fine", wish:"play"}},
  {t:"ぐるぐるまわってみる",
   g:"発散",
   img:"act-rotate.png",
   desc:"そのばで コマみたいに、ぐるぐる まわってみよう。こどものうちしか できないらしい。",
   tags:{mood:["angry","happy"], energy:["veryhigh","high"], place:["active","move"], body:"fine", wish:"play"}},
  {t:"ゆかにねっころがる",
   g:"発散",
   img:"act-laydown.png",
   desc:"ゆかにごろんとねっころがって、だらーんとしてみる。",
   tags:{mood:["sad","anxious"], energy:["low","verylow"], place:["indoor","calm","rest"], body:["fine","bad"], wish:"sleep"}},
  {t:"ストローで みずを ぶくぶくしてみる",
   g:"発散",
   img:"act-bukubuku.png",
   desc:"コップに ストローをいれて みずを ぶくぶくするのって、おもしろい。",
   tags:{mood:["angry","happy","anxious"], energy:["veryhigh","high","mid","low"], place:["indoor"], body:["fine","breath"], wish:"play"}},
  {t:"かみをはさみでぐるぐるにきってみる",
   g:"発散",
   img:"",
   desc:"かみを ぐるぐるにきる。ながーく きればきるほど びよーん。",
   tags:{mood:["angry","anxious"], energy:["veryhigh","high","mid"], place:["indoor","desk"], body:"fine", wish:"play"}},
  {t:"もこもこのもうふにくるまってみる",
   g:"落ち着き",
   img:"act-blanket.png",
   desc:"もこもこの ものに くるまって、もこもこになるマン",
   tags:{mood:["sad","anxious"], energy:["low","verylow"], place:["indoor","calm","alone","rest"], body:["fine","bad"], wish:"sleep"}},
  {t:"くらいへやでぼーっとしてみる",
   g:"落ち着き",
   img:"act-darkroom.png",
   desc:"でんきをけして、しずかなくらい へやで しばらく ぼーっとしてみよう。",
   tags:{mood:["sad","anxious"], energy:["low","verylow"], place:["indoor","calm","alone","rest"], body:["fine","bad","heart"], wish:"nothing"}},
  {t:"とけいのおとをきいてみる",
   g:"落ち着き",
   img:"act-eyeclose-seiza.png",
   desc:"チクタク チクタク。とけいの おとだけに しゅうちゅう してみよう。",
   tags:{mood:"anxious", energy:["mid","low"], place:["indoor","calm"], body:["heart","breath"], wish:"nothing"}},
  {t:"ひざをむねにかかえてみる",
   g:"落ち着き",
   img:"act-okiagari.png",
   desc:"ひざをかかえてまるくなると、こころがすこしおちつくよ。おきあがりこぼしのように ゆれてみよう。",
   tags:{mood:["sad","anxious"], energy:["low","verylow"], place:["calm","alone"], body:["fine","bad"], wish:"nothing"}},
  {t:"めをとじて すきなばしょをそうぞうしてみる",
   g:"落ち着き",
   img:"act-eyeclose-seiza.png",
   desc:"めをとじて、いちばん すきなばしょに いるところを そうぞうしてみよう。",
   tags:{mood:["anxious","sad"], energy:["mid","low"], place:["calm","rest"], body:["fine","heart","breath"], wish:"nothing"}},
  {t:"なにもしないじかんを3ふんつくってみる",
   g:"落ち着き",
   img:"act-sitting-smile.png",
   desc:"なにもしない！ただそれだけ。3ふんだけ ぼーーーっ。",
   tags:{mood:["sad","anxious"], energy:["low","verylow"], place:["calm","rest"], body:["fine","bad","heart"], wish:"nothing"}},
  {t:"あしたやりたいことをかんがえてみる",
   g:"気分転換",
   img:"act-thinking-stand.png",
   desc:"たのしみなことを 1つかんがえる。",
   tags:{mood:["sad","anxious"], energy:["mid","low"], place:["calm"], body:["fine","bad"], wish:"nothing"}},
  {t:"すきなたべものをかんがえてみる",
   g:"気分転換",
   img:"act-thinking-chair.png",
   desc:"いちばん すきなたべものを おもいうかべる。ちなみに、わたしはいま ステーキを おもいうかべています。ジュルリ...。",
   tags:{mood:["sad","anxious"], energy:["mid","low"], place:["calm"], body:["bad","fine"], wish:"nothing"}},
  {t:"ゆかにねころんでてんじょうをみてみる",
   g:"気分転換",
   img:"act-laydown-thinking.png",
   desc:"てんじょうをじっとみる。ふだん いがいと てんじょうって みないよね。",
   tags:{mood:["sad","anxious"], energy:["low","verylow"], place:["indoor","calm","rest"], body:["fine","bad"], wish:"nothing"}},
  {t:"きせつのものをさがしてみる",
   g:"気分転換",
   img:"act-run-outside.png",
   desc:"そとにでて、いまの きせつにしか ないものを さがしてみよう。",
   tags:{mood:["sad","anxious"], energy:["mid","low"], place:["outdoor","nature"], body:"fine", wish:"nothing"}},
  {t:"すきなキャラクターのものまねを おねがいする",
   g:"気分転換",
   img:"act-witch.png",
   desc:"だれかに すきなキャラクターの せりふや しぐさを してもらおう。ﾋﾟｶﾁｭﾋﾟｯｶ！",
   tags:{mood:["angry","happy"], energy:["veryhigh","high","mid"], place:["active","friends"], body:"fine", wish:"play"}},
  {t:"いまのきもちのかおをしてみる",
   g:"気分転換",
   img:"act-expression.png",
   desc:"おこっているなら おこっているかお。いやなきもちなら え～ってかお。おちこんでるなら おちこんでる おかお。",
   tags:{mood:["angry","sad"], energy:["veryhigh","high","mid"], place:[], body:"fine", wish:"play"}},
  {t:"ぺんをくるくるまわしてみる",
   g:"気分転換",
   img:"act-pen.png",
   desc:"ペンまわしに ちょうせんだ！ むずかしいぞ できるかな？",
   tags:{mood:["anxious","angry"], energy:["veryhigh","high","mid"], place:["calm","desk"], body:"fine", wish:"play"}},
  {t:"ほしいものリストをかいてみる",
   g:"気分転換",
   img:"act-writing.png",
   desc:"いつか ほしいものを ぜ～んぶ かいてみよう。かくだけで わくわくしてくるよ。わたしがいま ほしいのは、スリーディー プリンター。",
   tags:{mood:["sad","happy"], energy:["mid","low"], place:["indoor","desk"], body:"fine", wish:"nothing"}},
  {t:"いまいるばしょをたんけんするつもりで あるいてみる",
   g:"気分転換",
   img:"act-run-outside.png",
   desc:"みなれたへやでも「はじめてきた たんけんか」のつもりで たんけんしてみると しんはっけん！",
   tags:{mood:["sad","anxious"], energy:["mid","low"], place:["active","move"], body:"fine", wish:"nothing"}},
  {t:"だれかにすきなものをきいてみる",
   g:"人とつながる",
   img:"act-talk-with-friend.png",
   desc:"「さいきん すきなものは なんですか？」って ともだちや せんせいに きいてみよう。",
   tags:{mood:["happy","sad"], energy:["veryhigh","high","mid"], place:["friends"], body:"fine", wish:"talk"}},
  {t:"ひみつをだれかにおしえてみる",
   g:"人とつながる",
   img:"act-tell.png",
   desc:"「じつはね...」って、だれかに ちょっとした ひみつを ひとつ はなしてみる。",
   tags:{mood:["sad","anxious"], energy:["mid","low"], place:["friends","teacher"], body:["fine","bad"], wish:"talk"}},
  {t:"だれかのいいところをみつけて つたえてみる",
   g:"人とつながる",
   img:"act-tell.png",
   desc:"ともだちの すてきなところを 1つみつけて つたえると、ふたりとも うれしくなるよ。",
   tags:{mood:"happy", energy:["veryhigh","high","mid"], place:["friends"], body:"fine", wish:"talk"}},
  {t:"いっしょにしゃしんをとってみる",
   g:"人とつながる",
   img:"act-photo.png",
   desc:"ともだちや せんせいと いっしょに しゃしんをとる。ハイ ポーズ！",
   tags:{mood:"happy", energy:["veryhigh","high","mid"], place:["friends"], body:"fine", wish:"play"}},
  {t:"てをほっぺにあててみる",
   g:"からだ",
   img:"act-cheek.png",
   desc:"りょうてを ほっぺにそっと あててみよう。そのまま むにーって のばしたら .........へんがお。",
   tags:{mood:["sad","anxious"], energy:["mid","low"], place:["calm"], body:["fine","bad","heart"], wish:"nothing"}},
  {t:"はだしになってみる",
   g:"からだ",
   img:"act-foot.png",
   desc:"くつとくつしたをぬいで、はだしになってみる。ゆかのひんやりがきもちいいよ。",
   tags:{mood:["anxious","sad"], energy:["veryhigh","high","mid","low"], place:["indoor"], body:["heart","breath","fine"], wish:"nothing"}},
  {t:"だれかにせなかをさすってもらう",
   g:"人とつながる",
   img:"act-stay-with-adult-2.png",
   desc:"だれかに そばにいてもらって、せなかを やさしく さすってもらおう。しずかにでも、なにか はなしながらでも いい。",
   tags:{mood:["sad","anxious"], energy:["mid","low","verylow"], place:["calm","teacher","family"], body:["heart","breath","bad"], wish:"nothing"}},
  {t:"いまのきもちのりゆうを かみにかいてみる",
   g:"表現",
   img:"act-mad-write.png",
   desc:"なにがいやだったか、かみにぜんぶかいてみよう。えでも、ことばでも。",
   tags:{mood:"angry", energy:["mid","low"], place:["indoor","calm","desk"], body:["fine","bad"], wish:"nothing"}},
  {t:"きょうのできごとをえにしてみる",
   g:"表現",
   img:"act-paint.png",
   desc:"きょうあったことを、いちまいの えに かいてみよう。",
   tags:{mood:["happy","sad","anxious","angry"], energy:["mid","low"], place:["indoor","desk"], body:"fine", wish:"nothing"}},
  {t:"いまのきもちはなにいろかかんがえてみる",
   g:"表現",
   img:"act-thinking-stand.png",
   desc:"いまのきもちは なにいろ？ あおいろかな。まっかっかかな。...レインボー かしら。",
   tags:{mood:["sad","anxious","angry"], energy:["mid","low"], place:["calm"], body:["fine","bad"], wish:"nothing"}},
  {t:"じぶんへのほめことばをかいてみる",
   g:"表現",
   img:"act-writing-letter.png",
   desc:"じぶんを ほめることばを かみに かいてみよう。もし じぶんで おもいつかなかったら、まわりのひとに きいてみよう。",
   tags:{mood:["sad","anxious"], energy:["mid","low"], place:["calm","desk"], body:["fine","bad"], wish:"nothing"}},
  {t:"なりたいじぶんをかんがえてみる",
   g:"表現",
   img:"act-thinking-stand.png",
   desc:"どんなじぶんになりたいか、かみにかいてみよう。わたしはね、ほかのひとを いっぱい ほめられる ひとになりたいな。",
   tags:{mood:["happy","sad"], energy:["veryhigh","high","mid"], place:["calm"], body:"fine", wish:"nothing"}},
  {t:"「もしも」のはなしをかんがえてみる",
   g:"表現",
   img:"act-imagine.png",
   desc:"「もしも おうちの となりに ゆうえんちがあったら」とか、じゆうに かんがえてみよう！",
   tags:{mood:["happy","sad"], energy:["veryhigh","high","mid"], place:["calm"], body:"fine", wish:"play"}},
  {t:"ひとにはなすのが むずかしいことを かいてみる",
   g:"表現",
   img:"act-writing-letter.png",
   desc:"だれにもいえないことを かみにかいて、そのまま だれにもみせずに びりびりにして すてちゃう。",
   tags:{mood:["sad","angry"], energy:["mid","low"], place:["calm","alone","desk"], body:["fine","bad"], wish:"nothing"}},
  {t:"やってみたいことを たくさんかいてみる",
   g:"表現",
   img:"act-writing.png",
   desc:"いつか やってみたいことを たくさん かきだしてみよう。",
   tags:{mood:"happy", energy:["veryhigh","high","mid"], place:["desk"], body:"fine", wish:"play"}},
  {t:"じぶんのどうぶつをかんがえてみる",
   g:"表現",
   img:"act-animals.png",
   desc:"じぶんって、どうぶつで いったら、あれかなあ って かんがえてみる。",
   tags:{mood:"happy", energy:["veryhigh","high","mid"], place:["calm"], body:"fine", wish:"play"}},
  {t:"じぶんのいいところを 5つかぞえてみる",
   g:"表現",
   img:"act-thinking-stand.png",
   desc:"じぶんの いいところを 5つ かんがえて かいてみよう。おもいつかなかったら、だれかに きいてみよう！",
   tags:{mood:["sad","anxious"], energy:["mid","low"], place:["calm"], body:["fine","bad"], wish:"nothing"}},
  {t:"いまのきもちは おとでいうとなにか かんがえてみる",
   g:"表現",
   img:"act-thinking-stand.png",
   desc:"いまのきもちは「しーん」か「ぐにゃぐにゃ」か「ぐるぐる」か、おとで かんがえて みる。",
   tags:{mood:["angry","sad","anxious"], energy:["mid","low"], place:["calm","music"], body:["fine","bad"], wish:"nothing"}},
  {t:"てのこうにえをかいてみる",
   g:"表現",
   img:"act-paint.png",
   desc:"てのひらに ペンで ちいさなえを かいてみよう。",
   tags:{mood:["sad"], energy:["mid","low"], place:["calm","desk"], body:"fine", wish:"nothing"}},
  {t:"つみきをたかくつんでみる",
   g:"気分転換",
   img:"act-play-with-friends.png",
   desc:"つみきを たかーく つみあげてみよう。どこまで たかく できるかな？",
   tags:{mood:["happy","sad","anxious"], energy:["veryhigh","high","mid","low"], place:["indoor","build","calm"], body:"fine", wish:"play"}},
  {t:"つみきでおうちやしろをつくってみる",
   g:"落ち着き",
   img:"act-play-with-friends.png",
   desc:"つみきで おうちを つくってみよう。どんな おうちに すみたいかな？",
   tags:{mood:["happy","sad","anxious"], energy:["mid","low"], place:["indoor","build","calm"], body:"fine", wish:"play"}},
  {t:"ブロックやレゴでなにかをつくってみる",
   g:"気分転換",
   img:"act-play-with-friends.png",
   desc:"ブロックや レゴで、すきなものを つくってみよう。ロボットも くるまも おまかせ！",
   tags:{mood:["happy","sad","anxious","angry"], energy:["veryhigh","high","mid"], place:["indoor","build"], body:"fine", wish:"play"}},
  {t:"おままごとをする",
   g:"人とつながる",
   img:"act-play-with-dolls.png",
   desc:"おままごとで、おいしそうな ごはんを つくってみよう。なにを つくろうかな？",
   tags:{mood:["happy","sad","anxious"], energy:["mid","low"], place:["indoor","friends","calm"], body:"fine", wish:["play","talk"]}},
  {t:"おみせやさんごっこをする",
   g:"人とつながる",
   img:"act-play-with-friends.png",
   desc:"「いらっしゃいませー！」おみせやさんごっこで、すきなものを うってみよう。",
   tags:{mood:["happy","sad"], energy:["mid","low"], place:["indoor","friends"], body:"fine", wish:["play","talk"]}},
  {t:"ヒーローごっこやプリンセスごっこをする",
   g:"発散",
   img:"act-witch.png",
   desc:"すきな ヒーローや プリンセスに へんしん！ポーズを きめてみよう。",
   tags:{mood:["happy","angry","anxious"], energy:["veryhigh","high","mid"], place:["active","friends"], body:"fine", wish:"play"}},
  {t:"でんしゃごっこをする",
   g:"気分転換",
   img:"act-play-with-friends.png",
   desc:"「がたんごとん がたんごとん」。でんしゃごっこで どこへ いこうかな？",
   tags:{mood:["happy","anxious"], energy:["mid","high"], place:["active","friends","indoor"], body:"fine", wish:"play"}},
  {t:"きょうりゅうごっこをする",
   g:"発散",
   img:"act-animals.png",
   desc:"ガオー！きょうりゅうに へんしんして おおきな こえで あそんでみよう。",
   tags:{mood:["happy","angry"], energy:["veryhigh","high"], place:["active","friends"], body:"fine", wish:"play"}},
  {t:"かくれんぼをする",
   g:"発散",
   img:"act-play-with-friends.png",
   desc:"「もういいかい？」「まーだだよ」。かくれんぼで かくれてみよう。",
   tags:{mood:["happy","angry"], energy:["veryhigh","high"], place:["active","friends","move"], body:"fine", wish:"play"}},
  {t:"おにごっこをする",
   g:"発散",
   img:"act-run-plain.png",
   desc:"おにごっこで おもいきり はしろう！つかまらないように にげきれるかな？",
   tags:{mood:["happy","angry"], energy:["veryhigh","high"], place:["outdoor","active","friends","move"], body:"fine", wish:"play"}},
  {t:"どろだんごをつくる",
   g:"気分転換",
   img:"act-run-outside.png",
   desc:"すなばで どろだんごを つくってみよう。つるつるに なるまで まるめるのが コツ！",
   tags:{mood:["happy","sad","anxious"], energy:["mid","low"], place:["outdoor","nature","active"], body:"fine", wish:"play"}},
  {t:"しゃぼんだまをとばしてみる",
   g:"気分転換",
   img:"act-jump-happy.png",
   desc:"しゃぼんだまを ふーって とばしてみよう。おおきな しゃぼんだま できるかな？",
   tags:{mood:["happy","sad","anxious"], energy:["mid","low"], place:["outdoor","nature","calm"], body:["fine","breath"], wish:"play"}},
  {t:"ボールをついてみる",
   g:"発散",
   img:"act-play-with-friends.png",
   desc:"ボールを ぽんぽん ついてみよう。なんかい つづけられるかな？",
   tags:{mood:["happy","angry"], energy:["veryhigh","high","mid"], place:["active","friends"], body:"fine", wish:"play"}},
  {t:"なわとびにちょうせんしてみる",
   g:"発散",
   img:"act-jump-happy.png",
   desc:"なわとびで なんかい とべるかな？1、2、3...！",
   tags:{mood:["happy","angry"], energy:["veryhigh","high"], place:["outdoor","active","move"], body:"fine", wish:"play"}},
  {t:"すべりだいやブランコであそぶ",
   g:"気分転換",
   img:"act-jump-happy.png",
   desc:"すべりだいは シューッ！ブランコは ゆらゆら。そとの あそびは たのしいね。",
   tags:{mood:["happy","sad"], energy:["veryhigh","high","mid"], place:["outdoor","active","move"], body:"fine", wish:"play"}},
  {t:"シールをぺたぺたはってみる",
   g:"表現",
   img:"act-play-with-dolls.png",
   desc:"すきな シールを ぺたぺた。ノートに はって、シールの もようを つくってみよう。",
   tags:{mood:["happy","sad","anxious"], energy:["mid","low"], place:["indoor","desk","calm"], body:"fine", wish:"play"}},
  {t:"ねんどでなにかをつくってみる",
   g:"表現",
   img:"act-paint.png",
   desc:"ねんどを こねこね。なにを つくろうかな？ケーキ？どうぶつ？",
   tags:{mood:["happy","sad","anxious","angry"], energy:["mid","low"], place:["indoor","desk"], body:"fine", wish:"play"}},
  {t:"パズルをやってみる",
   g:"落ち着き",
   img:"act-thinking-chair.png",
   desc:"パズルを ひとつずつ はめていこう。できあがったら うれしいね。",
   tags:{mood:["happy","sad","anxious"], energy:["mid","low"], place:["indoor","desk","calm"], body:"fine", wish:"nothing"}},
  {t:"かみひこうきをとばしてみる",
   g:"発散",
   img:"act-rotate.png",
   desc:"かみひこうきを つくって とばしてみよう。",
   tags:{mood:["happy","angry","anxious"], energy:["high","mid"], place:["indoor","outdoor","desk"], body:["fine","breath"], wish:"play"}},
  {t:"ふうせんをふくらませてとばしてみる",
   g:"からだ",
   img:"act-bukubuku.png",
   desc:"ふうせんを ふーって ふくらませて、とばしてみよう。だれの ふうせんが いちばん とおくまで とぶかな？",
   tags:{mood:["happy","angry","anxious"], energy:["high","mid"], place:["indoor","active"], body:["breath","fine"], wish:"play"}},
  {t:"おうちのひとにぎゅーってしてもらう",
   g:"人とつながる",
   img:"act-stay-with-adult-2.png",
   desc:"おうちのひとに「ぎゅーして！」って いってみよう。ぎゅーっと してもらうと あんしんするよ。",
   tags:{mood:["sad","anxious","happy"], energy:["mid","low","verylow"], place:["family","calm"], body:["heart","bad","fine"], wish:["nothing","talk"]}},
];

/* ==============================================
   ZONES : 地図上の「見えない当たり判定」(四角形のみ・名前なし)
   ・作業用 zone-editor.html で作成・編集する(START〜END の間は自動書き換え対象)
   ・rect は [左, 上, 右, 下]。画像全体を 0〜1 に正規化した座標
   ・ゾーンは重なってOK。人物の足元が入った全ゾーンのタグが加算される
     (例: 園庭 + 遊具まわり にいれば outdoor/active/friends/teacher/move が全部+1)
   ・weight : そのゾーンの重み(省略時1)。タグ加点にこの値が掛かる
   ・id は内部管理用(画面には出さない)
   ※現在の座標は たたき台 です。zone-editor.html で調整してください
   ============================================== */
/* ZONES:START */
const ZONES = [
  {id:"z1",  weight:1, tags:["outdoor", "active"], rect:[0.0242, 0.2015, 0.3366, 0.8966]},
  {id:"z2",  weight:1, tags:["outdoor", "active"], rect:[0.3366, 0.2015, 0.4045, 0.6546]},
  {id:"z3",  weight:1, tags:["alone", "move"], rect:[0.1075, 0.3029, 0.2205, 0.5451]},
  {id:"z4",  weight:1, tags:["teacher"], rect:[0.1892, 0.37, 0.2511, 0.5451]},
  {id:"z5",  weight:1, tags:["friends", "teacher"], rect:[0.2205, 0.3426, 0.3939, 0.5671]},
  {id:"z6",  weight:1, tags:["teacher"], rect:[0.2892, 0.2756, 0.3366, 0.4549]},
  {id:"z7",  weight:1, tags:["alone", "friends", "move"], rect:[0.2961, 0.2154, 0.4183, 0.3426]},
  {id:"z8",  weight:1, tags:["alone", "move"], rect:[0.2129, 0.2154, 0.3037, 0.4138]},
  {id:"z9",  weight:1, tags:["nature"], rect:[0.0242, 0.5835, 0.2511, 0.8845]},
  {id:"z10", weight:1, tags:["alone"], rect:[0.0487, 0.526, 0.3748, 0.8845]},
  {id:"z11", weight:1, tags:["alone", "nature"], rect:[0.0846, 0.6177, 0.1617, 0.8298]},
  {id:"z12", weight:1, tags:["indoor", "alone", "build", "desk"], rect:[0.3435, 0.667, 0.3939, 0.8966]},
  {id:"z13", weight:1, tags:["alone", "build", "desk"], rect:[0.4045, 0.4398, 0.5672, 0.5451]},
  {id:"z14", weight:1, tags:["alone", "friends", "build"], rect:[0.3877, 0.5082, 0.5863, 0.667]},
  {id:"z15", weight:1, tags:["active", "alone", "friends", "build", "move"], rect:[0.3748, 0.6546, 0.5985, 0.8966]},
  {id:"z16", weight:1, tags:["alone", "friends", "build"], rect:[0.5863, 0.5835, 0.7108, 0.7285]},
  {id:"z17", weight:1, tags:["friends", "teacher", "desk", "rest"], rect:[0.5672, 0.7039, 0.7108, 0.8845]},
  {id:"z18", weight:1, tags:["indoor", "calm"], rect:[0.3641, 0.5082, 0.865, 0.9078]},
  {id:"z19", weight:1, tags:["calm", "alone", "desk", "book", "rest"], rect:[0.7108, 0.5671, 0.8757, 0.8845]},
  {id:"z20", weight:1, tags:["indoor", "calm", "alone", "book", "rest"], rect:[0.4045, 0.1867, 0.5603, 0.4672]},
  {id:"z21", weight:1, tags:["indoor", "active", "alone", "rest"], rect:[0.5451, 0.1867, 0.6405, 0.526]},
  {id:"z22", weight:1, tags:["indoor", "active", "calm", "alone", "teacher", "rest", "move", "music"], rect:[0.6245, 0.1702, 0.836, 0.526]},
  {id:"z23", weight:1, tags:["indoor", "active", "teacher", "rest"], rect:[0.8192, 0.1565, 0.9719, 0.5835]},
  {id:"z24", weight:1, tags:["outdoor", "active", "alone", "teacher", "rest", "family"], rect:[0.8475, 0.526, 0.9956, 0.9201]},
  {id:"z25", weight:1, tags:["active", "alone", "friends", "move"], rect:[0.2411, 0.7162, 0.3435, 0.8845]},
  {id:"z26", weight:1, tags:["nature"], rect:[0.0242, 0.24, 0.1411, 0.8966]},
  {id:"z27", weight:1, tags:["nature"], rect:[0.096, 0.2154, 0.2411, 0.3426]},
  {id:"z28", weight:1, tags:["calm", "alone"], rect:[0.4183, 0.2154, 0.5451, 0.4398]}
];
/* ZONES:END */


/* ── きもちごとの見出し・説明・アイコン設定 ──
   mood の回答値（happy/sad/angry/anxious/neutral）ごとに設定する
   ============================================== */
/* ══════════════════════════════════════════════════
   結果画面（今のきもち）のメッセージデータ
   キーは "mood_physicalLevel" の組み合わせ（4×4＝16パターン）。
   physicalLevel は、2問目（からだのげんき）と4問目（からだの
   かんじ）の2つをあわせて算出する「からだの状態レベル」。
   （算出ロジックは index.html の derivePhysicalLevel() 関数）

   例えば「たのしい」と答えていても、げんきは「high」なのに
   からだのかんじが「bad（たいちょうがわるい）」なら、
   げんき度だけで判定せず、からだの不調ぶんだけ状態を
   重く見て happy_low のような結果になる。
   1問目だけに引っぱられず、2問目・4問目の矛盾もちゃんと
   汲み取った文言になる。

   ce_ikey は中央カードの表情画像キー（IMGオブジェクトのキー）。
   physicalLevelがlow/verylowのときは、たとえmoodがhappyでも
   からだの様子が伝わる表情（tired・sleepy・notfeelingwellなど）
   を優先して選ぶことで、画像と実際の状態の矛盾を防いでいる。

   なお、見出し下の小さいラベル（ct）は index.html の
   ANS_LABEL.mood から1問目の回答をそのまま表示する形に変更した
   ため、ここには含まない。
   ══════════════════════════════════════════════════ */
const MD = {

  /* ═══ happy（たのしい）系 ═══ */
  happy_high: {
    ce_ikey: "enjoy",
    ttls: [
      "わくわくげんきいっぱいだね！",
    ],
    descs: [
      "たのしいきもちとげんきがある、さいこうのじょうたい！そのエネルギー、いっぱいつかってみよう。",
    ],
  },
  happy_mid: {
    ce_ikey: "smile",
    ttls: [
      "たのしいきもちなんだね！",
    ],
    descs: [
      "たのしいきもちはまわりのひともうれしくさせるよ。とってもすてき！",
    ],
  },
  happy_low: {
    ce_ikey: "tired",
    ttls: [
      "たのしいけど、すこしつかれてるみたい",
      "きもちはたのしいけど、からだはおつかれかな",
    ],
    descs: [
      "たのしいきもちのなかにも、からだがつかれてることってあるよね。むりせずやすんでね。",
      "たのしい！だけど、からだはちょっとおつかれ。むりしないで、じぶんのペースでね。",
    ],
  },
  happy_verylow: {
    ce_ikey: "notfeelingwell",
    ttls: [
      "たのしいきもちだけど、からだはおやすみモードみたい",
      "きもちはうれしいのに、からだがぐったりしてるね",
    ],
    descs: [
      "たのしいきもちはすてきだよ。でも、からだがぐったりしてるみたいだから、まずはゆっくりやすもうね。",
      "うれしいきもちのままで、からだをやすませてあげよう。",
    ],
  },

  /* ═══ sad（かなしい）系 ═══ */
  sad_high: {
    ce_ikey: "cry",
    ttls: [
      "かなしいけど、げんきはあるみたい",
      "かなしいきもちだけど、からだはうごけそう",
    ],
    descs: [
      "かなしいきもちだけど、からだにげんきがあるなら、すこしうごいてきもちをだしてみるのもいいかも。",
    ],
  },
  sad_mid: {
    ce_ikey: "cry",
    ttls: [
      "かなしいきもちなんだね",
      "なんだかかなしくなっちゃったんだね",
    ],
    descs: [
      "かなしいとき、むりにがんばらなくていいよ。じぶんのきもちをたいせつにしてね。",
    ],
  },
  sad_low: {
    ce_ikey: "tired",
    ttls: [
      "かなしくて、つかれちゃったね",
      "かなしいきもちで、からだもおつかれみたい",
    ],
    descs: [
      "かなしいきもちと、からだのつかれが、いっしょにきてるのかもね。むりせず、ゆっくりやすんでね。",
    ],
  },
  sad_verylow: {
    ce_ikey: "notfeelingwell",
    ttls: [
      "かなしくて、からだもぐったりしてるね",
      "きもちもからだも、おやすみがひつようみたい",
    ],
    descs: [
      "かなしいきもちと、からだのぐったり、どっちもたいへんだね。むりをせず、しっかりやすんでね。",
    ],
  },

  /* ═══ angry（いらいら）系 ═══ */
  angry_high: {
    ce_ikey: "mad",
    ttls: [
      "いやなきもちで、いらいらしているみたい",
    ],
    descs: [
      "そのエネルギー、そとにだしてみよう！からだをうごかすと、すっきりするかも。",
    ],
  },
  angry_mid: {
    ce_ikey: "mad",
    ttls: [
      "もやもやしてるんだね",
      "なんだかイライラしているんだね",
    ],
    descs: [
      "そのエネルギーをそとにだしてあげよう。",
    ],
  },
  angry_low: {
    ce_ikey: "tired",
    ttls: [
      "いらいらするけど、ちょっとつかれてるかな",
      "もやもやしてて、からだもおつかれみたい",
    ],
    descs: [
      "むかーっとするきもちと、からだのつかれ、どっちもあるのかもね。まずはすこしやすんでからにしよう。",
    ],
  },
  angry_verylow: {
    ce_ikey: "notfeelingwell",
    ttls: [
      "もやもやするけど、からだはぐったりみたい",
      "いらいらしていて、からだもしんどそうだね",
    ],
    descs: [
      "むかーっとするきもちと、からだのぐったり、いっぺんにくるとたいへんだね。まずはやすむのがいちばん。",
    ],
  },

  /* ═══ anxious（しんぱい・こわい）系 ═══ */
  anxious_high: {
    ce_ikey: "fear",
    ttls: [
      "ざわざわ、そわそわしてるみたいだね",
    ],
    descs: [
      "ふあんなことがあると、きもちもおちこんじゃうよね。",
    ],
  },
  anxious_mid: {
    ce_ikey: "puzzled",
    ttls: [
      "なんだかドキドキしてるんだね",
      "ふあんなきもちなんだね",
    ],
    descs: [
      "ふあんなことやこわいことがあると、からだもどきどきしちゃうよね。",
    ],
  },
  anxious_low: {
    ce_ikey: "tired",
    ttls: [
      "ふあんで、つかれてるのかな",
      "こころもからだも、おつかれみたいだね",
    ],
    descs: [
      "しんぱいなきもちと、からだのつかれ、いっしょにきてるのかもね。むりせず、ゆっくりしてね。",
    ],
  },
  anxious_verylow: {
    ce_ikey: "sickness",
    ttls: [
      "しんぱいで、からだもぐったりしてるんだね",
      "こころもからだも、おやすみがひつようみたい",
    ],
    descs: [
      "しんぱいなきもちと、からだのぐったり、どっちもたいへんだね。むりをせず、しっかりやすんでね。",
    ],
  },

  /* ═══ veryhigh（とてもげんき）／ normal（ふつうのきもち）の追加分 ═══ */
  happy_veryhigh: {
    ce_ikey: "enjoy",
    ttls: [
      "パワーがあふれちゃってるね！",
      "もうスーパーげんきだね！",
    ],
    descs: [
      "たのしいきもちも、からだのパワーも、ぜんぶまんたん！すきなことを おもいっきり やってみよう。",
    ],
  },
  sad_veryhigh: {
    ce_ikey: "cry",
    ttls: [
      "かなしいけど、パワーはあふれてるみたい",
    ],
    descs: [
      "かなしいきもちのまま、からだはげんきいっぱい。おもいっきりうごいてみると、きもちがすこしかるくなるかも。",
    ],
  },
  angry_veryhigh: {
    ce_ikey: "mad",
    ttls: [
      "いらいらパワーが あふれてるみたい",
    ],
    descs: [
      "エネルギーがいっぱいで、いらいらもおおきいのかもね。からだをおもいっきりうごかして、そとにだしちゃおう！",
    ],
  },
  anxious_veryhigh: {
    ce_ikey: "fear",
    ttls: [
      "そわそわして、じっとしていられないみたい",
    ],
    descs: [
      "しんぱいなきもちと、あまったエネルギーが いっしょにきてるのかも。まずはゆっくりいきをして、おちついてからうごいてみよう。",
    ],
  },

  /* ═══ normal（ふつう）系 ═══ */
  normal_veryhigh: {
    ce_ikey: "enjoy",
    ttls: [
      "げんきいっぱいなんだね！",
      "パワーがあふれてるね！",
    ],
    descs: [
      "きもちはふつうだけど、からだはげんきいっぱい！すきなことで パワーをつかってみよう。",
    ],
  },
  normal_high: {
    ce_ikey: "smile",
    ttls: [
      "げんきそうだね！",
    ],
    descs: [
      "きもちはふつうで、からだはげんき。なにをして すごそうかな？",
    ],
  },
  normal_mid: {
    ce_ikey: "normal",
    ttls: [
      "いつもどおりのきもちなんだね",
      "ふつうのきもちなんだね",
    ],
    descs: [
      "ふつうのきもちって、おちついていて いいよね。やってみたいことを えらんでみよう。",
    ],
  },
  normal_low: {
    ce_ikey: "tired",
    ttls: [
      "ちょっとおつかれ、かな",
      "すこしげんきが ないのかな",
    ],
    descs: [
      "きもちはふつうだけど、からだはすこしおつかれみたい。むりせず、のんびりすごそうね。",
    ],
  },
  normal_verylow: {
    ce_ikey: "notfeelingwell",
    ttls: [
      "からだが とってもおつかれみたい",
      "ぐったりしているのかな",
    ],
    descs: [
      "きもちはふつうでも、からだがぐったりしているよ。まずは ゆっくりやすもうね。",
    ],
  },

  /* ═══ 万一データが見つからないときの保険 ═══
     本来、moodとげんき段階の組み合わせは25パターン(5きもち×5段階)すべて
     用意してあるので、ここに来るのはバグ（キーの typo など）。
     「ふつうのきもち」のような当たり障りのない文言で
     ごまかさず、なにかおかしいことをやさしく伝える。 */
  error: {
    ce_ikey: "puzzled",
    ttls: [
      "あれれ、うまく けっかが みつからなかったよ",
    ],
    descs: [
      "ごめんね、うまく けっかが だせなかったみたい。トップがめんから、もういちど やってみてね。",
    ],
  },

};