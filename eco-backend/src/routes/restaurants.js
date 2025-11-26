const express = require('express');
const router = express.Router();

// Helper function to convert snake_case to camelCase and ensure proper types
const toCamelCase = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(toCamelCase);
    }
    if (obj !== null && typeof obj === 'object') {
        // Handle Date objects
        if (obj instanceof Date) {
            return obj.toISOString();
        }

        return Object.keys(obj).reduce((acc, key) => {
            const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
            let value = obj[key];

            // Convert numeric strings to numbers for specific fields
            if (['original_price', 'discounted_price', 'quantity', 'remaining_quantity', 'rating', 'total_orders'].includes(key)) {
                value = parseFloat(value);
            }

            // Convert timestamp fields to ISO strings
            if (['expires_at', 'created_at', 'premium_expires_at'].includes(key) && value) {
                value = value instanceof Date ? value.toISOString() : new Date(value).toISOString();
            }

            acc[camelKey] = toCamelCase(value);
            return acc;
        }, {});
    }
    return obj;
};

module.exports = (pool) => {
    // Get all restaurants
    router.get('/', async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM restaurants');
            res.json(toCamelCase(result.rows));
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    });

    // Get restaurant by ID
    router.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const result = await pool.query('SELECT * FROM restaurants WHERE id = $1', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Restaurant not found' });
            }
            res.json(toCamelCase(result.rows[0]));
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    });

    // Create restaurant
    router.post('/', async (req, res) => {
        try {
            const { userId, name, description, address, phone, category } = req.body;
            const result = await pool.query(
                'INSERT INTO restaurants (user_id, name, description, address, phone, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [userId, name, description, address, phone, category]
            );
            res.status(201).json(toCamelCase(result.rows[0]));
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    });

    return router;
};
