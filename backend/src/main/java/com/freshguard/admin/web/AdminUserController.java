package com.freshguard.admin.web;

import com.freshguard.admin.model.UserAccount;
import com.freshguard.admin.service.UserService;
import com.freshguard.admin.web.dto.CreateRegionalManagerRequest;
import com.freshguard.admin.web.dto.UpdateRegionalManagerRequest;
import com.freshguard.admin.web.dto.UserResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserResponse> list(@RequestParam(defaultValue = "false") boolean activeOnly) {
        return userService.listRegionalManagers(activeOnly).stream().map(DtoMapper::toUserResponse).toList();
    }

    @PostMapping
    public ResponseEntity<UserResponse> create(@Valid @RequestBody CreateRegionalManagerRequest request) {
        UserAccount created = userService.createRegionalManager(
                request.firstName(),
                request.lastName(),
                request.region(),
                request.password()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(DtoMapper.toUserResponse(created));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserResponse> update(
            @PathVariable String userId,
            @Valid @RequestBody UpdateRegionalManagerRequest request
    ) {
        return userService.updateRegionalManager(
                        userId,
                        request.firstName(),
                        request.lastName(),
                        request.region(),
                        request.newPassword()
                )
                .map(DtoMapper::toUserResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{userId}/deactivate")
    public ResponseEntity<Void> deactivate(@PathVariable String userId) {
        if (userService.deactivate(userId)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
