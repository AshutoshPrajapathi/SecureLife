package com.securelife_backend.scure_life.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.securelife_backend.scure_life.models.Diary;
import com.securelife_backend.scure_life.models.Todo;
import com.securelife_backend.scure_life.repositories.DiaryRepository;

@Service
public class DiaryServices {

	@Autowired
	private DiaryRepository diaryRepo;
	
	//find by id it will fetch data based on id(based on diary id)
	public Diary findById(Long id) {
        return diaryRepo.findById(id).orElse(null);
    }
	
	//Provide all the Diaries(get all the data(Diary) of user)
	public List<Diary> getDiaryByUserId(Long id){
		return diaryRepo.findByUserId(id);
	}
	
	//get single diary by diary id
	public Diary getSingleDiary(Long id) {
	    return diaryRepo.findById(id).orElse(null);
	}
	
	//create new Diary service
	public void addDiary(Diary diary) {
		diaryRepo.save(diary);
	}
	
	//update the diary
	public Diary updateDiary(Long id,Diary updatedDiary) {
		return diaryRepo.findById(id)
        .map(diary -> {
            diary.setDate(updatedDiary.getDate());
            diary.setTitle(updatedDiary.getTitle());
            diary.setContent(updatedDiary.getContent());
            
            return diaryRepo.save(updatedDiary);
          
        })
        .orElseGet(() -> {
            updatedDiary.setId(id);
            return diaryRepo.save(updatedDiary);
        });
	}
	
	//Delete Diary based on diary id
	public String deleteDiary(Long id) {
		diaryRepo.deleteById(id);
		return "Deleted successfully!";
	}
	
}
