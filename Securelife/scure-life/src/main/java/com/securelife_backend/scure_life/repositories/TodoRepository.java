package com.securelife_backend.scure_life.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.securelife_backend.scure_life.models.Todo;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByUserId(Long userId);
}
