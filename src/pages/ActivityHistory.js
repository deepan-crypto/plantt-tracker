import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ActivityHistory() {
  // Simple state
  const [activities, setActivities] = useState([]);
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [filterPlant, setFilterPlant] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // Fetch data when page loads
  useEffect(() => {
    fetchActivities();
    fetchPlants();
  }, []);

  // Get all activities
  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/activities', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setActivities(data);
      }
    } catch (err) {
      console.log('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get all plants for filter dropdown
  const fetchPlants = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/plants', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setPlants(data);
      }
    } catch (err) {
      console.log('Error fetching plants:', err);
    }
  };

  // Simple function to format date and time
  const formatDateTime = (date) => {
    return new Date(date).toLocaleString();
  };

  // Simple function to format just date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  // Simple filter function
  const filteredActivities = activities.filter((activity) => {
    // Filter by plant
    if (filterPlant && activity.plant._id !== filterPlant) {
      return false;
    }
    
    // Filter by type
    if (filterType && activity.type !== filterType) {
      return false;
    }
    
    // Filter by date
    if (filterDate) {
      const activityDate = formatDate(activity.date);
      const selectedDate = new Date(filterDate).toLocaleDateString();
      if (activityDate !== selectedDate) {
        return false;
      }
    }
    
    return true;
  });

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Activity History</h1>
      
      {/* Filters */}
      <div className="card">
        <h3>Filters</h3>
        <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
          <div className="form-group" style={{flex: 1, minWidth: '200px'}}>
            <label>Filter by Plant</label>
            <select 
              value={filterPlant}
              onChange={(e) => setFilterPlant(e.target.value)}
            >
              <option value="">All Plants</option>
              {plants.map((plant) => (
                <option key={plant._id} value={plant._id}>
                  {plant.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{flex: 1, minWidth: '200px'}}>
            <label>Filter by Activity Type</label>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="watered">Watered</option>
              <option value="fertilized">Fertilized</option>
            </select>
          </div>

          <div className="form-group" style={{flex: 1, minWidth: '200px'}}>
            <label>Filter by Date</label>
            <input 
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>
        
        {/* Clear filters button */}
        <button 
          onClick={() => {
            setFilterPlant('');
            setFilterType('');
            setFilterDate('');
          }}
          className="btn btn-secondary"
          style={{marginTop: '10px'}}
        >
          Clear Filters
        </button>
      </div>

      {/* Activities list */}
      <div className="card">
        <h2>All Activities ({filteredActivities.length})</h2>
        
        {filteredActivities.length === 0 ? (
          <p>No activities found</p>
        ) : (
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '2px solid #ddd'}}>
                <th style={{padding: '10px', textAlign: 'left'}}>Plant Name</th>
                <th style={{padding: '10px', textAlign: 'left'}}>Activity Type</th>
                <th style={{padding: '10px', textAlign: 'left'}}>Date & Time</th>
                <th style={{padding: '10px', textAlign: 'left'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.map((activity) => (
                <tr key={activity._id} style={{borderBottom: '1px solid #eee'}}>
                  <td style={{padding: '10px'}}>{activity.plant.name}</td>
                  <td style={{padding: '10px'}}>
                    {activity.type === 'watered' ? '💧 Watered' : '🌱 Fertilized'}
                  </td>
                  <td style={{padding: '10px'}}>{formatDateTime(activity.date)}</td>
                  <td style={{padding: '10px'}}>
                    <Link to={`/plant/${activity.plant._id}`}>
                      <button className="btn btn-secondary" style={{padding: '5px 10px'}}>
                        View Plant
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ActivityHistory;
