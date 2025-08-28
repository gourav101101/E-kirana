package com.kirana.service;

import com.kirana.dto.LowStockDTO;
import com.kirana.dto.SalesSummaryDTO;
import com.kirana.dto.TopProductDTO;
import com.kirana.model.Order;
import com.kirana.model.OrderStatus;
import com.kirana.model.Product;
import com.kirana.repository.OrderItemRepository;
import com.kirana.repository.OrderRepository;
import com.kirana.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private ProductRepository productRepository;

    private static final List<OrderStatus> REVENUE_STATUSES =
            Arrays.asList(OrderStatus.CONFIRMED, OrderStatus.SHIPPED, OrderStatus.DELIVERED);

    public SalesSummaryDTO getSalesSummary(LocalDateTime from, LocalDateTime to) {
        LocalDateTime toUse = (to == null) ? LocalDateTime.now() : to;
        LocalDateTime fromUse = (from == null) ? toUse.minusDays(30) : from;

        List<Order> orders = orderRepository.findInDateRangeWithStatuses(fromUse, toUse, REVENUE_STATUSES);

        long totalOrders = orders.size();
        double totalRevenue = orders.stream().mapToDouble(Order::getTotalPrice).sum();

        return new SalesSummaryDTO(totalOrders, totalRevenue, fromUse, toUse);
    }

    public List<TopProductDTO> getTopProducts(int limit) {
        List<Object[]> rows = orderItemRepository.topProducts(REVENUE_STATUSES, PageRequest.of(0, Math.max(1, limit)));
        return rows.stream()
                .map(r -> new TopProductDTO(
                        (Long) r[0],
                        (String) r[1],
                        ((Number) r[2]).longValue(),
                        ((Number) r[3]).doubleValue()
                ))
                .collect(Collectors.toList());
    }

    public List<LowStockDTO> getLowStock(int threshold) {
        // CORRECTED: Changed to use the findByStockLessThan method, which exists in the repository.
        List<Product> low = productRepository.findByStockLessThan(threshold);
        return low.stream()
                .map(p -> new LowStockDTO(p.getId(), p.getName(), p.getStock()))
                .collect(Collectors.toList());
    }
}
