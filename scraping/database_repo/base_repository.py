from typing import List, Dict, Optional, Any, Union
from datetime import datetime
import logging

class BaseRepository:
    def __init__(self, supabase_client, table_name: str):
        self.supabase = supabase_client
        self.table_name = table_name
        self.logger = logging.getLogger(__name__)
    
    def create(self, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        try:
            response = self.supabase.table(self.table_name).insert(data).execute()
            if response.data:
                self.logger.info(f"Successfully inserted {len(response.data)} records")
                return response.data
            else:
                self.logger.error(f"Error inserting data: {response}")
                return []
        except Exception as e:
            self.logger.error(f"Exception during insert: {e}")
            return None
    def find_all(self) -> List[Dict[str, Any]]:
        try:
            response = self.supabase.table(self.table_name).select("*").execute()
            if response.data:
                self.logger.info(f"Successfully fetched {len(response.data)} records")
                return response.data
            else:
                self.logger.error(f"Error fetching data: {response}")
                return []
        except Exception as e:
            self.logger.error(f"Exception during find_all: {e}")
            return []

    def read(self, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        try:
            response = self.supabase.table(self.table_name).select("*").filter(**filters).execute()
            if response.data:
                self.logger.info(f"Successfully fetched {len(response.data)} records")
                return response.data
            else:
                self.logger.error(f"Error fetching data: {response}")
                return []
        except Exception as e:
            self.logger.error(f"Exception during read: {e}")
            return []

    def update(self, id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        try:
            response = self.supabase.table(self.table_name).update(data).eq("id", id).execute()
            if response.data:
                self.logger.info(f"Successfully updated {len(response.data)} records")
                return response.data
            else:
                self.logger.error(f"Error updating data: {response}")
                return []
        except Exception as e:
            self.logger.error(f"Exception during update: {e}")
            return None

    def delete(self, id: str) -> bool:
        try:
            response = self.supabase.table(self.table_name).delete().eq("id", id).execute()
            if response.data:
                self.logger.info(f"Successfully deleted {len(response.data)} records")
                return response.data
            else:
                self.logger.error(f"Error deleting data: {response}")
                return []
        except Exception as e:
            self.logger.error(f"Exception during delete: {e}")
            return False

    def bulk_create(self, data: List[Dict[str, Any]]) -> List[Optional[Dict[str, Any]]]:
        try:
            if not data:
                return []
            
            response = self.supabase.table(self.table_name).insert(data).execute()
            if response.data:
                self.logger.info(f"Successfully bulk inserted {len(response.data)} records")
                return response.data
            else:
                self.logger.error(f"Error bulk inserting data: {response}")
                return []
        except Exception as e:
            self.logger.error(f"Exception during bulk insert: {e}")
            # Fallback to individual inserts if bulk fails
            self.logger.info("Falling back to individual inserts")
            created_records = []
            for item in data:
                created_record = self.create(item)
                created_records.append(created_record)
            return created_records