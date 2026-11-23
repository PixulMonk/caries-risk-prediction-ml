"use client";

import { useState } from "react";
import AssessmentForm from "@/components/AssessmentForm";
import ResultsPanel from "@/components/ResultsPanel";
import { predict } from "@/lib/predict";
import { FormValues, PredictionResponse } from "@/lib/types";

export default function Home() {
  const [values, setValues] = useState<FormValues>({});
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(key: string, value: FormValues[string]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setResult(null);
    setError(null);
    try {
      const prediction = await predict(values);
      setResult(prediction);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to get a prediction.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <p className="font-sans text-xs text-primary tracking-wide mb-1">
            Caries Risk Prediction System
          </p>
          <h1 className="font-sans text-2xl text-foreground">
            General patient assessment
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
        <section>
          <AssessmentForm
            values={values}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
          {error && (
            <p role="alert" className="mt-4 text-sm text-destructive">
              {error}
            </p>
          )}
        </section>

        <aside className="lg:sticky lg:top-10 self-start">
          <ResultsPanel result={result} isLoading={isSubmitting} />
        </aside>
      </div>
    </main>
  );
}
