
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Allow the React frontend to access the backend
app.use(cors());
app.use(express.json());

// Test API
app.get('/', (req, res) => {
  res.json({
    message: 'Group Chat Backend is running!'
  });
});

// Login API
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'priya' && password === 'chat123') {
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        username: 'priya',
        name: 'Priya'
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid username or password'
  });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
