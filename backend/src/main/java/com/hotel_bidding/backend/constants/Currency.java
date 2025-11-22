package com.hotel_bidding.backend.constants;

/**
 * Currency codes supported by the platform
 */
public enum Currency {
    LKR("Sri Lankan Rupee", "Rs", 1.0),
    USD("US Dollar", "$", 330.0),         // 1 USD = 330 LKR (approximate)
    EUR("Euro", "€", 360.0),              // 1 EUR = 360 LKR (approximate)
    GBP("British Pound", "£", 420.0),     // 1 GBP = 420 LKR (approximate)
    INR("Indian Rupee", "₹", 4.0),        // 1 INR = 4 LKR (approximate)
    AED("UAE Dirham", "AED", 90.0);       // 1 AED = 90 LKR (approximate)

    private final String displayName;
    private final String symbol;
    private final Double toLkrRate;

    Currency(String displayName, String symbol, Double toLkrRate) {
        this.displayName = displayName;
        this.symbol = symbol;
        this.toLkrRate = toLkrRate;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getSymbol() {
        return symbol;
    }

    public Double getToLkrRate() {
        return toLkrRate;
    }

    /**
     * Convert amount to LKR
     */
    public Double convertToLkr(Double amount) {
        return amount * toLkrRate;
    }
}
