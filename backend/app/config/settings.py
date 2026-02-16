from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GOOGLE_SHEET_ID: str
    GOOGLE_CREDENTIALS_FILE: str

    UPI_ID: str
    UPI_NAME: str

    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    class Config:
        env_file = ".env"

settings = Settings()