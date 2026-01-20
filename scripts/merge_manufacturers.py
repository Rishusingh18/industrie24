import os
import requests
import json
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env.local")

SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

# Mapping: { "Bad Name": "Canonical Name" }
# Also general rule: Title Case if not in exception list
MAPPINGS = {
    "Allen": "Allen Bradley",
    "Gems": "Gemü",
    "AMKASYN": "AMK",
    "BOSCH": "Bosch",
    "BAUER": "Bauer",
    "DropsA": "Dropsa",
    "Ebmpast": "Ebmpapst", # Fix typo
    "FOXBORO": "Foxboro",
    "FRER": "Frer",
    "HYDACBetamicron": "Hydac", 
    "KUKA": "Kuka",
    "Klöckner": "Klöckner Moeller",
    "Klöckner-Moeller": "Klöckner Moeller",
    "Moeller": "Klöckner Moeller",
    "Pneumatic": "Pneumatic-Center",
    "Pneumatic Center": "Pneumatic-Center",
    "Pliz": "Pilz",
    "MWTS-PT100-6-100-3L-10.0": "Unknown", # Looks like model
    "Rose": "Rosemount",
    "Schmidbauer": "Bauer",
    "SCHUNK": "Schunk",
    "SICK": "Sick",
    "SIBA": "Siba",
    "SICMEMOTORI": "Sicme Motori",
    "Sicmemotori": "Sicme Motori",
    "SKA": "SKA", # Keep caps if acronym
    "SMC": "SMC",
    "SMW": "SMW", 
    "SPS": "SPS",
    "Speaker+Schuh": "Sprecher + Schuh", # Fix spelling likely
    "Stäubli": "Stäubli", # Ensure encoding
    "Suco": "Suco",
    "TAIK": "Taik",
    "TDK": "TDK",
    "TLS": "TLS",
    "VAL.Co": "Val.co",
    "VDO": "VDO",
    "VEGA": "Vega",
    "WIBOND": "Wibond",
    "WQV": "WQV", 
    "ifm": "ifm" 
}

def normalize_name(name):
    if not name: 
        return None
    
    # Check explicit mapping first
    if name in MAPPINGS:
        return MAPPINGS[name]
    
    # Check case-insensitive mapping
    for bad, good in MAPPINGS.items():
        if name.lower() == bad.lower():
            return good
            
    # Default: Title Case logic?
    # Some brands are acronyms (ABB, AEG). If length <= 3, keep caps?
    if len(name) <= 3 and name.isupper():
        return name
        
    return name.title() # Default to Title Case behavior (e.g. SIEMENS -> Siemens)

def run_merge():
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    
    # 1. Fetch all unique current names with IDs to update
    # Actually, easiest is: Select id, company_name from products
    print("Fetching products...")
    url_get = f"{SUPABASE_URL}/rest/v1/products?select=id,company_name"
    
    try:
        resp = requests.get(url_get, headers=headers)
        resp.raise_for_status()
        products = resp.json()
    except Exception as e:
        print(f"Error fetching: {e}")
        return

    print(f"Checking {len(products)} products...")
    
    updates = 0
    
    # Batch updates? Rest API allows patch with filter.
    # To be efficient, let's group by "From -> To"
    
    # { "OldName": ["id1", "id2"] }
    to_change = {}
    
    for p in products:
        original = p.get('company_name')
        if not original: continue
        
        normalized = normalize_name(original)
        
        if normalized and original != normalized:
            if original not in to_change:
                to_change[original] = normalized
            # Start accumulating stats
            
    print(f"Found {len(to_change)} variations to merge.")
    
    for old, new in to_change.items():
        print(f"Merging '{old}' -> '{new}'...")
        
        # SQL Update: UPDATE products SET company_name = 'new' WHERE company_name = 'old'
        patch_url = f"{SUPABASE_URL}/rest/v1/products?company_name=eq.{requests.utils.quote(old)}"
        payload = { "company_name": new }
        
        try:
            r = requests.patch(patch_url, headers=headers, json=payload)
            r.raise_for_status()
            print(f"  Updated.")
        except Exception as e:
            print(f"  Failed: {e}")
            
    print("Merge complete.")

if __name__ == "__main__":
    run_merge()
