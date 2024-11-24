# Vue3 Mini Feedback Form 意見反饋表單

> 面試作業

這是基於 Vue 3 + TypeScript + Vite 的意見反饋表單，使用 Element Plus 作為主要 UI 框架。

## Installation (Development)

```bash
npm install
npm run dev

# Production
npm run build
```

## 簡易功能需求特點

- 支持多種反饋類別選擇
- 提交前會進行表單驗證
- 圖片預覽 + 圖片上傳(最多 3 張，PNG、JPG 格式，每張 5MB 內) + 圖片刪除
- 若提交成功後，顯示 dialog 內容，在 5 秒後自動關閉

## 技術棧

- Vue 3 + TypeScript + Vite
- Element Plus + Tailwind CSS
- Unplugin 系列 (AutoImport、Components、Icons)

## 目錄結構

```bash

src/
  ├── components/       # 共用組件
  ├── config/           # 配置文件
  │   ├── constants/    # 存放 constants
  ├── types/            # TypeScript 類型定義
  ├── App.vue           # Main 頁面
  └── main.ts           # 入口文件

```
