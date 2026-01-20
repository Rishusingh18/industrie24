import os
import pandas as pd
import requests
import re
import json
import random
import string

# Config
EXCEL_FILE = 'product.xlsx'
SUPABASE_URL = "https://ahbwqahnyvnywegexjoj.supabase.co"
SUPABASE_KEY = "sb_publishable_mQpMmWV02v1JlvfTkZWGkw_RwL2q3QA" # From .env.local

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

def clean_price(price_str):
    if pd.isna(price_str) or price_str == 'N/A':
        return 0.0
    # Remove currency symbols and cleanup
    # Assuming "99,00 €" -> 99.00
    cleaned = str(price_str).replace('€', '').replace('EUR', '').strip()
    cleaned = cleaned.replace(',', '.') # Replace comma decimal with dot
    try:
        # Extract first float found
        match = re.search(r"(\d+\.?\d*)", cleaned)
        if match:
            return float(match.group(1))
        return float(cleaned)
    except:
        return 0.0

def generate_sku(name, manufacturer):
    # Create valid SKU
    prefix = (manufacturer[:3] if manufacturer and manufacturer != 'N/A' else 'GEN').upper()
    slug = re.sub(r'[^a-zA-Z0-9]', '', name)[:10].upper()
    random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"{prefix}-{slug}-{random_suffix}"

def import_products():
    print(f"Reading {EXCEL_FILE}...")
    try:
        df = pd.read_excel(EXCEL_FILE)
    except Exception as e:
        print(f"Error reading excel: {e}")
        return

    print(f"Found {len(df)} rows.")

    # 1. Delete existing products
    # Note: This might fail if RLS prevents deletion or foreign keys exist without cascade.
    print("Deleting existing products...")
    try:
        # Delete using simple filter 'id.gt.0'
        del_res = requests.delete(
            f"{SUPABASE_URL}/rest/v1/products?id=gt.0",
            headers=HEADERS
        )
        if del_res.status_code >= 400:
            print(f"Warning: Failed to delete products. {del_res.text}")
        else:
            print("Existing products deleted.")
    except Exception as e:
        print(f"Error deleting: {e}")

    # 2. Prepare batches
    products_to_insert = []
    
    for index, row in df.iterrows():
        name = row.get('Product Name', 'Unknown')
        if pd.isna(name) or name == 'N/A':
            continue

        manufacturer = row.get('Manufacturer', 'N/A')
        product_type = row.get('Product Type', 'Generic')
        if pd.isna(product_type) or product_type == 'N/A':
             product_type = 'Industrial Part'
             
        price = clean_price(row.get('Price'))
        image_url = row.get('Image URL')
        if pd.isna(image_url) or image_url == 'N/A':
            image_url = None
            
        sku = generate_sku(name, manufacturer)
        
        product = {
            "name": name,
            "description": f"{product_type} by {manufacturer}",
            "category": product_type, # Mapping Product Type to Category
            "price": price,
            "sku": sku,
            "stock_quantity": random.randint(1, 50), # Default stock
            "image_url": image_url,
            "company_name": manufacturer if manufacturer != 'N/A' else None,
            "product_type": product_type
        }
        products_to_insert.append(product)

    # 3. Insert in batches
    BATCH_SIZE = 100
    print(f"Inserting {len(products_to_insert)} products in batches of {BATCH_SIZE}...")
    
    for i in range(0, len(products_to_insert), BATCH_SIZE):
        batch = products_to_insert[i:i + BATCH_SIZE]
        try:
            res = requests.post(
                f"{SUPABASE_URL}/rest/v1/products",
                headers=HEADERS,
                json=batch
            )
            if res.status_code >= 400:
                print(f"Batch {i//BATCH_SIZE + 1} failed: {res.text}")
            else:
                print(f"Batch {i//BATCH_SIZE + 1} inserted.")
        except Exception as e:
             print(f"Error checking batch {i}: {e}")

    print("Import complete.")

if __name__ == "__main__":
    import_products()
