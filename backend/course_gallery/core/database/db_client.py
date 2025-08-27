from supabase import create_client, Client
from typing import Optional
from ..utils import settings
class DatabaseManager:
    _instance: Optional['DatabaseManager'] = None
    _client: Optional[Client] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def get_client(self) -> Client:
        if self._client is None:
            url = settings.supabase_url
            key = settings.supabase_service_key
            if not url or not key:
                raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment variables.")
            self._client = create_client(url, key)
        return self._client

class DBClient:
    def __init__(self, db_manager: Optional[DatabaseManager] = None):
        self.db_manager = db_manager or DatabaseManager()
        self.supabase = self.db_manager.get_client()

    def table(self, table_name: str):
        return self.supabase.table(table_name)
