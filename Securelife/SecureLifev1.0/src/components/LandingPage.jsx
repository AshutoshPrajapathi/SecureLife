import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  const handleNavigation = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      navigate('/get-started');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4">
      <h1 className="text-5xl font-bold mb-6 text-center">Welcome to SecureLife</h1>
      <p className="text-xl mb-8 text-center">Manage your tasks, passwords, and diary securely and efficiently.</p>
      <button
        onClick={() => handleNavigation('/get-started')}
        className="bg-yellow-500 text-blue-900 px-6 py-3 rounded-full font-semibold text-lg hover:bg-yellow-400 transition-transform transform hover:scale-105 mb-10"
      >
        Get Started
      </button>
      <div className="text-center w-full">
        <h2 className="text-3xl font-bold mb-8">Our Services</h2>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white text-blue-900 p-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 cursor-pointer max-w-xs mx-auto" onClick={() => handleNavigation('/todo-list')}>
            <h3 className="text-2xl font-bold mb-2">To-Do List</h3>
            <p className="mb-4">Keep track of your tasks, set deadlines, and stay organized with our intuitive to-do list.</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400">
              Explore
            </button>
          </div>
          <div className="bg-white text-blue-900 p-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 cursor-pointer max-w-xs mx-auto" onClick={() => handleNavigation('/password-manager')}>
            <h3 className="text-2xl font-bold mb-2">Password Manager</h3>
            <p className="mb-4">Securely store and manage your passwords. Auto-fill and generate strong passwords easily.</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400">
              Explore
            </button>
          </div>
          <div className="bg-white text-blue-900 p-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 cursor-pointer max-w-xs mx-auto mb-6" onClick={() => handleNavigation('/secret-diary')}>
            <h3 className="text-2xl font-bold mb-2">Secret Diary</h3>
            <p className="mb-4">Write and keep your personal diary securely. Add entries with rich text formatting and mood tracking.</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400">
              Explore
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
