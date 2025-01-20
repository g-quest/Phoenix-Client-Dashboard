from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Phoenix API"  # Application name
    DOCS_URL: str = "/docs"  # Swagger documentation URL
    DATABASE_URL: str = ""

    class Config:
        env_file = ".env"  # Load environment variables from .env file


# Instantiate the settings
settings = Settings()