// コアラアプリ Service Worker
const CACHE = 'koala-app-v20';
const PRECACHE = [
  "./koala-app.html",
  "./manifest.json",
  "./koala-images/@のぞみ/S__44449807.jpg",
  "./koala-images/@はな/S__44449803.jpg",
  "./koala-images/@ひなぎく/S__44449802.jpg",
  "./koala-images/@ふく/S__44449808.jpg",
  "./koala-images/@アース/S__44449809.jpg",
  "./koala-images/@シャイニー/S__44449806.jpg",
  "./koala-images/@ニシチ/S__44449795_0.jpg",
  "./koala-images/@ニーナ/S__44449804.jpg",
  "./koala-images/あずま/prtimes_2024.jpg",
  "./koala-images/いぶき/oji_2023.jpeg",
  "./koala-images/おもち/higashiyama_2023.jpg",
  "./koala-images/きらら/metro_2020.jpg",
  "./koala-images/きんとき/exblog_2023.jpg",
  "./koala-images/こまち/england-hill_2026.jpg",
  "./koala-images/こまち/tama_2026.png",
  "./koala-images/さち/sczoo_2024.jpg",
  "./koala-images/ししお/higashiyama_2023.jpg",
  "./koala-images/たんぽぽ/S__44449813.jpg",
  "./koala-images/だいふく/higashiyama_2023.jpg",
  "./koala-images/つくし/hirakawa_2025.jpg",
  "./koala-images/ななみ/S__44449799.jpg",
  "./koala-images/ぼたん/kanazawa_2024.jpg",
  "./koala-images/もなか/higashiyama_2024.jpg",
  "./koala-images/りん/higashiyama_2023.jpg",
  "./koala-images/りん/higashiyama_2024.JPG",
  "./koala-images/アサヒ/sczoo_2025.jpg",
  "./koala-images/アラタ/hirakawa_2025.jpg",
  "./koala-images/アーチャー/higashiyama_2010.jpg",
  "./koala-images/アーチャー平川/hirakawa_2025.jpeg",
  "./koala-images/アーティ/oji_2016.jpeg",
  "./koala-images/イシン/higashiyama_2024.png",
  "./koala-images/イツキ/hirakawa.png",
  "./koala-images/インディコ平川/hirakawa_2025.jpeg",
  "./koala-images/インディコ東山/higashiyama_2021.jpg",
  "./koala-images/ウッドランド/uddorando1m.jpg",
  "./koala-images/ウミ/raditopi_2024.jpg",
  "./koala-images/ウメ/oji_2022.jpeg",
  "./koala-images/ウルル/oji_2017.jpeg",
  "./koala-images/エイト/hirakawa_2025.jpeg",
  "./koala-images/エマ/oji_2019.jpeg",
  "./koala-images/カスミ/hirakawa_2025.jpg",
  "./koala-images/カナエ/hirakawa_2025.jpg",
  "./koala-images/キボウ/hirakawa_2025.jpeg",
  "./koala-images/クレメンツ/higashiyama_2018.jpg",
  "./koala-images/コスモ/hirakawa_2025.jpeg",
  "./koala-images/コタロウ/exblog_2018.jpg",
  "./koala-images/コハル/sczoo_2023.jpg",
  "./koala-images/コロコロ/anokoronagoya_1984.jpg",
  "./koala-images/コロン/S__44449805.jpg",
  "./koala-images/スカイ/S__44449796_0.jpg",
  "./koala-images/スター/hirakawa_2024.jpg",
  "./koala-images/スミレ/hirakawa_2025.jpeg",
  "./koala-images/ソラ/sczoo_2022.jpg",
  "./koala-images/タイチ/higashiyama_2022.jpg",
  "./koala-images/タイヨウ/hirakawa_2024.jpg",
  "./koala-images/タムタム/タムタム.png",
  "./koala-images/タムタム・トムトム/metro_tokyo_1984.jpg",
  "./koala-images/チャーボウ/hirakawa_2025.jpg",
  "./koala-images/チャーリー/tama_2023.jpg",
  "./koala-images/ツムギ/hirakawa_2025.jpg",
  "./koala-images/ティアラ/mi84ta_2008.jpg",
  "./koala-images/ティムタム/ameba_2009.jpg",
  "./koala-images/ティリー/higashiyama_2024.JPG",
  "./koala-images/テラ/higashiyama_blog2010.jpg",
  "./koala-images/トムトム/トムトム.png",
  "./koala-images/ナギ/raditopi_2024.jpg",
  "./koala-images/ニポポ/kanazawa_display2016.jpg",
  "./koala-images/ハッピー/higashiyama_blog2024.jpg",
  "./koala-images/ハリー/S__44449812.jpg",
  "./koala-images/ヒナタ/hirakawa_2025.jpeg",
  "./koala-images/ヒマワリ/hirakawa_2025.jpeg",
  "./koala-images/ピース/higashiyama_2017.jpg",
  "./koala-images/ピース平川/hirakawa_2024.jpg",
  "./koala-images/ピーター/higashiyama_2016.jpg",
  "./koala-images/ブルー/tokaitv_1986.jpg",
  "./koala-images/ホリー/higashiyama_2020.jpg",
  "./koala-images/ポポロ/S__44449814.jpg",
  "./koala-images/マイ/oji_2022.jpeg",
  "./koala-images/ミドリ/england-hill_2021.jpg",
  "./koala-images/ライト/hirakawa_2024.jpg",
  "./koala-images/ラムネ/hirakawa_2025.jpeg",
  "./koala-images/リオ/hirakawa_2025.jpg",
  "./koala-images/桜希/ojizoo_2025.jpg",
  "./koala-images/桜花/ojizoo_2025.jpg"
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  const url = e.request.url;
  // HTMLはネットワーク優先（更新をすぐ反映）
  if(url.endsWith('.html') || url.endsWith('/')) {
    e.respondWith(
      fetch(e.request).then(res => {
        if(!res || res.status !== 200 || res.type === 'opaque') return res;
        caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  // 画像・その他はキャッシュ優先
  e.respondWith(
    caches.match(e.request).then(cached => {
      if(cached) return cached;
      return fetch(e.request).then(res => {
        if(!res || res.status !== 200 || res.type === 'opaque') return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match('./koala-app.html'));
    })
  );
});
