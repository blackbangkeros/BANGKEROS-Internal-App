const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your Neon connection string
const pool = new Pool({
  connectionString: 'postgres://user:password@host:port/dbname',
  ssl: { rejectUnauthorized: false }
});

// Example: User login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await pool.query(
    'SELECT * FROM users WHERE username = $1 AND password = $2',
    [username, password]
  );
  if (result.rows.length > 0) {
    res.json({ success: true, user: result.rows[0] });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));