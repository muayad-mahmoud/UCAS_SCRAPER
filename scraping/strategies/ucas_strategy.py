import os
import requests
from .base import ScraperStrategy
import time
import random
import logging
from scraping.proxy_client.proxy_client import ProxyClient
from scraping.database_repo.database_manager import DatabaseManager
from datetime import datetime
class UCASScraper(ScraperStrategy):
    PAGE_SIZE = 1000
    RATE_LIMIT_SLEEP = 10
    REQUEST_SLEEP_MIN = 5
    REQUEST_SLEEP_MAX = 8
    def __init__(self, base_url: str, db_manager: DatabaseManager):
        self.base_url = base_url
        self.courses_scraped = 0
        self.providers_scraped = 0
        self.proxy_client = ProxyClient()
        self.logger = logging.getLogger(__name__)
        self.db_manager = db_manager

    def scrape(self):
        '''''
        Extract is divided into two steps , first extract all providers and save them in db
        second step, get courses info
        '''

        #Start First Step
        self.logger.info("Starting UCAS Scraper")
        self.logger.info("Getting Providers Info")
        providerList = []
        addressList = []
        for providers in self.extract_providers():
            self.logger.info(f"Extracted {len(providers)} providers from current page")
            for provider in providers:
                provider_obj = {
                    "provider_ID": provider.get("id"),
                    "name": provider.get("name"),
                    "logoUrl": provider.get("logoUrl"),
                    "institution_code": provider.get("institutionCode")
                }
                address_obj = {
                    "line1": provider.get("address", {}).get("line1"),
                    "line2": provider.get("address", {}).get("line2"),
                    "line3": provider.get("address", {}).get("line3"),
                    "line4": provider.get("address", {}).get("line4"),
                    "country": provider.get("address", {}).get("country").get('caption'),
                    "region": provider.get("address", {}).get("region").get('caption'),
                    "latitude": provider.get("address", {}).get("latitude"),
                    "longitude": provider.get("address", {}).get("longitude"),
                    "provider_id": provider.get("id")
                }
                providerList.append(provider_obj)
                addressList.append(address_obj)

        self.logger.info(f"Total providers collected: {len(providerList)}")
        if providerList:
            result = self.db_manager.provider_repository.bulk_create_non_duplicate(providerList)
            self.logger.info(f"Bulk insert completed. Records processed: {len(result) if result else 0}")
        else:
            self.logger.warning("No providers to insert")

        if addressList:
            result = self.db_manager.address_repository.bulk_create(addressList)
            self.logger.info(f"Bulk insert completed. Records processed: {len(result) if result else 0}")
        else:
            self.logger.warning("No addresses to insert")
        
        courses_list = []
        options_list = []
        for courses in self.extract_courses():
            self.logger.info(f"Extracted {len(courses)} courses from current page")
            for course in courses:
                
                courseObj = {
                    "id": course.get("id"),
                    "academicYear": course.get("academicYearId"),
                    "courseTitle": course.get("courseTitle"),
                    "summary": course.get("summary"),
                    "provider_id": course.get("provider", {}).get("id"),
                }
                for option in course.get("options", []):
                    optionsObj = {
                        "id": option.get("id"),
                        "course_id": course.get("id"),
                        "location": option.get("location", {}).get("name") if option.get("location") else None,
                        "duration": (
                            f"{option.get('duration', {}).get('durationType', {}).get('id', '')} "
                            f"{option.get('duration', {}).get('durationType', {}).get('caption', '')}"
                        ).strip() if option.get("duration") and option.get("duration").get("durationType") else None,
                        "googleMapsUrl": option.get("location", {}).get("googleMapsUrl") if option.get("location") else None,
                        "startDate": option.get("startDate", {}).get("date") if option.get("startDate") else None,
                        "Qualification": option.get("outcomeQualification", {}).get("caption") if option.get("outcomeQualification") else None
                    }
                    options_list.append(optionsObj)
                courses_list.append(courseObj)
                if len(courses_list) > 1000:
                    self.db_manager.courses_repository.bulk_create(courses_list)
                    courses_list = []
                    self.db_manager.options_repository.bulk_create(options_list)
                    options_list = []
        if len(courses_list) > 0:
            self.db_manager.courses_repository.bulk_create(courses_list)
            courses_list = []
        if len(options_list) > 0:
            self.db_manager.options_repository.bulk_create(options_list)
            options_list = []

    def extract_providers(self):
        self.logger.info("Extracting providers")
        PROVIDERS_OPTIONS="fields=providers(id,name,logoUrl,institutionCode,address(line1,line2,line3,line4,country(id,mappedCaption,caption),region(id,mappedCaption,caption),latitude,longitude))"
        provider_filter = {
            "options": {
                "paging": {"pageNumber": 1, "pageSize": 100}
            }
        }
        page = 1
        while True:
            proxy_ip = self.proxy_client.getRandomProxy()
            proxies = {
                "http": f"http://{proxy_ip}"
            }
            provider_filter['options']['paging']['pageNumber'] = page
            try:
                response = requests.post(f"{self.base_url}/providers/search?{PROVIDERS_OPTIONS}", json=provider_filter, proxies=proxies)
                providers_list = response.json().get('providers', [])
                self.logger.info(f"Providers Count: {len(providers_list)}")
                if not providers_list:
                    self.logger.warning("No providers found in the response.")
                    return
                self.logger.info(f"Found {len(providers_list)} providers")
            except requests.exceptions.ProxyError as e:
                self.logger.error(f"Proxy error: {e}")
                continue
            except requests.RequestException as e:
                self.logger.error(f"Error fetching data: {e}")
                break

            if response.status_code != 200:
                self.logger.error(f"Error fetching data: {response.status_code}")
                break
            if response.status_code == 429:
                time.sleep(self.RATE_LIMIT_SLEEP)
                self.logger.warning(f"Rate limit exceeded, Applying sleep to restore rate limit problem")
                provider_filter['options']['paging']['pageNumber'] = page
                continue
            if not providers_list or len(providers_list) == 0:
                self.logger.info(f"No more providers found on page {page}. Ending scrape.")
                self.logger.info(f"Total Providers Scraped: {self.providers_scraped}")
                break
            
            self.providers_scraped += len(providers_list)
            self.logger.info(f"Page {page}: Found {len(providers_list)} providers (Total so far: {self.providers_scraped})")
            yield providers_list
            page += 1
            time.sleep(random.uniform(self.REQUEST_SLEEP_MIN, self.REQUEST_SLEEP_MAX))

    def extract_courses(self):
        current_year = datetime.now().year
        max_year = current_year + 1
        COURSES_OPTIONS = "fields=courses(id,academicYearId,compositeId,courseTitle,summary,provider(id)," \
        "options(id,duration(durationType(id,caption)),location(name,googleMapsUrl)," \
        "outcomeQualification(caption),startDate(date,nonSpecific)))"
        
        for year in range(current_year, max_year + 1):
            course_filters = {
                "filters": {
                    "academicYearId": f"{year}"
                },
                "options": {
                    "paging": {"pageNumber": 1, "pageSize": 500}
                }
            }
            course_page = 1
            self.logger.info(f"Extracting courses for year {year}")
            year_has_courses = False
            
            while True:
                proxy_ip = self.proxy_client.getRandomProxy()
                proxies = {
                    "http": f"http://{proxy_ip}"
                }
                course_filters['options']['paging']['pageNumber'] = course_page
                try:
                    response = requests.post(f"{self.base_url}/courses/search?{COURSES_OPTIONS}", json=course_filters, proxies=proxies)
                    courses_list = response.json().get('courses', [])
                    self.logger.info(f"Courses Count for year {year}: {len(courses_list)}")
                    if not courses_list:
                        if not year_has_courses:
                            self.logger.warning(f"No courses found for year {year}.")
                        break  # No more courses for this year, move to next year
                    self.logger.info(f"Found {len(courses_list)} courses for year {year}")
                    year_has_courses = True
                except requests.exceptions.ProxyError as e:
                    self.logger.error(f"Proxy error: {e}")
                    continue
                except requests.RequestException as e:
                    self.logger.error(f"Error fetching data: {e}")
                    break

                if response.status_code != 200:
                    self.logger.error(f"Error fetching data: {response.status_code}")
                    break
                if response.status_code == 429:
                    time.sleep(self.RATE_LIMIT_SLEEP)
                    self.logger.warning(f"Rate limit exceeded, Applying sleep to restore rate limit problem")
                    continue
                if not courses_list or len(courses_list) == 0:
                    self.logger.info(f"No more courses found on page {course_page} for year {year}. Moving to next year.")
                    break

                self.courses_scraped += len(courses_list)
                self.logger.info(f"Year {year}, Page {course_page}: Found {len(courses_list)} courses (Total so far: {self.courses_scraped})")
                yield courses_list
                course_page += 1
                time.sleep(random.uniform(self.REQUEST_SLEEP_MIN, self.REQUEST_SLEEP_MAX))
        
        self.logger.info(f"Finished extracting courses. Total Courses Scraped: {self.courses_scraped}")