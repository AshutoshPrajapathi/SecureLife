package com.securelife_backend.scure_life.controllers;

import java.util.List;
import java.util.Optional;

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

import com.securelife_backend.scure_life.models.Todo;
import com.securelife_backend.scure_life.services.TodoService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/todo")
public class TodoController {
//    private static final Logger logger = LoggerFactory.getLogger(TodoService.class);


    @Autowired
    private TodoService todoService;

   
  
    @GetMapping("/user/{userId}")
    public List<Todo> getTodosByUserId(@PathVariable Long userId) {
        List<Todo> todos = todoService.getTodosByUserId(userId);
        return todos;
       
    }
    
//	  To get a single to do from the db based on task id i

//    @GetMapping("/{id}")
//    public ResponseEntity<Todo> getTodoById(@PathVariable Long id) {
//        Todo todo = todoService.findById(id);
//        if (todo != null) {
//            return ResponseEntity.ok(todo);
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }
    
    @PostMapping("/create")
    public ResponseEntity<Todo> createTodo(@RequestBody Todo todo) {
        Todo savedTodo = todoService.saveTodo(todo);
        return ResponseEntity.ok(savedTodo);
    }
    
//	To handle the edit of data from the fronend(as of now handling in frontend)

//    @PutMapping("/{id}")
//    public ResponseEntity<String> updateTodo(@PathVariable Long id, @RequestBody Todo updatedTodo) {
//        Todo savedTodo = todoService.updateTodo(id, updatedTodo);
//        return ResponseEntity.ok("Working");
//    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTodoById(@PathVariable Long id) {
        todoService.deleteTodoById(id);
        return ResponseEntity.noContent().build();
    }
}

