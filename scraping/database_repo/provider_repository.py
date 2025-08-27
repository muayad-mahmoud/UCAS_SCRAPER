from .base_repository import BaseRepository


class ProviderRepository(BaseRepository):
    def __init__(self, supabase_client):
        super().__init__(supabase_client, "provider")

    def bulk_create_non_duplicate(self, providers):
        existing_ids = {provider['provider_ID'] for provider in self.find_all()}
        new_providers = [provider for provider in providers if provider['provider_ID'] not in existing_ids]
        if not new_providers:
            return []

        return self.bulk_create(new_providers)
