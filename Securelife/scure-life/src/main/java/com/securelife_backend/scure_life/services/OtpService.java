package com.securelife_backend.scure_life.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    private final Map<String, OtpDetails> otpStore = new HashMap<>();

    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 10;

    public void sendOtp(String email) {
        String otp = generateOtp();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES);

        // Store OTP and expiry time in-memory
        otpStore.put(email, new OtpDetails(otp, expiryTime));

        // Send OTP via email
        sendEmail(email, "Your OTP Code", "Your OTP is: " + otp);
    }

    public boolean validateOtp(String email, String otp) {
        OtpDetails details = otpStore.get(email);

        if (details != null && details.getOtp().equals(otp) && LocalDateTime.now().isBefore(details.getExpiryTime())) {
            otpStore.remove(email); // OTP is valid and used, remove it
            return true;
        }
        return false;
    }

    private String generateOtp() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder(OTP_LENGTH);
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    private void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

    private static class OtpDetails {
        private final String otp;
        private final LocalDateTime expiryTime;

        public OtpDetails(String otp, LocalDateTime expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }

        public String getOtp() {
            return otp;
        }

        public LocalDateTime getExpiryTime() {
            return expiryTime;
        }
    }
}
