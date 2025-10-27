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
}
