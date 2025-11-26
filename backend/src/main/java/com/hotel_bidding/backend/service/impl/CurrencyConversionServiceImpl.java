package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.service.CurrencyConversionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.Map;

/**
 * Currency conversion service implementation
 */
@Service
@Slf4j
public class CurrencyConversionServiceImpl implements CurrencyConversionService {
    
    // Exchange rates to LKR (can be updated via API in future)
    private static final Map<String, Double> EXCHANGE_RATES = Map.of(
        "LKR", 1.0,
        "USD", 330.0,
        "EUR", 360.0,
        "GBP", 420.0,
        "INR", 4.0,
        "AED", 90.0
    );
    
    private static final Map<String, String> CURRENCY_SYMBOLS = Map.of(
        "LKR", "Rs",
        "USD", "$",
        "EUR", "€",
        "GBP", "£",
        "INR", "₹",
        "AED", "AED"
    );
    
    @Override
    public Double convertToLkr(Double amount, String fromCurrency) {
        if (amount == null || amount == 0) {
            return 0.0;
        }
        
        String currency = fromCurrency.toUpperCase();
        
        if ("LKR".equals(currency)) {
            return amount;
        }
        
        Double rate = EXCHANGE_RATES.get(currency);
        if (rate == null) {
            log.warn("Exchange rate not found for currency: {}, using USD rate", currency);
            rate = EXCHANGE_RATES.get("USD");
        }
        
        Double convertedAmount = amount * rate;
        log.info("Converted {} {} to {} LKR", amount, currency, convertedAmount);
        
        return Math.round(convertedAmount * 100.0) / 100.0; // Round to 2 decimal places
    }
    
    @Override
    public Double getExchangeRate(String currency) {
        return EXCHANGE_RATES.getOrDefault(currency.toUpperCase(), 330.0);
    }
    
    @Override
    public String formatAmount(Double amount, String currency) {
        if (amount == null) {
            return "0.00";
        }
        
        DecimalFormat df = new DecimalFormat("#,##0.00");
        String symbol = CURRENCY_SYMBOLS.getOrDefault(currency.toUpperCase(), currency);
        
        return symbol + " " + df.format(amount);
    }
}
