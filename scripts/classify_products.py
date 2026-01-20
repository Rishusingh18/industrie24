import requests
import json
import time

SUPABASE_URL = "https://ahbwqahnyvnywegexjoj.supabase.co"
SUPABASE_KEY = "sb_publishable_mQpMmWV02v1JlvfTkZWGkw_RwL2q3QA" 

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

# Strict keyword mappings with exclusions
# Format: "Category": {"keywords": [...], "exclude": [...]}

CATEGORIES_CONFIG = {
    "Valves": {
        "keywords": ["valve", "solenoid", "manifold", "valve terminal"],
        "exclude": [] # Allow pneumatic valves to be here
    },
    "Pneumatics": {
        "keywords": ["pneumatic", "cylinder", "compressor", "festo", "smc", "filter regulator", "hose", "fitting", "vacuum"],
        "exclude": []
    },
    "Servo Motors": {
        "keywords": ["servo motor", "stepper motor", "servomotor", "fan motor", "spindle motor"], 
        "exclude": ["motor protection", "starter", "circuit breaker"]
    },
    "Sensors": {
        "keywords": ["sensor", "proximity switch", "limit switch", "light guide", "photocell", "encoder", "thermocouple", "transducer", "detector", "light barrier"],
        "exclude": ["circuit breaker", "disconnector", "contact block", "auxiliary contact", "contactor"] 
    },
    "Pumps": {
        "keywords": ["pump", "hydraulic"],
        "exclude": []
    },
    "Ball-Bearing": {
        "keywords": ["bearing", "linear guide", "carriage", "bushing", "runner block", "rail"],
        "exclude": ["din rail"] # DIN rails are automation/mounting
    },
    "Drive Technology": {
        "keywords": ["inverter", "frequency converter", "soft starter", "vfd", "transformer", "power supply", "rectifier", "thyristor", "converter"],
        "exclude": []
    },
    "Automation": {
        "keywords": ["plc", "module", "simatic", "hmi", "touch panel", "cpu", "processor", "relay", "contactor", "circuit breaker", "fuse", "terminal block", "connector", "switch", "pushbutton", "panel", "display", "monitor", "screen", "keyboard", "input", "output", "i/o", "cable", "din rail", "power supply"],
        "exclude": []
    }
}

def classify_text(text):
    text = text.lower()
    
    # Check "Phoenix Contact" edge case - common Brand name causing false positive for "Contact" -> Sensor
    if "phoenix contact" in text:
        text = text.replace("phoenix contact", "phoenix_brand") 

    # Priority order: Check specific categories first, then generic Automation
    priority_order = ["Valves", "Pneumatics", "Servo Motors", "Sensors", "Pumps", "Ball-Bearing", "Drive Technology", "Automation"]
    
    for cat in priority_order:
        config = CATEGORIES_CONFIG[cat]
        
        # Check exclusions first
        excluded = False
        for ex in config["exclude"]:
            if ex in text:
                excluded = True
                break
        if excluded:
            continue
            
        # Check matches
        for kw in config["keywords"]:
            if kw in text:
                return cat, kw
                
    return "Automation" # Default fallback for unknowns if we want to be safe, or "Other"

def run_classification():
    print("Fetching products...")
    # Fetch all IDs and Names to be efficient (pagination might be needed if too large, but 17k is borderline for single req depending on payload)
    # Let's do batches.
    
    BATCH_SIZE = 1000
    offset = 0
    total_updated = 0
    
    while True:
        print(f"Fetching batch offset {offset}...")
        res = requests.get(
            f"{SUPABASE_URL}/rest/v1/products?select=id,name,description,category,product_type&order=id&offset={offset}&limit={BATCH_SIZE}",
            headers=HEADERS
        )
        
        products = res.json()
        if not products:
            break
            
        print(f"Processing {len(products)} products...")
        updates = []
        
        for p in products:
            text = f"{p.get('name', '')} {p.get('product_type', '')} {p.get('description', '')}"
            new_cat = classify_text(text)
            
            # Update mappings
            # Also normalize product_type to match Category for filter simplicity, 
            # OR keep product_type detailed and just fix Category. 
            # The filter logic uses 'product_type' column to match the matched category? 
            # products-content.tsx says: filtered = filtered.filter((p) => p.product_type === productType)
            # So we MUST update `product_type` column to match the Category Name (e.g. "Pneumatics").
            
            if p.get('product_type') != new_cat:
                # We update both category and product_type to be safe/consistent
                updates.append({
                    "id": p['id'],
                    "category": new_cat,
                    "product_type": new_cat 
                })
        
        # Batch update? Supabase REST doesn't support bulk PATCH easily with different values.
        # We might have to do one by one or Upsert. 
        # Upsert requires all required fields or they might be nullified? No, PATCH is safe. Upsert is PUT.
        # Efficient way: Use upsert with just ID and changed fields.
        
        if updates:
            print(f"Updating {len(updates)} products...")
            
            # Use threading for faster individual PATCH requests
            from concurrent.futures import ThreadPoolExecutor, as_completed
            
            def update_product(p_update):
                try:
                    pid = p_update.pop('id')
                    r = requests.patch(
                        f"{SUPABASE_URL}/rest/v1/products?id=eq.{pid}",
                        headers=HEADERS,
                        json=p_update
                    )
                    if r.status_code >= 400:
                        print(f"Error {pid}: {r.text}")
                        return False
                    return True
                except Exception as ex:
                    print(f"Ex {pid}: {ex}")
                    return False

            with ThreadPoolExecutor(max_workers=10) as executor:
                futures = [executor.submit(update_product, u) for u in updates]
                for future in as_completed(futures):
                    if future.result():
                         total_updated += 1
            
            print(f"Batch complete. Total updated: {total_updated}")
            
        if len(products) < BATCH_SIZE:
            break
            
        offset += BATCH_SIZE
        
    print(f"Classification complete. Updated {total_updated} products.")

if __name__ == "__main__":
    run_classification()
