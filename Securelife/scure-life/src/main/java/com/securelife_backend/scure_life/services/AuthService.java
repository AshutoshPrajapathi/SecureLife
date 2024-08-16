package com.securelife_backend.scure_life.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.securelife_backend.scure_life.models.User;
import com.securelife_backend.scure_life.repositories.UserRepository;

@Service
public class AuthService   {

	 @Autowired
	    private UserRepository userRepository;

	    @Autowired
	    private BCryptPasswordEncoder passwordEncoder;

	    public void registerUser(User user) throws Exception {
	        // Check if email already exists
	        if (userRepository.findByEmail(user.getEmail()) != null) {
	            throw new Exception("Email already in use");
	        }

	        // Encrypt password before saving
	        user.setPassword(passwordEncoder.encode(user.getPassword()));

	        // Save user to database
	        userRepository.save(user);


	    }
	    public User findByEmail(String email) {
	        return userRepository.findByEmail(email);
	    }

}
