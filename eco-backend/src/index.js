const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'ecobites',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Connected to PostgreSQL database');
    release();
});

// Routes
app.use('/api/users', require('./routes/users')(pool));
app.use('/api/restaurants', require('./routes/restaurants')(pool));
app.use('/api/listings', require('./routes/listings')(pool));
app.use('/api/orders', require('./routes/orders')(pool));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/seed', require('./routes/seed')(pool));

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
