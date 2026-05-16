package com.freshguard.admin.model;

import java.util.ArrayList;
import java.util.List;

public class Store {

    private String id;
    private String name;
    private String city;
    private String regionCode;
    private List<Department> departments = new ArrayList<>();

    public Store() {
    }

    public Store(String id, String name, String city, String regionCode, List<Department> departments) {
        this.id = id;
        this.name = name;
        this.city = city;
        this.regionCode = regionCode;
        this.departments = departments != null ? new ArrayList<>(departments) : new ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getRegionCode() {
        return regionCode;
    }

    public void setRegionCode(String regionCode) {
        this.regionCode = regionCode;
    }

    public List<Department> getDepartments() {
        return departments;
    }

    public void setDepartments(List<Department> departments) {
        this.departments = departments != null ? new ArrayList<>(departments) : new ArrayList<>();
    }
}
