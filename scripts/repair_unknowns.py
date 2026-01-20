import requests
import time
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
from scrape_category import CategoryScraper, SUPABASE_URL, HEADERS

# Config
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class RepairScraper(CategoryScraper):
    def __init__(self, category_name, base_url):
        super().__init__(category_name, base_url)
        self.existing_names = set()
        self.load_existing_products()

    def load_existing_products(self):
        logger.info(f"Loading existing products for {self.category_name}...")
        try:
            # Fetch names in batches by page
            # Because Supabase range header syntax is Range: 0-999
            offset = 0
            limit = 1000
            while True:
                # Proper Range header usage per postgrest
                h = HEADERS.copy()
                h['Range'] = f"{offset}-{offset+limit-1}"
                
                url = f"{SUPABASE_URL}/rest/v1/products?category=eq.{self.category_name}&select=name"
                res = requests.get(url, headers=h)
                
                if res.status_code == 416: # Range unsatisfiable (done)
                    break
                if res.status_code != 200 and res.status_code != 206:
                    logger.error(f"Error loading existing: {res.text}")
                    break
                
                rows = res.json()
                if not rows:
                    break
                    
                count = 0
                for r in rows:
                    self.existing_names.add(r['name'])
                    count += 1
                
                logger.info(f"Loaded {count} names (Offset {offset}). Total: {len(self.existing_names)}")
                
                if len(rows) < limit:
                    break
                    
                offset += limit
                
        except Exception as e:
            logger.error(f"Failed to load existing products: {e}")

    # Override extraction to SKIP early
    def _extract_product(self, item, page_num):
        # 1. Get Name FIRST (lightweight)
        title_elem = item.find('h3', class_='card__heading')
        if not title_elem:
             title_elem = item.find('span', class_='card__heading__product-title')
        if not title_elem:
             link_elem = item.find('a', class_='full-unstyled-link')
             if link_elem: title_elem = link_elem
             
        raw_name = title_elem.get_text(strip=True) if title_elem else "Unknown"
        english_name = self._translate(raw_name)
        
        # 2. CHECK if exists
        if english_name in self.existing_names:
            # SKIP EVERYTHING ELSE
            return None
            
        # 3. If new, proceed with deep scraping
        return super()._extract_product(item, page_num)

    def save_batch(self, batch):
        if not batch: return
        # Logic to double-check duplicates just in case
        new_items = []
        for p in batch:
            if p['name'] not in self.existing_names:
                new_items.append(p)
                self.existing_names.add(p['name'])
        
        if not new_items:
            return

        super().save_batch(new_items)

def main():
    # Only scrape Automation as that's where the issue was
    logger.info("Starting Optimized Repair Scraper...")
    scraper = RepairScraper("Automation", "https://industrie24.com/en/collections/elektromaterial")
    # Resume from page 280 roughly where it was, or just 1? 
    # Since we have skip logic, starting from 1 is fast. Assumed 1.
    scraper.run(start_page=1)

if __name__ == "__main__":
    main()
