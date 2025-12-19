import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/auth.css';

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			const emailNorm = email.trim().toLowerCase();

			const response = await fetch('http://localhost:5000/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email: emailNorm, password })
			});

			const data = await response.json().catch(() => ({}));
			console.log('Login response:', response.status, data);

			if (response.ok && data.token) {
				// Save token and userId
				localStorage.setItem('token', data.token);
				if (data.userId) localStorage.setItem('userId', data.userId);
				// navigate to home (or dashboard)
				navigate('/home');
			} else {
				setError(data.message || 'Login failed. Check credentials.');
			}
		} catch (err) {
			console.error('Login error', err);
			setError('Cannot connect to server');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-container">
			<div className="auth-card">
				<h2>Login</h2>

				{error && <div className="alert alert-danger">{error}</div>}

				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label>Email</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					<div className="form-group">
						<label>Password</label>
						<div style={{ position: 'relative' }}>
							<input
								type={showPassword ? 'text' : 'password'}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								style={{ paddingRight: '40px' }}
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								style={{
									position: 'absolute',
									right: '10px',
									top: '50%',
									transform: 'translateY(-50%)',
									background: 'none',
									border: 'none',
									cursor: 'pointer',
									fontSize: '1.2rem'
								}}
								title={showPassword ? 'Hide password' : 'Show password'}
							>
								{showPassword ? '🙈' : '👁️'}
							</button>
						</div>
					</div>

					<button type="submit" className="btn btn-primary" disabled={loading}>
						{loading ? 'Logging in...' : 'Login'}
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
