from .base_repository import BaseRepository
from .provider_repository import ProviderRepository
from .address_repository import AddressRepository
from .options_repository import OptionsRepository
from .courses_repository import CoursesRepository

class DatabaseManager:
    def __init__(self, supabase_client):
        self.supabase = supabase_client
        self.provider_repository = ProviderRepository(supabase_client)
        self.address_repository = AddressRepository(supabase_client)
        self.options_repository = OptionsRepository(supabase_client)
        self.courses_repository = CoursesRepository(supabase_client)
