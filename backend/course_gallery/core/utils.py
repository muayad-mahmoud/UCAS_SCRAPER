from dotenv import load_dotenv
from pydantic_settings import BaseSettings
from pydantic import Field

load_dotenv()


class Settings(BaseSettings):
    supabase_url: str = Field(..., description="Supabase URL")
    supabase_service_key: str = Field(..., description="Supabase Service Key")
    client_url: str = Field(..., description="Client URL")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

settings = Settings()
