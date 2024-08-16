import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaTasks, FaLock, FaBook } from 'react-icons/fa';

const services = [
  {
    id: 1,
    name: 'To-Do List',
    description: 'Organize your daily tasks efficiently with our To-Do List feature. Set priorities, deadlines, and track your progress seamlessly.',
    icon: <FaTasks />,
    color: 'bg-blue-600',
    route: '/todo',
  },
  {
    id: 2,
    name: 'Password Manager',
    description: 'Securely store and manage all your passwords in one place. Generate strong passwords and auto-fill credentials for a hassle-free experience.',
    icon: <FaLock />,
    color: 'bg-green-600',
    route: '/password-manager',
  },
  {
    id: 3,
    name: 'Secret Diary',
    description: 'Keep your personal thoughts and notes private and secure. Use tags, search functionality, and more to keep track of your entries.',
    icon: <FaBook />,
    color: 'bg-purple-600',
    route: '/secret-diary',
  },
];

const ServicePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  const handleExplore = (route) => {
    if (isLoggedIn) {
      navigate(route);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800 mt-12">Our Services</h1>
      <div className="text-center mb-8 mt-4">
        <p className="text-lg text-gray-700 mb-4">
          Explore our range of services designed to make your life easier and more organized. Whether you need to manage tasks, store passwords securely, or keep a personal diary, we’ve got you covered.
        </p>
        <p className="text-md text-gray-600">
          Click on each service below to learn more about its features and how it can help you stay on top of your daily activities and personal security.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className={`w-full max-w-sm p-6 rounded-lg shadow-lg ${service.color} text-white flex flex-col items-center text-center space-y-4 transition-transform transform hover:scale-105`}
          >
            <div className="text-5xl">{service.icon}</div>
            <h2 className="text-2xl font-semibold">{service.name}</h2>
            <p>{service.description}</p>
            <button
              className={`bg-white text-gray-800 px-4 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors`}
              onClick={() => handleExplore(service.route)}
            >
              Explore {service.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicePage;
