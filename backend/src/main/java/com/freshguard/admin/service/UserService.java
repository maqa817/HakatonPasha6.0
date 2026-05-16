package com.freshguard.admin.service;

import com.freshguard.admin.model.AppRole;
import com.freshguard.admin.model.UserAccount;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Year;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final Map<String, UserAccount> byUserId = new ConcurrentHashMap<>();
    private final AtomicLong internalSeq = new AtomicLong(1);
    private final AtomicLong rmSeq = new AtomicLong(0);

    public UserService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void seedSuperAdmin() {
        if (!byUserId.isEmpty()) {
            return;
        }
        UserAccount admin = new UserAccount(
                internalSeq.getAndIncrement(),
                "SA-ADMIN",
                "Super",
                "Admin",
                "Bütün regionlar",
                AppRole.SUPER_ADMIN,
                passwordEncoder.encode("SuperAdmin!2026"),
                true
        );
        byUserId.put(admin.getUserId(), admin);

        UserAccount rm1 = new UserAccount(
                internalSeq.getAndIncrement(),
                nextRegionalManagerId(),
                "Leyla",
                "Məmmədova",
                "Bakı",
                AppRole.REGIONAL_MANAGER,
                passwordEncoder.encode("DemoRm!2026"),
                true
        );
        byUserId.put(rm1.getUserId(), rm1);
    }

    public String nextRegionalManagerId() {
        long n = rmSeq.incrementAndGet();
        return String.format("RM-%d-%05d", Year.now().getValue(), n);
    }

    public Optional<UserAccount> findByUserId(String userId) {
        return Optional.ofNullable(byUserId.get(userId));
    }

    public List<UserAccount> listRegionalManagers(boolean activeOnly) {
        List<UserAccount> list = new ArrayList<>();
        for (UserAccount u : byUserId.values()) {
            if (u.getRole() != AppRole.REGIONAL_MANAGER) {
                continue;
            }
            if (activeOnly && !u.isActive()) {
                continue;
            }
            list.add(u);
        }
        list.sort(Comparator.comparing(UserAccount::getUserId));
        return list;
    }

    public UserAccount createRegionalManager(String firstName, String lastName, String region, String rawPassword) {
        String id = nextRegionalManagerId();
        UserAccount u = new UserAccount(
                internalSeq.getAndIncrement(),
                id,
                firstName,
                lastName,
                region,
                AppRole.REGIONAL_MANAGER,
                passwordEncoder.encode(rawPassword),
                true
        );
        byUserId.put(id, u);
        return u;
    }

    public Optional<UserAccount> updateRegionalManager(String userId, String firstName, String lastName,
                                                       String region, String newPasswordOptional) {
        UserAccount u = byUserId.get(userId);
        if (u == null || u.getRole() != AppRole.REGIONAL_MANAGER) {
            return Optional.empty();
        }
        u.setFirstName(firstName);
        u.setLastName(lastName);
        u.setRegion(region);
        if (newPasswordOptional != null && !newPasswordOptional.isBlank()) {
            if (newPasswordOptional.length() < 8 || newPasswordOptional.length() > 72) {
                throw new IllegalArgumentException("Şifrə 8-72 simvol aralığında olmalıdır");
            }
            u.setPasswordHash(passwordEncoder.encode(newPasswordOptional));
        }
        return Optional.of(u);
    }

    public boolean deactivate(String userId) {
        UserAccount u = byUserId.get(userId);
        if (u == null || u.getRole() != AppRole.REGIONAL_MANAGER) {
            return false;
        }
        u.setActive(false);
        return true;
    }
}
