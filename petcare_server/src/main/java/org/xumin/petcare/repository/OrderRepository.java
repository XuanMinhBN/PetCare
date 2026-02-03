package org.xumin.petcare.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.xumin.petcare.domain.Order;

import javax.swing.text.html.Option;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {
    Page<Order> findOrdersByUserIdOrderByIdDesc(Long userId, Pageable pageable);
    Optional<Order> findOrderById(Long id);
    Optional<Order> findOrderByQrTxnId(String qrTxnId);
    Page<Order> findAllByOrderByIdDesc(Pageable pageable);
}
