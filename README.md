# 退化器官博物館 · Vestigial Organs Space 🫙

收藏做過的個人小專案的目錄站。把每一個 side project 當作一件**浸液標本**陳列在暗夜展廳裡——
有的還活著（已上線），有的浸進了福馬林（館藏 / 本機運行）。

> 痕跡器官（vestigial organ）是演化留下、卻不再承擔原本功能的構造。
> side project 也是：源自某次衝動而長出，功能未必還在，但值得隔著玻璃保存。

## 技術棧

沿用 [`Sides/project-common`](../../project-common) 的 Vue 3 + Vite + Tailwind 4 架構與 `resources/js` 目錄／path alias 慣例，
**裁掉用不到的 auth / API 層 / i18n / Pinia / router**——純靜態單頁目錄站，資料寫死在 `resources/js/data/specimens.js`。

- Vue 3（`<script setup>`）
- Vite + `@vitejs/plugin-vue`
- Tailwind 4（`@tailwindcss/vite`，CSS-first，色票寫在 `resources/css/app.css` 的 `@theme`）+ SCSS（元件層）
- `reset-css`（不載 preflight）

## 開發

```sh
nvm use            # node v22
npm install
npm run serve      # http://localhost:8087
npm run build      # 輸出到 dist/
npm run preview    # 預覽 build 結果
```

## 目錄結構

```
resources/
├── css/app.css                          # Tailwind 4 入口 + @theme 博物館色票 + normalize
└── js/
    ├── index.html                       # Vite root 的入口 HTML
    ├── index.js                          # createApp 掛載
    ├── data/specimens.js                 # ★ 標本目錄（新增專案改這裡）
    └── components/
        ├── App.vue                       # 門楣 + 科別篩選 + 陳列櫃 + 版權
        └── common/SpecimenCard.vue       # 單件標本瓶（玻璃瓶 + 漂浮器官 + 標籤）
```

## 新增一件標本

編輯 [`resources/js/data/specimens.js`](resources/js/data/specimens.js)，在 `specimens` 陣列加一筆：

```js
{
    no: 11,
    slug: 'my-project',
    name: '中文名',
    latin: 'Genus species',      // 隨手取的偽拉丁學名
    family: 'lexica',            // satirica / metrica / lexica / selecta
    collected: '2026.07',        // 採集年月
    status: 'living',            // living=已上線 / preserved=館藏
    features: ['網站特色一', '網站特色二'],   // 賣點 / 亮點，非技術棧
    desc: '一句話標本野外筆記。',
    repo: 'https://github.com/thekdesign/my-project',
    live: '',                    // 有上線就填，卡片連結會優先用它
}
```

科別不夠用時，在同檔的 `families` 加一科，並到 `app.css` 補一個 `--color-fam-<key>` 色票。

## 部署

純靜態（無 SSR、單頁無 client routing，連 SPA fallback 都不需要）。任一平台：

| 平台 | Build command | Output directory |
| --- | --- | --- |
| Vercel | `npm run build` | `dist` |
| Cloudflare Pages | `npm run build` | `dist` |

> 與其他個人站（chill-retire / rude-gestures …）一致走 Vercel + thekdesign。部署一律手動觸發。
