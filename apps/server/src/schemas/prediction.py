from pydantic import BaseModel
from schemas.patient import CivilStatus, Occupation, TypeOfSugar, DMFTData

# TODO: Consider extracting the feature lists into a separate file to avoid duplication between this file and the notebook. The lists must match exactly, so it would be better to have a single source of truth.
# Single source of truth — must match ml/notebooks binary_cols/categorical_cols/
# numerical_cols exactly. If the notebook's feature list changes, update here too.
BINARY_COLS = [
    "sex", "flossing", "fluoride_toothpaste", "fluoride_mouthwash",
    "professional_fluoride", "antihypertensives", "antidiabetics",
    "antidepressants", "antihistamines", "anticonvulsants",
    "chemotherapy", "corticosteroids", "diuretics", "bronchodilators",
    "bisphosphonates", "oral_contraceptives", "xerogenic_medications",
    "systemic_conditions", "dry_mouth", "orthodontic_appliances",
]
CATEGORICAL_COLS = ["civil_status", "occupation", "type_of_sugar"]
NUMERICAL_COLS = [
    "age", "brushing_frequency", "sugar_intake_frequency",
    "educational_attainment", "snacking", "last_dental_visit",
    "teeth_present", "plaque_level", "calculus_level",
    "gingival_findings", "restorations_present",
    "active_carious_lesions_count", "tobacco_use",
]
MODEL_FEATURE_COLS = BINARY_COLS + CATEGORICAL_COLS + NUMERICAL_COLS


class PredictionRequest(BaseModel):
    patient_code: str  # identifier only — excluded before hitting the model

    sex: int
    flossing: bool
    fluoride_toothpaste: bool
    fluoride_mouthwash: bool
    professional_fluoride: bool
    antihypertensives: bool
    antidiabetics: bool
    antidepressants: bool
    antihistamines: bool
    anticonvulsants: bool
    chemotherapy: bool
    corticosteroids: bool
    diuretics: bool
    bronchodilators: bool
    bisphosphonates: bool
    oral_contraceptives: bool
    xerogenic_medications: bool
    systemic_conditions: bool
    dry_mouth: bool
    orthodontic_appliances: bool

    civil_status: CivilStatus
    occupation: Occupation
    type_of_sugar: TypeOfSugar

    age: int
    brushing_frequency: int
    sugar_intake_frequency: int
    educational_attainment: int
    snacking: int
    last_dental_visit: int
    teeth_present: int
    plaque_level: int
    calculus_level: int
    gingival_findings: int
    restorations_present: int
    active_carious_lesions_count: int
    tobacco_use: int

    dmft: DMFTData  # collected, displayed, never passed to predict_proba()


class FeatureContribution(BaseModel):
    feature: str
    label: str
    direction: str  # "increases" | "decreases"
    magnitude: float


class PredictionResponse(BaseModel):
    label: str  # "High" | "Low"
    probability: float
    is_borderline: bool
    top_features: list[FeatureContribution]
    recommendations: list[str]
    dmft_total: int
    model_note: str