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


/* ── 全特効薬バブルのデータ ──
   tags の書き方：
     文字列 1つ  : mood:"angry"
     配列で複数  : mood:["angry","sad"]
     any        : 指定しない場合は省略するか "any" を使う（加点されない）
   ============================================== */
const BUBBLES = [
  /* ── 発散・うごく ── */
  {t:"そとでジャンプしてみる",      g:"発散",    tags:{mood:["angry","happy"], energy:"high",    social:["alone","neutral"], body:["fine","heart"],  wish:"play"}},
  {t:"そのばではしってみる",        g:"発散",    tags:{mood:["angry","happy"], energy:"high",    social:["alone","neutral"], body:["fine","heart"],  wish:"play"}},
  {t:"かみをビリビリやぶいてみる",  g:"発散",    tags:{mood:"angry",           energy:["high","mid"], social:"alone",        body:["fine","heart"],  wish:["nothing","any"]}},
  {t:"まくらにさけんでみる",        g:"発散",    tags:{mood:"angry",           energy:["high","mid"], social:"alone",        body:["fine","breath"], wish:["nothing","any"]}},
  {t:"ぎゅーっててをにぎってみる",g:"発散",  tags:{mood:"angry",           energy:["high","mid"], social:["alone","neutral"], body:"heart",    wish:["nothing","play"]}},
  {t:"からだをぐるぐるうごかしてみる",g:"発散",  tags:{mood:["angry","happy"], energy:"high",    social:["alone","neutral"], body:"fine",       wish:"play"}},
  {t:"からだをのばしてみる",        g:"発散",    tags:{mood:["sad","anxious"],  energy:"low",     social:["alone","neutral"], body:"breath",     wish:["nothing","sleep"]}},
  {t:"おもいきりのびをしてみる",    g:"発散",    tags:{mood:["angry","anxious"],energy:["high","mid"], social:["alone","neutral"], body:"breath", wish:["nothing","play"]}},
  {t:"おもいっきりわらってみる",    g:"発散",    tags:{mood:"happy",           energy:"high",    social:["alone","social"],  body:"fine",       wish:"play"}},

  /* ── 落ち着く・ひとりで ── */
  {t:"トイレでゆっくりいきをはいてみる",g:"落ち着き",tags:{mood:"angry",        energy:["high","mid"],  social:"alone",        body:"breath",     wish:["nothing","play"]}},
  {t:"ゆっくりしんこきゅうしてみる",    g:"落ち着き",tags:{mood:["anxious","angry"], energy:["low","mid"],   social:["alone","neutral"], body:"breath",  wish:["nothing","sleep"]}},
  {t:"しんこきゅうを3かいしてみる", g:"落ち着き",tags:{mood:["anxious","angry"], energy:["low","mid"],   social:["alone","neutral"], body:"heart",   wish:["nothing","sleep"]}},
  {t:"4びょうすって8びょうはいてみる",g:"落ち着き",tags:{mood:"anxious",        energy:["low","mid"],   social:["alone","neutral"], body:"heart",   wish:["nothing","sleep"]}},
  {t:"めをとじて10かぞえてみる",    g:"落ち着き",tags:{mood:"anxious",          energy:["low","mid"],   social:"alone",        body:["heart","breath"], wish:"nothing"}},
  {t:"すわってめをとじてみる",      g:"落ち着き",tags:{mood:["sad","anxious"],   energy:"low",     social:"alone",        body:["fine","bad"],wish:"nothing"}},
  {t:"しばらくひとりでいてみる",    g:"落ち着き",tags:{mood:["angry","sad"],     energy:["low","mid"],   social:"alone",        body:["fine","breath"], wish:"nothing"}},
  {t:"すきなばしょですわってみる",  g:"落ち着き",tags:{mood:["anxious","sad"],   energy:"low",     social:"alone",        body:["fine","bad"],wish:"nothing"}},
  {t:"めをとじてやすんでみる",      g:"落ち着き",tags:{mood:["sad","anxious"],   energy:"verylow", social:"alone",        body:["fine","bad"],wish:"sleep"}},
  {t:"きょうはゆっくりやすんでみる",g:"落ち着き",tags:{mood:["sad","anxious"],   energy:"verylow", social:["alone","neutral"], body:["fine","bad"],wish:"sleep"}},
  {t:"ゆっくりあるいてみる",        g:"落ち着き",tags:{mood:["sad","anxious"],   energy:"low",     social:["alone","neutral"], body:["fine","bad"],wish:["nothing","sleep"]}},
  {t:"そとをおさんぽしてみる",      g:"落ち着き",tags:{mood:["happy","sad"],     energy:["high","mid"],  social:["alone","neutral"], body:"fine",    wish:"play"}},
  {t:"5ふんだけそとをあるいてみる", g:"落ち着き",tags:{mood:["sad","angry"],     energy:"mid",     social:["alone","neutral"], body:"fine",       wish:"nothing"}},
  {t:"そとではしってみる",          g:"落ち着き",tags:{mood:["happy","angry"],   energy:"high",    social:["alone","neutral"], body:"fine",       wish:"play"}},

  /* ── 気分転換・楽しむ ── */
  {t:"すきなうたをきいてみる",      g:"気分転換",tags:{mood:["sad","anxious","angry"],energy:["low","mid"],social:"alone",  body:["fine","bad"],wish:["nothing","sleep"]}},
  {t:"すきなどうがをみてみる",      g:"気分転換",tags:{mood:"sad",              energy:"low",     social:"alone",        body:["fine","bad"],wish:"nothing"}},
  {t:"おきにいりのうたをきいてみる",g:"気分転換",tags:{mood:["sad","anxious"],   energy:["low","mid"],   social:"alone",        body:["fine","breath"], wish:["nothing","sleep"]}},
  {t:"すきなうたにあわせておどってみる",g:"気分転換",tags:{mood:"happy",         energy:"high",    social:["alone","social"],  body:"fine",       wish:"play"}},
  {t:"すきなうたをうたってみる",    g:"気分転換",tags:{mood:"happy",            energy:["high","mid"],  social:["alone","social"],  body:"fine",       wish:"play"}},
  {t:"すきなほんをよんでみる",      g:"気分転換",tags:{mood:["sad","anxious"],   energy:"low",     social:"alone",        body:["fine","bad"],wish:"nothing"}},
  {t:"すきなキャラクターをながめてみる",g:"気分転換",tags:{mood:"sad",          energy:"low",     social:"alone",        body:["fine","bad"],wish:"nothing"}},
  {t:"すきなキャラクターのえをかいてみる",g:"気分転換",tags:{mood:"happy",      energy:["high","mid"],  social:"alone",        body:"fine",       wish:"play"}},
  {t:"あたらしいあそびをためしてみる",g:"気分転換",tags:{mood:"happy",          energy:"high",    social:["alone","neutral"], body:"fine",       wish:"play"}},
  {t:"すきなあそびをしてみる",      g:"気分転換",tags:{mood:"happy",            energy:["high","mid"],  social:["alone","neutral","social"], body:"fine", wish:"play"}},
  {t:"おりがみをおってみる",        g:"気分転換",tags:{mood:["sad","anxious"],   energy:"low",     social:"alone",        body:["fine","bad"],wish:"nothing"}},
  {t:"ちいさなかたづけをしてみる",  g:"気分転換",tags:{mood:["sad","angry"],     energy:"mid",     social:"alone",        body:"fine",       wish:"nothing"}},
  {t:"たいようをあびてみる",        g:"気分転換",tags:{mood:"sad",              energy:["low","mid"],   social:["alone","neutral"], body:["fine","bad"],wish:["nothing","sleep"]}},
  {t:"そとのそらをみあげてみる",    g:"気分転換",tags:{mood:"anxious",          energy:["low","mid"],   social:["alone","neutral"], body:"breath",   wish:["nothing","sleep"]}},
  {t:"そとのそらをみてみる",        g:"気分転換",tags:{mood:["sad","anxious"],   energy:["low","mid"],   social:["alone","neutral"], body:["fine","breath"],wish:["nothing","sleep"]}},

  /* ── 人とつながる ── */
  {t:"しんらいできるひとにはなしてみる",g:"人とつながる",tags:{mood:["sad","anxious","angry"],energy:["low","mid","verylow"],social:"social",body:["fine","heart","bad"],wish:"talk"}},
  {t:"せんせいにはなしかけてみる",  g:"人とつながる",tags:{mood:["sad","anxious"],energy:["low","mid","verylow"],social:"social",body:["fine","bad"],wish:"talk"}},
  {t:"だれかにそばにいてもらう",    g:"人とつながる",tags:{mood:"sad",            energy:"verylow", social:"social",       body:["fine","bad"],wish:["nothing","sleep"]}},
  {t:"やさしいひとのそばにいてみる",g:"人とつながる",tags:{mood:"sad",            energy:["low","verylow"],social:"social",   body:["fine","bad"],wish:["nothing","sleep"]}},
  {t:"おともだちにはなしかけてみる",g:"人とつながる",tags:{mood:["sad","anxious","angry"],energy:["low","mid"],social:"social",body:["fine","heart"],wish:"talk"}},
  {t:"ともだちをさそってみる",      g:"人とつながる",tags:{mood:"happy",          energy:"high",    social:"social",       body:"fine",       wish:"play"}},
  {t:"おともだちとわらいあってみる",g:"人とつながる",tags:{mood:"happy",          energy:"high",    social:"social",       body:"fine",       wish:"play"}},
  {t:"だれかにえがおをむけてみる",  g:"人とつながる",tags:{mood:"happy",          energy:["high","mid"],  social:"social",       body:"fine",       wish:["play","talk"]}},
  {t:"ともだちにありがとうといってみる",g:"人とつながる",tags:{mood:"happy",       energy:["high","mid"],  social:"social",       body:"fine",       wish:"talk"}},
  {t:"たのしいきもちをだれかにつたえてみる",g:"人とつながる",tags:{mood:"happy",  energy:["high","mid"],  social:"social",       body:"fine",       wish:"talk"}},
  {t:"だれかをわらわせてみる",      g:"人とつながる",tags:{mood:"happy",          energy:["high","mid"],  social:"social",       body:"fine",       wish:"talk"}},
  {t:"おともだちのそばにいてみる",  g:"人とつながる",tags:{mood:"anxious",        energy:["low","mid"],   social:"social",       body:["fine","heart"],wish:["nothing","talk"]}},

  /* ── からだをととのえる ── */
  {t:"みずをゴクっとのんでみる",    g:"からだ",  tags:{mood:"angry",            energy:["high","mid"],  social:["alone","neutral"], body:["fine","heart"],  wish:["nothing","play"]}},
  {t:"つめたいみずをのんでみる",    g:"からだ",  tags:{mood:"angry",            energy:["high","mid"],  social:["alone","neutral"], body:["fine","heart"],  wish:["nothing","play"]}},
  {t:"みずをゆっくりのんでみる",    g:"からだ",  tags:{mood:"anxious",          energy:["low","mid"],   social:["alone","neutral"], body:"heart",           wish:["nothing","sleep"]}},
  {t:"みずをのんでリセットしてみる",g:"からだ",  tags:{mood:["angry","sad"],     energy:["low","mid"],   social:["alone","neutral"], body:["fine","bad"], wish:"nothing"}},
  {t:"みずをのんでひとやすみしてみる",g:"からだ",tags:{mood:["sad","anxious"],   energy:"verylow", social:["alone","neutral"], body:["fine","bad"], wish:"sleep"}},
  {t:"てをあらってすっきりしてみる",g:"からだ",  tags:{mood:["sad","angry"],     energy:["low","mid"],   social:["alone","neutral"], body:"bad",         wish:"nothing"}},
  {t:"てをあらってリセットしてみる",g:"からだ",  tags:{mood:"angry",            energy:["high","mid"],  social:["alone","neutral"], body:["fine","heart"],  wish:["nothing","play"]}},
  {t:"てをあらってきりかえてみる",  g:"からだ",  tags:{mood:["sad","anxious"],   energy:["low","mid"],   social:["alone","neutral"], body:["fine","bad"], wish:"nothing"}},
  {t:"あしのうらをかんじてみる",    g:"からだ",  tags:{mood:"anxious",          energy:["low","mid"],   social:["alone","neutral"], body:"heart",           wish:["nothing","sleep"]}},
  {t:"くつをはいてちめんをふんでみる",g:"からだ",tags:{mood:"anxious",          energy:["low","mid"],   social:["alone","neutral"], body:"heart",           wish:["nothing","sleep"]}},
  {t:"てのひらをひざにおいてみる",  g:"からだ",  tags:{mood:"anxious",          energy:["low","mid"],   social:["alone","neutral"], body:"heart",           wish:["nothing","sleep"]}},
  {t:"みえるものを5つさがしてみる", g:"からだ",  tags:{mood:"anxious",          energy:["low","mid"],   social:["alone","neutral"], body:["heart","breath"], wish:["nothing","sleep"]}},
  {t:"きこえるおとを3つさがしてみる",g:"からだ", tags:{mood:"anxious",          energy:["low","mid"],   social:["alone","neutral"], body:["heart","breath"], wish:["nothing","sleep"]}},
  {t:"すきなにおいをかいでみる",    g:"からだ",  tags:{mood:["sad","anxious"],   energy:"low",     social:"alone",             body:["fine","bad"], wish:"nothing"}},
  {t:"ふわふわしたものをさわってみる",g:"からだ", tags:{mood:"anxious",          energy:["low","mid"],   social:"alone",             body:"heart",           wish:["nothing","sleep"]}},
  {t:"ぬいぐるみをだっこしてみる",  g:"からだ",  tags:{mood:["sad","anxious"],   energy:"low",     social:"alone",             body:["fine","bad"], wish:"nothing"}},
  {t:"ぬいぐるみをぎゅっとしてみる",g:"からだ",  tags:{mood:["sad","anxious"],   energy:["low","mid"],   social:"alone",             body:["fine","heart"],  wish:["nothing","sleep"]}},

  /* ── 表現・かく ── */
  {t:"きもちをえにかいてみる",      g:"表現",    tags:{mood:["angry","sad"],     energy:["low","mid"],   social:"alone",        body:["fine","bad"],wish:"nothing"}},
  {t:"えんぴつでぐるぐるかいてみる",g:"表現",    tags:{mood:"angry",            energy:["high","mid"],  social:"alone",        body:["fine","heart"],  wish:"nothing"}},
  {t:"きもちをノートにかいてみる",  g:"表現",    tags:{mood:["sad","angry","anxious"],energy:["low","mid"],social:"alone",   body:["fine","bad"],wish:"nothing"}},
  {t:"しんぱいをノートにかいてみる",g:"表現",    tags:{mood:"anxious",          energy:["low","mid"],   social:"alone",        body:["fine","heart"],  wish:"nothing"}},
  {t:"えにかいてみる",              g:"表現",    tags:{mood:["sad","anxious"],   energy:"low",     social:"alone",        body:["fine","bad"],wish:"nothing"}},
  {t:"いまのきもちをえにかいてみる",g:"表現",    tags:{mood:["angry","sad","anxious"],energy:["low","mid"],social:"alone",  body:["fine","bad"],wish:"nothing"}},
  {t:"えんぴつですきなものをかいてみる",g:"表現",tags:{mood:["sad","anxious"],   energy:"low",     social:"alone",        body:["fine","bad"],wish:"nothing"}},
  {t:"みつけたものをえにかいてみる",g:"表現",    tags:{mood:["sad","happy"],     energy:"mid",     social:["alone","neutral"], body:"fine",       wish:"nothing"}},
  {t:"おてがみをかいてみる",          g:"表現",    tags:{mood:"happy",            energy:["high","mid"],  social:"social",       body:"fine",       wish:"talk"}},
  {t:"ちいさなこえでうたってみる",  g:"表現",    tags:{mood:["sad","anxious"],   energy:"low",     social:"alone",        body:["fine","breath"], wish:"nothing"}},
  {t:"おおきなこえであくびしてみる",g:"表現",    tags:{mood:"angry",            energy:["high","mid"],  social:"alone",        body:"breath",     wish:["nothing","play"]}},
  {t:"きもちをことばにしてみる",    g:"表現",    tags:{mood:["sad","anxious"],   energy:["low","mid"],   social:["alone","social"],body:["fine","bad"],wish:"talk"}},
  {t:"しんぱいをことばにしてみる",  g:"表現",    tags:{mood:"anxious",          energy:["low","mid"],   social:["alone","social"],body:["fine","heart"],  wish:"talk"}},
  {t:"「かなしいな」ってつぶやいてみる",g:"表現",tags:{mood:"sad",             energy:"low",     social:"alone",        body:["fine","bad"],wish:"nothing"}},
  {t:"「だいじょうぶ」ってつぶやいてみる",g:"表現",tags:{mood:"anxious",        energy:["low","mid"],   social:"alone",        body:["fine","heart"],  wish:"nothing"}},
  {t:"「いまここにいる」ってかんじてみる",g:"表現",tags:{mood:"anxious",        energy:["low","mid"],   social:["alone","neutral"],body:"heart",      wish:"nothing"}},
  {t:"100までかぞえてみる",         g:"表現",    tags:{mood:"angry",            energy:["high","mid"],  social:["alone","neutral"],body:["fine","heart"],wish:["nothing","play"]}},
  {t:"てのひらをぎゅっとひらいてみる",g:"表現",  tags:{mood:"angry",            energy:["high","mid"],  social:["alone","neutral"],body:"heart",      wish:["nothing","play"]}},
  {t:"てをぎゅってにぎってひらいてみる",g:"表現",tags:{mood:"anxious",          energy:["low","mid"],   social:["alone","neutral"],body:"heart",      wish:"nothing"}},
  {t:"やりたいことをリストにかいてみる",g:"表現",tags:{mood:"happy",            energy:["high","mid"],  social:["alone","neutral"],body:"fine",       wish:"play"}},
  {t:"きょうのことをにっきにかいてみる",g:"表現",tags:{mood:"happy",            energy:["high","mid"],  social:"alone",        body:"fine",       wish:["nothing","play"]}},
  {t:"きょうよかったことをひとつかんがえてみる",g:"表現",tags:{mood:["sad","anxious"],energy:["low","mid"],social:"alone",  body:["fine","bad"],wish:"nothing"}},
  {t:"きょうよかったことを3つかんがえてみる",g:"表現",tags:{mood:"happy",       energy:["high","mid"],  social:["alone","neutral"],body:"fine",      wish:["nothing","play"]}},
  {t:"ありがとうをつたえてみる",    g:"表現",    tags:{mood:"happy",            energy:["high","mid"],  social:"social",       body:"fine",       wish:"talk"}},
  {t:"すきなことにちょうせんしてみる",g:"表現",  tags:{mood:"happy",            energy:"high",    social:["alone","neutral"],body:"fine",       wish:"play"}},
  {t:"たのしかったことをはなしてみる",g:"表現",  tags:{mood:"happy",            energy:["high","mid"],  social:"social",       body:"fine",       wish:"talk"}},
  {t:"おきにいりのものをながめてみる",g:"表現",  tags:{mood:"sad",             energy:"low",     social:"alone",        body:["fine","bad"],wish:"nothing"}},
  {t:"すきなものをながめてみる",    g:"表現",    tags:{mood:"anxious",          energy:["low","mid"],   social:"alone",        body:["fine","heart"],  wish:"nothing"}},
  {t:"すきなものをあつめてみる",    g:"表現",    tags:{mood:"happy",            energy:["high","mid"],  social:"alone",        body:"fine",       wish:"play"}},
  {t:"たのしいきもちをそうぞうしてみる",g:"表現",tags:{mood:"happy",            energy:["high","mid"],  social:["alone","neutral"],body:"fine",      wish:["nothing","play"]}},
  {t:"おもしろいかたちのくもをさがしてみる",g:"表現",tags:{mood:"sad",          energy:["low","mid"],   social:["alone","neutral"],body:["fine","breath"],wish:"nothing"}},
];


/* ── きもちごとの見出し・説明・アイコン設定 ──
   mood の回答値（happy/sad/angry/anxious/neutral）ごとに設定する
   ============================================== */
const MD = {

  angry: {
    topImg:  "mad",
    ce_ikey: "mad",
    ct:      "もやもや",
    ttls: [
      "もやもやしてるんだね",
      "なんかイライラしているんだね",
      "むかーってなっているんだね",
    ],
    descs: [
      "なにかがうまくいかなくて、むかーっとしちゃうこと、だれにでもあるよ。そのエネルギーをそとにだしてあげよう。",
      "イライラしてるきもち、ちゃんとわかるよ。そういうときはからだをうごかすとすっきりするよ！",
      "もやもやしてるとき、むりにわらわなくていいよ。すこしずつきもちをだしてみよう。",
    ],
  },

  sad: {
    topImg:  "cry",
    ce_ikey: "cry",
    ct:      "かなしい",
    ttls: [
      "かなしいきもちなんだね",
      "なんかかなしくなっちゃったんだね",
      "しんどいきもちなんだね",
    ],
    descs: [
      "なみだがでそうなくらいかなしいこと、あるよね。そのきもちはそのままでいいよ。ゆっくりしてね。",
      "かなしいとき、むりにがんばらなくていいよ。じぶんのきもちをたいせつにしてね。",
      "しんどいきもち、ひとりでかかえなくていいよ。だれかそばにいるよ。",
    ],
  },

  anxious: {
    topImg:  "puzzled",
    ce_ikey: "puzzled",
    ct:      "しんぱい",
    ttls: [
      "なんだかドキドキしてるんだね",
      "しんぱいなきもちなんだね",
      "こころがざわざわしてるんだね",
    ],
    descs: [
      "しんぱいなことやこわいことがあると、からだもどきどきしちゃうよね。ひとつずつ、ゆっくりいこうね。",
      "ざわざわするきもち、ちゃんとわかるよ。いっしょにおちつこうね。",
      "どきどきしてるとき、ひとりでかかえなくていいよ。そばにいるよ。",
    ],
  },

  happy: {
    topImg:  "smile",
    ce_ikey: "smile",
    ct:      "たのしい",
    ttls: [
      "たのしいきもちなんだね！",
      "うれしいきもちなんだね！",
      "わくわくしてるんだね！",
    ],
    descs: [
      "わあ、うれしいな！そのきもち、だいじにしてね。たのしいエネルギーをいっぱいつかってみよう！",
      "たのしいきもちはまわりのひともうれしくさせるよ。とってもすてき！",
      "わくわくしてるって、すてきだね！そのきもちをいっぱいたのしんでね！",
    ],
  },

  neutral: {
    topImg:  "normal",
    ce_ikey: "normal",
    ct:      "ふつう",
    ttls: [
      "なんとなくそんなきもちなんだね",
      "ぼんやりしてるかんじなんだね",
      "まあまあなきもちなんだね",
    ],
    descs: [
      "おおきなきもちはないけど、なんとなくぼんやりしてたり、つかれてたりするのかもね。ゆっくりしてね。",
      "ふつうのときも、じぶんのきもちをきいてあげるのはたいせつなことだよ。",
      "まあまあなきもちのとき、なにかひとつちいさなことをやってみると、きもちがかわるかも。",
    ],
  },

};