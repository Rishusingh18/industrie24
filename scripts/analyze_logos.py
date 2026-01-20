import os
import json
import requests
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env.local")

SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

def analyze():
    # Load existing logos
    try:
        with open('components/manufacturer-logos.json', 'r') as f:
            existing_logos = json.load(f)
    except FileNotFoundError:
        existing_logos = {}
    
    # Normalize keys
    existing_keys = {k.lower().replace(" ", "").replace("-", "") for k in existing_logos.keys()}
    
    print("Fetching manufacturers from DB...")
    
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Range": "0-49999" # Try to get all
    }
    
    # Supabase REST API
    # select distinct company_name? REST doesn't support distinct easy without RPC.
    # We fetch company_name
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
            
    print(f"Total Unique Manufacturers in DB: {len(all_brands)}")
    
    missing = []
    found_count = 0
    
    for brand in all_brands:
        norm = brand.lower().replace(" ", "").replace("-", "")
        
        found = False
        # 1. Exact/Norm match in keys
        if norm in existing_keys:
            found = True
        
        # 2. Key contains brand or Brand contains key (fuzzy)
        if not found:
             for k in existing_logos.keys():
                 k_norm = k.lower().replace(" ", "").replace("-", "")
                 if k_norm == norm: 
                     found = True 
                     break
        
        if found:
            found_count += 1
        else:
            missing.append(brand)
            
    print(f"Logos Found: {found_count}")
    print(f"Missing Logos: {len(missing)}")
    
    # Save missing
    with open('start_missing_logos.json', 'w') as f:
        json.dump(sorted(missing), f, indent=2)
    
    print("Saved missing brands to start_missing_logos.json")

if __name__ == "__main__":
    analyze()
