package za.co.interfile.enums;

import java.math.BigDecimal;

public enum GrantType {
    SRD("Social Relief of Distress", 350.00),
    CHILD_SUPPORT("Child Support Grant", 480.00),
    DISABILITY("Disability Grant", 1986.00),
    OLD_AGE("Old Age Grant", 1986.00),
    CARE_DEPENDENCY("Care Dependency Grant", 1986.00),
    FOSTER_CARE("Foster Care Grant", 1050.00),
    WAR_VETERANS("War Veterans Grant", 1986.00);

    private final String description;
    private final double defaultAmount;

    GrantType(String description, double defaultAmount) {
        this.description = description;
        this.defaultAmount = defaultAmount;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getDefaultAmount() {
        return BigDecimal.valueOf(defaultAmount);
    }

    public String getDisplayName() {
        return this.description + " (R" + this.defaultAmount + ")";
    }
}