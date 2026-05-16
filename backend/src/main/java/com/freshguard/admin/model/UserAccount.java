package com.freshguard.admin.model;

import java.util.Objects;

public class UserAccount {

    private long internalId;
    private String userId;
    private String firstName;
    private String lastName;
    private String region;
    private AppRole role;
    private String passwordHash;
    private boolean active;

    public UserAccount() {
    }

    public UserAccount(long internalId, String userId, String firstName, String lastName, String region,
                       AppRole role, String passwordHash, boolean active) {
        this.internalId = internalId;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.region = region;
        this.role = role;
        this.passwordHash = passwordHash;
        this.active = active;
    }

    public long getInternalId() {
        return internalId;
    }

    public void setInternalId(long internalId) {
        this.internalId = internalId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public AppRole getRole() {
        return role;
    }

    public void setRole(AppRole role) {
        this.role = role;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        UserAccount that = (UserAccount) o;
        return Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId);
    }
}
