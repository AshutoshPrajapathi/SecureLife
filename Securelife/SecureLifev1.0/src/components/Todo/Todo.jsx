import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { jwtDecode } from 'jwt-decode';
import { FaPlus, FaEdit, FaTrash, FaCheckCircle, FaUndo } from 'react-icons/fa';
import { RiseLoader } from 'react-spinners'
import { format } from 'date-fns';



// Dummy data for demonstration purposes
let dummyData = [
  { id: 1, date: '2024-08-07', title: 'Task 1', description: 'Description for Task 1', dueDate: '2024-08-10', priority: 'high', completed: false },
  { id: 2, date: '2024-08-07', title: 'Task 2', description: 'Description for Task 2', dueDate: '2024-08-12', priority: 'medium', completed: false },
  { id: 3, date: '2024-08-07', title: 'Task 3', description: 'Description for Task 3', dueDate: '2024-08-15', priority: 'low', completed: false },
  { id: 4, date: '2024-08-07', title: 'Task 4', description: 'Description for Task 4', dueDate: '2024-08-18', priority: 'high', completed: false },
  { id: 5, date: '2024-08-07', title: 'Task 5', description: 'Description for Task 5', dueDate: '2024-08-20', priority: 'medium', completed: false },
  { id: 6, date: '2024-08-07', title: 'Task 6', description: 'Description for Task 6', dueDate: '2024-08-22', priority: 'low', completed: false },
  // Add more dummy data if needed...
];

const Todo = () => {
  const [todos, setTodos] = useState(dummyData);
  const [showModal, setShowModal] = useState(false);

  //to show a loading spinner whne the page is loading
  const [isLoading, setIsLoading] = useState(false);
  //retrieve the token from local storage
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const [isEditing, setIsEditing] = useState(1);

  //fetch the all the todo of the current user
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // Make the GET request with axios
        const response = await axios.get(`http://localhost:8080/todo/user/${decoded.id} `, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // Ensure content type is set if needed
          }
        });

        // console.log(response.data)
        setTodos(response.data) // Log the actual data from the response
        setIsLoading(false)
        // console.log('debug')

      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false)
      }
    };

    fetchData();


  }, [showModal]);



  const [filteredTodos, setFilteredTodos] = useState(todos);
 
  const [currentTodo, setCurrentTodo] = useState(null);
  const [filters, setFilters] = useState({ search: '', date: '' });
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // Apply filters
    let filtered = todos.filter(todo =>
      todo.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.date ? todo.dueDate === filters.date : true)
    );

    // Sort by priority and move completed tasks to the bottom
    filtered.sort((a, b) => {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    // Pagination
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setFilteredTodos(filtered.slice(startIndex, endIndex));
  }, [todos, filters, page]);

  const handleAddNew = () => {
    setCurrentTodo(null);
    setShowModal(true);
  };

  const handleSave = async (newTodo, todoMarkCompleted = -1) => {
    //todoMarkCompleted=-1 will help in handling with completed and uncompleted task

    try {
      setIsLoading(true)
      setIsEditing(3)

      const data = newTodo;

      data.user = {
        "id": decoded.id,
      };
      const response = await axios.post('http://localhost:8080/todo/create', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('To-Do added successfully');
      setIsLoading(false)
    } catch (error) {
      console.error('Error adding To-Do:', error);
      setIsLoading(false)
    }

    if (currentTodo || todoMarkCompleted !== -1) {
      // Update existing todo

      setTodos(todos.map(todo => (todo.id === currentTodo.id ? newTodo : todo)));
    } else {
      // Add new todo
      setTodos([...todos, { ...newTodo, id: todos.length + 1, completed: false }]);
    }
    setShowModal(false);
  };


  const handleEdit = (todo) => {
    setCurrentTodo(todo);
    setIsEditing(2)
    setShowModal(true);

  };

  const handleDelete = async (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    try {

      setIsLoading(true);
      const response = await axios.delete(`http://localhost:8080/todo/delete/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setIsLoading(false)

      console.log('Data deleted successfully')

    } catch (error) {
      console.log("Failed to delete " + error)
      setIsLoading(false)
    }
  };

  const handleMarkCompleted = (id) => {
    //filter the todo list if mark completed based id
    setTodos(todos.map(todo => (todo.id === id ? { ...todo, completed: true } : todo)));

    //Request backend to change completed satus we can call put method but for now using handleSave 

    const isCompleted = todos.filter(todo => todo.id === id)[0]//get the particular task, [0] bcoz it reurn array of object since we need first use 0
    isCompleted.completed = true //we are not caling put api instead we are using sava api thats why explicitly changing the status
    console.log(isCompleted)
    handleSave(isCompleted, 1)
  };

  const handleMarkUncompleted = (id) => {
    //filter the todo list if unmark completed based id
    setTodos(todos.map(todo => (todo.id === id ? { ...todo, completed: false } : todo)));
    //Request backend to change completed satus we can call put method but for now using handleSave 

    const isCompleted = todos.filter(todo => todo.id === id)[0]//get the particular task, [0] bcoz it reurn array of object since we need first use 0
    isCompleted.completed = false //we are not caling put api instead we are using sava api thats why explicitly changing the status
    handleSave(isCompleted, 0)
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const priorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };



  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0  transition-opacity duration-300">

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center"
          onClick={handleAddNew}
        >
          <FaPlus className="mr-2" /> Add New To-Do
        </button>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <input
            type="text"
            name="search"
            placeholder="Search..."
            value={filters.search}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded-md w-full md:w-auto"
          />
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded-md w-full md:w-auto"
          />
        </div>
      </div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <RiseLoader color="#30a992" margin={2} />
        </div>
      )}
      <div className="space-y-4">
        {filteredTodos.length === 0 ? (
          <p className="text-green-600 text-center">Looks like you’re all caught up today! Take a breather and enjoy your free time!</p>
        ) : (
          filteredTodos.map(todo => (
            <div
              key={todo.id}
              className={`p-4 border rounded-lg shadow-md flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 ${todo.completed ? 'bg-gray-200' : 'bg-white'}`}
            >
              <div className="flex-1">
                <h2 className={`text-xl font-semibold capitalize ${todo.completed ? 'line-through' : ''}`}>{todo.title}</h2>
                <p>{todo.description}</p>
                <p className="text-gray-600">Due Date: {format(new Date(todo.dueDate), 'yyyy-MM-dd')}</p>
                <p className={priorityColor(todo.priority)}>Priority: {todo.priority}</p>
              </div>
              <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0 w-full md:w-auto">
                {!todo.completed && (
                  <>
                    <button
                      onClick={() => handleEdit(todo)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md flex items-center w-full md:w-auto"
                    >
                      <FaEdit className="mr-2" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center w-full md:w-auto"
                    >
                      <FaTrash className="mr-2" /> Delete
                    </button>
                  </>
                )}
                <button
                  onClick={() => todo.completed ? handleMarkUncompleted(todo.id) : handleMarkCompleted(todo.id)}
                  className={`bg-${todo.completed ? 'blue-500' : 'green-600'} text-white px-4 py-2 rounded-md flex items-center w-full md:w-auto`}
                >
                  {todo.completed ? <FaUndo className="mr-2" /> : <FaCheckCircle className="mr-2" />}
                  {todo.completed ? 'Mark as Uncompleted' : 'Mark as Completed'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
          className="bg-gray-300 px-4 py-2 rounded-md"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          disabled={filteredTodos.length < itemsPerPage}
          onClick={() => handlePageChange(page + 1)}
          className="bg-gray-300 px-4 py-2 rounded-md"
        >
          Next
        </button>
      </div>
      {showModal && (
        <Modal
          todo={currentTodo}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

const Modal = ({ todo, onSave, onClose }) => {
  const [formData, setFormData] = useState(todo || { title: '', description: '', dueDate: '', priority: 'low' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    console.log(e)
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mx-4">
        <h2 className="text-2xl font-semibold mb-4">{todo ? 'Edit To-Do' : 'Add New To-Do'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="date"
            name="dueDate"
            value={format(new Date(formData.dueDate), 'yyyy-MM-dd')}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Todo;
