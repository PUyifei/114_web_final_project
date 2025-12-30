# 商品管理後台系統 API 規格文件

## 一、API 基本資訊

- Base URL：`http://localhost:3000`
- 資料格式：JSON
- 認證方式：無（可於加分項目實作 JWT）

### 統一回應格式

成功回應：
```json
{
  "success": true,
  "data": {},
  "message": "操作成功"
}
```

錯誤回應：
```json
{
  "success": false,
  "message": "錯誤說明"
}
```

---

## 二、商品（Products）API

### 1. 新增商品

- Method：`POST`
- URL：`/api/products`

#### Request Body
```json
{
  "name": "Keyboard",
  "description": "Mechanical keyboard",
  "price": 1500,
  "stock": 20,
  "status": "active"
}
```

#### Response（201 Created）
```json
{
  "success": true,
  "data": {
    "_id": "64f...",
    "name": "Keyboard",
    "price": 1500
  },
  "message": "Product created successfully"
}
```

---

### 2. 取得所有商品

- Method：`GET`
- URL：`/api/products`

#### Response（200 OK）
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f...",
      "name": "Keyboard",
      "price": 1500,
      "stock": 20,
      "status": "active"
    }
  ]
}
```

---

### 3. 取得單一商品

- Method：`GET`
- URL：`/api/products/:id`

#### Response（200 OK）
```json
{
  "success": true,
  "data": {
    "_id": "64f...",
    "name": "Keyboard",
    "price": 1500
  }
}
```

#### 錯誤（404 Not Found）
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### 4. 更新商品

- Method：`PUT`
- URL：`/api/products/:id`

#### Request Body
```json
{
  "price": 1600,
  "stock": 15
}
```

#### Response（200 OK）
```json
{
  "success": true,
  "data": {
    "_id": "64f...",
    "price": 1600,
    "stock": 15
  },
  "message": "Product updated successfully"
}
```

---

### 5. 刪除商品

- Method：`DELETE`
- URL：`/api/products/:id`

#### Response（200 OK）
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 三、HTTP 狀態碼說明

| 狀態碼 | 說明 |
|------|------|
| 200 | 請求成功 |
| 201 | 資源建立成功 |
| 400 | 請求格式錯誤 |
| 404 | 資料不存在 |
| 500 | 伺服器錯誤 |

---

## 四、CRUD 流程說明（文字版）

1. 使用者於前端操作商品管理介面
2. 前端透過 API 發送請求至後端
3. 後端 Controller 處理請求並存取 MongoDB
4. MongoDB 回傳結果
5. 後端回傳統一格式 JSON 給前端
6. 前端更新畫面顯示結果

