import requests
import json

# Config
SUPABASE_URL = "https://ahbwqahnyvnywegexjoj.supabase.co"
SUPABASE_KEY = "sb_publishable_mQpMmWV02v1JlvfTkZWGkw_RwL2q3QA"
HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

def clean_unknowns():
    print("Searching for 'Unknown' products...")
    
    # query to find them first to print count
    url = f"{SUPABASE_URL}/rest/v1/products?name=eq.Unknown&select=count"
    try:
        # Get count
        # HEAD request or GET with count=exact
        res = requests.get(f"{SUPABASE_URL}/rest/v1/products?name=eq.Unknown", headers=HEADERS)
        items = res.json()
        count = len(items)
        
        if count == 0:
            print("No 'Unknown' products found.")
            return

        print(f"Found {count} products named 'Unknown'. Deleting...")
        
        # Delete
        del_res = requests.delete(
            f"{SUPABASE_URL}/rest/v1/products?name=eq.Unknown",
            headers=HEADERS
        )
        
        if del_res.status_code >= 400:
            print(f"Error deleting: {del_res.text}")
        else:
            print("Successfully deleted 'Unknown' products.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    clean_unknowns()
