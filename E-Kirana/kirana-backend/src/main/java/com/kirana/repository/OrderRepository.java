package com.kirana.repository;

import com.kirana.model.Order;
import com.kirana.model.OrderStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    List<Order> findByUserEmail(String email);

    @Query("SELECT o FROM Order o WHERE o.orderDate BETWEEN :from AND :to AND o.status IN :statuses")
    List<Order> findInDateRangeWithStatuses(@Param("from") LocalDateTime from,
                                            @Param("to") LocalDateTime to,
                                            @Param("statuses") Collection<OrderStatus> statuses);

    @Override
    @EntityGraph(attributePaths = {"user"})
    List<Order> findAll();
}
