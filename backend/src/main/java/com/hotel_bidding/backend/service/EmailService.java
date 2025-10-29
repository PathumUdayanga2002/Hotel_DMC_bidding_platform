package com.hotel_bidding.backend.service;

public interface EmailService {
    
    /**
     * Send email notification to admin about new DMC registration
     * @param dmcCompanyName Company name of the DMC
     * @param dmcEmail DMC email address
     */
    void sendNewDMCRegistrationNotification(String dmcCompanyName, String dmcEmail);
    
    /**
     * Send approval email to DMC
     * @param dmcEmail DMC email address
     * @param companyName Company name
     */
    void sendDMCApprovalEmail(String dmcEmail, String companyName);
    
    /**
     * Send rejection email to DMC
     * @param dmcEmail DMC email address
     * @param companyName Company name
     * @param reason Rejection reason
     */
    void sendDMCRejectionEmail(String dmcEmail, String companyName, String reason);
    
    /**
     * Send email notification to admin about new Hotel registration
     * @param hotelName Name of the hotel
     * @param hotelEmail Hotel contact email address
     */
    void sendNewHotelRegistrationNotification(String hotelName, String hotelEmail);
    
    /**
     * Send approval email to Hotel
     * @param hotelEmail Hotel contact email address
     * @param hotelName Hotel name
     */
    void sendHotelApprovalEmail(String hotelEmail, String hotelName);
    
    /**
     * Send rejection email to Hotel
     * @param hotelEmail Hotel contact email address
     * @param hotelName Hotel name
     * @param reason Rejection reason
     */
    void sendHotelRejectionEmail(String hotelEmail, String hotelName, String reason);
}
