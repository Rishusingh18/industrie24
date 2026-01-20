import requests

def test():
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    # Try Bosch
    domain = "bosch.com"
    u = f"https://logo.clearbit.com/{domain}"
    
    print(f"Testing {u}...")
    try:
        r = requests.get(u, headers=headers, timeout=5)
        print(f"Status: {r.status_code}")
        print(f"Content-Type: {r.headers.get('Content-Type')}")
    except Exception as e:
        print(f"Error: {e}")

    # Try Google
    u2 = f"https://www.google.com/s2/favicons?domain={domain}&sz=128"
    print(f"Testing Google {u2}...")
    try:
        r = requests.get(u2, headers=headers, timeout=5)
        print(f"Status: {r.status_code}")
        print(f"Content-Type: {r.headers.get('Content-Type')}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test()
