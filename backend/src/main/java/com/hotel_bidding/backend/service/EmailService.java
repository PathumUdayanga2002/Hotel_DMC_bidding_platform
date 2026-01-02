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
    
    // ============ BID INQUIRY NOTIFICATION EMAILS ============
    
    /**
     * Send new inquiry notification to hotels
     */
    void sendNewInquiryNotificationToHotel(String hotelEmail, String hotelName, String inquiryTitle,
                                          String dmcCompanyName, String destination, String checkIn,
                                          String checkOut, int rooms, String deadline);
    
    /**
     * Send new bid notification to DMC
     */
    void sendNewBidNotificationToDmc(String dmcCompanyName, String hotelName, String inquiryTitle,
                                    Double bidPrice, String currency);
    
    /**
     * Send bid acceptance notification to hotel
     */
    void sendBidAcceptanceNotificationToHotel(String hotelEmail, String hotelName, String inquiryTitle,
                                             String dmcCompanyName, Double totalPrice, String currency);
    
    /**
     * Send bid rejection notification to hotel
     */
    void sendBidRejectionNotificationToHotel(String hotelEmail, String hotelName, String inquiryTitle,
                                            String dmcCompanyName, String rejectionReason);

    /**
     * Send password reset email with secure link
     * @param userEmail User email address
     * @param recipientName Name to personalize the email
     * @param resetLink One-time password reset link
     */
    void sendPasswordResetEmail(String userEmail, String recipientName, String resetLink);
}
