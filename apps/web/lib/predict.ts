import { FormValues, PredictionResponse } from "./types";

type PredictionRequest = {
  patient_code: string;
  sex: number;
  flossing: boolean;
  fluoride_toothpaste: boolean;
  fluoride_mouthwash: boolean;
  professional_fluoride: boolean;
  antihypertensives: boolean;
  antidiabetics: boolean;
  antidepressants: boolean;
  antihistamines: boolean;
  anticonvulsants: boolean;
  chemotherapy: boolean;
  corticosteroids: boolean;
  diuretics: boolean;
  bronchodilators: boolean;
  bisphosphonates: boolean;
  oral_contraceptives: boolean;
  xerogenic_medications: boolean;
  systemic_conditions: boolean;
  dry_mouth: boolean;
  orthodontic_appliances: boolean;
  civil_status: string;
  occupation: string;
  type_of_sugar: string;
  age: number;
  brushing_frequency: number;
  sugar_intake_frequency: number;
  educational_attainment: number;
  snacking: number;
  last_dental_visit: number;
  teeth_present: number;
  plaque_level: number;
  calculus_level: number;
  gingival_findings: number;
  restorations_present: number;
  active_carious_lesions_count: number;
  tobacco_use: number;
  dmft: { d: number; m: number; f: number };
};

interface ApiPredictionResponse {
  label: "High" | "Low";
  probability: number;
  is_borderline: boolean;
  top_features: PredictionResponse["topFeatures"];
  recommendations: string[];
  dmft_total: number;
  model_note: string;
}

const medicationKeys = [
  "antihypertensives",
  "antidiabetics",
  "antidepressants",
  "antihistamines",
  "anticonvulsants",
  "chemotherapy",
  "corticosteroids",
  "diuretics",
  "bronchodilators",
  "bisphosphonates",
  "oral_contraceptives",
] as const;

function numberValue(
  values: FormValues,
  key: string,
  optional = false,
): number {
  const raw = values[key];
  if (raw === undefined || raw === "") {
    if (optional) return 0;
    throw new Error(`Please enter ${key.replaceAll("_", " ")}.`);
  }

  const value = Number(raw);
  if (!Number.isInteger(value)) {
    throw new Error(`${key.replaceAll("_", " ")} must be a whole number.`);
  }
  return value;
}

function stringValue(values: FormValues, key: string): string {
  const value = values[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Please provide ${key.replaceAll("_", " ")}.`);
  }
  return value.trim();
}

function toPredictionRequest(values: FormValues): PredictionRequest {
  const medicationValues = values.medications;
  const medications =
    medicationValues && typeof medicationValues === "object"
      ? medicationValues
      : {};
  const booleanValue = (key: string) => values[key] === true;
  const optionalNumber = (key: string) => numberValue(values, key, true);

  return {
    patient_code: stringValue(values, "patient_code"),
    sex: numberValue(values, "sex"),
    flossing: booleanValue("flossing"),
    fluoride_toothpaste: booleanValue("fluoride_toothpaste"),
    fluoride_mouthwash: booleanValue("fluoride_mouthwash"),
    professional_fluoride: booleanValue("professional_fluoride"),
    antihypertensives: medications.antihypertensives === true,
    antidiabetics: medications.antidiabetics === true,
    antidepressants: medications.antidepressants === true,
    antihistamines: medications.antihistamines === true,
    anticonvulsants: medications.anticonvulsants === true,
    chemotherapy: medications.chemotherapy === true,
    corticosteroids: medications.corticosteroids === true,
    diuretics: medications.diuretics === true,
    bronchodilators: medications.bronchodilators === true,
    bisphosphonates: medications.bisphosphonates === true,
    oral_contraceptives: medications.oral_contraceptives === true,
    xerogenic_medications: booleanValue("xerostomic_medications"),
    systemic_conditions: booleanValue("systemic_conditions"),
    dry_mouth: booleanValue("dry_mouth"),
    orthodontic_appliances: booleanValue("orthodontic_appliances"),
    civil_status: stringValue(values, "civil_status"),
    occupation: stringValue(values, "occupation"),
    type_of_sugar: stringValue(values, "type_of_sugar"),
    age: numberValue(values, "age"),
    brushing_frequency: numberValue(values, "brushing_frequency"),
    sugar_intake_frequency: numberValue(values, "sugar_intake_frequency"),
    educational_attainment: numberValue(values, "educational_attainment"),
    snacking: numberValue(values, "snacking"),
    last_dental_visit: numberValue(values, "last_dental_visit"),
    teeth_present: numberValue(values, "teeth_present"),
    plaque_level: numberValue(values, "plaque_level"),
    calculus_level: numberValue(values, "calculus_level"),
    gingival_findings: numberValue(values, "gingival_findings"),
    restorations_present: optionalNumber("restorations_present"),
    active_carious_lesions_count: optionalNumber(
      "active_carious_lesions_count",
    ),
    tobacco_use: numberValue(values, "tobacco_use"),
    dmft: {
      d: optionalNumber("dmft_d"),
      m: optionalNumber("dmft_m"),
      f: optionalNumber("dmft_f"),
    },
  };
}

export async function predict(values: FormValues): Promise<PredictionResponse> {
  const payload = toPredictionRequest(values);
  const baseUrl = (
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"
  ).replace(/\/$/, "");
  const response = await fetch(`${baseUrl}/api/v1/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const detail =
      typeof body?.detail === "string" ? body.detail : response.statusText;
    throw new Error(`Prediction request failed (${response.status}): ${detail}`);
  }

  const result = (await response.json()) as ApiPredictionResponse;
  return {
    label: result.label,
    probability: result.probability,
    isBorderline: result.is_borderline,
    topFeatures: result.top_features,
    recommendations: result.recommendations,
    dmft: {
      d: payload.dmft.d,
      m: payload.dmft.m,
      f: payload.dmft.f,
      total: result.dmft_total,
    },
    modelNote: result.model_note,
  };
}