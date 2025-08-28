package com.kirana.repository;

import com.kirana.model.OrderItem;
import com.kirana.model.OrderStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("SELECT oi.product.id, oi.product.name, SUM(oi.quantity) AS qty, SUM(oi.quantity * oi.price) AS revenue " +
            "FROM OrderItem oi JOIN oi.order o " +
            "WHERE o.status IN :statuses " +
            "GROUP BY oi.product.id, oi.product.name " +
            "ORDER BY qty DESC")
    List<Object[]> topProducts(@Param("statuses") Collection<OrderStatus> statuses, Pageable pageable);
}
