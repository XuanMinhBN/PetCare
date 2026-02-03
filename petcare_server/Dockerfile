# --- GIAI ĐOẠN 1: Build Java (Backend Only) ---
# Dùng Maven và Java 17 (hoặc 21 tùy code của bạn)
FROM maven:3.9.6-eclipse-temurin-17 as builder

WORKDIR /app

# Copy file cấu hình và tải thư viện
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy toàn bộ code nguồn
COPY src ./src

# Build ra file .jar (Bỏ qua test cho nhanh)
RUN mvn clean package -DskipTests -U

# --- GIAI ĐOẠN 2: Run (Chạy ứng dụng) ---
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Lấy file .jar từ giai đoạn 1
COPY --from=builder /app/target/*.jar app.jar

# Mở cổng 8080
EXPOSE 8080

# Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]