# Caries Risk Assessment — Web UI (draft)

Drop this into `apps/web/` in the monorepo. It's a standalone Next.js app —
no dependency on `apps/server/` yet.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Component library

Built on shadcn/ui (`components/ui/`) — Radix primitives + Tailwind, not a
packaged dependency, so the source lives directly in this repo and is yours
to edit. The shadcn semantic tokens (`--primary`, `--background`, etc., in
`app/globals.css`) are mapped to the original clinical palette rather than
shadcn's default gray theme, so the look doesn't change — just the
underlying component structure (accessible by default, consistent focus
states, Radix-driven Select/Checkbox instead of raw HTML controls).

## What's real vs. placeholder

- **`lib/formSchema.ts`** — the actual field list, matching
  `mock_caries_data_v5.csv` and the GPA form sections (A–D). Edit this file
  when the feature set changes; the form re-renders automatically since it's
  looped from this config, not hardcoded.
- **`lib/mockPredict.ts`** — a heuristic stand-in for the trained model.
  Its return shape (`PredictionResponse` in `lib/types.ts`) is what the real
  `POST /predict` on `apps/server` should return. When that endpoint exists,
  replace the body of `mockPredict()` with a `fetch()` call — no other file
  needs to change.
- **Medications** — rendered as individual checkboxes (`MEDICATION_CLASSES`
  in `formSchema.ts`), matching the CSV's per-drug-class columns. Free-text
  entry + auto-classification is a planned later version, not built here.
- **Feature importance in the results panel** — currently just sorts by a
  fake magnitude. Once SHAP is implemented, the per-patient contribution
  values from the backend response slot into the same `topFeatures` array
  with no UI changes needed.

## Known gaps to close before this is real

- No form validation beyond basic required/min/max — no cross-field checks
  (e.g. DMFT total vs. teeth present).
- No persistence — nothing is saved between page loads.
- Sex/civil status/occupation option lists are inferred from the mock CSV's
  observed values; confirm these match the actual data dictionary before
  wiring up the real backend.
