package com.hotel_bidding.backend.service;

/**
 * Currency conversion service
 */
public interface CurrencyConversionService {
    
    /**
     * Convert amount from any currency to LKR
     */
    Double convertToLkr(Double amount, String fromCurrency);
    
    /**
     * Get current exchange rate for a currency to LKR
     */
    Double getExchangeRate(String currency);
    
    /**
     * Format amount with currency symbol
     */
    String formatAmount(Double amount, String currency);
}
