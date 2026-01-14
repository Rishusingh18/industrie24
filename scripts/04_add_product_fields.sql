-- Add product_type column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_type VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS model VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);

-- Create index for product_type
CREATE INDEX IF NOT EXISTS idx_products_type ON products(product_type);
