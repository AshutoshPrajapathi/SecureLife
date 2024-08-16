package com.securelife_backend.scure_life.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.securelife_backend.scure_life.models.Diary;
import com.securelife_backend.scure_life.services.DiaryServices;

@RestController
@CrossOrigin
@RequestMapping("/diary")
public class DiaryController {

	@Autowired
	private DiaryServices diaryServices;
	
	//get api to get all diary data based on user id
	@GetMapping("/{userId}")
	public List<Diary> getAllDiary(@PathVariable Long userId){
		return diaryServices.getDiaryByUserId(userId);
	}
	
	//create new diary post request for new diary
	
	@PostMapping("/create")
	public ResponseEntity<String> addDiary(@RequestBody Diary diary) {
		diaryServices.addDiary(diary);
		return ResponseEntity.ok("Added Successfully!");
	}
	
	//update existing diary,based on diary id
	
	@PutMapping("/edit/{id}")
	public ResponseEntity<String> updateDiary(@PathVariable Long id,@RequestBody Diary diary) {
		diaryServices.updateDiary(id, diary);
		return ResponseEntity.ok("Updated Successfully");
	}
	
	//Delete the diary,based on diary id
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deleteDiary(@PathVariable Long id) {
		
		return ResponseEntity.ok(diaryServices.deleteDiary(id));
	}
	
	//To get a single diary
	@GetMapping("/get/{id}")
	public Diary getDiary(@PathVariable Long id) { 
		return diaryServices.getSingleDiary(id);
	}
}
