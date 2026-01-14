-- Add new columns to products table for company name and model
ALTER TABLE products ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS model VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_type VARCHAR(100);

-- Create analytics events table for tracking user behavior
CREATE TABLE IF NOT EXISTS analytics_events (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  user_id UUID,
  session_id VARCHAR(255),
  product_id INTEGER REFERENCES products(id),
  event_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create page views table
CREATE TABLE IF NOT EXISTS page_views (
  id SERIAL PRIMARY KEY,
  user_id UUID,
  session_id VARCHAR(255),
  page_path VARCHAR(500),
  referrer VARCHAR(500),
  user_agent TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create conversion tracking table
CREATE TABLE IF NOT EXISTS conversions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  product_id INTEGER REFERENCES products(id),
  order_id INTEGER REFERENCES orders(id),
  value DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for analytics
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created ON analytics_events(created_at);
CREATE INDEX idx_page_views_created ON page_views(created_at);
CREATE INDEX idx_conversions_user_id ON conversions(user_id);
CREATE INDEX idx_conversions_created ON conversions(created_at);
