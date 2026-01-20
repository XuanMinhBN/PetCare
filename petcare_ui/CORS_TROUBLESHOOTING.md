# CORS Troubleshooting Guide - PetCare Web

## 🚨 Vấn đề CORS đã được giải quyết

### ✅ Các file đã được tạo/cập nhật:

1. **`src/setupProxy.js`** - Proxy configuration cho development
2. **`src/config/api.js`** - Cập nhật CORS headers
3. **`src/services/api.js`** - Cập nhật axios configuration

## 🔧 Cách khắc phục lỗi CORS

### 1. **Development Mode (Đã được cấu hình)**

File `setupProxy.js` sẽ tự động proxy các request từ React app (port 3000) đến backend server (port 8080).

```javascript
// src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:8080",
      changeOrigin: true,
      secure: false,
    })
  );
};
```

### 2. **Environment Variables**

Tạo file `.env` trong thư mục `petcare/`:

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENV=development
REACT_APP_DEBUG=true
GENERATE_SOURCEMAP=false
```

### 3. **Backend Server CORS Configuration**

Đảm bảo backend server có CORS configuration:

```javascript
// Backend CORS config (Node.js/Express)
const cors = require("cors");

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);
```

## 🚀 Cách test

### 1. **Khởi động ứng dụng**

```bash
cd petcare
npm start
```

### 2. **Kiểm tra trong browser console**

```javascript
// Test API call
window.demoAPI.testAuth();
```

### 3. **Kiểm tra Network tab**

- Mở Developer Tools (F12)
- Vào tab Network
- Thực hiện một API call
- Kiểm tra request không bị block bởi CORS

## 🔍 Debugging CORS Issues

### 1. **Lỗi thường gặp:**

```
Access to XMLHttpRequest at 'http://localhost:8080/api/login'
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Giải pháp:** File `setupProxy.js` đã được cấu hình để xử lý vấn đề này.

### 2. **Kiểm tra proxy hoạt động:**

Trong console, bạn sẽ thấy log:

```
Proxying request: POST /api/login
```

### 3. **Nếu vẫn gặp lỗi CORS:**

1. **Kiểm tra backend server có chạy không:**

   ```bash
   curl http://localhost:8080/api/health
   ```

2. **Kiểm tra port backend:**

   - Mặc định: `http://localhost:8080`
   - Nếu khác, cập nhật trong `.env`

3. **Restart React development server:**
   ```bash
   npm start
   ```

## 📝 Production Deployment

### 1. **Environment Variables cho Production:**

```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_ENV=production
REACT_APP_DEBUG=false
```

### 2. **Backend CORS cho Production:**

```javascript
app.use(
  cors({
    origin: ["https://your-frontend-domain.com"],
    credentials: true,
  })
);
```

## 🛠️ Additional Solutions

### 1. **Nếu proxy không hoạt động:**

Thêm vào `package.json`:

```json
{
  "proxy": "http://localhost:8080"
}
```

### 2. **Alternative: Disable CORS trong browser (chỉ dành cho development):**

```bash
# Chrome
chrome.exe --user-data-dir=/tmp/foo --disable-web-security --disable-features=VizDisplayCompositor

# Không khuyến khích cho production!
```

### 3. **Manual CORS headers trong axios:**

```javascript
// src/services/api.js
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  },
});
```

## ✅ Checklist

- [x] Tạo `setupProxy.js`
- [x] Cập nhật API configuration
- [x] Cài đặt `http-proxy-middleware`
- [x] Cập nhật axios configuration
- [ ] Tạo file `.env` (cần tạo thủ công)
- [ ] Test API calls
- [ ] Kiểm tra backend CORS config

## 🆘 Support

Nếu vẫn gặp vấn đề:

1. Kiểm tra console logs
2. Kiểm tra Network tab
3. Đảm bảo backend server đang chạy
4. Restart cả frontend và backend

---

**Lưu ý:** File `setupProxy.js` chỉ hoạt động trong development mode. Cho production, cần cấu hình CORS trên backend server.
