from pathlib import Path
from functools import lru_cache
import joblib

# Set the artifacts directory relative to this file
ARTIFACTS_DIR = Path(__file__).resolve().parent.parent.parent / "artifacts"

@lru_cache
def get_model():
    return joblib.load(ARTIFACTS_DIR / "current.pkl")

@lru_cache
def get_explainer():
    return joblib.load(ARTIFACTS_DIR / "explainer.pkl")