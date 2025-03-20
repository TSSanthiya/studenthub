import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage({ setIsAuthenticated, setUserRole }) {  
  const [activeTab, setActiveTab] = useState("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    const role = activeTab === "student" ? "student" : "faculty";
    
    // Store authentication state
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem("userRole", role);

    // Redirect to respective dashboard
    navigate(role === "faculty" ? "/faculty-dashboard" : "/student-dashboard");
  };

  return (
    <div className="login-container">
      {/* Left Side - Image Section */}
      <div className="login-image">
        <img src="image.png" alt="Illustration" />
      </div>

      {/* Right Side - Login Form */}
      <div className="login-form">
        <h2>Log In</h2>

        {/* Tabs for Student and Faculty */}
        <div className="tabs">
          <button className={activeTab === "student" ? "active" : ""} onClick={() => setActiveTab("student")}>
            Student Login
          </button>
          <button className={activeTab === "faculty" ? "active" : ""} onClick={() => setActiveTab("faculty")}>
            Faculty Login
          </button>
        </div>

        {/* Login Form */}
        <div className="input-group">
          <i className="fas fa-user"></i>
          <input 
            type="text" 
            placeholder="Your Name" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-group">
          <i className="fas fa-lock"></i>
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="remember-me">
          <input type="checkbox" id="rememberMe" />
          <label htmlFor="rememberMe">Remember me</label>
        </div>

        <button className="btn-login" onClick={handleLogin}>Log In</button>

        <div className="create-account">
          
        </div>
      </div> 
    </div> 
  );
} 