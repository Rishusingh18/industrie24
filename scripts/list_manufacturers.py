import os
import requests
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env.local")

SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

def list_manufacturers():
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Range": "0-49999"
    }
    
    url = f"{SUPABASE_URL}/rest/v1/products?select=company_name"
    
    try:
        resp = requests.get(url, headers=headers)
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        print(f"Error fetching: {e}")
        return

    all_brands = set()
    for item in data:
        if item.get('company_name'):
            all_brands.add(item['company_name'])
            
    sorted_brands = sorted(list(all_brands))
    
    print(f"Total Unique Manufacturers: {len(sorted_brands)}")
    print("-" * 30)
    for brand in sorted_brands:
        print(brand)

if __name__ == "__main__":
    list_manufacturers()
