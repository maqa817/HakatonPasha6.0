package com.freshguard.admin.service;

import com.freshguard.admin.model.Department;
import com.freshguard.admin.model.FoodCategory;
import com.freshguard.admin.model.Store;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class StoreService {

    private final Map<String, Store> stores = new ConcurrentHashMap<>();

    @PostConstruct
    public void seed() {
        if (!stores.isEmpty()) {
            return;
        }
        String s1 = "store-bravo-baku-1";
        String s2 = "store-bravo-sumgait-1";
        Store baku = new Store(s1, "Bravo Nərimanov", "Bakı", "BAKI", new ArrayList<>());
        baku.getDepartments().add(new Department(
                "dept-" + UUID.randomUUID(),
                s1,
                "Meyvə şöbəsi",
                "Elçin Qasımov",
                EnumSet.of(FoodCategory.FRUIT)
        ));
        baku.getDepartments().add(new Department(
                "dept-" + UUID.randomUUID(),
                s1,
                "Tərəvəz şöbəsi",
                "Aysel Əliyeva",
                EnumSet.of(FoodCategory.VEGETABLE)
        ));
        baku.getDepartments().add(new Department(
                "dept-" + UUID.randomUUID(),
                s1,
                "Süd məhsulları",
                "Rəşad Həsənov",
                EnumSet.of(FoodCategory.DAIRY, FoodCategory.EGGS)
        ));
        stores.put(s1, baku);

        Store sumgait = new Store(s2, "Bravo Sumqayıt Mərkəz", "Sumqayıt", "SUM", new ArrayList<>());
        sumgait.getDepartments().add(new Department(
                "dept-" + UUID.randomUUID(),
                s2,
                "Ət və toyuq",
                "Nicat İbrahimov",
                EnumSet.of(FoodCategory.MEAT_POULTRY)
        ));
        sumgait.getDepartments().add(new Department(
                "dept-" + UUID.randomUUID(),
                s2,
                "Çörək və şirniyyat",
                "Günay Kərimli",
                EnumSet.of(FoodCategory.BREAD_PASTRY, FoodCategory.CONFECTIONERY)
        ));
        stores.put(s2, sumgait);
    }

    public List<Store> listStores() {
        List<Store> list = new ArrayList<>(stores.values());
        list.sort((a, b) -> a.getName().compareToIgnoreCase(b.getName()));
        return list;
    }

    public Optional<Store> find(String id) {
        return Optional.ofNullable(stores.get(id));
    }

    public Store createStore(String name, String city, String regionCode) {
        String id = "store-" + UUID.randomUUID().toString().substring(0, 8);
        Store s = new Store(id, name, city, regionCode, new ArrayList<>());
        stores.put(id, s);
        return s;
    }

    public Optional<Store> updateStore(String id, String name, String city, String regionCode) {
        Store s = stores.get(id);
        if (s == null) {
            return Optional.empty();
        }
        s.setName(name);
        s.setCity(city);
        s.setRegionCode(regionCode);
        return Optional.of(s);
    }

    public Optional<Department> addDepartment(String storeId, String name, String headName,
                                              java.util.Set<FoodCategory> categories) {
        Store s = stores.get(storeId);
        if (s == null) {
            return Optional.empty();
        }
        Department d = new Department(
                "dept-" + UUID.randomUUID().toString().substring(0, 8),
                storeId,
                name,
                headName,
                categories == null ? EnumSet.noneOf(FoodCategory.class) : EnumSet.copyOf(categories)
        );
        s.getDepartments().add(d);
        return Optional.of(d);
    }

    public Optional<Department> updateDepartment(String departmentId, String name, String headName,
                                                   java.util.Set<FoodCategory> categories) {
        for (Store s : stores.values()) {
            for (Department d : s.getDepartments()) {
                if (d.getId().equals(departmentId)) {
                    d.setName(name);
                    d.setHeadName(headName);
                    d.setCategories(categories == null ? EnumSet.noneOf(FoodCategory.class) : EnumSet.copyOf(categories));
                    return Optional.of(d);
                }
            }
        }
        return Optional.empty();
    }
}
