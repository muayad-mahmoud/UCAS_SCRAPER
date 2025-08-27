import requests
import random
class ProxyClient:
    def __init__(self):
        self.proxy_list = []
        self.retrieve_proxies()

    def retrieve_proxies(self):
        PROXY_URL = "https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&proxy_format=ipport&format=text"
        try:
            response = requests.get(PROXY_URL)
            response.raise_for_status()
            self.proxy_list = response.text.splitlines()
        except requests.RequestException as e:
            print(f"Error fetching proxy list: {e}")

    def get_proxies(self):
        return self.proxy_list
    
    def getRandomProxy(self):
        if not self.proxy_list:
            self.retrieve_proxies()
        if self.proxy_list:
            return random.choice(self.proxy_list)
        return None
    