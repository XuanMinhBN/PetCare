# Checkout API Documentation

## Tổng quan

Tài liệu này mô tả các API functions đã được hoàn thiện cho chức năng thêm đồ vào giỏ hàng và tạo đơn hàng trong ứng dụng PetCare Web.

## API Endpoints được sử dụng

Dựa trên hình ảnh API documentation đã cung cấp, các endpoints sau đây đã được tích hợp:

### Cart Operations

- `POST /checkout/cart/items` - Thêm sản phẩm vào giỏ hàng
- `GET /checkout/cart` - Lấy thông tin giỏ hàng
- `PATCH /checkout/cart/items/{id}` - Cập nhật số lượng sản phẩm trong giỏ hàng
- `DELETE /checkout/cart/items/{id}` - Xóa sản phẩm khỏi giỏ hàng

### Order Operations

- `POST /checkout/orders` - Tạo đơn hàng mới
- `GET /checkout/orders` - Lấy danh sách đơn hàng
- `GET /checkout/orders/{id}` - Lấy chi tiết đơn hàng
- `POST /checkout/orders/{id}/cancel` - Hủy đơn hàng

### Coupon Operations

- `POST /checkout/order/{orderId}/apply-coupon` - Áp dụng coupon cho đơn hàng

## API Functions trong checkoutAPI

### 1. Cart Operations

#### `addToCart(cartItemData)`

Thêm sản phẩm vào giỏ hàng.

**Parameters:**

```javascript
const cartItemData = {
  productId: "string", // ID của sản phẩm
  quantity: number, // Số lượng
  price: number, // Giá sản phẩm
  name: "string", // Tên sản phẩm
  description: "string", // Mô tả sản phẩm
  image: "string", // Hình ảnh sản phẩm (emoji hoặc URL)
};
```

**Response:**

```javascript
{
  success: boolean,
  data?: object,
  error?: string
}
```

#### `getCart()`

Lấy thông tin giỏ hàng hiện tại.

**Response:**

```javascript
{
  success: boolean,
  data?: {
    id: number,
    updatedAt: "string",
    totalPrice: number | null,
    totalItems: number | null,
    items: {
      content: [
        {
          id: number,
          qty: number,
          price: number,
          createdAt: "string",
          cart: {
            id: number,
            createdAt: "string",
            updatedAt: "string",
            user: { /* user object */ }
          },
          product: {
            id: number,
            name: "string",
            sku: "string",
            price: number,
            stock: number,
            images: "string",
            attrs: "string",
            status: "string",
            createdAt: "string"
          }
        }
      ],
      pageable: { /* pagination info */ },
      totalPages: number,
      totalElements: number,
      // ... other pagination fields
    }
  },
  error?: string
}
```

#### `updateCartItem(itemId, updateData)`

Cập nhật thông tin sản phẩm trong giỏ hàng.

**Parameters:**

- `itemId`: ID của item trong giỏ hàng
- `updateData`: Object chứa dữ liệu cần cập nhật (thường là `{ quantity: number }`)

#### `removeFromCart(itemId)`

Xóa sản phẩm khỏi giỏ hàng.

**Parameters:**

- `itemId`: ID của item trong giỏ hàng

### 2. Order Operations

#### `createOrder(orderData)`

Tạo đơn hàng mới.

**Parameters:**

```javascript
const orderData = {
  items: [
    {
      productId: "string",
      quantity: number,
      price: number,
    },
  ],
  shippingAddress: "string",
  paymentMethod: "cod" | "bank",
  notes: "string",
  subtotal: number,
  shippingFee: number,
  discount: number,
  total: number,
  couponCode: "string", // optional
};
```

#### `getOrders()`

Lấy danh sách tất cả đơn hàng của user.

#### `getOrderById(orderId)`

Lấy chi tiết một đơn hàng cụ thể.

#### `cancelOrder(orderId)`

Hủy đơn hàng.

### 3. Coupon Operations

#### `applyCoupon(orderId, couponCode)`

Áp dụng coupon cho đơn hàng.

**Parameters:**

- `orderId`: ID của đơn hàng
- `couponCode`: Mã coupon

## Components đã được cập nhật

### 1. ShoppingCart.jsx

- Tích hợp với `checkoutAPI.getCart()` để load dữ liệu giỏ hàng
- Sử dụng `checkoutAPI.updateCartItem()` để cập nhật số lượng
- Sử dụng `checkoutAPI.removeFromCart()` để xóa sản phẩm
- Thêm loading states và error handling

### 2. Store.jsx

- Cập nhật `handleAddToCart()` để sử dụng `checkoutAPI.addToCart()`
- Truyền đầy đủ thông tin sản phẩm vào cart

### 3. ProductDetail.jsx

- Cập nhật `handleAddToCart()` để sử dụng `checkoutAPI.addToCart()`
- Xử lý việc chuyển đổi giá từ string sang number

### 4. Checkout.jsx (Mới)

- Component hoàn toàn mới để xử lý quá trình thanh toán
- Tích hợp với tất cả các API functions của checkout
- Bao gồm form nhập thông tin giao hàng
- Hỗ trợ áp dụng coupon
- Tính toán tự động phí ship và tổng tiền

### 5. OrderHistory.jsx

- Cập nhật để sử dụng `checkoutAPI.getOrders()`
- Thêm chức năng hủy đơn hàng với `checkoutAPI.cancelOrder()`
- Hiển thị thông tin đơn hàng chi tiết hơn
- Thêm loading states và error handling

## Navigation Updates

Đã cập nhật App.js để thêm route cho trang Checkout:

```javascript
if (screen === "checkout")
  return <Checkout onNavigate={navigateWithParams} onBack={goBack} />;
```

## Cách sử dụng

### Thêm sản phẩm vào giỏ hàng

```javascript
import { checkoutAPI } from "../services/api";

const handleAddToCart = async (product) => {
  const cartItemData = {
    productId: product.id,
    quantity: 1,
    price: product.price,
    name: product.name,
    description: product.description,
    image: product.image,
  };

  const result = await checkoutAPI.addToCart(cartItemData);
  if (result.success) {
    // Thành công
  } else {
    // Xử lý lỗi
  }
};
```

### Lấy giỏ hàng

```javascript
const loadCart = async () => {
  const result = await checkoutAPI.getCart();
  if (result.success) {
    setCartItems(result.data.items || []);
  }
};
```

### Tạo đơn hàng

```javascript
const createOrder = async (orderData) => {
  const result = await checkoutAPI.createOrder(orderData);
  if (result.success) {
    // Chuyển đến trang lịch sử đơn hàng
  }
};
```

## Lưu ý quan trọng

1. **Authentication**: Tất cả API calls đều yêu cầu authentication token được gửi trong headers
2. **Error Handling**: Tất cả functions đều trả về object với `success` boolean và `error` message nếu có lỗi
3. **Loading States**: Các components đã được cập nhật để hiển thị loading states
4. **Data Validation**: Cần validate dữ liệu trước khi gửi API requests

## Testing

Để test các chức năng:

1. Đăng nhập vào ứng dụng
2. Vào trang Store và thêm sản phẩm vào giỏ hàng
3. Kiểm tra giỏ hàng trong ShoppingCart
4. Thực hiện thanh toán trong Checkout
5. Xem lịch sử đơn hàng trong OrderHistory

## Troubleshooting

### Lỗi thường gặp:

- **401 Unauthorized**: Kiểm tra token authentication
- **Network Error**: Kiểm tra kết nối mạng và API server
- **Validation Error**: Kiểm tra dữ liệu đầu vào

### Debug:

- Sử dụng browser dev tools để xem network requests
- Kiểm tra console logs để debug API responses
- Verify API endpoints và request/response format
