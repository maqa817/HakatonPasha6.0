package com.freshguard.admin.model;

import java.util.EnumSet;
import java.util.Set;

public class Department {

    private String id;
    private String storeId;
    private String name;
    private String headName;
    private Set<FoodCategory> categories = EnumSet.noneOf(FoodCategory.class);

    public Department() {
    }

    public Department(String id, String storeId, String name, String headName, Set<FoodCategory> categories) {
        this.id = id;
        this.storeId = storeId;
        this.name = name;
        this.headName = headName;
        this.categories = categories != null ? EnumSet.copyOf(categories) : EnumSet.noneOf(FoodCategory.class);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStoreId() {
        return storeId;
    }

    public void setStoreId(String storeId) {
        this.storeId = storeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getHeadName() {
        return headName;
    }

    public void setHeadName(String headName) {
        this.headName = headName;
    }

    public Set<FoodCategory> getCategories() {
        return categories;
    }

    public void setCategories(Set<FoodCategory> categories) {
        this.categories = categories != null ? EnumSet.copyOf(categories) : EnumSet.noneOf(FoodCategory.class);
    }
}
