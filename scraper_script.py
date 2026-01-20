#!/usr/bin/env python3
"""
Industrie24 Product Scraper with Google Sheets API Integration
Scrapes all 17,686 products from industrie24.com and populates Google Sheet
Spreadsheet ID: 1RN_6s6nYYZcimCCdzRszcNkil9YuKn8Qcd5a88yjExA
"""

import os
import re
import time
import logging
import json
from typing import List, Dict, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed

import requests
from bs4 import BeautifulSoup
from google.oauth2 import service_account
from googleapiclient.discovery import build
from urllib.parse import urljoin
from deep_translator import GoogleTranslator

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class Industrie24Scraper:
    """Scrapes products from industrie24.com"""
    
    BASE_URL = "https://industrie24.com/collections/alle-produkte"
    HEADERS = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(self.HEADERS)
        self.timeout = 15
        self.translator = GoogleTranslator(source='auto', target='en')
    
    def get_total_pages(self) -> int:
        """Get total number of pages"""
        try:
            response = self.session.get(f"{self.BASE_URL}?page=1", timeout=self.timeout)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Look for pagination info (e.g., "17686 Produkte")
            page_text = soup.get_text()
            match = re.search(r'(\d+)\s+Produkte', page_text)
            if match:
                total_products = int(match.group(1))
                total_pages = (total_products + 11) // 12
                logger.info(f"Total products found: {total_products}")
                logger.info(f"Estimated pages: {total_pages}")
                return total_pages
            
            logger.warning("Could not determine total pages, using default 1474")
            return 1474
        except Exception as e:
            logger.error(f"Error getting total pages: {e}")
            return 1474
    
    def scrape_page(self, page_num: int) -> List[Dict[str, str]]:
        """Scrape products from a specific page"""
        products = []
        try:
            url = f"{self.BASE_URL}?page={page_num}"
            response = self.session.get(url, timeout=self.timeout)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find all product listing items
            product_items = soup.find_all('li', class_='grid__item')
            
            if not product_items:
                logger.debug(f"Page {page_num}: No products found with primary selector")
                return products
            
            for item in product_items:
                try:
                    product = self._extract_product_data(item)
                    if product and product.get('Product Name') != 'N/A':
                        product['Page Number'] = str(page_num)
                        products.append(product)
                except Exception as e:
                    logger.debug(f"Error extracting product from page {page_num}: {e}")
                    continue
            
            if products:
                logger.info(f"Page {page_num}: Extracted {len(products)} products")
            
            return products
            
        except requests.RequestException as e:
            logger.error(f"Error scraping page {page_num}: {e}")
            return []
    
    def _translate(self, text: str) -> str:
        """Translate text to English"""
        try:
            if not text or text == 'N/A':
                return text
            # Add small delay to avoid hitting rate limits too hard if synchronous
            return self.translator.translate(text)
        except Exception as e:
            logger.warning(f"Translation failed for '{text}': {e}")
            return text

    def _extract_product_data(self, item) -> Optional[Dict[str, str]]:
        """Extract product data from HTML element"""
        try:
            # Check if it's a product card
            if not item.find('div', class_='card-wrapper--product'):
                return None

            # Get product name/title
            title_elem = item.find('span', class_='card__heading__product-title')
            
            product_name = title_elem.get_text(strip=True) if title_elem else "N/A"
            
            if not product_name or product_name == 'N/A':
                return None
            
            # Translate product name
            product_name = self._translate(product_name)

            # Extract manufacturer (usually first word)
            parts = product_name.split()
            manufacturer = parts[0] if len(parts) > 0 else "N/A"
            
            # Extract product type (try to get from description or category, fallback to part of name)
            # No specific class found in new HTML, using name parts
            product_type = " ".join(parts[1:4]) if len(parts) > 1 else "N/A"
            
            # Get price
            # Try sale price first
            price_elem = item.find('span', class_='price-item--sale')
            if not price_elem:
                price_elem = item.find('span', class_='price-item--regular')
            
            # Look for dualPrice inside the price element
            if price_elem:
                dual_price = price_elem.find('span', class_='dualPrice')
                if dual_price:
                    price = dual_price.get_text(strip=True)
                else:
                    price = price_elem.get_text(strip=True)
            else:
                price = "N/A"
            
            # Get all image URLs
            # Get all image URLs
            image_urls = []
            seen_base_urls = set()
            
            img_elems = item.find_all('img')
            
            for img_elem in img_elems:
                # Check src and data-src
                srcs = [img_elem.get('src', ''), img_elem.get('data-src', '')]
                
                # Check srcset if available - often contains high-res variants
                srcset = img_elem.get('srcset', '') or img_elem.get('data-srcset', '')
                if srcset:
                    parts = srcset.split(',')
                    for part in parts:
                        srcs.append(part.strip().split(' ')[0])

                for image_src in srcs:
                    if not image_src:
                        continue
                        
                    if image_src.startswith('//'):
                        image_url = 'https:' + image_src
                    elif not image_src.startswith('http') and not image_src.startswith('data:'):
                        image_url = urljoin('https://industrie24.com', image_src)
                    else:
                        image_url = image_src
                    
                    if image_url.startswith('data:'):
                        continue
                        
                    # Clean URL to deduplicate
                    # Remove width/height params to find true duplicates
                    try:
                        base_url = image_url.split('?')[0]  # Remove all query params for checking uniqueness
                        # Optionally, remove Shopify size suffix patterns like _300x, _50x, etc. if present in filename
                        # This helps if they are physically different files but same image context
                        base_url_cleaned = re.sub(r'_\d+x\d*', '', base_url)
                        
                        if base_url_cleaned not in seen_base_urls:
                            seen_base_urls.add(base_url_cleaned)
                            # Prefer a clean URL without width constraint if possible, or keep the found one
                            # For Shopify, removing 'width' usually gives master. 
                            # But let's just use the found URL but ensure we don't add duplicates.
                            # Better: Strip the 'width' param from the URL that we save.
                            
                            clean_save_url = re.sub(r'[?&]width=\d+', '', image_url)
                            clean_save_url = re.sub(r'[?&]height=\d+', '', clean_save_url)
                            
                            # Fix potentially trailing ? or &
                            if clean_save_url.endswith('?') or clean_save_url.endswith('&'):
                                clean_save_url = clean_save_url[:-1]
                                
                            image_urls.append(clean_save_url)
                    except Exception as e:
                        # Fallback
                        if image_url not in image_urls:
                            image_urls.append(image_url)
            
            image_urls_str = ", ".join(image_urls) if image_urls else "N/A"
            
            return {
                'Product Name': product_name,
                'Manufacturer': manufacturer,
                'Product Type': product_type,
                'Price': price,
                'Image URLs': image_urls_str,
                'Page Number': '1'
            }
        
        except Exception as e:
            logger.debug(f"Error extracting product data: {e}")
            return None
    
    def scrape_all_pages(self, max_pages: Optional[int] = None) -> List[Dict[str, str]]:
        """Scrape all pages and return list of products"""
        total_pages = self.get_total_pages()
        if max_pages:
            total_pages = min(total_pages, max_pages)
        
        all_products = []
        logger.info(f"Starting to scrape {total_pages} pages...")
        
        # Use ThreadPoolExecutor for parallel requests
        with ThreadPoolExecutor(max_workers=3) as executor:
            futures = {
                executor.submit(self.scrape_page, page_num): page_num 
                for page_num in range(1, total_pages + 1)
            }
            
            completed = 0
            for future in as_completed(futures):
                page_num = futures[future]
                try:
                    products = future.result()
                    all_products.extend(products)
                    completed += 1
                    
                    if completed % 50 == 0:
                        logger.info(f"Progress: {completed}/{total_pages} pages ({len(all_products)} products so far)")
                    
                except Exception as e:
                    logger.error(f"Error processing page {page_num}: {e}")
                
                # Rate limiting
                time.sleep(0.3)
        
        logger.info(f"Scraping complete: {len(all_products)} total products")
        return all_products


class GoogleSheetsUpdater:
    """Updates Google Sheet with product data using Google Sheets API"""
    
    SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
    
    def __init__(self, credentials_file: str, spreadsheet_id: str):
        """
        Initialize with credentials file and spreadsheet ID
        
        Args:
            credentials_file: Path to service account credentials JSON
            spreadsheet_id: Google Sheet ID
        """
        self.credentials_file = credentials_file
        self.spreadsheet_id = spreadsheet_id
        self.service = None
        self._authenticate()
    
    def _authenticate(self):
        """Authenticate with Google Sheets API"""
        try:
            creds = service_account.Credentials.from_service_account_file(
                self.credentials_file, 
                scopes=self.SCOPES
            )
            
            self.service = build('sheets', 'v4', credentials=creds)
            logger.info("✓ Successfully authenticated with Google Sheets API")
            
            # Verify sheet exists
            sheet = self.service.spreadsheets().get(
                spreadsheetId=self.spreadsheet_id
            ).execute()
            logger.info(f"✓ Sheet access verified: {sheet.get('properties', {}).get('title', 'Unknown')}")
            
        except FileNotFoundError:
            logger.error(f"Credentials file not found: {self.credentials_file}")
            raise
        except Exception as e:
            logger.error(f"Authentication failed: {e}")
            raise
    
    def clear_existing_data(self, sheet_name: str = "Sheet1"):
        """Clear existing product data from sheet"""
        try:
            # Get the sheet to find the last row
            result = self.service.spreadsheets().values().get(
                spreadsheetId=self.spreadsheet_id,
                range=f"{sheet_name}!A:A"
            ).execute()
            
            values = result.get('values', [])
            if len(values) > 1:  # More than just header
                last_row = len(values)
                clear_range = f"{sheet_name}!A2:F{last_row}"
                
                self.service.spreadsheets().values().clear(
                    spreadsheetId=self.spreadsheet_id,
                    range=clear_range
                ).execute()
                logger.info(f"✓ Cleared rows 2-{last_row}")
            else:
                logger.info("✓ No existing data to clear")
                
        except Exception as e:
            logger.error(f"Error clearing data: {e}")
    
    def add_headers(self, sheet_name: str = "Sheet1"):
        """Add column headers if sheet is empty"""
        headers = [['Product Name', 'Manufacturer', 'Product Type', 'Price', 'Image URLs', 'Page Number']]
        
        try:
            # Check if headers exist
            result = self.service.spreadsheets().values().get(
                spreadsheetId=self.spreadsheet_id,
                range=f"{sheet_name}!A1:F1"
            ).execute()
            
            if not result.get('values'):
                self.service.spreadsheets().values().update(
                    spreadsheetId=self.spreadsheet_id,
                    range=f"{sheet_name}!A1:F1",
                    valueInputOption='RAW',
                    body={'values': headers}
                ).execute()
                logger.info("✓ Headers added")
        except Exception as e:
            logger.error(f"Error adding headers: {e}")
    
    def append_products(self, products: List[Dict[str, str]], sheet_name: str = "Sheet1"):
        """
        Append products to sheet
        """
        if not products:
            return
        
        # Convert products to rows
        rows = []
        for product in products:
            row = [
                product.get('Product Name', ''),
                product.get('Manufacturer', ''),
                product.get('Product Type', ''),
                product.get('Price', ''),
                product.get('Image URLs', ''),
                product.get('Page Number', '')
            ]
            rows.append(row)
        
        try:
            body = {
                'values': rows
            }
            self.service.spreadsheets().values().append(
                spreadsheetId=self.spreadsheet_id,
                range=f"{sheet_name}!A1",
                valueInputOption='RAW',
                insertDataOption='INSERT_ROWS',
                body=body
            ).execute()
            
            logger.info(f"✓ Appended {len(rows)} products to sheet")
            
        except Exception as e:
            logger.error(f"Error appending data: {e}")
            # Wait and retry once
            time.sleep(5)
            try:
                self.service.spreadsheets().values().append(
                    spreadsheetId=self.spreadsheet_id,
                    range=f"{sheet_name}!A1",
                    valueInputOption='RAW',
                    insertDataOption='INSERT_ROWS',
                    body=body
                ).execute()
                logger.info(f"✓ Appended {len(rows)} products to sheet (retry success)")
            except Exception as retry_e:
                 logger.error(f"Retry failed: {retry_e}")

def main():
    """Main execution function"""
    # Initialize updater first
    CREDENTIALS_FILE = r'C:\Users\ASUS\Downloads\data-scraper-484120-57693f796054.json'
    SPREADSHEET_ID = '1RN_6s6nYYZcimCCdzRszcNkil9YuKn8Qcd5a88yjExA'
    
    try:
        updater = GoogleSheetsUpdater(CREDENTIALS_FILE, SPREADSHEET_ID)
        
        # Clear existing data first? 
        # Optional: Ask user or just clear for a fresh run
        logger.info("Clearing existing sheet data for fresh scrape...")
        updater.clear_existing_data()
        updater.add_headers()
        
        scraper = Industrie24Scraper()
        
        # Custom scraping loop with incremental save
        total_pages = scraper.get_total_pages()
        logger.info(f"Found {total_pages} total pages to scrape")
        
        all_products = []
        batch_products = []
        
        # Start scraping
        for page_num in range(1, total_pages + 1):
            products = scraper.scrape_page(page_num)
            all_products.extend(products)
            batch_products.extend(products)
            
            # Save every 5 pages or ~60 products
            if page_num % 5 == 0 and batch_products:
                logger.info(f"Saving batch of {len(batch_products)} products...")
                updater.append_products(batch_products)
                batch_products = [] # Clear batch
            
            # Progress log
            if page_num % 10 == 0:
                logger.info(f"Progress: {page_num}/{total_pages} pages ({len(all_products)} total)")
            
            # Rate limiting
            time.sleep(0.3)
            
        # Save remaining products
        if batch_products:
             logger.info(f"Saving final batch of {len(batch_products)} products...")
             updater.append_products(batch_products)
        
        logger.info(f"\n{'='*70}")
        logger.info(f"SCRAPING COMPLETE: {len(all_products)} products collected")
        logger.info(f"{'='*70}\n")
        
    except KeyboardInterrupt:
        logger.warning("\nScrape interrupted by user. Saving any remaining products...")
        if 'batch_products' in locals() and batch_products:
             updater.append_products(batch_products)
        logger.info("Progress saved.")
        
    except Exception as e:
        logger.error(f"Fatal error: {e}")

if __name__ == "__main__":
    main()
