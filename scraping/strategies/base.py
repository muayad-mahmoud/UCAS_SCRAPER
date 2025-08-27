from abc import ABC, abstractmethod

class ScraperStrategy(ABC):
    #Base Class for Strategy Pattern In case of Future Requirements to add new sites
    #Strategy Pattern Provides an easy way to swap out different scraping implementations and Extend Existing Functionality
    @abstractmethod
    def scrape(self, filters=None):
        pass
    