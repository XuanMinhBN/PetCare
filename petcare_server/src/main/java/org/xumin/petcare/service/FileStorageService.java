package org.xumin.petcare.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path storageFolder = Paths.get("uploads");

    public FileStorageService() {
        try{
            Files.createDirectories(storageFolder);
        } catch (IOException e) {
            throw new RuntimeException("Cannot create folder", e);
        }
    }

    public String storeFile(MultipartFile file) {
        try {
            // 1. Tạo tên file mới: UUID + Tên gốc (để tránh trùng lặp)
            // Ví dụ: a1b2c3d4-avatar.jpg
            String generatedFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

            // 2. Giải quyết đường dẫn file đích
            Path destinationFilePath = this.storageFolder.resolve(generatedFileName)
                    .normalize().toAbsolutePath();

            // 3. Copy file vào thư mục đích (Lưu đè nếu tồn tại)
            Files.copy(file.getInputStream(), destinationFilePath, StandardCopyOption.REPLACE_EXISTING);

            // 4. Trả về tên file để lưu vào Database
            return generatedFileName;
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi lưu file", e);
        }
    }
}
