import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/auth.css';

function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();
		// Store a dummy token to satisfy isLoggedIn check
		localStorage.setItem('token', 'dummy-token');
		// Redirect to home page
		navigate('/home');
	};

	return (
		<div className="auth-container">
			<div className="auth-card">
				<h2>Login</h2>

				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label>Username</label>
						<input
							type="text"
							placeholder="Username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</div>

					<div className="form-group">
						<label>Password</label>
						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>

					<button type="submit" className="btn btn-primary">
						Login
					</button>
				</form>

				<p style={{ marginTop: '1rem' }}>
					Don't have an account? <Link to="/register">Register here</Link>
				</p>
			</div>
		</div>
	);
}

export default Login;
