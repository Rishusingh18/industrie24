import requests
from bs4 import BeautifulSoup
import json
import logging
import re
from urllib.parse import urljoin

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def scrape_logos():
    logos = {}
    
    # 1. Try Homepage "Hersteller" section (most reliable for logos)
    url = "https://industrie24.com/"
    logger.info(f"Scraping homepage: {url}")
    try:
        res = requests.get(url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(res.content, 'html.parser')
        
        # Look for section with "Hersteller"
        # Often Shopify themes use a 'logo-bar' or 'logo-list' class
        # Or look for links to collections inside a specific container
        
        # Strategy: Find images that link to /collections/...
        # And usually have alt text matching the brand
        
        # Searching for images inside links
        links = soup.find_all('a', href=re.compile(r'/collections/'))
        
        for link in links:
            href = link.get('href')
            # Extract brand from href (e.g. /collections/siemens -> Siemens)
            brand_slug = href.split('/')[-1]
            
            # Look for image
            img = link.find('img')
            if img:
                src = img.get('src') or img.get('data-src')
                alt = img.get('alt')
                
                if src:
                    if src.startswith('//'): src = "https:" + src
                    # Clean URL (remove usually ?v=...)
                    src = src.split('?')[0]
                    
                    # Name preference: Alt text, then slug
                    name = alt.strip() if alt else brand_slug.replace('-', ' ').title()
                    
                    # Basic cleaning of name
                    if "logo" in name.lower():
                        name = name.lower().replace("logo", "").strip().title()
                        
                    logos[name] = src
                    
    except Exception as e:
        logger.error(f"Homepage scrape failed: {e}")

    # 2. Try Collections page
    url = "https://industrie24.com/collections"
    logger.info(f"Scraping collections: {url}")
    try:
        res = requests.get(url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(res.content, 'html.parser')
        
        # Cards in collections
        cards = soup.find_all(class_=re.compile(r'card'))
        for card in cards:
            # Name
            heading = card.find(class_=re.compile(r'heading'))
            if not heading: continue
            
            name = heading.get_text(strip=True)
            
            # Image
            img = card.find('img')
            if img:
                src = img.get('src') or img.get('data-src')
                if src:
                    if src.startswith('//'): src = "https:" + src
                    src = src.split('?')[0]
                    
                    # Store
                    if name not in logos:
                        logos[name] = src
                        
    except Exception as e:
        logger.error(f"Collections scrape failed: {e}")

    logger.info(f"Found {len(logos)} logos.")
    
    # Filter junk
    clean_logos = {}
    for k, v in logos.items():
        if len(k) > 2 and "slide" not in k.lower(): # Filter simple bad parses
             clean_logos[k] = v

    # Save
    with open('components/manufacturer-logos.json', 'w') as f:
        json.dump(clean_logos, f, indent=2)
        
if __name__ == "__main__":
    scrape_logos()
