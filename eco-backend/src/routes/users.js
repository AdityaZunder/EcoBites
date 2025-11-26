const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    /**
     * GET /:id
     * Retrieves a specific user by their ID.
     */
    router.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    });

    /**
     * POST /
     * Creates a new user.
     */
    router.post('/', async (req, res) => {
        try {
            const { email, role, name, phone } = req.body;
            const result = await pool.query(
                'INSERT INTO users (email, role, name, phone) VALUES ($1, $2, $3, $4) RETURNING *',
                [email, role, name, phone]
            );
            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    });

    /**
     * PATCH /:id/premium
     * Updates the premium status of a user.
     */
    router.patch('/:id/premium', async (req, res) => {
        try {
            const { id } = req.params;
            const { isPremium, premiumPlan, premiumExpiresAt } = req.body;
            const result = await pool.query(
                'UPDATE users SET is_premium = $1, premium_plan = $2, premium_expires_at = $3 WHERE id = $4 RETURNING *',
                [isPremium, premiumPlan, premiumExpiresAt, id]
            );
            res.json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    });

    return router;
};
