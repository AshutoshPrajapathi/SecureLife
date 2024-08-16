import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthContext from './context/AuthContext.jsx';
import Header from './components/Header.jsx';
import LandingPage from './components/LandingPage.jsx';
import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Todo from './components/Todo/Todo.jsx';
import PasswordManager from './components/PasswordManager/PasswordManager.jsx';
import SecretDiary from './components/SecretDiary/SecretDiary.jsx';
import Otp from './components/Otp.jsx';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" exact element={<LandingPage />} />
            <Route path="/home" element={isLoggedIn ? <Home /> : <LandingPage />} />
            <Route path="/services" element={<Services />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<Otp />} />
            <Route path="/get-started" element={isLoggedIn ? <Home /> : <Login />} />
            <Route path="/todo" element={isLoggedIn ? <Todo /> : <Login />} />
            <Route path="/password-manager" element={isLoggedIn ? <PasswordManager /> : <Login />} />
            <Route path="/secret-diary" element={isLoggedIn ? <SecretDiary />: <Login />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
