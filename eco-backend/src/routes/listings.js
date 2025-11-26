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
    /**
     * GET /
     * Retrieves all active listings with remaining quantity.
     */
    router.get('/', async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM listings WHERE status = $1 AND remaining_quantity > 0', ['active']);
            res.json(toCamelCase(result.rows));
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    });

    /**
     * GET /restaurant/:restaurantId
     * Retrieves all listings for a specific restaurant.
     */
    router.get('/restaurant/:restaurantId', async (req, res) => {
        try {
            const { restaurantId } = req.params;
            const result = await pool.query('SELECT * FROM listings WHERE restaurant_id = $1', [restaurantId]);
            res.json(toCamelCase(result.rows));
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    });

    /**
     * POST /
     * Creates a new listing.
     * Calculates expiration time based on input hours.
     */
    router.post('/', async (req, res) => {
        try {
            const { restaurantId, title, description, originalPrice, discountedPrice, quantity, expiresInHours, isPriorityAccess, imageUrl, tags = [] } = req.body;

            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + parseInt(expiresInHours));

            const result = await pool.query(
                `INSERT INTO listings (
          restaurant_id, title, description, original_price, discounted_price, 
          quantity, remaining_quantity, expires_at, is_priority_access, image_url, tags
        ) VALUES ($1, $2, $3, $4, $5, $6, $6, $7, $8, $9, $10) RETURNING *`,
                [restaurantId, title, description, originalPrice, discountedPrice, quantity, expiresAt, isPriorityAccess, imageUrl, tags]
            );
            res.status(201).json(toCamelCase(result.rows[0]));
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    });

    return router;
};
