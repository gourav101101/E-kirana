package com.kirana.controller;

import com.kirana.dto.LowStockDTO;
import com.kirana.dto.SalesSummaryDTO;
import com.kirana.dto.TopProductDTO;
import com.kirana.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/admin/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    // ✅ Sales summary between dates (defaults: last 30 days)
    @GetMapping("/sales")
    public ResponseEntity<SalesSummaryDTO> getSalesSummary(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to
    ) {
        return ResponseEntity.ok(reportService.getSalesSummary(from, to));
    }

    // ✅ Top selling products (by quantity) — default limit 10
    @GetMapping("/top-products")
    public ResponseEntity<List<TopProductDTO>> getTopProducts(
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(reportService.getTopProducts(limit));
    }

    // ✅ Low stock alert (<= threshold) — default threshold 5
    @GetMapping("/low-stock")
    public ResponseEntity<List<LowStockDTO>> getLowStock(
            @RequestParam(defaultValue = "5") int threshold
    ) {
        return ResponseEntity.ok(reportService.getLowStock(threshold));
    }
}
