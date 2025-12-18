import React from 'react';

function Home() {
  return (
    <div className="container">
      <div className="card" style={{textAlign: 'center', padding: '40px'}}>
        <h1 style={{color: '#4CAF50', marginBottom: '20px'}}>🌱 Plant Watering & Fertilizing Tracker</h1>
        <p style={{fontSize: '18px', marginBottom: '30px'}}>
          Keep your plants healthy and happy by tracking their watering and fertilizing schedules!
        </p>
      </div>

      <div className="card">
        <h2>About This Website</h2>
        <p>
          This is a simple plant care tracking application that helps you:
        </p>
        <ul style={{marginLeft: '20px', lineHeight: '1.8'}}>
          <li>📝 Add and manage your plants</li>
          <li>💧 Track watering schedules</li>
          <li>🌱 Track fertilizing schedules</li>
          <li>📊 View your plant care history</li>
          <li>⏰ Get reminders for overdue tasks</li>
        </ul>
        <p style={{marginTop: '20px'}}>
          Never forget to water or fertilize your plants again! This app keeps all your plant care information in one place.
        </p>
      </div>

      <div className="card">
        <h2>How to Use</h2>
        <ol style={{marginLeft: '20px', lineHeight: '1.8'}}>
          <li>Click <strong>"Add Plant"</strong> to add your first plant</li>
          <li>Enter plant details and care schedule</li>
          <li>View all your plants on the <strong>Dashboard</strong></li>
          <li>Click on any plant to see details and mark tasks complete</li>
          <li>Check <strong>Activity History</strong> to see all your plant care activities</li>
        </ol>
      </div>

      <div className="card" style={{backgroundColor: '#f0f8ff'}}>
        <h2>Contact & Developer Info</h2>
        <div style={{lineHeight: '2'}}>
          <p><strong>👨‍💻 Developer:</strong> Deepan</p>
          <p><strong>📧 Email:</strong> <a href="mailto:deepan.g2024cse@sece.ac.in">deepan.g2024cse@sece.ac.in</a></p>
          <p><strong>📱 Phone:</strong> <a href="tel:9361423549">9361423549</a></p>
        </div>
      </div>

      <div className="card" style={{textAlign: 'center', backgroundColor: '#e8f5e9'}}>
        <h3 style={{color: '#4CAF50'}}>🌿 Happy Planting! 🌿</h3>
        <p>Take care of your plants and they'll take care of you!</p>
      </div>
    </div>
  );
}

export default Home;
