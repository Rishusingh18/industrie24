import subprocess
import time
import logging

# Config
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

TASKS = [
    {
        "category": "Automation",
        "url": "https://industrie24.com/en/collections/elektromaterial"
    },
    {
        "category": "Drive Technology",
        "url": "https://industrie24.com/en/collections/antriebstechnik"
    },
    {
        "category": "Pumps",
        "url": "https://industrie24.com/en/collections/pumpen"
    },
    {
        "category": "Ball-Bearing",
        "url": "https://industrie24.com/en/collections/walzlager"
    }
]

def run_scraper(category, url):
    logger.info(f"==== Starting Scrape for {category} ====")
    try:
        # Run the scrape_category.py script
        # We don't specify start_page because they are empty (Count 0)
        cmd = ["python", "scripts/scrape_category.py", category, url]
        
        # Use subprocess.run to wait for completion
        result = subprocess.run(cmd, check=True)
        
        logger.info(f"==== Finished {category} (Exit Code: {result.returncode}) ====")
        
    except subprocess.CalledProcessError as e:
        logger.error(f"Error scraping {category}: {e}")
    except Exception as e:
        logger.error(f"Unexpected error for {category}: {e}")

def main():
    logger.info("Starting Sequential Scraper Manager")
    
    for task in TASKS:
        run_scraper(task["category"], task["url"])
        
        # Cool down between categories
        logger.info("Waiting 30 seconds before next category...")
        time.sleep(30)
        
    logger.info("All sequential tasks completed.")

if __name__ == "__main__":
    main()
