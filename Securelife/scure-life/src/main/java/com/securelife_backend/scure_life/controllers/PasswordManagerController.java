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

import com.securelife_backend.scure_life.models.PasswordManager;
import com.securelife_backend.scure_life.services.PasswordMangServices;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/passwordmanager")
public class PasswordManagerController {

	@Autowired
	private PasswordMangServices passMgrServices;
	
	//get all the data of password manager
		@GetMapping("/{userId}")
		public List<PasswordManager> getAllPasswordManagerData(@PathVariable Long userId){
			return passMgrServices.getPassMgrByUserId(userId);
		}
	
	//add a new data or new password manager
	@PostMapping("/create")
	public ResponseEntity<String> addPasswordManager(@RequestBody PasswordManager passwordManager){
		passMgrServices.savePasswordManager(passwordManager);
		return ResponseEntity.ok("Added Sucessfully!");
	}
	
	
	//Update the password manager based password manager data id
	@PutMapping("/edit/{id}")
	public ResponseEntity<PasswordManager> updatePasswordManager(@PathVariable Long id,@RequestBody PasswordManager passwordManager){
		return ResponseEntity.ok(passMgrServices.updatePasswordManager(id,passwordManager));
	}
	
	//delete the data
	@DeleteMapping("/delete/{id}")
	public String deleteById(@PathVariable Long id) {
		passMgrServices.deleteById(id);
		return "Data Deleted Successfully";
	}
}
