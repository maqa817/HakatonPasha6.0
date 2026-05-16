package com.freshguard.admin.service;

import com.freshguard.admin.model.AppRole;
import com.freshguard.admin.model.UserAccount;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AdminUserDetailsService implements UserDetailsService {

    private final UserService userService;

    public AdminUserDetailsService(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        UserAccount u = userService.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("İstifadəçi tapılmadı: " + userId));
        return org.springframework.security.core.userdetails.User.builder()
                .username(u.getUserId())
                .password(u.getPasswordHash())
                .disabled(!u.isActive())
                .roles(u.getRole().name())
                .build();
    }
}
