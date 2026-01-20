# Hướng dẫn tích hợp API cho PetCare Web

## Tổng quan

Dự án PetCare Web đã được tích hợp với hệ thống API calls hoàn chỉnh cho các chức năng:

- **Authentication**: Login, Register, Social Login
- **Store**: Quản lý sản phẩm, giỏ hàng, đơn hàng
- **Services**: Danh sách dịch vụ, đặt lịch dịch vụ
- **Pets**: Quản lý profile thú cưng

## Cấu trúc thư mục

```
src/
├── services/
│   └── api.js              # API service chính
├── context/
│   └── AppContext.js       # Context quản lý state toàn cục
├── config/
│   └── api.js              # Cấu hình API endpoints
└── pages/
    ├── Login.jsx           # Trang đăng nhập với API
    ├── Register.jsx        # Trang đăng ký với API
    ├── Store.jsx           # Trang cửa hàng với API
    └── Services.jsx        # Trang dịch vụ với API
```

## Cấu hình API

### 1. Base URL

Mặc định API sẽ chạy tại: `http://localhost:3001/api`

Để thay đổi, tạo file `.env` trong thư mục `petcare/`:

```env
REACT_APP_API_URL=http://your-api-server.com/api
```

### 2. API Endpoints

#### Authentication

- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký
- `POST /auth/google` - Đăng nhập Google
- `POST /auth/facebook` - Đăng nhập Facebook

#### Store

- `GET /store/products` - Lấy danh sách sản phẩm
- `GET /store/products/:id` - Lấy chi tiết sản phẩm
- `POST /store/cart/add` - Thêm vào giỏ hàng
- `GET /store/cart` - Lấy giỏ hàng
- `PUT /store/cart/:id` - Cập nhật giỏ hàng
- `DELETE /store/cart/:id` - Xóa khỏi giỏ hàng
- `POST /store/orders` - Đặt hàng
- `GET /store/orders` - Lịch sử đơn hàng

#### Services

- `GET /services` - Lấy danh sách dịch vụ
- `GET /services/:id` - Lấy chi tiết dịch vụ
- `POST /services/book` - Đặt lịch dịch vụ
- `GET /services/history` - Lịch sử đặt dịch vụ
- `PUT /services/cancel/:id` - Hủy đặt lịch

#### Pets

- `GET /pets` - Lấy danh sách thú cưng
- `POST /pets` - Tạo profile thú cưng
- `PUT /pets/:id` - Cập nhật profile thú cưng
- `DELETE /pets/:id` - Xóa thú cưng

## Cách sử dụng

### 1. Import API services

```javascript
import { authAPI, storeAPI, servicesAPI, petAPI } from "../services/api";
```

### 2. Sử dụng trong component

```javascript
import { useApp } from '../context/AppContext';

function MyComponent() {
  const { state, actions } = useApp();

  const handleLogin = async () => {
    const result = await actions.login({
      email: 'user@example.com',
      password: 'password123'
    });

    if (result.success) {
      console.log('Đăng nhập thành công');
    } else {
      console.error('Lỗi:', result.error);
    }
  };

  return (
    // JSX của component
  );
}
```

### 3. State Management

Context cung cấp các state và actions:

- `state.user` - Thông tin user hiện tại
- `state.isAuthenticated` - Trạng thái đăng nhập
- `state.cart` - Giỏ hàng
- `state.services` - Danh sách dịch vụ
- `state.products` - Danh sách sản phẩm
- `actions.login()` - Đăng nhập
- `actions.register()` - Đăng ký
- `actions.logout()` - Đăng xuất
- `actions.addToCart()` - Thêm vào giỏ hàng

## Error Handling

Tất cả API calls đều có xử lý lỗi tự động:

- Hiển thị loading state
- Hiển thị thông báo lỗi
- Fallback về dữ liệu mock nếu API lỗi
- Tự động logout khi token hết hạn

## Authentication

- Token được lưu trong localStorage
- Tự động thêm token vào headers của mọi request
- Tự động logout khi nhận 401 response
- Kiểm tra authentication state khi khởi động app

## Mock Data

Khi API server chưa sẵn sàng, ứng dụng sẽ sử dụng mock data:

- Store: Danh sách sản phẩm mẫu
- Services: Danh sách dịch vụ mẫu
- Fallback tự động khi API call thất bại

## Development

### Chạy ứng dụng

```bash
cd petcare
npm start
```

### Kiểm tra lỗi

```bash
npm run lint
```

## API Response Format

Tất cả API responses đều có format:

```javascript
{
  success: true/false,
  data: {}, // Dữ liệu trả về
  error: "Error message" // Thông báo lỗi nếu có
}
```

## Next Steps

1. **Setup Backend API**: Triển khai backend server với các endpoints đã định nghĩa
2. **Environment Variables**: Cấu hình environment variables cho production
3. **Error Monitoring**: Thêm error tracking (Sentry, etc.)
4. **Testing**: Viết unit tests cho API services
5. **Documentation**: Tạo API documentation chi tiết

## Support

Nếu có vấn đề với API integration, vui lòng kiểm tra:

1. Console logs để xem lỗi cụ thể
2. Network tab để kiểm tra API calls
3. Backend server có đang chạy không
4. CORS configuration trên backend
