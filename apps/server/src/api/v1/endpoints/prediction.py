from fastapi import APIRouter, Depends
from src.schemas.prediction import PredictionRequest, PredictionResponse
from src.services.model_runner import run_prediction
from src.core.deps import get_model, get_explainer

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
async def predict(
    payload: PredictionRequest,
    model=Depends(get_model),
    explainer=Depends(get_explainer),
):
    return run_prediction(payload, model, explainer)