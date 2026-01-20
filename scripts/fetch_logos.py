import json
import requests
import os
import time

def fetch_logos():
    with open('start_missing_logos.json', 'r') as f:
        missing = json.load(f)
        
    print(f"Attempts needed: {len(missing)}")
    
    # Load existing to append
    try:
        with open('components/manufacturer-logos.json', 'r') as f:
            current_logos = json.load(f)
    except:
        current_logos = {}
        
    new_found = 0
    
    HEADERS = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }

    for brand in missing:
        clean_brand = brand.lower().replace(" ", "").replace("-", "").replace(".", "")
        domains = [f"{clean_brand}.com", f"{clean_brand}.de", f"{brand.lower().replace(' ', '-')}.com"]
        domains = list(set(domains))
        
        found_url = None
        
        # 1. Try Clearbit
        for d in domains:
            u = f"https://logo.clearbit.com/{d}"
            try:
                r = requests.get(u, headers=HEADERS, timeout=3)
                if r.status_code == 200:
                    found_url = u
                    print(f"[CLEARBIT] {brand} -> {u}")
                    break
            except:
                pass
            time.sleep(0.1)
            
        # 2. Try Google Favicon (fallback)
        if not found_url:
             for d in domains:
                u = f"https://www.google.com/s2/favicons?domain={d}&sz=128"
                try:
                    r = requests.get(u, headers=HEADERS, timeout=3)
                    if r.status_code == 200:
                        found_url = u
                        print(f"[GOOGLE] {brand} -> {u}")
                        break
                except:
                    pass
        
        if found_url:
            current_logos[brand] = found_url
            new_found += 1
            if new_found % 5 == 0:
                 with open('components/manufacturer-logos.json', 'w') as f:
                    json.dump(current_logos, f, indent=2)
                 print(f"Saved {new_found} new logos so far...")
        else:
            print(f"[FAIL] {brand }")
            
    print(f"Total new logos found: {new_found}")
    
    with open('components/manufacturer-logos.json', 'w') as f:
        json.dump(current_logos, f, indent=2)

if __name__ == "__main__":
    fetch_logos()
