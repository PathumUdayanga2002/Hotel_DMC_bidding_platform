package com.hotel_bidding.backend.constants;

/**
 * Subscription plan types with pricing
 */
public enum SubscriptionPlan {
    MONTHLY(200.00, 30),    // $200 per month
    YEARLY(2000.00, 365);   // $2000 per year

    private final double price;
    private final int durationDays;

    SubscriptionPlan(double price, int durationDays) {
        this.price = price;
        this.durationDays = durationDays;
    }

    public double getPrice() {
        return price;
    }

    public int getDurationDays() {
        return durationDays;
    }
}
