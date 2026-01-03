package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${admin.email}")
    private String adminEmail;

    @Async
    @Override
    public void sendNewDMCRegistrationNotification(String dmcCompanyName, String dmcEmail) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(adminEmail);
            message.setSubject("New DMC Registration Request - " + dmcCompanyName);
            message.setText(
                "Dear Admin,\n\n" +
                "A new DMC has registered on the Hotel Bidding Platform:\n\n" +
                "Company Name: " + dmcCompanyName + "\n" +
                "Email: " + dmcEmail + "\n\n" +
                "Please review and approve/reject the registration.\n\n" +
                "Login to the admin panel to review the details.\n\n" +
                "Best regards,\n" +
                "Hotel Bidding Platform Team"
            );

            mailSender.send(message);
            log.info("Admin notification sent for new DMC registration: {}", dmcCompanyName);

        } catch (Exception e) {
            log.error("Failed to send admin notification email: {}", e.getMessage());
        }
    }

    @Async
    @Override
    public void sendDMCApprovalEmail(String dmcEmail, String companyName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(dmcEmail);
            message.setSubject("DMC Registration Approved - " + companyName);
            message.setText(
                "Dear " + companyName + ",\n\n" +
                "Congratulations! Your DMC registration has been approved.\n\n" +
                "You can now access all features of the Hotel Bidding Platform:\n" +
                "- Browse hotel inquiries\n" +
                "- Submit bids\n" +
                "- Manage your profile\n" +
                "- Communicate with hotels\n\n" +
                "Login to your dashboard to get started.\n\n" +
                "Best regards,\n" +
                "Hotel Bidding Platform Team"
            );

            mailSender.send(message);
            log.info("Approval email sent to DMC: {}", companyName);

        } catch (Exception e) {
            log.error("Failed to send approval email: {}", e.getMessage());
        }
    }

    @Async
    @Override
    public void sendDMCRejectionEmail(String dmcEmail, String companyName, String reason) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(dmcEmail);
            message.setSubject("DMC Registration Update - " + companyName);
            message.setText(
                "Dear " + companyName + ",\n\n" +
                "Thank you for your interest in the Hotel Bidding Platform.\n\n" +
                "Unfortunately, your DMC registration has not been approved at this time.\n\n" +
                "Reason: " + reason + "\n\n" +
                "You can update your profile and resubmit your registration for review.\n\n" +
                "If you have any questions, please contact our support team.\n\n" +
                "Best regards,\n" +
                "Hotel Bidding Platform Team"
            );

            mailSender.send(message);
            log.info("Rejection email sent to DMC: {}", companyName);

        } catch (Exception e) {
            log.error("Failed to send rejection email: {}", e.getMessage());
        }
    }
    
    @Async
    @Override
    public void sendNewHotelRegistrationNotification(String hotelName, String hotelEmail) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(adminEmail);
            message.setSubject("New Hotel Registration Request - " + hotelName);
            message.setText(
                "Dear Admin,\n\n" +
                "A new Hotel has registered on the Hotel Bidding Platform:\n\n" +
                "Hotel Name: " + hotelName + "\n" +
                "Email: " + hotelEmail + "\n\n" +
                "Please review and approve/reject the registration.\n\n" +
                "Login to the admin panel to review the details.\n\n" +
                "Best regards,\n" +
                "Hotel Bidding Platform Team"
            );

            mailSender.send(message);
            log.info("Admin notification sent for new Hotel registration: {}", hotelName);

        } catch (Exception e) {
            log.error("Failed to send admin notification email for hotel: {}", e.getMessage());
        }
    }

    @Async
    @Override
    public void sendHotelApprovalEmail(String hotelEmail, String hotelName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(hotelEmail);
            message.setSubject("Hotel Registration Approved - " + hotelName);
            message.setText(
                "Dear " + hotelName + ",\n\n" +
                "Congratulations! Your hotel registration has been approved.\n\n" +
                "You can now access all features of the Hotel Bidding Platform:\n" +
                "- Receive inquiries from DMCs\n" +
                "- Respond to bids\n" +
                "- Manage your hotel profile\n" +
                "- Track bookings and payments\n\n" +
                "Login to your dashboard to get started.\n\n" +
                "Best regards,\n" +
                "Hotel Bidding Platform Team"
            );

            mailSender.send(message);
            log.info("Approval email sent to Hotel: {}", hotelName);

        } catch (Exception e) {
            log.error("Failed to send approval email to hotel: {}", e.getMessage());
        }
    }

    @Async
    @Override
    public void sendHotelRejectionEmail(String hotelEmail, String hotelName, String reason) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(hotelEmail);
            message.setSubject("Hotel Registration Update - " + hotelName);
            message.setText(
                "Dear " + hotelName + ",\n\n" +
                "Thank you for your interest in the Hotel Bidding Platform.\n\n" +
                "Unfortunately, your hotel registration has not been approved at this time.\n\n" +
                "Reason: " + reason + "\n\n" +
                "You can update your profile and resubmit your registration for review.\n\n" +
                "If you have any questions, please contact our support team.\n\n" +
                "Best regards,\n" +
                "Hotel Bidding Platform Team"
            );

            mailSender.send(message);
            log.info("Rejection email sent to Hotel: {}", hotelName);

        } catch (Exception e) {
            log.error("Failed to send rejection email to hotel: {}", e.getMessage());
        }
    }
    
    // ============ BID INQUIRY NOTIFICATION EMAILS ============
    
    @Async
    @Override
    public void sendNewInquiryNotificationToHotel(String hotelEmail, String hotelName, String inquiryTitle,
                                                  String dmcCompanyName, String destination, String checkIn,
                                                  String checkOut, int rooms, String deadline) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(hotelEmail);
            message.setSubject("New Bid Inquiry Available - " + inquiryTitle);
            message.setText(
                "Dear " + hotelName + ",\n\n" +
                "A new bid inquiry is available that matches your hotel location:\n\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                "Inquiry: " + inquiryTitle + "\n" +
                "From: " + dmcCompanyName + "\n" +
                "Destination: " + destination + "\n" +
                "Check-in: " + checkIn + "\n" +
                "Check-out: " + checkOut + "\n" +
                "Rooms Needed: " + rooms + "\n" +
                "Deadline: " + deadline + "\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Don't miss this opportunity! Submit your competitive bid before the deadline.\n\n" +
                "Login to your dashboard to view full details and submit your bid:\n" +
                "→ View Inquiry Details\n" +
                "→ Submit Your Bid\n\n" +
                "⏰ Remember: Bids close in 48 hours!\n\n" +
                "Best regards,\n" +
                "Hotel Bidding Platform Team"
            );

            mailSender.send(message);
            log.info("New inquiry notification sent to Hotel: {}", hotelName);

        } catch (Exception e) {
            log.error("Failed to send new inquiry notification: {}", e.getMessage());
        }
    }
    
    @Async
    @Override
    public void sendNewBidNotificationToDmc(String dmcCompanyName, String hotelName, String inquiryTitle,
                                           Double bidPrice, String currency) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(adminEmail); // DMC email should be passed here
            message.setSubject("New Bid Received - " + inquiryTitle);
            message.setText(
                "Dear " + dmcCompanyName + ",\n\n" +
                "Good news! You've received a new bid on your inquiry:\n\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                "Inquiry: " + inquiryTitle + "\n" +
                "Hotel: " + hotelName + "\n" +
                "Bid Price: " + currency + " " + String.format("%.2f", bidPrice) + " per room per night\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Login to your dashboard to:\n" +
                "→ View full bid details\n" +
                "→ Compare with other bids\n" +
                "→ Accept, reject, or negotiate\n\n" +
                "Best regards,\n" +
                "Hotel Bidding Platform Team"
            );

            mailSender.send(message);
            log.info("New bid notification sent to DMC: {}", dmcCompanyName);

        } catch (Exception e) {
            log.error("Failed to send new bid notification: {}", e.getMessage());
        }
    }
    
    @Async
    @Override
    public void sendBidAcceptanceNotificationToHotel(String hotelEmail, String hotelName, String inquiryTitle,
                                                     String dmcCompanyName, Double totalPrice, String currency) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(hotelEmail);
            message.setSubject("🎉 Bid Accepted - " + inquiryTitle);
            message.setText(
                "Dear " + hotelName + ",\n\n" +
                "Congratulations! Your bid has been ACCEPTED! 🎉\n\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                "Inquiry: " + inquiryTitle + "\n" +
                "DMC: " + dmcCompanyName + "\n" +
                "Total Booking Value: " + currency + " " + String.format("%.2f", totalPrice) + "\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Next Steps:\n" +
                "1. The DMC will contact you shortly with booking confirmation\n" +
                "2. Review and confirm all booking details\n" +
                "3. Prepare for the guest arrival\n\n" +
                "Login to your dashboard to view complete booking details.\n\n" +
                "Thank you for using Hotel Bidding Platform!\n\n" +
                "Best regards,\n" +
                "Hotel Bidding Platform Team"
            );

            mailSender.send(message);
            log.info("Bid acceptance notification sent to Hotel: {}", hotelName);

        } catch (Exception e) {
            log.error("Failed to send bid acceptance notification: {}", e.getMessage());
        }
    }
    
    @Async
    @Override
    public void sendBidRejectionNotificationToHotel(String hotelEmail, String hotelName, String inquiryTitle,
                                                    String dmcCompanyName, String rejectionReason) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(hotelEmail);
            message.setSubject("Bid Update - " + inquiryTitle);
            message.setText(
                "Dear " + hotelName + ",\n\n" +
                "Thank you for submitting your bid for:\n\n" +
                "Inquiry: " + inquiryTitle + "\n" +
                "DMC: " + dmcCompanyName + "\n\n" +
                "Unfortunately, your bid was not selected for this inquiry.\n\n" +
                (rejectionReason != null && !rejectionReason.isEmpty() ? 
                "Feedback: " + rejectionReason + "\n\n" : "") +
                "Don't be discouraged! There are many more opportunities:\n" +
                "→ Check for new inquiries daily\n" +
                "→ Adjust your pricing strategy\n" +
                "→ Highlight your unique selling points\n\n" +
                "Keep bidding and good luck with future opportunities!\n\n" +
                "Best regards,\n" +
                "Hotel Bidding Platform Team"
            );

            mailSender.send(message);
            log.info("Bid rejection notification sent to Hotel: {}", hotelName);

        } catch (Exception e) {
            log.error("Failed to send bid rejection notification: {}", e.getMessage());
        }
    }
    // ============ PASSWORD RESET EMAIL ============
    
    @Async
    @Override
    public void sendPasswordResetEmail(String userEmail, String recipientName, String resetLink) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(userEmail);
            message.setSubject("Password Reset Request");
            message.setText(
                "Hi " + (recipientName != null ? recipientName : "there") + ",\n\n" +
                "We received a request to reset your password for the Hotel Bidding Platform.\n\n" +
                "If you made this request, click the link below to set a new password:\n\n" +
                resetLink + "\n\n" +
                "This link will expire soon. If you did not request a password reset, you can safely ignore this email.\n\n" +
                "Thank you,\n" +
                "Hotel Bidding Platform Team"
            );

            mailSender.send(message);
            log.info("Password reset email sent to: {}", userEmail);

        } catch (Exception e) {
            log.error("Failed to send password reset email: {}", e.getMessage());
        }
    }

    // ============ SUBSCRIPTION NOTIFICATION EMAILS ============

    @Async
    @Override
    public void sendTrialExpiringEmail(String email, String name, long daysRemaining) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(email);
            message.setSubject("Your Free Trial is Expiring Soon - " + daysRemaining + " Days Left!");
            message.setText(
                "Dear " + name + ",\n\n" +
                "Your 30-day free trial on the Hotel Bidding Platform is expiring soon!\n\n" +
                "Days Remaining: " + daysRemaining + "\n\n" +
                "📦 MONTHLY PLAN: $200/month\n" +
                "🎯 YEARLY PLAN: $2000/year (Save $400!)\n\n" +
                "Login to your dashboard and subscribe to continue.\n\n" +
                "Best regards,\n" +
                "Hotel Bidding Platform Team"
            );

            mailSender.send(message);
            log.info("Trial expiring email sent to: {}", email);

        } catch (Exception e) {
            log.error("Failed to send trial expiring email: {}", e.getMessage());
        }
    }

    @Async
    @Override
    public void sendTrialExpiredEmail(String email, String name) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(email);
            message.setSubject("Your Free Trial Has Expired - Subscribe to Continue");
            message.setText(
                "Dear " + name + ",\n\n" +
                "Your free trial has expired.\n\n" +
                "Subscribe now to regain full access.\n\n" +
                "Best regards,\n" +
                "Hotel Bidding Platform Team"
            );

            mailSender.send(message);
            log.info("Trial expired email sent to: {}", email);

        } catch (Exception e) {
            log.error("Failed to send trial expired email: {}", e.getMessage());
        }
    }

    @Async
    @Override
    public void sendSubscriptionExpiredEmail(String email, String name) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(email);
            message.setSubject("Your Subscription Has Expired - Renew Now");
            message.setText(
                "Dear " + name + ",\n\n" +
                "Your subscription has expired.\n\n" +
                "Renew now to continue using the platform.\n\n" +
                "Best regards,\n" +
                "Hotel Bidding Platform Team"
            );

            mailSender.send(message);
            log.info("Subscription expired email sent to: {}", email);

        } catch (Exception e) {
            log.error("Failed to send subscription expired email: {}", e.getMessage());
        }
    }

    @Async
    @Override
    public void sendPaymentSuccessEmail(String email, String name, String plan, double amount, String orderId) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(email);
            message.setSubject("Payment Successful - Subscription Activated!");
            message.setText(
                "Dear " + name + ",\n\n" +
                "Payment successful!\n\n" +
                "Plan: " + plan + "\n" +
                "Amount: $" + String.format("%.2f", amount) + "\n" +
                "Order ID: " + orderId + "\n\n" +
                "Your subscription is now active.\n\n" +
                "Best regards,\n" +
                "Hotel Bidding Platform Team"
            );

            mailSender.send(message);
            log.info("Payment success email sent to: {}", email);

        } catch (Exception e) {
            log.error("Failed to send payment success email: {}", e.getMessage());
        }
    }
