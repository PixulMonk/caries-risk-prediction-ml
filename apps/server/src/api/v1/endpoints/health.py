from fastapi import APIRouter

router = APIRouter()

@router.get("/health", include_in_schema=False)
async def health_check():
    return {
        "service": "caries-risk-prediction-api",
        "version": "0.1.0",
        "status": "ok",
    }