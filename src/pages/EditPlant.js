import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditPlant() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Simple state for form inputs
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [wateringFrequency, setWateringFrequency] = useState('');
  const [fertilizingFrequency, setFertilizingFrequency] = useState('');
  const [image, setImage] = useState('');
  const [notes, setNotes] = useState('');
  // NEW: allow editing last watered / last fertilized dates
  const [lastWatered, setLastWatered] = useState('');
  const [lastFertilized, setLastFertilized] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch plant data when page loads
  useEffect(() => {
    fetchPlant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Get existing plant data
  const fetchPlant = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/plants/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        // Fill form with existing data
        setName(data.name);
        setType(data.type);
        setWateringFrequency(data.wateringFrequency);
        setFertilizingFrequency(data.fertilizingFrequency);
        setImage(data.image || '');
        setNotes(data.notes || '');
        // NEW: prefill dates if present (format to yyyy-mm-dd for date input)
        if (data.lastWatered) {
          setLastWatered(new Date(data.lastWatered).toISOString().slice(0,10));
        }
        if (data.lastFertilized) {
          setLastFertilized(new Date(data.lastFertilized).toISOString().slice(0,10));
        }
      }
    } catch (err) {
      console.log('Error fetching plant:', err);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Create updated plant object
      const plantData = {
        name,
        type,
        wateringFrequency: Number(wateringFrequency),
        fertilizingFrequency: Number(fertilizingFrequency),
        image,
        notes,
        // NEW: send updated lastWatered / lastFertilized
        lastWatered: lastWatered || null,
        lastFertilized: lastFertilized || null
      };

      // Call API to update plant
      const response = await fetch(`http://localhost:5000/api/plants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(plantData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Plant updated successfully!');
        navigate(`/plant/${id}`);
      } else {
        setError(data.message || 'Failed to update plant');
      }
    } catch (err) {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Edit Plant</h1>
      
      <div className="card">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Plant Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Plant Type/Species *</label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Watering Frequency (days) *</label>
            <input
              type="number"
              value={wateringFrequency}
              onChange={(e) => setWateringFrequency(e.target.value)}
              required
              min="1"
            />
          </div>

          <div className="form-group">
            <label>Fertilizing Frequency (days) *</label>
            <input
              type="number"
              value={fertilizingFrequency}
              onChange={(e) => setFertilizingFrequency(e.target.value)}
              required
              min="1"
            />
          </div>

          <div className="form-group">
            <label>Plant Image URL (optional)</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
            />
          </div>

          {/* NEW: Last Watered */}
          <div className="form-group">
            <label>Last Watered Date</label>
            <input
              type="date"
              value={lastWatered}
              onChange={(e) => setLastWatered(e.target.value)}
            />
          </div>
          
          {/* NEW: Last Fertilized */}
          <div className="form-group">
            <label>Last Fertilized Date</label>
            <input
              type="date"
              value={lastFertilized}
              onChange={(e) => setLastFertilized(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Plant'}
          </button>
          
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => navigate(`/plant/${id}`)}
            style={{marginLeft: '10px'}}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditPlant;
