-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'restaurant')),
    name TEXT NOT NULL,
    phone TEXT,
    is_priority BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    premium_plan TEXT CHECK (premium_plan IN ('monthly', 'annual')),
    premium_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Restaurants Table
CREATE TABLE restaurants (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users(id),
    name TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    logo TEXT,
    rating NUMERIC DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    earnings NUMERIC DEFAULT 0,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Listings Table
CREATE TABLE listings (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id TEXT NOT NULL REFERENCES restaurants(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    original_price NUMERIC NOT NULL,
    discounted_price NUMERIC NOT NULL,
    quantity INTEGER NOT NULL,
    remaining_quantity INTEGER NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    image_url TEXT,
    tags TEXT[],
    is_priority_access BOOLEAN DEFAULT FALSE,
    status TEXT CHECK (status IN ('active', 'expired', 'sold_out')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users(id),
    subtotal NUMERIC NOT NULL,
    service_fee NUMERIC NOT NULL,
    savings NUMERIC NOT NULL,
    total_price NUMERIC NOT NULL,
    status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
    pickup_time TIMESTAMP WITH TIME ZONE,
    delivery_address TEXT,
    special_instructions TEXT,
    restaurant_ids TEXT[], -- Storing as array of IDs for simplicity, could be normalized
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE order_items (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT NOT NULL REFERENCES orders(id),
    listing_id TEXT NOT NULL REFERENCES listings(id),
    quantity INTEGER NOT NULL,
    price_at_purchase NUMERIC NOT NULL
);

-- Bookmarks Table
CREATE TABLE bookmarks (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users(id),
    listing_id TEXT NOT NULL REFERENCES listings(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, listing_id)
);

-- Notifications Table
CREATE TABLE notifications (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('new_listing', 'expiring_soon', 'order_update', 'general')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data (Optional - for testing)
INSERT INTO users (email, role, name, is_priority, is_premium) VALUES 
('user@example.com', 'user', 'John Doe', FALSE, FALSE),
('restaurant@example.com', 'restaurant', 'Green Eats', FALSE, FALSE);
