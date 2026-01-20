# --- GIAI ĐOẠN 1: Build Frontend (ReactJS) ---
# Sử dụng đúng Node v20 như máy của bạn
FROM node:20-alpine as frontend-builder

WORKDIR /app/frontend

# Copy file package để cài thư viện trước (tận dụng cache)
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# Copy toàn bộ code React và Build
COPY frontend/ ./
RUN npm run build


# --- GIAI ĐOẠN 2: Build Backend (Spring Boot) ---
# Sử dụng Maven và Java 17 (Sửa thành 21 nếu project bạn dùng Java 21)
FROM maven:3.9.6-eclipse-temurin-17 as backend-builder

WORKDIR /app/backend

# Copy file cấu hình Maven
COPY backend/pom.xml ./
# Tải thư viện Java về trước để cache (giúp build lần sau nhanh hơn)
RUN mvn dependency:go-offline

# Copy code Java
COPY backend/src ./src

# QUAN TRỌNG: Copy bản build của React vào thư mục static của Spring Boot
# Docker sẽ lấy thư mục 'build' (hoặc 'dist') từ Giai đoạn 1 ném vào đây
COPY --from=frontend-builder /app/frontend/build ./src/main/resources/static

# Build ra file .jar (bỏ qua bước chạy test unit để tiết kiệm thời gian)
RUN mvn clean package -DskipTests


# --- GIAI ĐOẠN 3: Chạy ứng dụng (Runtime) ---
# Dùng bản Java siêu nhẹ chỉ để chạy (không chứa công cụ build)
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Lấy file .jar đã build xong ở Giai đoạn 2
COPY --from=backend-builder /app/backend/target/*.jar app.jar

# Mở port 8080 (Port mặc định của Spring Boot)
EXPOSE 8080

# Lệnh chạy server khi khởi động container
ENTRYPOINT ["java", "-jar", "app.jar"]