from .base_repository import BaseRepository


class OptionsRepository(BaseRepository):
    def __init__(self, supabase_client):
        super().__init__(supabase_client, "options")

    def bulk_create_non_duplicate(self, options):
        existing_ids = {option['id'] for option in self.find_all()}
        new_options = [option for option in options if option['id'] not in existing_ids]
        if not new_options:
            return []

        return self.bulk_create(new_options)
