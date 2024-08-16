package com.securelife_backend.scure_life.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.securelife_backend.scure_life.services.AuthService;
import com.securelife_backend.scure_life.services.OtpService;

@RestController
@CrossOrigin
@RequestMapping("/api/otp")
public class OtpController {

    @Autowired
    private OtpService otpService;
    @Autowired
    private AuthService authService;

    @PostMapping("/send")
    public String sendOtp(@RequestParam String email) {
    	String msg = "Email Not found";
    	if(authService.findByEmail(email) != null) {
    		otpService.sendOtp(email);
    		msg = "OTP sent to your email.";
    	}
    		
        return msg;
    }

    @PostMapping("/validate")
    public String validateOtp(@RequestParam String email, @RequestParam String otp) {
        boolean isValid = otpService.validateOtp(email, otp);
        return isValid ? "OTP is valid." : "Invalid or expired OTP.";
    }
}
