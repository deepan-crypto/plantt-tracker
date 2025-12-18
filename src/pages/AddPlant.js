import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddPlant() {
  // Simple state for form inputs
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [wateringFrequency, setWateringFrequency] = useState('');
  const [fertilizingFrequency, setFertilizingFrequency] = useState('');
  const [lastWatered, setLastWatered] = useState('');
  const [lastFertilized, setLastFertilized] = useState('');
  const [image, setImage] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Create plant object
      const plantData = {
        name,
        type,
        wateringFrequency: Number(wateringFrequency),
        fertilizingFrequency: Number(fertilizingFrequency),
        lastWatered,
        lastFertilized,
        image,
        notes
      };

      // Call API to add plant
      const response = await fetch('http://localhost:5000/api/plants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(plantData)
      });

      const data = await response.json();

      if (response.ok) {
        // Go back to dashboard
        alert('Plant added successfully!');
        navigate('/dashboard');
      } else {
        setError(data.message || 'Failed to add plant');
      }
    } catch (err) {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Add New Plant</h1>
      
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
              placeholder="e.g., Succulent, Fern, etc."
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
              placeholder="e.g., 7 (water every 7 days)"
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
              placeholder="e.g., 30 (fertilize every 30 days)"
            />
          </div>

          <div className="form-group">
            <label>Last Watered Date *</label>
            <input
              type="date"
              value={lastWatered}
              onChange={(e) => setLastWatered(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Last Fertilized Date *</label>
            <input
              type="date"
              value={lastFertilized}
              onChange={(e) => setLastFertilized(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Plant Image URL (optional)</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/plant-image.jpg"
            />
          </div>

          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              placeholder="Any special care instructions..."
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Adding Plant...' : 'Add Plant'}
          </button>
          
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => navigate('/dashboard')}
            style={{marginLeft: '10px'}}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPlant;
