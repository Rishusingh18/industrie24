import requests
import sys
import argparse

# Config
SUPABASE_URL = "https://ahbwqahnyvnywegexjoj.supabase.co"
SUPABASE_KEY = "sb_publishable_mQpMmWV02v1JlvfTkZWGkw_RwL2q3QA"
HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

def clean_category(category):
    print(f"Cleaning category: {category}...")
    
    # Check count first
    url = f"{SUPABASE_URL}/rest/v1/products?category=eq.{category}&select=count"
    try:
        # Get count (using separate request or just delete)
        # Delete directly
        del_res = requests.delete(
            f"{SUPABASE_URL}/rest/v1/products?category=eq.{category}",
            headers=HEADERS
        )
        
        if del_res.status_code >= 400:
            print(f"Error deleting: {del_res.text}")
        else:
            print(f"Successfully deleted products in category '{category}'.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('category', help='Category to clean')
    args = parser.parse_args()
    
    clean_category(args.category)
