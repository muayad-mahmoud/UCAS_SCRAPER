from .base_repository import BaseRepository


class AddressRepository(BaseRepository):
    def __init__(self, supabase_client):
        super().__init__(supabase_client, "address")

    def bulk_create_non_duplicate(self, addresses):
        existing_ids = {address['provider_id'] for address in self.find_all()}
        new_addresses = [address for address in addresses if address['provider_id'] not in existing_ids]
        if not new_addresses:
            return []

        return self.bulk_create(new_addresses)
