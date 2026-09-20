#!/bin/bash

set -e  # stop on first error

VERSION=$1
if [ -z "$VERSION" ]; then
  echo "Usage: ./scripts/promote_model.sh <version_tag>"
  echo "Example: ./scripts/promote_model.sh 0.1.0-mock"
  exit 1
fi

# Source files in ml/models/
MODEL_SRC="ml/models/caries-risk-v${VERSION}.pkl"
EXPLAINER_SRC="ml/models/caries-risk-explainer-v${VERSION}.pkl"

# Check if source model exists before copying
if [ ! -f "$MODEL_SRC" ]; then
  echo "Error: Source model file '$MODEL_SRC' not found."
  exit 1
fi

# Copy artifacts to server workspace
cp "$MODEL_SRC" apps/server/artifacts/current.pkl
if [ -f "$EXPLAINER_SRC" ]; then
  cp "$EXPLAINER_SRC" apps/server/artifacts/explainer.pkl
fi

# Store active metadata version
echo "caries-risk-v${VERSION}" > apps/server/artifacts/VERSION

echo "Successfully promoted caries-risk-v${VERSION} → apps/server/artifacts/"