# PopShelf - Hướng Dẫn Test Authentication & CRUD

## 🎯 Tổng Quan

Đã triển khai đầy đủ hệ thống authentication và CRUD cho sản phẩm:

- ✅ Login với JWT token
- ✅ Protected routes (yêu cầu authentication)
- ✅ Create, Read, Update, Delete sản phẩm
- ✅ Upload ảnh sản phẩm
- ✅ Logout

---

## 🔧 Chuẩn Bị

### 1. Tạo User Test trong Rails

Mở Rails console:

```bash
cd backend
rails console
```

Tạo user mới:

```ruby
User.create!(
  email: 'admin@popshelf.com',
  password: 'password123',
  password_confirmation: 'password123'
)
```

Kiểm tra user đã tạo:

```ruby
User.last
# => #<User id: 1, email: "admin@popshelf.com", ...>
```

### 2. Khởi Động Backend Rails

```bash
cd backend
rails server
```

Backend sẽ chạy tại: `http://localhost:3000`

### 3. Khởi Động React Frontend

Mở terminal mới:

```bash
cd frontend
npm install  # (nếu chưa cài dependencies)
npm start
```

Frontend sẽ chạy tại: `http://localhost:3003` (hoặc port khác nếu 3000 bận)

---

## 🧪 Test Workflow Chi Tiết

### Bước 1: Test Login

1. Mở trình duyệt: `http://localhost:3003/login`
2. Nhập thông tin:
   - Email: `admin@popshelf.com`
   - Password: `password123`
3. Click "ログイン" (Login)
4. **Kết quả mong đợi:**
   - Redirect sang `/admin`
   - Hiển thị "ようこそ、admin@popshelf.com" ở góc phải
   - Có nút "ログアウト" (Logout)

**Kiểm tra token:**

- Mở DevTools (F12) → Application → Local Storage
- Xác nhận có `authToken` và `authUser`

---

### Bước 2: Test Tạo Sản Phẩm Mới (Create)

1. Ở trang Admin, scroll đến form "新規商品を追加"
2. Điền thông tin:
   - 商品名 (Name): `Test Product`
   - 説明 (Description): `This is a test product`
   - 著者 (Author): `Test Author`
   - リリース年 (Release Year): `2025`
   - 価格 (Price): `1999`
   - ジャンル (Genre): `Test`
   - 評価 (Rating): `4.5`
   - カバー写真 (Cover Photo): Chọn file ảnh từ máy
3. Click "追加" (Add)
4. **Kết quả mong đợi:**
   - Alert: "商品が正常に作成されました！"
   - Sản phẩm mới xuất hiện trong danh sách phía dưới
   - Form reset về trạng thái trống

**Verify trong backend:**

```bash
# Rails console
Product.last
# => Hiển thị sản phẩm vừa tạo với tất cả thông tin
```

---

### Bước 3: Test Sửa Sản Phẩm (Edit)

1. Ở danh sách sản phẩm, tìm sản phẩm vừa tạo
2. Click nút "編集" (Edit)
3. **Kết quả mong đợi:**
   - Form ở trên sẽ load dữ liệu của sản phẩm đó
   - Tiêu đề form đổi thành "商品を編集"
4. Thay đổi một vài thông tin (ví dụ: đổi giá thành `2500`)
5. Click "更新" (Update)
6. **Kết quả mong đợi:**
   - Sản phẩm trong danh sách cập nhật với giá mới
   - Form reset

**Verify trong backend:**

```bash
Product.find(ID).price
# => 2500
```

---

### Bước 4: Test Xóa Sản Phẩm (Delete)

1. Ở danh sách sản phẩm, click nút "削除" (Delete) của sản phẩm test
2. **Kết quả mong đợi:**
   - Hiện confirm dialog: "本当にこの商品を削除しますか？"
3. Click OK
4. **Kết quả mong đợi:**
   - Sản phẩm biến mất khỏi danh sách

**Verify trong backend:**

```bash
Product.find(ID)
# => ActiveRecord::RecordNotFound (sản phẩm đã bị xóa)
```

---

### Bước 5: Test Logout

1. Ở trang Admin, click nút "ログアウト" (Logout) ở góc phải
2. **Kết quả mong đợi:**

   - Redirect sang `/login`
   - Token bị xóa khỏi localStorage

3. Thử truy cập trực tiếp `/admin` trong URL
4. **Kết quả mong đợi:**
   - Tự động redirect về `/login` (protected route hoạt động)

---

### Bước 6: Test Unauthorized Access

1. Logout nếu đang login
2. Trong DevTools Console, thử gọi API trực tiếp:

```javascript
fetch("http://localhost:3000/api/v1/products", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    product: {
      name: "Unauthorized Test",
      price: 1000,
    },
  }),
})
  .then((r) => r.json())
  .then(console.log);
```

3. **Kết quả mong đợi:**
   - Response: `{"message": "Please log in"}` với status 401

---

## 🐛 Troubleshooting

### Lỗi: "Failed to fetch" khi login

**Nguyên nhân:** Backend chưa chạy hoặc CORS chưa được cấu hình đúng.

**Giải pháp:**

1. Kiểm tra backend đang chạy tại port 3000
2. Kiểm tra file `backend/config/initializers/cors.rb`:

```ruby
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:3003'  # Frontend URL
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end
```

### Lỗi: "Invalid username or password"

**Nguyên nhân:** Email/password không đúng hoặc user chưa tồn tại.

**Giải pháp:**

```bash
# Rails console
User.all  # Kiểm tra danh sách users
User.find_by(email: 'admin@popshelf.com')  # Kiểm tra user cụ thể
```

### Lỗi: Token bị mất sau khi refresh trang

**Nguyên nhân:** AuthContext chưa load token từ localStorage đúng cách.

**Giải pháp:**

- Kiểm tra DevTools → Application → Local Storage
- Verify `authToken` và `authUser` có tồn tại không
- Nếu có nhưng vẫn lỗi, xóa cache và refresh

---

## 📝 API Endpoints Summary

| Method | Endpoint               | Auth Required | Description                            |
| ------ | ---------------------- | ------------- | -------------------------------------- |
| POST   | `/api/v1/login`        | ❌            | Login với email + password, nhận token |
| GET    | `/api/v1/products`     | ❌            | Lấy danh sách tất cả sản phẩm          |
| GET    | `/api/v1/products/:id` | ❌            | Lấy chi tiết 1 sản phẩm                |
| POST   | `/api/v1/products`     | ✅            | Tạo sản phẩm mới                       |
| PATCH  | `/api/v1/products/:id` | ✅            | Cập nhật sản phẩm                      |
| DELETE | `/api/v1/products/:id` | ✅            | Xóa sản phẩm                           |

**Authorization Header Format:**

```
Authorization: Bearer <JWT_TOKEN>
```

---

## ✅ Checklist Test Hoàn Chỉnh

- [ ] Backend Rails đang chạy
- [ ] Frontend React đang chạy
- [ ] User test đã được tạo trong database
- [ ] Login thành công và redirect đến /admin
- [ ] Token được lưu trong localStorage
- [ ] Tạo sản phẩm mới thành công (với ảnh)
- [ ] Sửa sản phẩm thành công
- [ ] Xóa sản phẩm thành công (có confirm)
- [ ] Logout thành công và redirect về /login
- [ ] Protected route hoạt động (không thể truy cập /admin khi chưa login)
- [ ] Unauthorized API call trả về 401

---

## 🚀 Next Steps (Tùy Chọn)

1. **Cải thiện UX:**

   - Thay alert() bằng toast notifications
   - Thêm loading spinners cho API calls
   - Thêm form validation phía client

2. **Security:**

   - Token expiration và refresh token
   - HTTPS cho production
   - Rate limiting

3. **Features:**
   - Pagination cho danh sách sản phẩm
   - Search và filter nâng cao
   - User roles (admin, editor, viewer)

---

Chúc bạn test thành công! 🎉
