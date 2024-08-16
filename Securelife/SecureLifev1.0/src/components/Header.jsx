import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaHome, FaClipboardList, FaSignInAlt, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useCookies } from 'react-cookie';

const Header = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['authToken']);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in based on cookies
    if (cookies.authToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [cookies.authToken, setIsLoggedIn]);

  const handleLogout = () => {
    removeCookie('authToken'); // Clear the cookie
    setIsLoggedIn(false);
    navigate('/login'); // Redirect to login page
    setMenuOpen(false); // Close menu on logout
  };

  const toggleMenu = () => {
    setMenuOpen(prevState => !prevState);
  };

  return (
    <header className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold">SecureLife</h1>
      <nav>
        <ul className="hidden md:flex space-x-6">
          <li>
            <Link to="/home" className="flex items-center space-x-1 hover:text-yellow-400 transition-colors">
              <FaHome /> <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/services" className="flex items-center space-x-1 hover:text-yellow-400 transition-colors">
              <FaClipboardList /> <span>Services</span>
            </Link>
          </li>
          {isLoggedIn ? (
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 hover:text-yellow-400 transition-colors"
              >
                <FaSignOutAlt /> <span>Logout</span>
              </button>
            </li>
          ) : (
            <li>
              <Link to="/get-started" className="flex items-center space-x-1 hover:text-yellow-400 transition-colors">
                <FaSignInAlt /> <span>Get Started</span>
              </Link>
            </li>
          )}
        </ul>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </nav>
      {menuOpen && (
        <nav className="absolute top-16 left-0 w-full bg-blue-600 p-4 flex flex-col items-start space-y-4 md:hidden">
          <Link to="/home" className="flex items-center space-x-1 text-xl hover:text-yellow-400 transition-colors" onClick={toggleMenu}>
            <FaHome /> <span>Home</span>
          </Link>
          <Link to="/services" className="flex items-center space-x-1 text-xl hover:text-yellow-400 transition-colors" onClick={toggleMenu}>
            <FaClipboardList /> <span>Services</span>
          </Link>
          {isLoggedIn ? (
            <button
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
              className="flex items-center space-x-1 text-xl hover:text-yellow-400 transition-colors"
            >
              <FaSignOutAlt /> <span>Logout</span>
            </button>
          ) : (
            <Link to="/get-started" className="flex items-center space-x-1 text-xl hover:text-yellow-400 transition-colors" onClick={toggleMenu}>
              <FaSignInAlt /> <span>Get Started</span>
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
