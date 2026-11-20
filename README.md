# CRPS: Caries Risk Prediction System

A machine-learning research prototype that predicts dental caries risk from clinical assessment data. Built as part of an undergraduate Doctor of Dental Medicine thesis.

> **Status: work in progress.** The pipeline currently runs on **synthetic data only**. The code on this branch reflects the study's original design: an adult feature set based on the intake form for 1st- and 2nd-year dental students. The study has since moved to a **retrospective pediatric dataset**, which is pending ethics approval. Migration to pediatric features is in progress and not yet merged, so features, models, and results are expected to change.
>
> **Not a medical device.** This is a research prototype and must not be used for clinical decisions.

**Live demo:** https://crps-web.vercel.app
The demo returns simulated predictions from a client-side heuristic. It is not connected to the model service.

## Why

Most published caries risk models are trained on populations unlike those of Filipino children, so their predictions may not generalize well to local pediatric patients. This project builds the pipeline for a locally trained model, starting from the features available in a standard patient assessment form.

## What's here

| Workspace | What it does | Stack |
|---|---|---|
| `ml/` | Preprocessing, model training and comparison, evaluation, SHAP analysis | Python, Jupyter, pandas, scikit-learn, XGBoost, SHAP |
| `apps/server/` | API that loads the promoted model and serves predictions with per-patient explanations | FastAPI, Pydantic, uv |
| `apps/web/` | Web UI for entering a patient assessment and viewing risk | Next.js, React, TypeScript, Tailwind CSS, shadcn/ui |
| `scripts/` | Tooling, e.g. `promote_model.sh` to promote a trained model version into the server | Bash |

### ML pipeline

- Uses an adult feature set: demographics (age, sex, civil status, occupation, educational attainment), oral hygiene and diet habits, fluoride use, medications, systemic conditions, and clinical findings (DMFT, plaque, calculus, gingival findings, active lesions)
- Preprocesses these fields into model features with a scikit-learn pipeline (imputation and one-hot encoding)
- Compares logistic regression (baseline), random forest, and XGBoost, tuned with grid search and 5-fold cross-validation
- Handles class imbalance with class weighting
- Evaluates with AUC-ROC (target ≥ 0.70), sensitivity, and specificity rather than accuracy alone, and selects the best model by AUC-ROC, then sensitivity
- Explains predictions with SHAP, both globally (feature importance) and per patient
- Uses versioned synthetic datasets to test the pipeline end to end before real data is available

### Server

The FastAPI service follows a router → service → schema structure. `core/deps.py` loads and caches the current model and SHAP explainer from `apps/server/artifacts/`. `services/model_runner.py` runs the prediction and returns the risk label, probability, the top contributing features for that patient, and recommendations based on them. `scripts/promote_model.sh` copies a trained model version and its explainer from `ml/models/` into the server and updates the `VERSION` file.

### Web

The UI renders the assessment form from a single field config (`lib/formSchema.ts`). Predictions currently come from a heuristic stand-in (`lib/mockPredict.ts`), not from the API.

## Data and artifact policy

- **No patient data is committed to this repository.** Only synthetic datasets (`ml/data/mock_data/`) are tracked. Everything else under `ml/data/` is git-ignored.
- **Model artifacts are never committed**, including models trained on synthetic data. `ml/models/*` and `apps/server/artifacts/*` are git-ignored, so a fresh clone has no model until you train and promote one (see below).
- A pre-commit hook (`nbstripout`) strips notebook outputs before commit.

## Running locally

Requires Python 3.14+ for the server (managed with [uv](https://docs.astral.sh/uv/)) and Node.js for the web app.

**1. Train a model**
```bash
cd ml
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
jupyter lab notebooks/caries_risk_prediction_models.ipynb
# Run all cells. This writes caries-risk-v<version>.pkl and its explainer to ml/models/
```

**2. Promote it to the server** (from the repository root)
```bash
./scripts/promote_model.sh 0.1.5-mock
```

**3. Start the server and web app**
```bash
make install   # npm install (web) + uv sync (server)
make dev       # web on http://localhost:3000, API on http://localhost:8000
```

Or run them separately:
```bash
cd apps/server && uv run uvicorn src.main:app --reload
cd apps/web && npm run dev
```

The two run independently for now. The web UI uses the mock predictor, and you can call the API directly at `POST http://localhost:8000/api/v1/predict` (interactive docs at `http://localhost:8000/docs`).

## Roadmap

- [ ] Migrate features to the pediatric dataset (in progress)
- [ ] Retrain and re-evaluate on the real pediatric dataset once ethics approval is granted
- [ ] Revisit features after seeing the real data (some current features are ambiguous proxies)
- [ ] Connect the web UI and deployed demo to the model service
- [ ] Fetch model artifacts from private storage (`scripts/fetch_artifacts.py`) so a fresh clone doesn't need to retrain
- [ ] Batch prediction from CSV upload

## Team

This is a group thesis project.

- **Ross Albert Tejada**: software and ML (pipeline, API, web UI)
- **Joella Mharee C. Advincula**, **Regine Ysabell Garing**, **Sarah M. Maglaqui**, **Psyche Mariz U. Mallari**, **Amos Aberlard L. Santos**: manuscript preparation and coordination with thesis advisers


## License

No license is granted at this time. Please contact the author before reusing any part of this code.
