import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Payment from "./pages/Payment";
import Receipt from "./pages/Receipt";
import LoginScreen from "./pages/LoginScreen";
import HomePage from "./pages/HomePage";
import Report from "./pages/Report";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        
        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div>
                <Navbar />
                <Navigate to="/login" />
              </div>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div>
                <Navbar />
                <HomePage />
              </div>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <div>
                <Navbar />
                <Payment />
              </div>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/receipt"
          element={
            <ProtectedRoute>
              <div>
                <Navbar />
                <Receipt />
              </div>
            </ProtectedRoute>
          }
        />
      
      <Route path="/report" element={
          <ProtectedRoute>
            <div>
              <Navbar />
              <Report />
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;