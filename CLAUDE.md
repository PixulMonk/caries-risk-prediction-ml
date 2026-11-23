# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Monorepo for a caries (tooth decay) risk prediction system. Three workspaces:

- `ml/` — notebook-driven model training/SHAP analysis (`ml/notebooks/caries_risk_prediction_models.ipynb`), trained on mock/synthetic data (`ml/data/mock_data/`). Python deps in `ml/requirements.txt` (own `.venv`).
- `apps/server/` — FastAPI inference API, managed with `uv` (Python >=3.14).
- `apps/web/` — Next.js (App Router) + Tailwind + shadcn/ui front end (`components/ui/` is editable source, not a dependency).

## Commands

Run from the repo root:

- `make install` — `npm install` in web, `uv sync` in server
- `make dev` — runs web (http://localhost:3000) and server (http://localhost:8000) in parallel; `make dev-web` / `make dev-server` individually
- `./scripts/promote_model.sh <version>` — copies `ml/models/caries-risk-v<version>.pkl` (and explainer) to `apps/server/artifacts/current.pkl` / `explainer.pkl` and writes `artifacts/VERSION`. Pass the version without the `v` prefix (e.g. `0.1.5-mock`).
- Web: `npm run build`, `npm run lint` in `apps/web`.
- No test suite exists yet.
- Pre-commit uses `nbstripout`, so notebook outputs are stripped on commit.

## Architecture

**Prediction flow:** web form → `apps/web/lib/predict.ts` → `POST /api/v1/predict` → `apps/server/src/services/model_runner.py` → response adapted back into the UI's `PredictionResponse`.

- **Contract is duplicated in three places** and must be kept in sync when features change: `apps/web/lib/formSchema.ts` (form fields, drives form rendering), `apps/web/lib/predict.ts` (request/response mapping), and `apps/server/src/schemas/prediction.py` (`PredictionRequest`, `MODEL_FEATURE_COLS`). The trained model's feature columns come from the notebook / mock CSV (`mock_caries_data_v5.csv`).
- **Server:** `src/api/v1/endpoints/` routers → `services/model_runner.py`. The model (a sklearn Pipeline with a `preprocessor` step) and SHAP explainer are loaded lazily and cached via `core/deps.py` from `apps/server/artifacts/*.pkl` (git-ignored; only `.gitkeep` tracked). The explainer is fit on *post-preprocessor* features, so SHAP inference transforms input first. Recommendations come from `RECOMMENDATION_MAP` keyed on base feature names (prefix `num__`/`cat__` stripped, one-hot suffixes matched).
- **Server imports:** `main.py`/`router.py` use `src.`-prefixed imports while `model_runner.py` imports `schemas.…` without the prefix — be careful about import style when editing; run uvicorn from `apps/server` as `uvicorn src.main:app`. Note `api/v1/endpoints/__init.py` is misspelled (missing trailing underscores).
- **Web:** `lib/mockPredict.ts` is a heuristic stand-in kept for comparison with real model output; API base URL via `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:8000`). CORS in `server/src/main.py` only allows `localhost` / `localhost:3000`.
- **Data safety:** `.gitignore` excludes everything under `ml/data/` except `.gitkeep` files and `mock_data/`; trained models in `ml/models/` are ignored too. Never commit real patient data.
