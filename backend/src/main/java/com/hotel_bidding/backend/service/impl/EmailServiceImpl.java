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
}
