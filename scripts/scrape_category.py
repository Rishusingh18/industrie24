import os
import requests
import re
import time
import random
import string
import logging
from bs4 import BeautifulSoup
from deep_translator import GoogleTranslator
from urllib.parse import urljoin
from concurrent.futures import ThreadPoolExecutor, as_completed

# Config
SUPABASE_URL = "https://ahbwqahnyvnywegexjoj.supabase.co"
SUPABASE_KEY = "sb_publishable_mQpMmWV02v1JlvfTkZWGkw_RwL2q3QA"
HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=ignore-duplicates" # Ignore duplicates to save valid items
}

# Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class CategoryScraper:
    def __init__(self, category_name, base_url):
        self.category_name = category_name
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.translator = GoogleTranslator(source='auto', target='en')

        self.site_url = "https://industrie24.com"

    def _request_with_retry(self, url):
        for i in range(5):
            try:
                # Random sleep
                time.sleep(random.uniform(2.0, 5.0))
                res = self.session.get(url, timeout=15)
                if res.status_code == 429:
                    wait_time = (i + 1) * 60
                    logger.warning(f"Rate limited (429). Waiting {wait_time}s...")
                    time.sleep(wait_time)
                    continue
                return res
            except Exception as e:
                logger.warning(f"Request failed: {e}")
                time.sleep(5)
        return None

    def _get_gallery_images(self, product_url):
        try:
            res = self._request_with_retry(product_url)
            if not res or res.status_code != 200: return []
            soup = BeautifulSoup(res.content, 'html.parser')
            
            media_imgs = soup.select('.product__media img')
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
            return image_urls
        except Exception as e:
            logger.debug(f"Gallery fetch failed for {product_url}: {e}")
            return []

    def get_total_pages(self):
        try:
            response = self._request_with_retry(f"{self.base_url}?page=1")
            if not response: return 1
            # response.raise_for_status() # handled in retry
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Look for pagination info
            page_text = soup.get_text()
            match = re.search(r'(\d+)\s+products', page_text.lower())
            if not match:
                match = re.search(r'(\d+)\s+produkte', page_text.lower())
            
            if match:
                total_products = int(match.group(1))
                items_on_page = len(soup.find_all('li', class_='grid__item'))
                if items_on_page > 0:
                    per_page = items_on_page
                else:
                    per_page = 12
                
                total_pages = (total_products + per_page - 1) // per_page
                logger.info(f"Found {total_products} products, estimated {total_pages} pages (approx {per_page}/page).")
                return total_pages
            
            pagination = soup.find('nav', class_='pagination')
            if pagination:
                links = pagination.find_all('a')
                nums = []
                for link in links:
                    txt = link.get_text(strip=True)
                    if txt.isdigit():
                        nums.append(int(txt))
                if nums:
                    return max(nums)
            
            logger.warning("Could not determine total pages. Defaulting to 10 for safety.")
            return 10
        except Exception as e:
            logger.error(f"Error getting pages: {e}")
            return 1

    def _translate(self, text):
        if not text or text == 'N/A': return text
        try:
            return self.translator.translate(text)
        except:
            return text

    def _extract_product(self, item, page_num):
        try:
            # Title
            title_elem = item.find('h3', class_='card__heading') # standard shopify dawn
            link_elem = None
            if not title_elem:
                title_elem = item.find('span', class_='card__heading__product-title') # custom
            if not title_elem: # Try generic link title
                link_elem = item.find('a', class_='full-unstyled-link')
                if link_elem: title_elem = link_elem
                
            raw_name = title_elem.get_text(strip=True) if title_elem else "Unknown"
            
            # Link for deep scraping
            if not link_elem:
                link_elem = item.find('a', class_='full-unstyled-link') or item.find('a')
            
            product_url = None
            if link_elem and link_elem.get('href'):
                href = link_elem.get('href')
                if href.startswith('/'):
                    product_url = f"{self.site_url}{href}"
                elif href.startswith('http'):
                    product_url = href
            
            # Translate Name
            english_name = self._translate(raw_name)

            # Manuf (First word usually)
            parts = english_name.split()
            manufacturer = parts[0] if parts else "Generic"
            
            # Product Type
            product_type = self.category_name
            
            # Price
            price_elem = item.find('span', class_='price-item--sale')
            if not price_elem: price_elem = item.find('span', class_='price-item--regular')
            price_txt = price_elem.get_text(strip=True) if price_elem else "0"
            
            # Clean price
            cleaned = price_txt.replace('€', '').replace('EUR', '').strip().replace(',', '.')
            match = re.search(r"(\d+\.?\d*)", cleaned)
            price = float(match.group(1)) if match else 0.0

            # Image (Deep Scraping)
            image_url = None
            full_gallery = []
            if product_url:
                full_gallery = self._get_gallery_images(product_url)
                if full_gallery:
                    # Save just the first image in the main column to avoid 500 char limit
                    image_url = full_gallery[0] 
            
            # Fallback to single image if gallery failed or disabled
            if not image_url:
                img = item.find('img')
                if img:
                    src = img.get('src') or img.get('data-src')
                    if src:
                        if src.startswith('//'): src = 'https:' + src
                        image_url = src.split('?')[0] # clean

            # SKU
            sku = f"{manufacturer[:3].upper()}-{re.sub(r'[^a-zA-Z0-9]', '', raw_name)[:10].upper()}-{random.randint(100000,999999)}"

            return {
                "name": english_name,
                "description": f"{english_name} (Original: {raw_name})",
                "category": self.category_name,
                "product_type": self.category_name, 
                "price": price,
                "sku": sku,
                "stock_quantity": random.randint(1, 10),
                "image_url": image_url,
                "company_name": manufacturer,
                "_gallery": full_gallery
            }
        except Exception as e:
            logger.debug(f"Error extracting item: {e}")
            return None

    def scrape_page(self, page_num):
        url = f"{self.base_url}?page={page_num}"
        try:
            res = self._request_with_retry(url)
            if not res or res.status_code != 200: return []
            soup = BeautifulSoup(res.content, 'html.parser')
            
            items = soup.find_all('li', class_='grid__item')
            products = []
            for item in items:
                p = self._extract_product(item, page_num)
                if p: products.append(p)
            return products
        except Exception as e:
            logger.error(f"Page {page_num} failed: {e}")
            return []
    
    # ...

    def run(self, start_page=1):
        logger.info(f"Starting scrape for category: {self.category_name}")
        total_pages = self.get_total_pages()
        logger.info(f"Targeting {total_pages} pages. Starting from page {start_page}.")
        
        all_products = []
        
        # Reduced workers to avoid rate limiting
        with ThreadPoolExecutor(max_workers=2) as executor:
            futures = {executor.submit(self.scrape_page, p): p for p in range(start_page, total_pages+1)}
            
            batch_buffer = []
            
            for future in as_completed(futures):
                pg = futures[future]
                try:
                    items = future.result()
                    if items:
                        batch_buffer.extend(items)
                        logger.info(f"Page {pg}: found {len(items)} items")
                        
                        if len(batch_buffer) >= 50:
                            self.save_batch(batch_buffer)
                            batch_buffer = []
                except Exception as e:
                    logger.error(f"Ex page {pg}: {e}")
            
            # Final batch
            if batch_buffer:
                self.save_batch(batch_buffer)
                
        logger.info("Done.")
                        
    def save_batch(self, batch):
        if not batch: return
        try:
            # Prepare main payload (remove _gallery)
            products_payload = []
            gallery_map = {} # sku -> gallery
            
            for p in batch:
                p_copy = p.copy()
                gallery = p_copy.pop('_gallery', [])
                gallery_map[p_copy['sku']] = gallery
                products_payload.append(p_copy)

            # POST to Supabase Products
            headers_with_return = HEADERS.copy()
            headers_with_return["Prefer"] = "resolution=ignore-duplicates, return=representation"
            
            res = requests.post(
                f"{SUPABASE_URL}/rest/v1/products",
                headers=headers_with_return,
                json=products_payload
            )
            
            if res.status_code >= 400:
                logger.error(f"Batch failed: {res.text}")
                return

            saved_products = res.json()
            if not saved_products:
                return

            # Prepare images payload
            images_payload = []
            for sp in saved_products:
                sku = sp.get('sku')
                pid = sp.get('id')
                if sku and pid and sku in gallery_map:
                    gallery = gallery_map[sku]
                    # Save all images to detail table
                    for i, img in enumerate(gallery):
                        images_payload.append({
                            "product_id": pid,
                            "image_url": img,
                            "display_order": i
                        })
            
            if images_payload:
                # POST to product_images
                # We need to handle case where table doesn't exist (404)
                img_res = requests.post(
                    f"{SUPABASE_URL}/rest/v1/product_images",
                    headers=HEADERS,
                    json=images_payload
                )
                if img_res.status_code == 404:
                    logger.warning("Table 'product_images' not found. Skipping extra images.")
                elif img_res.status_code >= 400:
                     logger.error(f"Images save failed: {img_res.text}")
                else:
                     logger.info(f"Saved {len(images_payload)} extra images.")

            logger.info(f"Saved {len(saved_products)} products.")
        except Exception as e:
            logger.error(f"Save error: {e}")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='Scrape Industrie24 category')
    parser.add_argument('category', nargs='?', help='Category name', default="Automation")
    parser.add_argument('url', nargs='?', help='Category URL', default="https://industrie24.com/en/collections/elektromaterial")
    parser.add_argument('--start-page', type=int, default=1, help='Page number to start scraping from')
    
    args = parser.parse_args()
    
    scraper = CategoryScraper(args.category, args.url)
    scraper.run(start_page=args.start_page)
