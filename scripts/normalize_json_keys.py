import json

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
    
    if name in MAPPINGS:
        return MAPPINGS[name]
    
    for bad, good in MAPPINGS.items():
        if name.lower() == bad.lower():
            return good
            
    if len(name) <= 3 and name.isupper():
        return name
        
    return name.title()

def normalize_json():
    with open('components/manufacturer-logos.json', 'r') as f:
        data = json.load(f)
        
    new_data = {}
    
    for key, url in data.items():
        new_key = normalize_name(key)
        
        # If new key exists, prefer the one that is NOT a google favicon if possible?
        # Or just overwrite.
        # Let's check collision.
        if new_key in new_data:
            # If current is google and new is not, keep new.
            # If current is custom and new is google, keep current.
            current_url = new_data[new_key]
            if "google.com" in current_url and "google.com" not in url:
                new_data[new_key] = url
            elif "google.com" not in current_url and "google.com" in url:
                pass # Keep current
            else:
                new_data[new_key] = url # Overwrite default
        else:
            new_data[new_key] = url
            
    print(f"Reduced from {len(data)} to {len(new_data)} keys.")
    
    with open('components/manufacturer-logos.json', 'w') as f:
        json.dump(new_data, f, indent=2)

if __name__ == "__main__":
    normalize_json()
