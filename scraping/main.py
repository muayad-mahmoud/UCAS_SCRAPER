from scraping.database_repo.database_manager import DatabaseManager
from scraping.strategies.ucas_strategy import UCASScraper
import logging
import psycopg2
from dotenv import load_dotenv
import os
from supabase import create_client, Client

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
if not supabase:
    logging.error("Failed to create Supabase client. Check your environment variables.")

db_manager = DatabaseManager(supabase)
if not supabase:
    logging.error("Failed to create Supabase client. Check your environment variables.")
    exit(1)
def run_scrapper(scraper):
    scraper.scrape()


if __name__ == "__main__":
    BASE_URL = "https://services.ucas.com/search/api/v2"
    scraper = UCASScraper(BASE_URL, db_manager)
    run_scrapper(scraper)
