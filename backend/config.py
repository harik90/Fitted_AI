import os
from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    face_model_path: str = "models/insightface"
    segmentation_model_path: str = "models/sam2"
    generation_model_path: str = "models/instantid"
    restoration_model_path: str = "models/gfpgan"
    device: str = "auto"
    max_retries: int = 3
    quality_threshold: float = 0.80
    temp_dir: str = str(Path(__file__).parent / "temp")
    max_upload_size_mb: int = 10
    allowed_extensions: list[str] = ["jpg", "jpeg", "png", "webp"]
    cors_origins: list[str] = ["*"]

    # Quality weights
    identity_weight: float = 0.40
    geometry_weight: float = 0.20
    mask_weight: float = 0.15
    sharpness_weight: float = 0.10
    preservation_weight: float = 0.15

    class Config:
        env_file = ".env"


settings = Settings()
os.makedirs(settings.temp_dir, exist_ok=True)
