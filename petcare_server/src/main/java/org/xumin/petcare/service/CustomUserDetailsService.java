package org.xumin.petcare.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.xumin.petcare.domain.UserAccount;
import org.xumin.petcare.repository.UserAccountRepository;

import java.util.List;

@Service("userDetailsService")
public class CustomUserDetailsService implements UserDetailsService {
    private final UserAccountRepository accountRepository;

    @Autowired
    public CustomUserDetailsService(UserAccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Tìm UserAccount trong database bằng email
        return accountRepository.findOneByEmailIgnoreCase(email)
                // 2. Nếu tìm thấy, chuyển đổi nó thành đối tượng UserDetails mà Spring Security hiểu
                .map(user -> createSpringSecurityUser(user))
                // 3. Nếu không tìm thấy, ném ra exception
                .orElseThrow(() -> new UsernameNotFoundException("User with email " + email + " was not found in the database"));
    }

    private User createSpringSecurityUser(UserAccount user) {
        // Lấy ra danh sách quyền (roles) của người dùng từ entity
        List<GrantedAuthority> grantedAuthorities = List.of(new SimpleGrantedAuthority(user.getRole().name()));

        // Trả về một đối tượng UserDetails chứa email, mật khẩu đã mã hóa, và danh sách quyền
        return new User(user.getEmail(),
                user.getPassword(),
                grantedAuthorities);
    }
}
