package com.kirana.controller;

import com.kirana.dto.OrderDTO;
import com.kirana.dto.OrderRequest;
import com.kirana.model.Order;
import com.kirana.model.OrderStatus;
import com.kirana.repository.OrderRepository;
import com.kirana.security.UserPrincipal;
import com.kirana.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepository orderRepository;

    // Customer: create order using body
    @PostMapping("/create")
    public ResponseEntity<OrderDTO> createOrder(@AuthenticationPrincipal UserPrincipal principal, @RequestBody OrderRequest orderRequest) {
        if (principal == null) {
            throw new IllegalStateException("Cannot create order without an authenticated user.");
        }
        OrderDTO createdOrder = orderService.createOrderFromCart(principal.getId(), orderRequest.getPaymentMethod());
        return ResponseEntity.ok(createdOrder);
    }

    // Customer: create order using legacy path /orders/checkout/{userId}?paymentMethod=...
    @PostMapping("/checkout/{userId}")
    public ResponseEntity<OrderDTO> checkout(@PathVariable Long userId,
                                          @RequestParam String paymentMethod,
                                          @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null || !principal.getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(orderService.createOrderFromCart(userId, paymentMethod));
    }

    // Customer: list own orders
    @GetMapping("/my")
    public ResponseEntity<List<OrderDTO>> myOrders(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(orderService.getOrdersForUser(principal.getId()));
    }

    // Admin: list all orders
    @GetMapping
    public ResponseEntity<List<OrderDTO>> all() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // Both (admin or owner) can get by id, but keeping it simple: authenticated users only
    @GetMapping("/{id}")
    public ResponseEntity<Order> get(@PathVariable Long id) {
        return orderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Admin: update status
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderDTO> updateStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        OrderDTO updatedOrder = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(updatedOrder);


    }

    // Admin: delete order
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (orderRepository.existsById(id)) {
            orderRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
