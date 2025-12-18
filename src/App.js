import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AddPlant from './pages/AddPlant';
import PlantDetails from './pages/PlantDetails';
import EditPlant from './pages/EditPlant';
import ActivityHistory from './pages/ActivityHistory';
import Navbar from './components/Navbar';

function App() {
  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    return token !== null;
  };

  return (
    <BrowserRouter>
      <div className="App">
        
        {isLoggedIn() && <Navbar />}
        
        <Routes>
        
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          
          <Route 
            path="/home" 
            element={isLoggedIn() ? <Home /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/dashboard" 
            element={isLoggedIn() ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/add-plant" 
            element={isLoggedIn() ? <AddPlant /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/plant/:id" 
            element={isLoggedIn() ? <PlantDetails /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/edit-plant/:id" 
            element={isLoggedIn() ? <EditPlant /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/activity-history" 
            element={isLoggedIn() ? <ActivityHistory /> : <Navigate to="/login" />} 
          />
          
         
          <Route 
            path="/" 
            element={isLoggedIn() ? <Navigate to="/home" /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
