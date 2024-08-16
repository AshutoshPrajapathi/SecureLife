package com.securelife_backend.scure_life.models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
		@Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private String fullname;
	    private String email;
	    private String password;
	    
	    @OneToMany(mappedBy = "user")
	    @JsonManagedReference
	    private List<Todo> todos;
	    
	    @OneToMany(mappedBy = "user")
	    @JsonManagedReference
	    private List<PasswordManager> passwordManager;
	    
	    @OneToMany(mappedBy = "user")
	    @JsonManagedReference
	    private List<Diary> diary;
	    
	    
		public List<Diary> getDiary() {
			return diary;
		}
		public void setDiary(List<Diary> diary) {
			this.diary = diary;
		}
		public List<PasswordManager> getPasswordManager() {
			return passwordManager;
		}
		public void setPasswordManager(List<PasswordManager> passwordManager) {
			this.passwordManager = passwordManager;
		}
		public List<Todo> getTodos() {
			return todos;
		}
		public void setTodos(List<Todo> todos) {
			this.todos = todos;
		}
		public User() {
			super();
			// TODO Auto-generated constructor stub
		}
		public User(Long id, String fullname, String email, String password) {
			super();
			this.id = id;
			this.fullname = fullname;
			this.email = email;
			this.password = password;
		}
		public Long getId() {
			return id;
		}
		public void setId(Long id) {
			this.id = id;
		}
		public String getFullname() {
			return fullname;
		}
		public void setFullname(String fullname) {
			this.fullname = fullname;
		}
		public String getEmail() {
			return email;
		}
		public void setEmail(String email) {
			this.email = email;
		}
		public String getPassword() {
			return password;
		}
		public void setPassword(String password) {
			this.password = password;
		} 
	    
	    
	    
}
