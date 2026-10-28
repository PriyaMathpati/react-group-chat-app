
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function login(e) {
    e.preventDefault();
    setError('');

    // Validate empty fields
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);

    try {
      // Send login request to backend API
      const response = await fetch(
        'http://localhost:5000/api/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: username.trim().toLowerCase(),
            password
          })
        }
      );

      // Read backend response
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Invalid username or password.');
        return;
      }

      // Save session only after successful backend validation
      localStorage.setItem(
        'chatUser',
        JSON.stringify({ name: data.user.name })
      );

      // Navigate to chat page
      navigate('/chat');
    } catch (err) {
      console.error('Login API error:', err);
      setError(
        'Unable to connect to the server. Please make sure the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={login}>
        <div className="chat-icon">💬</div>

        <h1>Welcome Back!</h1>

        <p className="subtitle">
          Sign in to your group chat
        </p>

        <label htmlFor="username">Username</label>

        <input
          id="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Enter username"
          autoComplete="username"
        />

        <label htmlFor="password">Password</label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter password"
          autoComplete="current-password"
        />

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="demo-info">
          Demo username: <b>priya</b>
          <br />
          Demo password: <b>chat123</b>
        </p>
      </form>
    </main>
  );
}

export default Login;
