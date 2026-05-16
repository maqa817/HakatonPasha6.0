package com.freshguard.admin.web;

import com.freshguard.admin.model.Store;
import com.freshguard.admin.service.StoreService;
import com.freshguard.admin.web.dto.CreateDepartmentRequest;
import com.freshguard.admin.web.dto.CreateStoreRequest;
import com.freshguard.admin.web.dto.DepartmentResponse;
import com.freshguard.admin.web.dto.StoreResponse;
import com.freshguard.admin.web.dto.UpdateDepartmentRequest;
import com.freshguard.admin.web.dto.UpdateStoreRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/stores")
public class StoreAdminController {

    private final StoreService storeService;

    public StoreAdminController(StoreService storeService) {
        this.storeService = storeService;
    }

    @GetMapping
    public List<StoreResponse> list() {
        return storeService.listStores().stream().map(DtoMapper::toStoreResponse).toList();
    }

    @PostMapping
    public ResponseEntity<StoreResponse> create(@Valid @RequestBody CreateStoreRequest request) {
        Store s = storeService.createStore(request.name(), request.city(), request.regionCode());
        return ResponseEntity.status(HttpStatus.CREATED).body(DtoMapper.toStoreResponse(s));
    }

    @PutMapping("/{storeId}")
    public ResponseEntity<StoreResponse> updateStore(
            @PathVariable String storeId,
            @Valid @RequestBody UpdateStoreRequest request
    ) {
        return storeService.updateStore(storeId, request.name(), request.city(), request.regionCode())
                .map(DtoMapper::toStoreResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{storeId}/departments")
    public ResponseEntity<DepartmentResponse> addDepartment(
            @PathVariable String storeId,
            @Valid @RequestBody CreateDepartmentRequest request
    ) {
        return storeService.addDepartment(storeId, request.name(), request.headName(), request.categories())
                .map(d -> ResponseEntity.status(HttpStatus.CREATED).body(DtoMapper.toDepartmentResponse(d)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/departments/{departmentId}")
    public ResponseEntity<DepartmentResponse> updateDepartment(
            @PathVariable String departmentId,
            @Valid @RequestBody UpdateDepartmentRequest request
    ) {
        return storeService.updateDepartment(departmentId, request.name(), request.headName(), request.categories())
                .map(DtoMapper::toDepartmentResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
