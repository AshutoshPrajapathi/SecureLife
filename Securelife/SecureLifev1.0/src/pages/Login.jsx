import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { RiseLoader } from 'react-spinners';

const LoginPage = () => {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { setIsLoggedIn, setIsLogregPage } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // To show a loading spinner when the page is loading
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simulate a login request
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:8080/auth/login', { email, password });
      if (response.status === 200) {
        // Redirect to login page or another page
        const token = response.data;
        const decoded = jwtDecode(token);
        const loginSuccessful = true;
        const userExists = decoded.id !== null && decoded.id !== undefined; // Replace with your API call to check if user exists
        setIsLoading(false);
        
        if (userExists) {
          if (loginSuccessful) {
            // Save user session and redirect
            localStorage.setItem('token', token); 
            setIsLoggedIn(true);
            if (rememberMe) {
              localStorage.setItem('user', JSON.stringify({ email }));
            }
           
            navigate('/home');
          } else {
            setError('Invalid email or password.');
          }
        } else {
          navigate('/register');
        }
      }

      if(response.status === 401) setError('Invalid email or password.');
    } catch (error) {
      setIsLoading(false);
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
      <div className={`bg-white p-8 rounded-lg shadow-lg w-full max-w-md ${isLoading ? 'opacity-50' : 'opacity-100'} transition-opacity duration-300`}> 
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Login</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
              <RiseLoader color="#30a992" margin={2} />
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="rememberMe" className="text-gray-700">Remember Me</label>
            </div>
            <NavLink to="/reset-password" className="text-blue-500 hover:underline">
              Forgot Password?
            </NavLink>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-400 transition-colors"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4">
          Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
