# 商品管理後台系統

## 專案簡介

本專案為一套商品管理後台系統，  
使用前後端分離架構，提供商品 CRUD 管理功能。

## 使用技術

- Frontend：HTML / JavaScript（Vite）
- Backend：Node.js / Express
- Database：MongoDB
- ORM：Mongoose

## 專案結構

114_web_final_project
├─ backend
│ ├─ app.js
│ ├─ routes
│ ├─ controllers
│ ├─ models
│ └─ config
└─ frontend
├─ index.html
└─ main.js

## 啟動方式

### 1. 啟動 MongoDB

MongoDB 以 Windows Service 方式執行。

### 2. 啟動後端

cd backend
npm install
npm run dev

### 3. 啟動前端

cd frontend
npm install
npm run dev

### 瀏覽器開啟：

前端：http://localhost:5173

後端：http://localhost:3001

### API 說明
Method Path 說明
GET /api/products 取得商品列表
POST /api/products 新增商品
PUT /api/products/:id 更新商品
DELETE /api/products/:id 刪除商品
