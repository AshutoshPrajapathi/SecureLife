import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { RiseLoader } from 'react-spinners'
import { jwtDecode } from 'jwt-decode';
import { format } from 'date-fns';

// Dummy data for demonstration purposes
const dummyData = [
  { id: 1, date: '2024-08-07', title: 'Diary Entry 1', content: 'Content for Diary Entry 1' },
  { id: 2, date: '2024-08-08', title: 'Diary Entry 2', content: 'Content for Diary Entry 2' },
  { id: 3, date: '2024-08-09', title: 'Diary Entry 3', content: 'Content for Diary Entry 3' },
  // Add more dummy data if needed...
];

const SecretDiary = () => {
  const [diaries, setDiaries] = useState(dummyData);
  const [filteredDiaries, setFilteredDiaries] = useState(diaries);
  const [showModal, setShowModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [currentDiary, setCurrentDiary] = useState(null);
  const [filters, setFilters] = useState({ search: '', date: '' });

  //to show a loading spinner whne the page is loading
  const [isLoading, setIsLoading] = useState(false);

  //retrieve the token from local storage
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);

  //fetch the data
  useEffect(() => {

    const fetchDiaries = async () => {
      try {
        setIsLoading(true);
        // Make the GET request with axios
        const response = await axios.get(`http://localhost:8080/diary/${decoded.id} `, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // Ensure content type is set if needed
          }
        });

        // console.log(response.data)
        setDiaries(response.data) // Log the actual data from the response
        setIsLoading(false)

      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    }
    fetchDiaries();

  }, [])


  useEffect(() => {
    // Apply filters
    let filtered = diaries.filter(diary =>
      diary.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.date ? diary.date === filters.date : true)
    );
    setFilteredDiaries(filtered);
  }, [diaries, filters]);

  const handleAddNew = () => {
    setCurrentDiary(null);
    setShowModal(true);
  };

  const handleSave = async (newDiary) => {
    if (currentDiary) {
      // Update existing diary
     const data =  {...currentDiary}
     data.user = {
      "id": decoded.id,
    };
      
      try {
        setIsLoading(true);
        // Make the PUT request with axios
        const response = await axios.put(`http://localhost:8080/diary/edit/${currentDiary.id} `,data, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // Ensure content type is set if needed
          }
        });
        setIsLoading(false)
        setDiaries(diaries.map(diary => (diary.id === currentDiary.id ? newDiary : diary)));
      } catch (error) {
        setIsLoading(false);
        console.error(error)
        alert("Could not update the data");
      }

    } else {
      // Add new diary
      const data = newDiary;
      data.user = {
        "id": decoded.id,
      };
      try {
        setIsLoading(true);
        // Make the PosT request with axios
        const response = await axios.post(`http://localhost:8080/diary/create `, data, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // Ensure content type is set if needed
          }
        });
        setIsLoading(false);
        setDiaries([...diaries, { ...newDiary, id: diaries.length + 1 }]);
      } catch (error) {
        setIsLoading(false);
        alert("Could not add the data");
      }

    }
    setShowModal(false);
  };

  const handleEdit = (diary) => {
    setCurrentDiary(diary);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      // Make the Delete request with axios
      const response = await axios.delete(`http://localhost:8080/diary/delete/${id} `, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' // Ensure content type is set if needed
        }
      });
      setIsLoading(false);
      setDiaries(diaries.filter(diary => diary.id !== id));
    } catch (error) {
      console.error(error)
      setIsLoading(false);
      // console.error(error)
      alert("Failed! to Delete the data.")
    }
  };

  const handleViewContent = (diary) => {
    setCurrentDiary(diary);
    setShowContentModal(true);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center"
          onClick={handleAddNew}
        >
          <FaPlus className="mr-2" /> Add New Entry
        </button>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <input
            type="text"
            name="search"
            placeholder="Search..."
            value={filters.search}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded-md"
          />
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded-md"
          />
        </div>
      </div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <RiseLoader color="#30a992" margin={2} />
        </div>
      )}
      <div className="space-y-4">
        {filteredDiaries.length === 0 ? (
          <p className="text-gray-600 text-center">No diary Entries found. Enjoy your free time!</p>
        ) : (
          filteredDiaries.map(diary => (
            <div
              key={diary.id}
              className="p-4 border rounded-lg shadow-md bg-white flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4"
            >
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{diary.title}</h2>
                <p>{diary.content.substring(0, 100)}...</p>
                <p className="text-gray-600">Date: {format(new Date(diary.date), 'yyyy-MM-dd')}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleViewContent(diary)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <FaEye className="mr-2" /> View
                </button>
                <button
                  onClick={() => handleEdit(diary)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(diary.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center"
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
          diary={currentDiary}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
      {showContentModal && (
        <ContentModal
          diary={currentDiary}
          onClose={() => setShowContentModal(false)}
        />
      )}
    </div>
  );
};

const Modal = ({ diary, onSave, onClose }) => {
  const [formData, setFormData] = useState(diary || { date: new Date().toISOString().split('T')[0], title: '', content: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">{diary ? 'Edit Diary Entry' : 'Add New Diary Entry'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={format(new Date(formData.date), 'yyyy-MM-dd')}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
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

const ContentModal = ({ diary, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">{diary.title}</h2>
        <p>{diary.content}</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecretDiary;
