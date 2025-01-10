import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await loginUser({ username, password });
      
      if (response.status === 'success') {
        // Store user data in localStorage or state management solution
        localStorage.setItem('user', JSON.stringify(response.data));
        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleLogin} style={styles.form}>
      <label style={styles.label}>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        <label style={styles.label}>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        
        <button type="submit" style={styles.button}>
          Login
        </button>

      </form>
    </div>
  );
};

// Add error style to your existing styles
const styles = {
    container: {
        width: "300px",
        margin: "50px auto",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      },
      form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      },
      label: {
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        marginBottom: "10px",
      },
      input: {
        padding: "8px",
        fontSize: "14px",
        borderRadius: "4px",
        border: "1px solid #ccc",
      },
      select: {
        padding: "8px",
        fontSize: "14px",
        borderRadius: "4px",
        border: "1px solid #ccc",
      },
      button: {
        padding: "10px 15px",
        fontSize: "16px",
        borderRadius: "4px",
        border: "none",
        backgroundColor: "#007bff",
        color: "#fff",
        cursor: "pointer",
      },
      registerText: {
        marginTop: "15px",
      },
      link: {
        background: "none",
        border: "none",
        color: "#007bff",
        cursor: "pointer",
        textDecoration: "underline",
        fontSize: "14px",
      },    
  error: {
    color: 'red',
    marginBottom: '10px',
    textAlign: 'center',
  },
};

export default LoginScreen;