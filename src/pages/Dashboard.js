import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPlants: 0,
    tasksCompleted: 0,
    overdueWatering: 0,
    overdueFertilizing: 0
  });
  const [upcomingTasks, setUpcomingTasks] = useState({
    watering: [],
    fertilizing: []
  });
  const [missedTasks, setMissedTasks] = useState([]);

  useEffect(() => {
    fetchPlants();
  }, []);

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
        calculateStats(data);
        categorizeUpcomingTasks(data);
        identifyMissedTasks(data);
      }
    } catch (err) {
      console.log('Error fetching plants:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (plantsData) => {
    let overdueWatering = 0;
    let overdueFertilizing = 0;
    const today = new Date();

    plantsData.forEach(plant => {
      if (new Date(plant.nextWateringDate) < today) {
        overdueWatering++;
      }
      if (new Date(plant.nextFertilizingDate) < today) {
        overdueFertilizing++;
      }
    });

    setStats({
      totalPlants: plantsData.length,
      tasksCompleted: 0, // Could be calculated from activities
      overdueWatering,
      overdueFertilizing
    });
  };

  const categorizeUpcomingTasks = (plantsData) => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const wateringTasks = [];
    const fertilizingTasks = [];

    plantsData.forEach(plant => {
      const waterDate = new Date(plant.nextWateringDate);
      const fertilizeDate = new Date(plant.nextFertilizingDate);

      // Upcoming watering (next 7 days, not overdue)
      if (waterDate >= today && waterDate <= nextWeek) {
        wateringTasks.push({
          ...plant,
          dueDate: waterDate,
          daysUntil: Math.ceil((waterDate - today) / (1000 * 60 * 60 * 24))
        });
      }

      // Upcoming fertilizing (next 7 days, not overdue)
      if (fertilizeDate >= today && fertilizeDate <= nextWeek) {
        fertilizingTasks.push({
          ...plant,
          dueDate: fertilizeDate,
          daysUntil: Math.ceil((fertilizeDate - today) / (1000 * 60 * 60 * 24))
        });
      }
    });

    // Sort by date
    wateringTasks.sort((a, b) => a.dueDate - b.dueDate);
    fertilizingTasks.sort((a, b) => a.dueDate - b.dueDate);

    setUpcomingTasks({
      watering: wateringTasks,
      fertilizing: fertilizingTasks
    });
  };

  const identifyMissedTasks = (plantsData) => {
    const today = new Date();
    const missed = [];

    plantsData.forEach(plant => {
      const waterDate = new Date(plant.nextWateringDate);
      const fertilizeDate = new Date(plant.nextFertilizingDate);

      if (waterDate < today) {
        missed.push({
          plantId: plant._id,
          plantName: plant.name,
          type: 'watering',
          dueDate: waterDate,
          daysOverdue: Math.ceil((today - waterDate) / (1000 * 60 * 60 * 24))
        });
      }

      if (fertilizeDate < today) {
        missed.push({
          plantId: plant._id,
          plantName: plant.name,
          type: 'fertilizing',
          dueDate: fertilizeDate,
          daysOverdue: Math.ceil((today - fertilizeDate) / (1000 * 60 * 60 * 24))
        });
      }
    });

    // Sort by days overdue (most urgent first)
    missed.sort((a, b) => b.daysOverdue - a.daysOverdue);
    setMissedTasks(missed);
  };

  const isOverdue = (date) => {
    const today = new Date();
    const taskDate = new Date(date);
    return taskDate < today;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>🌱 My Plant Dashboard</h1>
      
      {/* Missed Tasks Alert */}
      {missedTasks.length > 0 && (
        <div className="alert alert-danger" style={{marginTop: '20px'}}>
          <h3 style={{margin: '0 0 10px 0', fontSize: '1.2rem'}}>⚠️ Missed Tasks ({missedTasks.length})</h3>
          <ul style={{margin: 0, paddingLeft: '20px'}}>
            {missedTasks.slice(0, 5).map((task, index) => (
              <li key={index}>
                <Link to={`/plant/${task.plantId}`} style={{color: 'inherit', fontWeight: 'bold'}}>
                  {task.plantName}
                </Link>
                {' - '}
                {task.type === 'watering' ? '💧 Watering' : '🌱 Fertilizing'}
                {' - '}
                <strong>{task.daysOverdue} days overdue</strong>
              </li>
            ))}
          </ul>
          {missedTasks.length > 5 && (
            <p style={{margin: '10px 0 0 0', fontStyle: 'italic'}}>
              And {missedTasks.length - 5} more...
            </p>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid" style={{marginTop: '20px'}}>
        <div className="stat-card">
          <div className="stat-number">{stats.totalPlants}</div>
          <div className="stat-label">Total Plants</div>
        </div>
        <div className="stat-card" style={{borderLeft: '4px solid #e74c3c'}}>
          <div className="stat-number" style={{color: '#e74c3c'}}>{stats.overdueWatering}</div>
          <div className="stat-label">Overdue Watering</div>
        </div>
        <div className="stat-card" style={{borderLeft: '4px solid #f39c12'}}>
          <div className="stat-number" style={{color: '#f39c12'}}>{stats.overdueFertilizing}</div>
          <div className="stat-label">Overdue Fertilizing</div>
        </div>
        <div className="stat-card" style={{borderLeft: '4px solid #27ae60'}}>
          <div className="stat-number" style={{color: '#27ae60'}}>{stats.tasksCompleted}</div>
          <div className="stat-label">Tasks Completed</div>
        </div>
      </div>

      {/* Upcoming Tasks Section */}
      <div style={{marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px'}}>
        {/* Upcoming Watering */}
        <div className="card">
          <h2 style={{fontSize: '1.3rem', marginBottom: '15px'}}>💧 Upcoming Watering</h2>
          {upcomingTasks.watering.length === 0 ? (
            <p style={{color: 'var(--text-light)'}}>No watering tasks in the next 7 days</p>
          ) : (
            <ul style={{listStyle: 'none', padding: 0}}>
              {upcomingTasks.watering.map((task, index) => (
                <li key={index} style={{
                  padding: '10px',
                  marginBottom: '8px',
                  background: 'var(--bg-gradient-start)',
                  borderRadius: '8px',
                  borderLeft: '3px solid var(--primary-green)'
                }}>
                  <Link to={`/plant/${task._id}`} style={{textDecoration: 'none', color: 'inherit'}}>
                    <strong>{task.name}</strong>
                    <div style={{fontSize: '0.9rem', color: 'var(--text-light)', marginTop: '4px'}}>
                      {task.daysUntil === 0 ? 'Today' : task.daysUntil === 1 ? 'Tomorrow' : `In ${task.daysUntil} days`}
                      {' - '}
                      {formatDate(task.dueDate)}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Upcoming Fertilizing */}
        <div className="card">
          <h2 style={{fontSize: '1.3rem', marginBottom: '15px'}}>🌱 Upcoming Fertilizing</h2>
          {upcomingTasks.fertilizing.length === 0 ? (
            <p style={{color: 'var(--text-light)'}}>No fertilizing tasks in the next 7 days</p>
          ) : (
            <ul style={{listStyle: 'none', padding: 0}}>
              {upcomingTasks.fertilizing.map((task, index) => (
                <li key={index} style={{
                  padding: '10px',
                  marginBottom: '8px',
                  background: 'var(--bg-gradient-start)',
                  borderRadius: '8px',
                  borderLeft: '3px solid var(--light-green)'
                }}>
                  <Link to={`/plant/${task._id}`} style={{textDecoration: 'none', color: 'inherit'}}>
                    <strong>{task.name}</strong>
                    <div style={{fontSize: '0.9rem', color: 'var(--text-light)', marginTop: '4px'}}>
                      {task.daysUntil === 0 ? 'Today' : task.daysUntil === 1 ? 'Tomorrow' : `In ${task.daysUntil} days`}
                      {' - '}
                      {formatDate(task.dueDate)}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Add plant button */}
      <Link to="/add-plant">
        <button className="btn btn-primary" style={{marginTop: '30px', marginBottom: '20px'}}>
          ➕ Add New Plant
        </button>
      </Link>

      {/* All Plants Overview */}
      <h2 style={{marginTop: '20px'}}>All My Plants</h2>
      {plants.length === 0 ? (
        <p>No plants added yet. Add your first plant!</p>
      ) : (
        <div className="plant-grid">
          {plants.map((plant) => (
            <Link to={`/plant/${plant._id}`} key={plant._id} style={{textDecoration: 'none', color: 'inherit'}}>
              <div className="plant-card">
                {plant.image ? (
                  <img src={plant.image} alt={plant.name} />
                ) : (
                  <div style={{height: '200px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', marginBottom: '1rem', fontSize: '3rem'}}>
                    🌱
                  </div>
                )}
                
                <h3>{plant.name}</h3>
                <div className="plant-info"><strong>Type:</strong> {plant.type}</div>
                
                <div style={{marginTop: '10px'}}>
                  {isOverdue(plant.nextWateringDate) ? (
                    <span className="plant-badge badge-overdue">💧 Water Overdue</span>
                  ) : (
                    <span className="plant-badge badge-ok">💧 Water OK</span>
                  )}
                  
                  {isOverdue(plant.nextFertilizingDate) && (
                    <span className="plant-badge badge-overdue">🌱 Fertilize Overdue</span>
                  )}
                </div>

                <div className="plant-info" style={{marginTop: '10px'}}>
                  Next Water: {formatDate(plant.nextWateringDate)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
