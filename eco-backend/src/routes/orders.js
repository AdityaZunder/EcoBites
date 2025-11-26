const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    // Get orders by user
    router.get('/user/:userId', async (req, res) => {
        try {
            const { userId } = req.params;
            const result = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);

            // Fetch items for each order with full details
            const orders = await Promise.all(result.rows.map(async (order) => {
                const itemsResult = await pool.query(`
                    SELECT oi.*, l.title, l.description, l.image_url, l.original_price, l.discounted_price, r.name as restaurant_name
                    FROM order_items oi
                    JOIN listings l ON oi.listing_id = l.id
                    JOIN restaurants r ON l.restaurant_id = r.id
                    WHERE oi.order_id = $1
                `, [order.id]);

                const items = itemsResult.rows.map(item => ({
                    id: item.id,
                    listing: {
                        id: item.listing_id,
                        title: item.title,
                        description: item.description,
                        imageUrl: item.image_url,
                        originalPrice: parseFloat(item.original_price),
                        discountedPrice: parseFloat(item.discounted_price),
                        restaurant: {
                            name: item.restaurant_name
                        }
                    },
                    quantity: item.quantity,
                    priceAtPurchase: parseFloat(item.price_at_purchase)
                }));

                return {
                    ...order,
                    items,
                    subtotal: parseFloat(order.subtotal),
                    serviceFee: parseFloat(order.service_fee),
                    savings: parseFloat(order.savings),
                    totalPrice: parseFloat(order.total_price)
                };
            }));

            res.json(orders);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    });

    // Get order details by ID
    router.get('/detail/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);

            if (orderResult.rows.length === 0) {
                return res.status(404).json({ error: 'Order not found' });
            }

            const order = orderResult.rows[0];

            // Fetch items for the order
            const itemsResult = await pool.query(`
                SELECT oi.*, l.title, l.description, l.image_url, l.original_price, l.discounted_price, r.name as restaurant_name
                FROM order_items oi
                JOIN listings l ON oi.listing_id = l.id
                JOIN restaurants r ON l.restaurant_id = r.id
                WHERE oi.order_id = $1
            `, [id]);

            // Format items to match frontend expectation
            const items = itemsResult.rows.map(item => ({
                id: item.id,
                listing: {
                    id: item.listing_id,
                    title: item.title,
                    description: item.description,
                    imageUrl: item.image_url,
                    originalPrice: parseFloat(item.original_price),
                    discountedPrice: parseFloat(item.discounted_price),
                    restaurant: {
                        name: item.restaurant_name
                    }
                },
                quantity: item.quantity,
                priceAtPurchase: parseFloat(item.price_at_purchase)
            }));

            res.json({
                ...order,
                items,
                subtotal: parseFloat(order.subtotal),
                serviceFee: parseFloat(order.service_fee),
                savings: parseFloat(order.savings),
                totalPrice: parseFloat(order.total_price)
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    });

    // Get orders by restaurant
    router.get('/restaurant/:restaurantId', async (req, res) => {
        try {
            const { restaurantId } = req.params;

            // Get orders that contain items from this restaurant
            // We need to join with order_items and listings to filter by restaurant_id
            // Also join with users to get customer name
            const result = await pool.query(`
                SELECT DISTINCT o.*, u.name as user_name, u.email as user_email
                FROM orders o
                JOIN order_items oi ON o.id = oi.order_id
                JOIN listings l ON oi.listing_id = l.id
                JOIN users u ON o.user_id = u.id
                WHERE l.restaurant_id = $1
                ORDER BY o.created_at DESC
            `, [restaurantId]);

            // For each order, fetch the items specific to this restaurant
            const orders = await Promise.all(result.rows.map(async (order) => {
                const itemsResult = await pool.query(`
                    SELECT oi.*, l.title, l.image_url
                    FROM order_items oi
                    JOIN listings l ON oi.listing_id = l.id
                    WHERE oi.order_id = $1 AND l.restaurant_id = $2
                `, [order.id, restaurantId]);

                return {
                    ...order,
                    items: itemsResult.rows.map(item => ({
                        ...item,
                        priceAtPurchase: parseFloat(item.price_at_purchase)
                    })),
                    totalPrice: parseFloat(order.total_price),
                    subtotal: parseFloat(order.subtotal),
                    serviceFee: parseFloat(order.service_fee),
                    savings: parseFloat(order.savings),
                    userName: order.user_name,
                    userEmail: order.user_email
                };
            }));

            res.json(orders);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    });

    // Create order
    router.post('/', async (req, res) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const { userId, items, subtotal, serviceFee, savings, totalPrice, restaurantIds, deliveryAddress, pickupTime, specialInstructions } = req.body;

            // Validate quantities before creating order
            for (const item of items) {
                const listingResult = await client.query('SELECT remaining_quantity, title FROM listings WHERE id = $1', [item.listing.id]);
                if (listingResult.rows.length === 0) {
                    throw new Error(`Listing not found: ${item.listing.id}`);
                }
                const listing = listingResult.rows[0];
                if (listing.remaining_quantity < item.quantity) {
                    throw new Error(`Insufficient quantity for ${listing.title}. Available: ${listing.remaining_quantity}, Requested: ${item.quantity}`);
                }
            }

            // Create Order
            let order;
            try {
                const orderResult = await client.query(
                    `INSERT INTO orders (
          user_id, subtotal, service_fee, savings, total_price, restaurant_ids, delivery_address, pickup_time, special_instructions
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
                    [userId, subtotal, serviceFee, savings, totalPrice, restaurantIds, deliveryAddress, pickupTime, specialInstructions]
                );
                order = orderResult.rows[0];
            } catch (e) {
                throw new Error('Order insert failed: ' + e.message);
            }

            // Create Order Items
            for (const item of items) {
                try {
                    await client.query(
                        `INSERT INTO order_items (
            order_id, listing_id, quantity, price_at_purchase
          ) VALUES ($1, $2, $3, $4)`,
                        [order.id, item.listing.id, item.quantity, item.priceAtPurchase]
                    );
                } catch (e) {
                    throw new Error('Item insert failed: ' + e.message);
                }

                // Update listing quantity and status
                try {
                    await client.query(
                        `UPDATE listings 
                     SET remaining_quantity = remaining_quantity - $1,
                         status = CASE 
                           WHEN remaining_quantity - $1 <= 0 THEN 'sold_out'
                           ELSE status
                         END
                     WHERE id = $2`,
                        [item.quantity, item.listing.id]
                    );
                } catch (e) {
                    throw new Error('Listing update failed: ' + e.message);
                }

                // Update restaurant earnings and total orders
                try {
                    const itemTotal = item.priceAtPurchase * item.quantity;
                    await client.query(
                        `UPDATE restaurants
                     SET total_orders = total_orders + 1,
                         earnings = COALESCE(earnings, 0) + $1
                     WHERE id = $2`,
                        [itemTotal, item.listing.restaurantId]
                    );
                } catch (e) {
                    throw new Error('Restaurant update failed: ' + e.message);
                }
            }

            await client.query('COMMIT');

            // TODO: Send notification to restaurant(s) about the new order
            // This will be implemented when real-time notification system is added

            res.status(201).json(order);
        } catch (err) {
            await client.query('ROLLBACK');
            console.error(err);
            res.status(500).json({ error: err.message });
        } finally {
            client.release();
        }
    });

    return router;
};
