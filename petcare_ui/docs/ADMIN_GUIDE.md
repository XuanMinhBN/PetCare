# Hướng dẫn sử dụng Admin Panel - PetCare Web

## 🎯 Tổng quan

Admin Panel của PetCare Web cung cấp giao diện quản lý toàn diện cho hệ thống, bao gồm:

- **Dashboard**: Tổng quan thống kê hệ thống
- **Quản lý Sản phẩm**: CRUD sản phẩm, quản lý kho
- **Quản lý Đơn hàng**: Xử lý đơn hàng, cập nhật trạng thái
- **Quản lý Dịch vụ**: Quản lý dịch vụ và đặt lịch
- **Quản lý Người dùng**: Quản lý tài khoản khách hàng
- **Quản lý Thú cưng**: Quản lý thông tin thú cưng
- **Báo cáo & Thống kê**: Phân tích doanh thu và hoạt động

## 🚀 Cách truy cập

### Development Mode

1. Khởi động ứng dụng: `npm start`
2. **Truy cập Admin Panel:** Click vào nút **"🔧 Admin Panel"** từ trang chủ (chỉ hiển thị trong development)
3. **Hoặc đăng nhập admin:** Sử dụng tài khoản admin để thấy nút **"🔧 Admin"** trong navbar

### Production Mode

- Cần authentication và authorization
- Chỉ admin users mới có thể truy cập
- Button admin sẽ chỉ hiển thị trong navbar khi user có role admin

## 📊 Admin Dashboard

### Thống kê nhanh

- **Tổng sản phẩm**: Số lượng sản phẩm trong hệ thống
- **Đơn hàng hôm nay**: Số đơn hàng được tạo trong ngày
- **Dịch vụ đặt lịch**: Số lượng dịch vụ được đặt lịch
- **Người dùng mới**: Số tài khoản mới đăng ký

### Thao tác nhanh

- **+ Thêm sản phẩm mới**: Chuyển đến trang quản lý sản phẩm
- **+ Thêm dịch vụ mới**: Chuyển đến trang quản lý dịch vụ
- **Xem đơn hàng mới**: Chuyển đến trang quản lý đơn hàng

### Menu quản lý

- **🛍️ Quản lý Sản phẩm**: Thêm, sửa, xóa sản phẩm
- **📦 Quản lý Đơn hàng**: Xem và xử lý đơn hàng
- **🔧 Quản lý Dịch vụ**: Quản lý dịch vụ và đặt lịch
- **👥 Quản lý Người dùng**: Quản lý tài khoản người dùng
- **🐕 Quản lý Thú cưng**: Quản lý thông tin thú cưng
- **📊 Báo cáo & Thống kê**: Xem báo cáo doanh thu

## 🛍️ Quản lý Sản phẩm

### Tính năng chính

- ✅ **Xem danh sách sản phẩm** với pagination
- ✅ **Tìm kiếm sản phẩm** theo tên
- ✅ **Lọc theo danh mục** (Thức ăn, Đồ chơi, Phụ kiện, Sức khỏe)
- ✅ **Thêm sản phẩm mới** với form validation
- ✅ **Chỉnh sửa sản phẩm** hiện có
- ✅ **Xóa sản phẩm** với xác nhận
- ✅ **Quản lý trạng thái** (Hoạt động/Ngừng bán)

### Form thêm/sửa sản phẩm

```
- Tên sản phẩm * (bắt buộc)
- Giá (₫) * (bắt buộc)
- Danh mục * (bắt buộc)
- Số lượng tồn kho * (bắt buộc)
- URL hình ảnh
- Mô tả sản phẩm
- Trạng thái (Hoạt động/Ngừng bán)
```

### Danh mục sản phẩm

- **Thức ăn**: Các loại thức ăn cho chó, mèo
- **Đồ chơi**: Đồ chơi và giải trí cho thú cưng
- **Phụ kiện**: Vòng cổ, dây xích, chuồng, v.v.
- **Sức khỏe**: Thuốc, vitamin, dụng cụ chăm sóc

## 📦 Quản lý Đơn hàng

### Thống kê đơn hàng

- **Tổng đơn hàng**: Tổng số đơn hàng trong hệ thống
- **Chờ xác nhận**: Đơn hàng mới chưa được xử lý
- **Đang giao**: Đơn hàng đang trong quá trình giao hàng
- **Đã giao**: Đơn hàng đã hoàn thành

### Trạng thái đơn hàng

1. **Chờ xác nhận** (pending) - Màu vàng
2. **Đã xác nhận** (confirmed) - Màu xanh dương
3. **Đang giao** (shipped) - Màu tím
4. **Đã giao** (delivered) - Màu xanh lá
5. **Đã hủy** (cancelled) - Màu đỏ

### Thao tác trên đơn hàng

- **Xác nhận**: Chuyển từ "Chờ xác nhận" → "Đã xác nhận"
- **Giao hàng**: Chuyển từ "Đã xác nhận" → "Đang giao"
- **Hoàn thành**: Chuyển từ "Đang giao" → "Đã giao"
- **Hủy**: Chuyển từ "Chờ xác nhận" → "Đã hủy"

### Thông tin đơn hàng

- **Mã đơn hàng**: ID duy nhất (VD: ORD-001)
- **Khách hàng**: Tên và email người đặt hàng
- **Sản phẩm**: Danh sách sản phẩm và số lượng
- **Tổng tiền**: Tổng giá trị đơn hàng
- **Ngày đặt**: Thời gian tạo đơn hàng

## 🔧 API Integration

### Admin API Endpoints

#### Products

```javascript
// Lấy danh sách sản phẩm (admin)
GET /admin/products?page=1&limit=20&search=&category=

// Tạo sản phẩm mới
POST /admin/products

// Cập nhật sản phẩm
PUT /admin/products/:id

// Xóa sản phẩm
DELETE /admin/products/:id

// Upload hình ảnh
POST /admin/products/:id/image
```

#### Orders

```javascript
// Lấy danh sách đơn hàng
GET /admin/orders?page=1&limit=20&status=&search=

// Lấy chi tiết đơn hàng
GET /admin/orders/:id

// Cập nhật trạng thái đơn hàng
PUT /admin/orders/:id/status
```

#### Services

```javascript
// Lấy danh sách dịch vụ (admin)
GET /admin/services?page=1&limit=20&search=&type=

// Tạo dịch vụ mới
POST /admin/services

// Cập nhật dịch vụ
PUT /admin/services/:id

// Xóa dịch vụ
DELETE /admin/services/:id

// Lấy danh sách đặt lịch
GET /admin/services/bookings?page=1&limit=20&status=&serviceId=

// Cập nhật trạng thái đặt lịch
PUT /admin/services/bookings/:id/status
```

### Sử dụng Admin API

```javascript
import { adminAPI } from "../services/adminAPI";

// Lấy danh sách sản phẩm
const products = await adminAPI.products.getAllProducts(1, 20, "", "");

// Tạo sản phẩm mới
const newProduct = await adminAPI.products.createProduct({
  name: "Thức ăn cho chó",
  price: 250000,
  category: "food",
  stock: 50,
  description: "Thức ăn dinh dưỡng cho chó",
  status: "active",
});

// Cập nhật trạng thái đơn hàng
const updatedOrder = await adminAPI.orders.updateOrderStatus(
  orderId,
  "confirmed"
);
```

## 🎨 UI/UX Features

### Responsive Design

- ✅ **Mobile-first**: Tối ưu cho mobile và tablet
- ✅ **Desktop**: Giao diện đầy đủ cho desktop
- ✅ **Grid Layout**: Sử dụng CSS Grid cho layout linh hoạt

### Interactive Elements

- ✅ **Hover Effects**: Hiệu ứng hover cho buttons và cards
- ✅ **Loading States**: Spinner và skeleton loading
- ✅ **Modal Forms**: Form thêm/sửa trong modal
- ✅ **Confirmation Dialogs**: Xác nhận trước khi xóa

### Color Scheme

- **Primary**: Blue (#3B82F6) - Buttons và links
- **Success**: Green (#10B981) - Trạng thái thành công
- **Warning**: Yellow (#F59E0B) - Cảnh báo
- **Error**: Red (#EF4444) - Lỗi và xóa
- **Info**: Purple (#8B5CF6) - Thông tin

## 🔒 Security & Authentication

### Role-based Access Control

#### Admin User

- **Email:** `admin@example.com`
- **Password:** `123456`
- **Role:** `admin`
- **Quyền:** Truy cập Admin Dashboard, quản lý toàn bộ hệ thống

#### Regular User

- **Email:** `demo@example.com`
- **Password:** `123456`
- **Role:** `user`
- **Quyền:** Chỉ truy cập các tính năng thông thường

### Development Mode

- Admin panel có thể truy cập trực tiếp
- Mock authentication với 2 loại user
- Button admin chỉ hiển thị khi user có role admin

### Production Mode

- Cần đăng nhập với quyền admin
- JWT token validation
- Role-based access control
- API rate limiting

## 🚀 Development

### Cấu trúc thư mục

```
src/pages/admin/
├── AdminDashboard.jsx      # Dashboard chính
├── ProductManagement.jsx   # Quản lý sản phẩm
├── OrderManagement.jsx     # Quản lý đơn hàng
├── ServiceManagement.jsx   # Quản lý dịch vụ (tương lai)
├── UserManagement.jsx      # Quản lý người dùng (tương lai)
├── PetManagement.jsx       # Quản lý thú cưng (tương lai)
└── Reports.jsx             # Báo cáo & thống kê (tương lai)


src/components/
└── Navbar.jsx              # Navigation với admin button

src/context/
└── AppContext.js           # Context với isAdmin helper

src/services/
└── adminAPI.js             # API functions cho admin
```

### Mock Data

- Hiện tại sử dụng mock data cho demo
- Sẽ thay thế bằng API calls thực tế
- Dữ liệu được lưu trong state component

## 📝 TODO - Tính năng tương lai

### Quản lý Dịch vụ

- [ ] CRUD dịch vụ
- [ ] Quản lý lịch đặt dịch vụ
- [ ] Cập nhật trạng thái đặt lịch

### Quản lý Người dùng

- [ ] Xem danh sách người dùng
- [ ] Khóa/mở khóa tài khoản
- [ ] Cập nhật thông tin người dùng

### Quản lý Thú cưng

- [ ] Xem danh sách thú cưng
- [ ] Cập nhật thông tin thú cưng
- [ ] Xóa thú cưng

### Báo cáo & Thống kê

- [ ] Dashboard với charts
- [ ] Báo cáo doanh thu
- [ ] Thống kê sản phẩm bán chạy
- [ ] Phân tích người dùng

### Cải tiến UI/UX

- [ ] Dark mode
- [ ] Export data (Excel, PDF)
- [ ] Bulk operations
- [ ] Advanced filters
- [ ] Real-time notifications

## 🆘 Troubleshooting

### Lỗi thường gặp

1. **Admin panel không hiển thị**

   - Kiểm tra `NODE_ENV` có phải 'development' không
   - Refresh trang web

2. **Button admin không hiển thị trong navbar**

   - Đảm bảo đã đăng nhập với tài khoản admin
   - Kiểm tra user có role 'admin' không
   - Sử dụng console commands để test login

3. **Không thể thêm/sửa sản phẩm**

   - Kiểm tra form validation
   - Xem console logs để debug

4. **API calls fail**

   - Kiểm tra network connection
   - Xem browser console để debug
   - Đảm bảo backend server đang chạy

5. **Navigation không hoạt động**

   - Kiểm tra routing trong App.js
   - Đảm bảo onNavigate function được pass đúng

### Debug Tips

- Mở Developer Tools (F12)
- Kiểm tra Console tab cho errors
- Kiểm tra Network tab cho API calls
- Sử dụng React DevTools để debug state

---

**Lưu ý**: Đây là phiên bản demo với mock data. Trong production, cần tích hợp với backend API thực tế và implement authentication/authorization.
