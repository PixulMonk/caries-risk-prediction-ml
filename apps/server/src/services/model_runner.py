import pandas as pd

from schemas.prediction import (
    PredictionRequest,
    PredictionResponse,
    FeatureContribution,
    MODEL_FEATURE_COLS,
)


# services/model_runner.py
def run_prediction(payload: PredictionRequest, model, explainer) -> PredictionResponse:
    row = payload.model_dump(exclude={"dmft", "patient_code"})
    input_df = pd.DataFrame([row])[MODEL_FEATURE_COLS]

    proba = float(model.predict_proba(input_df)[0][1])
    top_features = _get_local_shap_features(model, explainer, input_df)

    return PredictionResponse(
        label="High" if proba >= 0.5 else "Low",
        probability=proba,
        is_borderline=abs(proba - 0.5) < 0.08,
        top_features=top_features,
        recommendations=_build_recommendations(top_features),
        dmft_total=payload.dmft.total,
        model_note="Prediction with per-patient SHAP attribution.",
    )


def _get_local_shap_features(model, explainer, input_df, top_n=4):
    preprocessor = model.named_steps["preprocessor"]
    feature_names = preprocessor.get_feature_names_out()

    # SHAP explainer was fit on TRANSFORMED features (post-imputation/encoding),
    # same as X_test_df in the notebook — so transform before calling it.
    transformed = preprocessor.transform(input_df)
    transformed_df = pd.DataFrame(transformed, columns=feature_names)

    try:
        shap_result = explainer(transformed_df, check_additivity=False)
    except TypeError:
        # LinearExplainer's __call__ doesn't accept check_additivity
        shap_result = explainer(transformed_df)

    values = shap_result.values
    if values.ndim == 3:  # same RF/XGB binary-output quirk handled in cell 37
        values = values[:, :, 1]

    patient_shap = values[0]  # single row — one patient per request
    max_abs = max(abs(v) for v in patient_shap) or 1.0

    ranked_idx = sorted(
        range(len(patient_shap)), key=lambda i: -abs(patient_shap[i])
    )[:top_n]

    return [
        FeatureContribution(
            feature=feature_names[i],
            label=_humanize(feature_names[i]),
            direction="increases" if patient_shap[i] > 0 else "decreases",
            magnitude=float(abs(patient_shap[i]) / max_abs),  # normalized 0–1 for the UI bars
        )
        for i in ranked_idx
    ]

# TODO: consider moving these messages to a config file or database for easier updates and localization

RECOMMENDATION_MAP = {
    "active_carious_lesions_count": "Prioritize restorative treatment for existing active lesions before the next recall.",
    "sugar_intake_frequency": "Counsel on reducing frequency of sugar exposure, not just total amount.",
    "type_of_sugar": "Discuss substituting sugary drinks/sweets for lower-cariogenicity alternatives.",
    "plaque_level": "Reinforce brushing technique; consider a plaque-disclosing session.",
    "calculus_level": "Schedule professional scaling to remove calculus buildup.",
    "last_dental_visit": "Schedule a recall visit — extended gaps between visits raise risk.",
    "brushing_frequency": "Encourage brushing at least twice daily with fluoride toothpaste.",
    "dry_mouth": "Evaluate salivary flow; consider saliva substitutes or xylitol products.",
    "xerogenic_medications": "Coordinate with prescribing physician; consider salivary stimulants if appropriate.",
    "fluoride_toothpaste": "Recommend fluoride toothpaste if not already in use.",
    "fluoride_mouthwash": "Recommend a fluoride mouthwash as an adjunct to brushing.",
    "professional_fluoride": "Consider an in-office professional fluoride application.",
    "tobacco_use": "Counsel on tobacco cessation — associated with elevated caries and periodontal risk.",
    "snacking": "Reduce between-meal snacking frequency to limit acid exposure cycles.",
    "gingival_findings": "Address gingival inflammation — may indicate broader oral hygiene gaps.",
    "restorations_present": "Monitor existing restorations for secondary caries at margins.",
    "teeth_present": "Elevated contribution here likely reflects prior caries-driven tooth loss — review dental history rather than treating this as an actionable factor.",
}


def _build_recommendations(top_features: list[FeatureContribution]) -> list[str]:
    recommendations = []
    for f in top_features:
        if f.direction != "increases":
            continue
        base_name = f.feature.split("__", 1)[-1]  # strip num__/cat__/binary__ prefix
        for key, message in RECOMMENDATION_MAP.items():
            # handles both exact matches (e.g. "teeth_present") and
            # one-hot-expanded categoricals (e.g. "type_of_sugar_Both" → "type_of_sugar")
            if base_name == key or base_name.startswith(f"{key}_"):
                recommendations.append(message)
                break
    return recommendations or [
        "No elevated risk factors stood out — maintain current preventive routine."
    ]

def _humanize(raw_name: str) -> str:
    # ColumnTransformer prefixes names like "num__age" or "cat__civil_status_Married"
    return raw_name.split("__", 1)[-1].replace("_", " ").title()