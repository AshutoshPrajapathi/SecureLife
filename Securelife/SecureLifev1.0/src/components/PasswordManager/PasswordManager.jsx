import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaLock, FaFilter } from 'react-icons/fa';
import { generatePassword } from './passwordUtils'; // Utility for generating passwords
import { jwtDecode } from 'jwt-decode';
import { RiseLoader } from 'react-spinners'

const dummyData = [
  { id: 1, category: 'Email', website: 'gmail.com', username: 'user1', password: 'password123', visible: false },
  { id: 2, category: 'Social', website: 'facebook.com', username: 'user2', password: 'password456', visible: false },
  { id: 3, category: 'Work', website: 'company.com', username: 'user3', password: 'password789', visible: false },
];

const PasswordManager = () => {
  const [passwords, setPasswords] = useState(dummyData);
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(null);
  const [filters, setFilters] = useState({ search: '', category: '' });
  const [showPassword, setShowPassword] = useState(false);
  //to show a loading spinner when the page is loading
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem('token')
  const decoded = jwtDecode(token);


  //fetch the all the todo of the current user
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // Make the GET request with axios
        const response = await axios.get(`http://localhost:8080/passwordmanager/${decoded.id} `, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // Ensure content type is set if needed
          }
        });

        // console.log(response.data)
        setPasswords(response.data) // Log the actual data from the response
        setIsLoading(false)


      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false)
      }
    };

    fetchData(); 


  }, [showModal]);


  const handleAddNew = () => {
    setCurrentPassword(null);
    setShowModal(true);
  };

  const handleSave = async (newPasswords, action = null) => {
    const data = newPasswords;
    // delete data.id;
    // console.log(`deleted `,data)
    setShowModal(false);
    //handling edit and addition of data based on password id(if its edit id will be there in password data otherwise wont)
    if (newPasswords.id === undefined) {
      try {
        setIsLoading(true);
        data.user = {
          "id": decoded.id,
        };
        // Make the post request with axios for adding the new data
        const response = await axios.post(`http://localhost:8080/passwordmanager/create `,data, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // Ensure content type is set if needed
          }
        });
        setIsLoading(false);

      } catch (error) {
        console.error("Error adding data");
        setIsLoading(false)
      }
      console.log('New password addition')
    } else {
      //edit the data here,send put request to update the data
      
      // 
      try {
        setIsLoading(true)
        const response = await axios.put(`http://localhost:8080/passwordmanager/edit/${newPasswords.id} `,newPasswords, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // Ensure content type is set if needed
          }
        });
        setIsLoading(false);
      } catch (error) {
        console.log('Edit operation failed ',error)
        setIsLoading(false);
      }
    }

    if (currentPassword) {
      setPasswords(passwords.map(pwd => (pwd.id === currentPassword.id ? newPasswords : pwd)));
      console.log('Updated Password:', newPasswords); // Simulate backend interaction
    } else {
      setPasswords([...passwords, { ...newPasswords, id: passwords.length + 1, visible: false }]);
      console.log('Added Password:', newPasswords); // Simulate backend interaction
    }

  };


  const handleEdit = (passwords) => {
    setCurrentPassword(passwords);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    setPasswords(passwords.filter(pwd => pwd.id !== id));
    //send delete request to delete the current data
    try {

      setIsLoading(true);
      const response = await axios.delete(`http://localhost:8080/passwordmanager/delete/${id}`, {
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
     // Simulate backend interaction
  };

  const handleToggleVisibility = (id) => {
    setPasswords(passwords.map(pwd => (pwd.id === id ? { ...pwd, visible: !pwd.visible } : pwd)));
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredPasswords = passwords.filter(pwd =>
    pwd.website.toLowerCase().includes(filters.search.toLowerCase()) &&
    (filters.category ? pwd.category === filters.category : true)
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center"
          onClick={handleAddNew}
        >
          <FaPlus className="mr-2" /> Add New Password
        </button>
        <div className="flex flex-col md:flex-row md:space-x-4 mt-4 md:mt-0 w-full md:w-auto">
          <input
            type="text"
            name="search"
            placeholder="Search..."
            value={filters.search}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded-md mb-2 md:mb-0"
          />
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded-md"
          >
            <option value="">All Categories</option>
            <option value="Email">Email</option>
            <option value="Social">Social</option>
            <option value="Work">Work</option>
            {/* Add more categories as needed */}
          </select>
        </div>
      </div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <RiseLoader color="#30a992" margin={2} />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPasswords.length === 0 ? (
          <p className="text-green-600 text-center col-span-full">No passwords found.</p>
        ) : (
          filteredPasswords.map(pwd => (
            <div
              key={pwd.id}
              className="p-4 border rounded-lg shadow-md flex flex-col space-y-4 bg-white"
            >
              <div>
                <h2 className="text-xl font-semibold">{pwd.website}</h2>
                <p className="text-gray-600">Username: {pwd.username}</p>
                <div className="flex items-center">
                  <span className="text-gray-600">Password: {pwd.visible ? pwd.password : '••••••••'}</span>
                  <button
                    onClick={() => handleToggleVisibility(pwd.id)}
                    className="ml-2 text-gray-600 hover:text-gray-800"
                  >
                    {pwd.visible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <p className="text-gray-600">Category: {pwd.category}</p>
              </div>
              <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-2">
                <button
                  onClick={() => handleEdit(pwd)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md flex items-center justify-center"
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(pwd.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center justify-center"
                >
                  <FaTrash className="mr-2" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <Modal
          password={currentPassword}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

const Modal = ({ password, onSave, onClose }) => {
  const [formData, setFormData] = useState(password || { website: '', username: '', password: '', category: 'Email' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGeneratePassword = () => {
    setFormData({ ...formData, password: generatePassword() });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">{password ? 'Edit Password' : 'Add New Password'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Website</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <div className="flex">
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border rounded-l-md"
                required
              />
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="bg-blue-600 text-white px-4 py-2 rounded-r-md flex items-center"
              >
                <FaLock className="mr-2" /> Generate
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="Email">Email</option>
              <option value="Social">Social</option>
              <option value="Work">Work</option>
              {/* Add more categories as needed */}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
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

export default PasswordManager;
