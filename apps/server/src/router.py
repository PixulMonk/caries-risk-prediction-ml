from fastapi import APIRouter
from src.api.v1.endpoints import prediction
from src.api.v1.endpoints import health

api_router = APIRouter()
api_router.include_router(prediction.router, tags=["prediction"])
api_router.include_router(health.router, tags=["health"])