package com.ifpb.agendapet;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/health")
public class HealthController {

    private final DataSource dataSource;

    public HealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {

        Map<String, Object> response = new HashMap<>();

        try (Connection conn = dataSource.getConnection()) {
            if (conn.isValid(2)) {
                response.put("status", "UP");
            } else {
                response.put("status", "DOWN");
            }
        } catch (Exception e) {
            response.put("status", "DOWN");
        }

        return ResponseEntity.ok(response);
    }
}
