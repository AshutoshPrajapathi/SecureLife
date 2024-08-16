package com.securelife_backend.scure_life.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.securelife_backend.scure_life.models.Diary;

public interface DiaryRepository extends JpaRepository<Diary, Long> {
	List<Diary> findByUserId(Long userId);
}
