package com.securelife_backend.scure_life.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.securelife_backend.scure_life.models.User;
import com.securelife_backend.scure_life.services.AuthService;
import com.securelife_backend.scure_life.utils.JwtUtil;



@RestController
@CrossOrigin
@RequestMapping("/auth")
public class AuthController {

		@Autowired
	    private AuthenticationManager authenticationManager;

	    @Autowired
	    private JwtUtil jwtUtil;

	    @Autowired
	    private AuthService authService;

	    @Autowired
	    private BCryptPasswordEncoder passwordEncoder;

	
	
	@PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        try {
            authService.registerUser(user);
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
        
    }
	
	  @PostMapping("/login")
	  public ResponseEntity<String> login(@RequestBody User user) {
		  String email = user.getEmail();
		  String password = user.getPassword();
		  
		  try {
	            Authentication authentication = authenticationManager.authenticate(
	                new UsernamePasswordAuthenticationToken(email, password)
	            );

	            User user1 = authService.findByEmail(email);

	            if (user1 != null && passwordEncoder.matches(password, user1.getPassword())) {
	                String token = jwtUtil.generateToken(user1.getId(), user1.getEmail());
	                return ResponseEntity.ok().body(token);
	            } else {
	                return ResponseEntity.status(401).body("Invalid email or password");
	            }

	        } catch (Exception e) {
	            return ResponseEntity.status(401).body("Invalid email or password");
	        }
	        
	    }
}
