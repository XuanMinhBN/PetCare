package org.xumin.petcare.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

public final class SecurityUtils {
    private SecurityUtils() {}

    public static Optional<String> getCurrentUserLogin() {
        // Lấy SecurityContext từ SecurityContextHolder
        SecurityContext securityContext = SecurityContextHolder.getContext();

        // Lấy đối tượng Authentication từ SecurityContext
        Authentication authentication = securityContext.getAuthentication();

        if (authentication == null) {
            return Optional.empty();
        }

        // Lấy thông tin user principal từ đối tượng Authentication
        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetails) {
            // Nếu principal là một instance của UserDetails (trường hợp phổ biến nhất)
            return Optional.of(((UserDetails) principal).getUsername());
        } else if (principal instanceof String) {
            // Nếu principal chỉ là một chuỗi String
            return Optional.of((String) principal);
        }

        // Trả về empty nếu không xác định được user
        return Optional.empty();
    }
}
