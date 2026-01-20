import requests
from bs4 import BeautifulSoup
import sys

def scrape_gallery(url):
    print(f"Scraping: {url}")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        res = requests.get(url, headers=headers, timeout=15)
        soup = BeautifulSoup(res.content, 'html.parser')
        
        # Selectors
        media_imgs = soup.select('.product__media img')
        thumb_imgs = soup.select('.thumbnail img')
        
        print(f"Found {len(media_imgs)} media images.")
        print(f"Found {len(thumb_imgs)} thumbnail images.")
        
        # Extract and clean
        image_urls = []
        seen = set()
        
        for img in media_imgs:
            src = img.get('src') or img.get('data-src')
            if src:
                if src.startswith('//'): src = 'https:' + src
                clean = src.split('?')[0]
                if clean not in seen:
                    seen.add(clean)
                    image_urls.append(clean)
                    
        print("\nExtracted Images:")
        for img in image_urls:
            print(f"- {img}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    url = "https://industrie24.com/en/products/festo-cpe18-m1h-3gl-1-4-magnetventil-163141-ve-10stk-for-industrial-use-pneumatics" 
    # Or take from args
    if len(sys.argv) > 1:
        url = sys.argv[1]
    
    scrape_gallery(url)
