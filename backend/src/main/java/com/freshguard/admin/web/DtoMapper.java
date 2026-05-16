package com.freshguard.admin.web;

import com.freshguard.admin.model.Department;
import com.freshguard.admin.model.FoodCategory;
import com.freshguard.admin.model.Store;
import com.freshguard.admin.model.UserAccount;
import com.freshguard.admin.web.dto.DepartmentResponse;
import com.freshguard.admin.web.dto.UserResponse;

import java.util.List;

public final class DtoMapper {

    private DtoMapper() {
    }

    public static UserResponse toUserResponse(UserAccount u) {
        return new UserResponse(
                u.getUserId(),
                u.getFirstName(),
                u.getLastName(),
                u.getRegion(),
                u.getRole().name(),
                u.isActive()
        );
    }

    public static StoreResponse toStoreResponse(Store s) {
        return new StoreResponse(
                s.getId(),
                s.getName(),
                s.getCity(),
                s.getRegionCode(),
                s.getDepartments().stream().map(DtoMapper::toDepartmentResponse).toList()
        );
    }

    public static DepartmentResponse toDepartmentResponse(Department d) {
        List<String> cats = d.getCategories().stream().map(FoodCategory::name).toList();
        return new DepartmentResponse(d.getId(), d.getStoreId(), d.getName(), d.getHeadName(), cats);
    }
}
