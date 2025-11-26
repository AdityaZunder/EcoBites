const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    router.post('/', async (req, res) => {
        try {
            // Check if data already exists
            const userCheck = await pool.query("SELECT * FROM users WHERE email = 'restaurant@demo.com'");
            if (userCheck.rows.length > 0) {
                return res.json({ message: 'Data already seeded' });
            }

            // Insert Users
            await pool.query(`
        INSERT INTO users (id, email, role, name, phone, is_priority, is_premium) VALUES 
        ('user-1', 'user@demo.com', 'user', 'Demo User', '+1 555-0100', FALSE, FALSE),
        ('user-rest-1', 'restaurant@demo.com', 'restaurant', 'Green Leaf Bistro', '+1 555-0101', FALSE, FALSE)
      `);

            // Insert Restaurant
            await pool.query(`
        INSERT INTO restaurants (id, user_id, name, description, address, phone, category, rating, total_orders) VALUES 
        ('restaurant-1', 'user-rest-1', 'Green Leaf Bistro', 'Fresh, organic, and delicious meals.', '123 Green St, Eco City', '+1 555-0101', 'Healthy', 4.8, 150)
      `);

            res.json({ message: 'Database seeded successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Seeding failed' });
        }
    });

    return router;
};
