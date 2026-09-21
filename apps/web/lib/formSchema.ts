import { FieldConfig } from "./types";

// Individual drug-class columns from mock_caries_data_v5.csv.
// Rendered as checkboxes for now; a note in the UI flags this for
// future auto-classification from a free-text medications field.
export const MEDICATION_CLASSES = [
  { key: "antihypertensives", label: "Antihypertensives" },
  { key: "antidiabetics", label: "Antidiabetics" },
  { key: "antidepressants", label: "Antidepressants" },
  { key: "antihistamines", label: "Antihistamines" },
  { key: "anticonvulsants", label: "Anticonvulsants" },
  { key: "chemotherapy", label: "Chemotherapy agents" },
  { key: "corticosteroids", label: "Corticosteroids" },
  { key: "diuretics", label: "Diuretics" },
  { key: "bronchodilators", label: "Bronchodilators" },
  { key: "bisphosphonates", label: "Bisphosphonates" },
  { key: "oral_contraceptives", label: "Oral contraceptives" },
];

export const FORM_SCHEMA: FieldConfig[] = [
  // SECTION A — Sociodemographic
  {
    key: "patient_code",
    label: "Patient code",
    type: "text",
    section: "A",
    placeholder: "PT0001",
    required: true,
  },
  {
    key: "age",
    label: "Age",
    type: "number",
    section: "A",
    min: 0,
    max: 120,
    unit: "years",
    required: true,
  },
  {
    key: "sex",
    label: "Sex",
    type: "select",
    section: "A",
    options: [
      { value: 0, label: "Female" },
      { value: 1, label: "Male" },
    ],
    required: true,
  },
  {
    key: "civil_status",
    label: "Civil status",
    type: "select",
    section: "A",
    options: [
      { value: "Single", label: "Single" },
      { value: "Married", label: "Married" },
      { value: "Widowed", label: "Widowed" },
      { value: "Separated", label: "Separated" },
    ],
    required: true,
  },
  {
    key: "occupation",
    label: "Occupation",
    type: "select",
    section: "A",
    options: [
      { value: "Student", label: "Student" },
      { value: "Blue Collar", label: "Blue collar" },
      { value: "White Collar", label: "White collar" },
      { value: "Professional", label: "Professional" },
      { value: "Unemployed", label: "Unemployed" },
      { value: "Retired", label: "Retired" },
    ],
    required: true,
  },
  {
    key: "educational_attainment",
    label: "Educational attainment",
    type: "select",
    section: "A",
    options: [
      { value: 0, label: "None" },
      { value: 1, label: "Elementary" },
      { value: 2, label: "High school" },
      { value: 3, label: "Vocational" },
      { value: 4, label: "College" },
      { value: 5, label: "Postgraduate" },
    ],
    required: true,
  },

  // SECTION B — Behavioral & Dietary
  {
    key: "brushing_frequency",
    label: "Brushing frequency",
    type: "number",
    section: "B",
    min: 0,
    max: 10,
    unit: "per day",
    required: true,
  },
  { key: "flossing", label: "Flossing", type: "boolean", section: "B" },
  {
    key: "fluoride_toothpaste",
    label: "Fluoride toothpaste use",
    type: "boolean",
    section: "B",
  },
  {
    key: "fluoride_mouthwash",
    label: "Fluoride mouthwash use",
    type: "boolean",
    section: "B",
  },
  {
    key: "professional_fluoride",
    label: "Professional fluoride treatment (past year)",
    type: "boolean",
    section: "B",
  },
  {
    key: "sugar_intake_frequency",
    label: "Sugar intake frequency",
    type: "number",
    section: "B",
    min: 0,
    max: 15,
    unit: "per day",
    required: true,
  },
  {
    key: "type_of_sugar",
    label: "Type of sugar consumed",
    type: "select",
    section: "B",
    options: [
      { value: "Sugary Drinks", label: "Sugary drinks" },
      { value: "Sweets", label: "Sweets" },
      { value: "Both", label: "Both" },
      { value: "None", label: "None" },
    ],
    required: true,
  },
  {
    key: "snacking",
    label: "Snacking between meals",
    type: "select",
    section: "B",
    options: [
      { value: 0, label: "Rarely" },
      { value: 1, label: "Sometimes" },
      { value: 2, label: "Frequently" },
    ],
    required: true,
  },
  {
    key: "last_dental_visit",
    label: "Last dental visit",
    type: "select",
    section: "B",
    options: [
      { value: 0, label: "Less than 6 months" },
      { value: 1, label: "6–12 months" },
      { value: 2, label: "More than 1 year" },
      { value: 3, label: "Never" },
    ],
    required: true,
  },
  {
    key: "tobacco_use",
    label: "Tobacco use",
    type: "select",
    section: "B",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Former" },
      { value: 2, label: "Current" },
    ],
    required: true,
  },

  // SECTION C — Medical History
  {
    key: "medications",
    label: "Current medications",
    type: "checkboxGroup",
    section: "C",
    groupOptions: MEDICATION_CLASSES,
    helpText:
      "Checked manually for now — auto-classifying from a free-text medication list is planned for a later version.",
  },
  {
    key: "systemic_conditions",
    label: "Systemic conditions present",
    type: "boolean",
    section: "C",
  },
  {
    key: "dry_mouth",
    label: "Subjective dry mouth symptoms",
    type: "boolean",
    section: "C",
  },

  // SECTION D — Clinical Findings
  {
    key: "teeth_present",
    label: "Number of teeth present",
    type: "number",
    section: "D",
    min: 0,
    max: 32,
    required: true,
  },
  {
    key: "plaque_level",
    label: "Plaque level",
    type: "select",
    section: "D",
    options: [
      { value: 0, label: "Low" },
      { value: 1, label: "Moderate" },
      { value: 2, label: "High" },
    ],
    required: true,
  },
  {
    key: "calculus_level",
    label: "Calculus level",
    type: "select",
    section: "D",
    options: [
      { value: 0, label: "Low" },
      { value: 1, label: "Moderate" },
      { value: 2, label: "High" },
    ],
    required: true,
  },
  {
    key: "gingival_findings",
    label: "Gingival findings",
    type: "select",
    section: "D",
    options: [
      { value: 0, label: "Healthy" },
      { value: 1, label: "Mild" },
      { value: 2, label: "Moderate" },
      { value: 3, label: "Severe" },
    ],
    required: true,
  },
  {
    key: "orthodontic_appliances",
    label: "Orthodontic appliances present",
    type: "boolean",
    section: "D",
  },
  {
    key: "restorations_present",
    label: "Restorations present",
    type: "number",
    section: "D",
    min: 0,
    max: 32,
  },
  {
    key: "active_carious_lesions_count",
    label: "Active carious lesions",
    type: "number",
    section: "D",
    min: 0,
    max: 32,
  },
  {
    key: "dmft_d",
    label: "DMFT — Decayed (D)",
    type: "number",
    section: "D",
    min: 0,
    max: 32,
  },
  {
    key: "dmft_m",
    label: "DMFT — Missing (M)",
    type: "number",
    section: "D",
    min: 0,
    max: 32,
  },
  {
    key: "dmft_f",
    label: "DMFT — Filled (F)",
    type: "number",
    section: "D",
    min: 0,
    max: 32,
  },
];

export const SECTION_TITLES: Record<string, string> = {
  A: "Sociodemographic data",
  B: "Behavioral & dietary factors",
  C: "Medical history",
  D: "Clinical findings",
};

export const SECTION_ORDER: Array<"A" | "B" | "C" | "D"> = [
  "A",
  "B",
  "C",
  "D",
];
