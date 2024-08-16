package com.securelife_backend.scure_life.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.securelife_backend.scure_life.models.User;

public interface UserRepository extends JpaRepository<User, Long> {
	User findByEmail(String email);
	
}
