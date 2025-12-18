import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <header className="header">
      <h1>Plant Tracker</h1>
      <nav className="nav-menu">
        <Link to="/home" className="navlink">Home</Link>
        <Link to="/dashboard" className="navlink">Dashboard</Link>
        <Link to="/add-plant" className="navlink">Add Plant</Link>
        <Link to="/activity-history" className="navlink">Activity History</Link>
        
        {/* Links requested by user - pointing to dashboard to select plant */}
        <Link to="/dashboard" className="navlink" title="Select a plant from dashboard to view details">Plant Details</Link>
        <Link to="/dashboard" className="navlink" title="Select a plant from dashboard to edit">Edit Plant</Link>
        
        <button onClick={handleLogout} className="logout-link">
          Logout
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
