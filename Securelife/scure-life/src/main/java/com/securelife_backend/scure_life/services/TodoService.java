package com.securelife_backend.scure_life.services;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.securelife_backend.scure_life.models.Todo;
import com.securelife_backend.scure_life.repositories.TodoRepository;

@Service
public class TodoService {

    //private static final Logger logger = LoggerFactory.getLogger(TodoService.class);

    @Autowired
    private TodoRepository todoRepository;

    public List<Todo> getTodosByUserId(Long userId) {
 
        List<Todo> todos = todoRepository.findByUserId(userId);
        return todos;
       
    }

    public Optional<Todo> getTodoById(Long id) {
        return todoRepository.findById(id);
    }
    
    public Todo findById(Long id) {
        return todoRepository.findById(id).orElse(null);
    }

    public Todo saveTodo(Todo todo) {
        return todoRepository.save(todo);
    }

    public void deleteTodoById(Long id) {
        todoRepository.deleteById(id);
    }

    public Todo updateTodo(Long id, Todo updatedTodo) {
        return todoRepository.findById(id)
                .map(todo -> {
                    todo.setTitle(updatedTodo.getTitle());
                    todo.setDescription(updatedTodo.getDescription());
                    todo.setDueDate(updatedTodo.getDueDate());
                    todo.setPriority(updatedTodo.getPriority());
                    todo.setCompleted(updatedTodo.isCompleted());
                    return todoRepository.save(todo);
                })
                .orElseGet(() -> {
                    updatedTodo.setId(id);
                    return todoRepository.save(updatedTodo);
                });
    }
}