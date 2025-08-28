package com.kirana.service;

import com.kirana.dto.OrderDTO;
import com.kirana.model.Customer;
import com.kirana.model.Order;
import com.kirana.repository.CustomerRepository;
import com.kirana.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public Order placeOrder(Order order) {
        order.setOrderDate(LocalDateTime.now());
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByCustomerId(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    public List<OrderDTO> getAllOrderDTOs() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(order -> {
            OrderDTO dto = new OrderDTO();
            dto.setId(order.getId());
            Customer customer = customerRepository.findById(order.getCustomerId()).orElse(null);
            dto.setCustomerName(customer != null ? customer.getName() : "Unknown");
            dto.setOrderDate(order.getOrderDate());
            dto.setTotalAmount(order.getTotalAmount());
            dto.setProductIds(order.getProductIds());
            return dto;
        }).toList();
    }
}
