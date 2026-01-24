package org.xumin.petcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.xumin.petcare.domain.UserAccount;

import java.util.Optional;

@Repository
public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    Optional<UserAccount> findOneByEmailIgnoreCase(String email);
    Optional<UserAccount> findOneByResetKey(String resetKey);
}
