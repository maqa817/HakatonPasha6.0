package com.freshguard.admin.model;

public enum FoodCategory {
    FRUIT("Meyvə"),
    VEGETABLE("Tərəvəz"),
    MEAT_POULTRY("Ət və toyuq"),
    DAIRY("Süd məhsulları"),
    BREAD_PASTRY("Çörək və pastry"),
    EGGS("Yumurta"),
    CONFECTIONERY("Şirniyyat"),
    BEVERAGES("İçki"),
    OTHER("Digər qida");

    private final String labelAz;

    FoodCategory(String labelAz) {
        this.labelAz = labelAz;
    }

    public String getLabelAz() {
        return labelAz;
    }
}
