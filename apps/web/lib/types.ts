// This shape is the contract between apps/web and apps/server.
// When the real /predict endpoint exists, only mockPredict.ts needs to change.

export type FieldType =
  | "text"
  | "number"
  | "boolean"
  | "select"
  | "checkboxGroup";

export interface SelectOption {
  value: number | string;
  label: string;
}

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  section: "A" | "B" | "C" | "D";
  options?: SelectOption[]; // for "select"
  groupOptions?: { key: string; label: string }[]; // for "checkboxGroup"
  min?: number;
  max?: number;
  unit?: string;
  helpText?: string;
  required?: boolean;
  placeholder?: string;
}

// Generic bag of answers keyed by FieldConfig["key"].
// Checkbox groups store an object of { [subKey]: boolean } under the group key.
export type FormValues = Record<
  string,
  string | number | boolean | Record<string, boolean> | undefined
>;

export interface FeatureContribution {
  feature: string;
  label: string;
  direction: "increases" | "decreases";
  magnitude: number; // 0-1, relative contribution to this prediction
  note?: string;
}

export interface PredictionResponse {
  label: "High" | "Low";
  probability: number; // 0-1
  isBorderline: boolean;
  topFeatures: FeatureContribution[];
  recommendations: string[];
  dmft: {
    d: number;
    m: number;
    f: number;
    total: number;
  };
  modelNote: string;
}
