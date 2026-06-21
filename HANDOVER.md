# コアラファミリーアプリ 引き継ぎプロンプト

## このファイルの使い方
新しいチャットにこのファイルの内容をそのまま貼り付けてください。

---

## プロジェクト概要

**コアラファミリーアプリ** — 日本の動物園にいるコアラの情報・ゲーム・サウンドノベルをまとめたSPA（Single Page App）。個人利用。

- **本番URL**: https://momivich.github.io/koala-app/koala-app.html
- **リポジトリ**: https://github.com/momivich/koala-app
- **ローカルフォルダ**: `C:\Users\ym\Desktop\コアラアプリ作成@ClaudeCode\`
- **メインファイル**: `koala-app.html`（5000行超のSPA）、`sw.js`（Service Worker）
- **SW キャッシュバージョン**: 現在 `koala-app-v19`（更新時はインクリメント必須）

---

## アーキテクチャ

### ファイル構成
```
koala-app.html      メインSPA（全機能入り）
sw.js               Service Worker（キャッシュ管理）
manifest.json       PWAマニフェスト
koala-images/       コアラ画像フォルダ（キャラ名でサブフォルダ分け）
icon-192.png        PWAアイコン
```

### SPA構造
- タブ切り替えは `showTab(name)` で div を `display:block/none`
- タブ一覧: 図鑑、家系図、クイズ、ゲーム、スイカ、記憶、ブラックジャック、森、リレー、うた、**ノベル**

### コアラデータ（KK配列）
```javascript
const KK = [
  { name:'きんとき', kana:'きんとき', sex:'m', born:'2022-06-25',
    zoo:'多摩動物公園', img:'koala-images/きんとき/exblog_2023.jpg',
    parents:[...], children:[...], ... },
  ...
]
```
- `img` フィールドは `./${k.img}` でアクセス
- 画像がないコアラは `img:null`

---

## サウンドノベルエンジン

### 状態変数
```javascript
let storyId=null, cur=null, seenEnds={};  // 現在ストーリー・シーン・クリア済みエンド
let novelAC=null, novelMG=null;            // AudioContext + マスターGainNode
let bgmNotes2=[], bgmIdx2=0, bgmNext2=0, bgmRun2=false;
let novelMuted=false, novelVol=0.7;
let autoAdv=false, autoTimer=null, txtSpeed=36;  // オートアドバンス・テキスト速度
let typTimer=null, isTyping=false, fullTxt='';
```

### 主要関数
| 関数 | 役割 |
|------|------|
| `novelMenu()` | ストーリー選択画面を表示 |
| `novelStart(sid)` | ストーリー開始 |
| `novelRender()` | 現在シーンを描画 |
| `novelTap()` | タップ処理（タイプ中なら全表示→AUTOタイマー） |
| `novelNext()` | 次シーンへ進む |
| `novelChoice(next)` | 選択肢を選ぶ |
| `startTyping(text)` | タイプライター開始 |
| `toggleAutoAdv()` | AUTOオン/オフ |
| `toggleTxtSpeed()` | テキスト速度切り替え（36→18→8→36ms） |
| `toggleNovelMute()` | ミュート切り替え |
| `setNovelVol(v)` | ボリューム設定（スライダー） |
| `startNovelBGM(sid)` | BGM開始（storyId prefix-match） |
| `stopNovelBGM()` | BGM停止 |

### BGMシステム
- Web Audio API、マルチオシレータ（sine基音＋triangle 2倍音＋sine 3倍音＋bass）
- ADSRエンベロープ: `linearRampToValueAtTime`（attack）、`exponentialRampToValueAtTime`（release）
- マスターGainNode `novelMG` で全体音量制御
- BGM種類はstoryIdのprefixでマッチ:
  ```javascript
  ['tama','oji','sczoo','rain','kanazawa','higashiyama'].find(k => sid.startsWith(k))
  ```

### BGM音符データ（BGMS）
```javascript
const BGMS = {
  higashiyama: [[330,.5],[294,.5],[262,.8],[0,.3],...],
  tama:        [[523,.3],[440,.3],[523,.3],[587,.5],...],
  kanazawa:    [[392,.5],[330,.5],[294,.8],[0,.3],...],
  oji:         [[440,.4],[523,.4],[440,.4],[392,.6],...],
  sczoo:       [[523,.3],[587,.3],[523,.3],[440,.5],...],
  rain:        [[262,.8],[294,.6],[0,.4],[262,.6],...],
};
// tama_kirara/tama_azumaはtamaのBGMを使う（prefix-match）
```

### 効果音
```javascript
function sfxNTap()    // タップ音（短いping）
function sfxNChoice() // 選択肢タップ音
```

### STORIESオブジェクト構造
```javascript
const STORIES = {
  storyId: {
    title: 'タイトル',
    zoo: '動物園名',
    emoji: '🐨',
    bgCol: '#hex',
    bgImg: 'koala-images/キャラ名/ファイル名.jpg', // 背景ぼかし写真
    desc: '説明文',
    endCount: 2,  // エンディング総数
    scenes: {
      's0': { bg:'BG名', ch:'キャラ名', t:'セリフ', n:'s1' },           // 通常シーン
      's1': { bg:'BG名', ch:'キャラ名', t:'セリフ',                      // 選択肢シーン
              c:[{t:'選択肢テキスト',n:'s2a'},{t:'選択肢テキスト',n:'s2b'}] },
      's2': { bg:'BG名', ch:'キャラ名', t:'ENDテキスト', e:1 },          // エンディング
    }
  }
}
```

### 背景（BG）オブジェクト
```javascript
const BG = {
  dawn, morning, afternoon, forest, evening, end1, end2, end3,
  tama, tama_eve, tama_end,
  knz_aut, knz_dusk, knz_end, knz_hope,
  oji_morn, oji_aft, oji_end,
  sczoo_rain, sczoo_clear, sczoo_end,
  rain, rain_eve, rain_end,
}
```

### キャラクター（CHARS）オブジェクト
```javascript
const CHARS = {
  'ナレーター': {img:null, col:'#dddddd'},
  'もなか':     {img:'koala-images/もなか/higashiyama_2024.jpg',  col:'#d4a8ff'},
  'りん':       {img:'koala-images/りん/higashiyama_2024.JPG',    col:'#a8d4ff'},
  'ししお':     {img:'koala-images/ししお/higashiyama_2023.jpg',  col:'#a8ffd4'},
  'きらら':     {img:'koala-images/きらら/metro_2020.jpg',        col:'#ffd4a8'},
  'きんとき':   {img:'koala-images/きんとき/exblog_2023.jpg',     col:'#ffcc88'},
  'あずま':     {img:'koala-images/あずま/prtimes_2024.jpg',      col:'#aaffcc'},
  'タムタム':   {img:'koala-images/タムタム/タムタム.png',         col:'#aaccff'},
  'たんぽぽ':   {img:'koala-images/たんぽぽ/S__44449813.jpg',     col:'#ffa8d4'},
  'ぼたん':     {img:'koala-images/ぼたん/kanazawa_2024.jpg',     col:'#ffaacc'},
  'ポポロ':     {img:'koala-images/ポポロ/S__44449814.jpg',       col:'#ccffaa'},
  'コロン':     {img:'koala-images/コロン/S__44449805.jpg',       col:'#ffaaaa'},
  'いぶき':     {img:'koala-images/いぶき/oji_2023.jpeg',         col:'#bbeecc'},
  'アーティ':   {img:'koala-images/アーティ/oji_2016.jpeg',       col:'#aabbdd'},
  'エマ':       {img:'koala-images/エマ/oji_2019.jpeg',           col:'#ddbbaa'},
  'さち':       {img:'koala-images/さち/sczoo_2024.jpg',          col:'#ffccdd'},
  'コハル':     {img:'koala-images/コハル/sczoo_2023.jpg',        col:'#ccffee'},
  'アサヒ':     {img:'koala-images/アサヒ/sczoo_2025.jpg',        col:'#ffeeaa'},
}
```

---

## ストーリー一覧（全8本）

| storyId | タイトル | 動物園 | エンディング | 主なキャラ |
|---------|---------|--------|------------|----------|
| `higashiyama` | ユーカリの約束 | 東山動植物園 | 3 | もなか・りん・ししお |
| `tama` | きんときのいい午後 | 多摩動物公園 | 2 | きんとき・きらら・あずま |
| `tama_kirara` | きらら、今日も | 多摩動物公園 | 2 | きらら・あずま・きんとき |
| `tama_azuma` | あずまのひとりごはん | 多摩動物公園 | 2 | あずま・きんとき・きらら |
| `kanazawa` | ポポロのある朝 | 金沢動物園 | 2 | ポポロ・コロン・たんぽぽ |
| `oji` | いぶきのおひるね | 王子動物公園 | 2 | いぶき・アーティ・エマ |
| `sczoo` | さちのあめあがり | 埼玉こども動物自然公園 | 2 | さち・コハル・アサヒ |
| `rain` | りんのあめのひ | 東山動植物園 | 2 | りん・もなか・きらら・ししお |

**全ストーリー共通方針**: ほのぼの日常。「乗り越える」「頑張る」ではなく、「そのまま一緒にいる」「ありがたく日常を受け取る」トーン。メンタル弱めな人がほっとできるような内容。

---

## UIのポイント

### novelRender() の構成
```javascript
// 背景: photoBg（ぼかし写真） + gradient オーバーレイ
// アニメ: nFadeIn（inner divに適用、毎レンダリングで再トリガー）
// キャラ名プレート: フロストガラス（${char.col}44 背景 + backdrop-filter:blur）
// テキストボックス: #novel-tb（backdrop-filter:blur(6px)）
// 選択肢ボタン: onmouseover/onmouseout でホバーエフェクト
// コントロール: [AUTO] [▶/▶▶/▶▶▶] [🔊] [スライダー]
```

### localStorage キー
```
koala-novel-story   // 現在storyId
koala-novel-scene   // 現在シーンキー
koala-novel-ends    // seenEnds JSON
koala-novel-vol     // 音量
koala-novel-mute    // ミュート
koala-novel-auto    // AUTOオン/オフ
koala-novel-speed   // テキスト速度
```

---

## 多摩動物公園 リアル情報（ストーリーに反映済み）
- 丘の上にコアラ館がある → 冒頭ナレーションに「丘の上のコアラ館」
- モノレールが聞こえる（多摩センター駅経由）→ 「多摩センターの方から来るモノレールの音」
- ごはんタイムが1日2回（朝・夕方）→ 冒頭「朝のごはんタイムは終わった。次は夕方にもう一回ある」
- 多摩のコアラは他の園より大きい → きらら冒頭ナレーション・きんとき食べすぎくだり

---

## git 運用

```bash
cd C:\Users\ym\Desktop\コアラアプリ作成@ClaudeCode
git add koala-app.html sw.js
git commit -m "feat: ..."
git push
```

デプロイ先: GitHub Pages（push後数分で反映）
**SW更新時は `sw.js` の `const CACHE = 'koala-app-vNN'` をインクリメント必須**

現在バージョン: `koala-app-v19`

---

## 直近の作業履歴（このチャットで完了）

- BGM多重オシレータ化（倍音・ADSRエンベロープ）
- オートアドバンス機能（AUTO/テキスト速度/localStorage保存）
- 全ストーリーに分岐追加（endCount管理）
- 背景写真のぼかしレイヤー
- シーン拡張: きんとき（+8）、りん（+5）、ポポロ（+5）
- UIポリッシュ: キャラ名フロストガラス・選択肢ホバーエフェクト
- 多摩リアル情報を全多摩ストーリーに組み込み
- SW v19に更新

---

## 次にやりたいこと（未着手）

- 多摩・王子・金沢・埼玉の動物園風景写真を背景に追加（ユーザーが用意予定）
- 新ストーリー候補: 平川動物公園、東山（別キャラ）など
- その他リアル情報があればストーリーに追加
