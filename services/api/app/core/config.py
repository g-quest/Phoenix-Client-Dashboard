from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Phoenix API"  # Application name
    DOCS_URL: str = "/docs"  # Swagger documentation URL
    DATABASE_URL: str = ""
    COMBOT_HUMANITY_API_KEY: str = ""
    COMBOT_IO_NET_API_KEY: str = ""

    class Config:
        env_file = ".env"  # Load environment variables from .env file


# Instantiate the settings
settings = Settings()