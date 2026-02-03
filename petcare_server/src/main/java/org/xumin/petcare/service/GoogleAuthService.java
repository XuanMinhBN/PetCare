package org.xumin.petcare.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.xumin.petcare.domain.UserAccount;
import org.xumin.petcare.domain.enumeration.AuthProvider;
import org.xumin.petcare.domain.enumeration.Role;
import org.xumin.petcare.domain.enumeration.Tier;
import org.xumin.petcare.repository.UserAccountRepository;
import org.xumin.petcare.security.jwt.TokenProvider;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GoogleAuthService {
    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    private final UserAccountRepository accountRepository;
    private final TokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public GoogleAuthService(UserAccountRepository accountRepository, TokenProvider tokenProvider, AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
    }

    public String loginByGoogle(String googleToken) {
        try {
            // 1. Xác thực Token với Google
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();
            GoogleIdToken idToken = verifier.verify(googleToken);
            if (idToken == null) {
                throw new RuntimeException("Token Google không hợp lệ");
            }
            // 2. Lấy thông tin User từ Google
            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String pictureUrl = (String) payload.get("picture");
            // 3. Kiểm tra xem User đã tồn tại trong DB chưa
            UserAccount user = accountRepository.findOneByEmailIgnoreCase(email).orElse(null);
            if (user == null) {
                // --> CHƯA CÓ: Đăng ký mới
                user = new UserAccount();
                user.setEmail(email);
                user.setName(name);
                user.setAvatar(pictureUrl);
                user.setProvider(AuthProvider.GOOGLE);
                user.setActivated(true);
                // Set mật khẩu ngẫu nhiên vì họ dùng Google
                user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                // Set quyền mặc định
//                user.setAuthorities(Collections.singleton(new Authority("ROLE_USER")));
                user.setRole(Role.ROLE_CUSTOMER);
                user.setTier(Tier.FREE);
                accountRepository.save(user);
            } else {
                // --> ĐÃ CÓ: Cập nhật thông tin nếu cần (ảnh, tên)
                user.setProvider(AuthProvider.GOOGLE);
                user.setAvatar(pictureUrl);
                accountRepository.save(user);
            }
            // 4. Tạo JWT của hệ thống (Access Token)
            List<GrantedAuthority> authorities = Collections.singletonList(
                    new SimpleGrantedAuthority(user.getRole().toString())
            );
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    user.getEmail(),
                    null,
                    authorities
            );
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            return tokenProvider.generateToken(authenticationToken);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi xác thực Google: " + e.getMessage());
        }
    }
}
