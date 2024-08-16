package com.securelife_backend.scure_life.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.securelife_backend.scure_life.models.PasswordManager;
import com.securelife_backend.scure_life.models.Todo;

public interface PasswordManRepository extends JpaRepository<PasswordManager, Long>{
	List<PasswordManager> findByUserId(Long userId);
}
