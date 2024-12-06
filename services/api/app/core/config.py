from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Phoenix API"  # Application name
    docs_url: str = "/docs"  # Swagger documentation URL
    openai_api_key: str = ""  # OpenAI API key

    class Config:
        env_file = ".env"  # Load environment variables from .env file


# Instantiate the settings
settings = Settings()