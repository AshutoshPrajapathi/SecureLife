import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaTasks, FaLock, FaBook } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';

const Home = () => {
  const { isLoggedIn} = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem('token')
  const decoded = jwtDecode(token);
  const userName = decoded.sub.split('@')[0];
  const { setIsLogregPage } = useContext(AuthContext);


  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  // Dummy data simulating data from backend
  const services = [
    {
      id: 1,
      name: 'To-Do List',
      description: 'Manage your tasks effectively and stay organized.',
      icon: <FaTasks />,
      color: 'bg-blue-600',
      route: '/todo',
    },
    {
      id: 2,
      name: 'Password Manager',
      description: 'Store and manage your passwords securely.',
      icon: <FaLock />,
      color: 'bg-green-600',
      route: '/password-manager',
    },
    {
      id: 3,
      name: 'Secret Diary',
      description: 'Keep your personal thoughts and notes private.',
      icon: <FaBook />,
      color: 'bg-purple-600',
      route: '/secret-diary',
    },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-teal-400 to-blue-600 p-6">
      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-4xl font-bold mb-4 text-center text-white">Welcome, {userName}!</h1>
        <p className="text-lg mb-8 text-center text-white">Your one-stop solution for managing your tasks, passwords, and diary.</p>
        <div className="flex flex-wrap justify-center gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className={`w-full max-w-xs p-6 rounded-lg shadow-lg ${service.color} text-white flex flex-col items-center text-center space-y-4 transition-transform transform hover:scale-105`}
            >
              <div className="text-4xl">{service.icon}</div>
              <h2 className="text-2xl font-semibold">{service.name}</h2>
              <p>{service.description}</p>
              <button
                className="bg-white text-blue-900 px-4 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors"
                onClick={() => navigate(service.route)}
              >
                Go to {service.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
