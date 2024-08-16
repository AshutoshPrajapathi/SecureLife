package com.securelife_backend.scure_life.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.securelife_backend.scure_life.models.PasswordManager;

import com.securelife_backend.scure_life.repositories.PasswordManRepository;


@Service
public class PasswordMangServices {
	@Autowired
	private PasswordManRepository passmgrepo;
	
	
	
	
	//Save the data of password manager
	public PasswordManager savePasswordManager (PasswordManager data) {

		return passmgrepo.save(data);
	}
	
	//this will return all the password manager data based on user_id
	public List<PasswordManager> getPassMgrByUserId(Long userId){
		List<PasswordManager> todos = passmgrepo.findByUserId(userId);
        return todos;
	}
	//this will return the particular password manager id which will help in updation and deletion
	public PasswordManager findById(Long id) {
        return passmgrepo.findById(id).orElse(null);
    }

    public PasswordManager updatePasswordManager(Long id, PasswordManager updatedPassMgr) {
    	return passmgrepo.findById(id)
		.map(passMgr->{
			passMgr.setCategory(updatedPassMgr.getCategory());
			passMgr.setWebsite(updatedPassMgr.getWebsite());
			passMgr.setUsername(updatedPassMgr.getUsername());
			passMgr.setPassword(updatedPassMgr.getPassword());
			passMgr.setVisible(updatedPassMgr.isVisible());
			return passmgrepo.save(passMgr);
		}).orElseGet(() -> {
            updatedPassMgr.setId(id);
            return passmgrepo.save(updatedPassMgr);
        });
        
       
    }
    
    //delete the particular data by id
    
    public void deleteById(Long id) {
    	passmgrepo.deleteById(id);
    }
	
}
