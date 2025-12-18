import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function PlantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plant, setPlant] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlantDetails();
    fetchActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPlantDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/plants/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setPlant(data);
      }
    } catch (err) {
      console.log('Error fetching plant:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/activities?plantId=${id}`, {
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
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this plant?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/plants/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          alert('Plant deleted successfully!');
          navigate('/dashboard');
        }
      } catch (err) {
        alert('Failed to delete plant');
      }
    }
  };

  const handleWatered = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/plants/${id}/water`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Plant watered! 💧');
        fetchPlantDetails();
        fetchActivities();
      }
    } catch (err) {
      alert('Failed to update');
    }
  };

  const handleFertilized = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/plants/${id}/fertilize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Plant fertilized! 🌱');
        fetchPlantDetails();
        fetchActivities();
      }
    } catch (err) {
      alert('Failed to update');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString();
  };

  const isOverdue = (date) => {
    return new Date(date) < new Date();
  };

  // Separate activities by type
  const getWateringHistory = () => {
    return activities.filter(a => a.type === 'watered').sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const getFertilizingHistory = () => {
    return activities.filter(a => a.type === 'fertilized').sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!plant) {
    return <div className="container">Plant not found</div>;
  }

  const wateringHistory = getWateringHistory();
  const fertilizingHistory = getFertilizingHistory();

  return (
    <div className="container">
      {/* Back button */}
      <Link to="/dashboard" style={{ textDecoration: 'none', color: 'var(--primary-green)', fontSize: '1.1rem', marginBottom: '20px', display: 'inline-block' }}>
        ← Back to Dashboard
      </Link>

      <h1 style={{ marginTop: '10px' }}>🌿 {plant.name}</h1>

      {/* Main Plant Profile Card */}
      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: plant.image ? '300px 1fr' : '1fr', gap: '30px' }}>
          {/* Plant Image */}
          {plant.image && (
            <div>
              <img
                src={plant.image}
                alt={plant.name}
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px var(--shadow-light)'
                }}
              />
            </div>
          )}

          {/* Plant Information */}
          <div>
            <h2 style={{ marginTop: 0, color: 'var(--primary-green)' }}>Plant Profile</h2>

            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: 'var(--text-dark)' }}>Type:</strong>
              <div style={{ fontSize: '1.1rem', marginTop: '5px' }}>{plant.type}</div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: 'var(--text-dark)' }}>Watering Frequency:</strong>
              <div style={{ fontSize: '1.1rem', marginTop: '5px' }}>Every {plant.wateringFrequency} days</div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: 'var(--text-dark)' }}>Fertilizing Frequency:</strong>
              <div style={{ fontSize: '1.1rem', marginTop: '5px' }}>Every {plant.fertilizingFrequency} days</div>
            </div>

            {plant.notes && (
              <div style={{ marginTop: '20px' }}>
                <strong style={{ color: 'var(--text-dark)' }}>Notes:</strong>
                <div style={{
                  marginTop: '8px',
                  padding: '15px',
                  background: 'var(--bg-gradient-start)',
                  borderRadius: '8px',
                  fontStyle: 'italic',
                  color: 'var(--text-light)'
                }}>
                  {plant.notes}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {/* Watering Status */}
        <div className="card" style={{ background: isOverdue(plant.nextWateringDate) ? '#fff5f5' : '#f0fdf4', borderLeft: `4px solid ${isOverdue(plant.nextWateringDate) ? 'var(--danger-red)' : 'var(--primary-green)'}` }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2rem' }}>💧 Watering Schedule</h3>
          <div style={{ marginBottom: '10px' }}>
            <strong>Last Watered:</strong>
            <div style={{ marginTop: '5px' }}>{formatDate(plant.lastWatered)}</div>
          </div>
          <div>
            <strong>Next Watering:</strong>
            <div style={{ marginTop: '5px', fontSize: '1.1rem', fontWeight: '600', color: isOverdue(plant.nextWateringDate) ? 'var(--danger-red)' : 'var(--primary-green)' }}>
              {formatDate(plant.nextWateringDate)}
              {isOverdue(plant.nextWateringDate) && <span> ⚠️ OVERDUE</span>}
            </div>
          </div>
        </div>

        {/* Fertilizing Status */}
        <div className="card" style={{ background: isOverdue(plant.nextFertilizingDate) ? '#fff5f5' : '#f0fdf4', borderLeft: `4px solid ${isOverdue(plant.nextFertilizingDate) ? 'var(--danger-red)' : 'var(--light-green)'}` }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2rem' }}>🌱 Fertilizing Schedule</h3>
          <div style={{ marginBottom: '10px' }}>
            <strong>Last Fertilized:</strong>
            <div style={{ marginTop: '5px' }}>{formatDate(plant.lastFertilized)}</div>
          </div>
          <div>
            <strong>Next Fertilizing:</strong>
            <div style={{ marginTop: '5px', fontSize: '1.1rem', fontWeight: '600', color: isOverdue(plant.nextFertilizingDate) ? 'var(--danger-red)' : 'var(--light-green)' }}>
              {formatDate(plant.nextFertilizingDate)}
              {isOverdue(plant.nextFertilizingDate) && <span> ⚠️ OVERDUE</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={handleWatered} className="btn btn-primary">
          💧 Mark as Watered
        </button>
        <button onClick={handleFertilized} className="btn btn-primary">
          🌱 Mark as Fertilized
        </button>
        <Link to={`/edit-plant/${id}`}>
          <button className="btn btn-secondary">
            ✏️ Edit Plant
          </button>
        </Link>
        <button onClick={handleDelete} className="btn btn-danger">
          🗑️ Delete Plant
        </button>
      </div>

      {/* History Timeline Section */}
      <div style={{ marginTop: '40px' }}>
        <h2>📊 Activity History</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {/* Watering History Timeline */}
          <div className="card">
            <h3 style={{ margin: '0 0 20px 0', color: 'var(--primary-green)' }}>💧 Watering History</h3>
            {wateringHistory.length === 0 ? (
              <p style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>No watering activities recorded yet</p>
            ) : (
              <ul className="activity-list">
                {wateringHistory.map((activity) => (
                  <li key={activity._id} className="activity-item">
                    <div className="activity-type">💧 Watered</div>
                    <div className="activity-date">{formatDateTime(activity.date)}</div>
                    {activity.note && <div className="activity-note">{activity.note}</div>}
                  </li>
                ))}
              </ul>
            )}
            <div style={{ marginTop: '15px', padding: '10px', background: 'var(--bg-gradient-start)', borderRadius: '8px', fontSize: '0.9rem' }}>
              <strong>Total watering sessions:</strong> {wateringHistory.length}
            </div>
          </div>

          {/* Fertilizing History Timeline */}
          <div className="card">
            <h3 style={{ margin: '0 0 20px 0', color: 'var(--light-green)' }}>🌱 Fertilizing History</h3>
            {fertilizingHistory.length === 0 ? (
              <p style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>No fertilizing activities recorded yet</p>
            ) : (
              <ul className="activity-list">
                {fertilizingHistory.map((activity) => (
                  <li key={activity._id} className="activity-item" style={{ borderLeftColor: 'var(--light-green)' }}>
                    <div className="activity-type" style={{ color: 'var(--light-green)' }}>🌱 Fertilized</div>
                    <div className="activity-date">{formatDateTime(activity.date)}</div>
                    {activity.note && <div className="activity-note">{activity.note}</div>}
                  </li>
                ))}
              </ul>
            )}
            <div style={{ marginTop: '15px', padding: '10px', background: 'var(--bg-gradient-start)', borderRadius: '8px', fontSize: '0.9rem' }}>
              <strong>Total fertilizing sessions:</strong> {fertilizingHistory.length}
            </div>
          </div>
        </div>
      </div>

      {/* Growth Images Timeline - Placeholder for future feature */}
      <div className="card" style={{ marginTop: '30px', background: 'var(--bg-gradient-start)', border: '2px dashed var(--primary-green)' }}>
        <h3 style={{ margin: '0 0 10px 0', color: 'var(--primary-green)' }}>📸 Growth Images Timeline</h3>
        <p style={{ color: 'var(--text-light)', fontStyle: 'italic', margin: 0 }}>
          Coming soon: Track your plant's growth with photos over time!
        </p>
      </div>
    </div>
  );
}

export default PlantDetails;
