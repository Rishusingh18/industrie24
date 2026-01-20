import requests
import json
import csv

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
        "exclude": ["din rail"]
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
    
    # Check "Phoenix Contact" edge case
    if "phoenix contact" in text:
        text = text.replace("phoenix contact", "phoenix_brand") 

    # Priority order: Valves moved UP
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
                
    return "Automation", None

def run_debug():
    print("Fetching sample products (searching for 'valve')...")
    # Fetch random 200, or filter by text if possible? supabase doesn't support 'contains' easily on 'or' multple cols in this client maybe
    # Just fetch random 200 and see. Or better, fetch 500.
    res = requests.get(
        f"{SUPABASE_URL}/rest/v1/products?select=id,name,description,category&limit=500",
        headers=HEADERS
    )
    products = res.json()
    
    with open('classification_report.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['ID', 'Name', 'Current Category', 'Proposed Category', 'Reason'])
        
        # Filter mostly for relevant things to reduce noise in report
        relevant_products = [p for p in products if 'valve' in p.get('name', '').lower() or 'pneumatic' in p.get('name', '').lower()]
        
        for p in relevant_products:
            text = f"{p.get('name', '')} {p.get('description', '')}"
            new_cat, reason = classify_text(text)
            writer.writerow([p['id'], p['name'], p.get('category'), new_cat, reason])
            
    print(f"Report generated: classification_report.csv with {len(relevant_products)} relevant items")

if __name__ == "__main__":
    run_debug()
