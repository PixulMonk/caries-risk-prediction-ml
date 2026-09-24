import { FormValues, PredictionResponse, FeatureContribution } from "./types";

// STANDIN ONLY. Once apps/server exposes POST /predict, replace the body
// of this function with a fetch() call to that endpoint. The return shape
// here is deliberately identical to the planned real response so the UI
// components below never need to change.

function num(v: unknown, fallback = 0): number {
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : fallback;
}

function bool(v: unknown): boolean {
  return v === true || v === 1 || v === "1";
}

export async function mockPredict(
  values: FormValues
): Promise<PredictionResponse> {
  // Simulated latency so the results panel's loading state is visible.
  await new Promise((r) => setTimeout(r, 600));

  const sugarFreq = num(values.sugar_intake_frequency);
  const brushing = num(values.brushing_frequency);
  const snacking = num(values.snacking);
  const lastVisit = num(values.last_dental_visit);
  const plaque = num(values.plaque_level);
  const calculus = num(values.calculus_level);
  const activeLesions = num(values.active_carious_lesions_count);
  const dryMouth = bool(values.dry_mouth);
  const tobacco = num(values.tobacco_use);
  const flossing = bool(values.flossing);
  const fluorideToothpaste = bool(values.fluoride_toothpaste);

  const contributions: FeatureContribution[] = [
    {
      feature: "active_carious_lesions_count",
      label: "Active carious lesions",
      direction: activeLesions > 0 ? "increases" : "decreases",
      magnitude: Math.min(activeLesions / 6, 1),
    },
    {
      feature: "sugar_intake_frequency",
      label: "Sugar intake frequency",
      direction: sugarFreq >= 3 ? "increases" : "decreases",
      magnitude: Math.min(sugarFreq / 8, 1),
    },
    {
      feature: "plaque_level",
      label: "Plaque level",
      direction: plaque >= 1 ? "increases" : "decreases",
      magnitude: plaque / 2,
    },
    {
      feature: "last_dental_visit",
      label: "Time since last dental visit",
      direction: lastVisit >= 2 ? "increases" : "decreases",
      magnitude: lastVisit / 3,
    },
    {
      feature: "brushing_frequency",
      label: "Brushing frequency",
      direction: brushing < 2 ? "increases" : "decreases",
      magnitude: Math.min(Math.abs(2 - brushing) / 2, 1),
    },
    {
      feature: "dry_mouth",
      label: "Dry mouth symptoms",
      direction: dryMouth ? "increases" : "decreases",
      magnitude: dryMouth ? 0.6 : 0.1,
    },
    {
      feature: "fluoride_toothpaste",
      label: "Fluoride toothpaste use",
      direction: fluorideToothpaste ? "decreases" : "increases",
      magnitude: fluorideToothpaste ? 0.3 : 0.5,
    },
  ];

  // Crude weighted heuristic standing in for predict_proba().
  let score = 0.15;
  score += Math.min(activeLesions * 0.08, 0.3);
  score += Math.min(sugarFreq * 0.04, 0.2);
  score += plaque * 0.08;
  score += calculus * 0.05;
  score += lastVisit * 0.06;
  score += tobacco * 0.04;
  score += dryMouth ? 0.08 : 0;
  score -= flossing ? 0.05 : 0;
  score -= fluorideToothpaste ? 0.05 : 0;
  score -= brushing >= 2 ? 0.05 : 0;
  const probability = Math.max(0.02, Math.min(0.97, score));

  const topFeatures = contributions
    .sort((a, b) => b.magnitude - a.magnitude)
    .slice(0, 4);

  const recommendationMap: Record<string, string> = {
    active_carious_lesions_count:
      "Prioritize restorative treatment for existing active lesions before the next recall.",
    sugar_intake_frequency:
      "Counsel on reducing frequency of sugar exposure, not just total amount.",
    plaque_level: "Reinforce brushing technique; consider a plaque-disclosing session.",
    last_dental_visit: "Schedule a recall visit — extended gaps between visits raise risk.",
    brushing_frequency: "Encourage brushing at least twice daily with fluoride toothpaste.",
    dry_mouth: "Evaluate salivary flow; consider saliva substitutes or xylitol products.",
    fluoride_toothpaste: "Recommend fluoride toothpaste if not already in use.",
  };

  const recommendations = topFeatures
    .filter((f) => f.direction === "increases")
    .map((f) => recommendationMap[f.feature])
    .filter(Boolean) as string[];

  const d = num(values.dmft_d);
  const m = num(values.dmft_m);
  const f = num(values.dmft_f);

  return {
    label: probability >= 0.5 ? "High" : "Low",
    probability,
    isBorderline: Math.abs(probability - 0.5) < 0.08,
    topFeatures,
    recommendations:
      recommendations.length > 0
        ? recommendations
        : ["No elevated risk factors stood out — maintain current routine."],
    dmft: { d, m, f, total: d + m + f },
    modelNote:
      "Demo prediction from a placeholder heuristic, not the trained model. Feature ranking uses scikit-learn's built-in importance for now — SHAP-based per-patient explanations are planned.",
  };
}
