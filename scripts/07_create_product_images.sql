-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id),
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for performance
CREATE INDEX idx_product_images_product_id ON product_images(product_id);

-- Optional: Seed some initial data for testing (replace 1 with valid product ID)
-- INSERT INTO product_images (product_id, image_url) VALUES 
-- (1, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'),
-- (1, 'https://images.unsplash.com/photo-1581093458891-b9883f8b629e');
