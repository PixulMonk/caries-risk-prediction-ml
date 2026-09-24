"use client";

import { useState } from "react";
import { PredictionResponse } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { CalculatingLoader } from "@/components/ui/calculating-loader";
import { cn } from "@/lib/utils";

interface Props {
  result: PredictionResponse | null;
  isLoading: boolean;
}

function ProbabilityGauge({ probability }: { probability: number }) {
  const pct = Math.round(probability * 100);
  const isHigh = probability >= 0.5;
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-bold tracking-tight text-foreground">
          {pct}%
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          Predicted Risk Score
        </span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            isHigh ? "bg-destructive" : "bg-primary",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function FeatureBar({
  label,
  magnitude,
  direction,
}: {
  label: string;
  magnitude: number;
  direction: "increases" | "decreases";
}) {
  const pct = Math.round(magnitude * 100);
  const isIncrease = direction === "increases";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span
          className={cn(
            "font-semibold text-[11px]",
            isIncrease ? "text-destructive" : "text-primary",
          )}
        >
          {isIncrease ? "↑ raises risk" : "↓ lowers risk"}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isIncrease ? "bg-destructive" : "bg-primary",
          )}
          style={{ width: `${Math.max(pct, 8)}%` }}
        />
      </div>
    </div>
  );
}

export default function ResultsPanel({ result, isLoading }: Props) {
  const [explainMode, setExplainMode] = useState<"plain" | "clinical">("plain");

  if (isLoading) {
    return (
      <Card className="border border-border shadow-xs bg-card/60">
        <CardContent className="p-8">
          <CalculatingLoader label="Calculating prediction…" />
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="border-dashed border-border bg-card/50 shadow-xs">
        <CardContent className="p-6">
          <p className="font-sans text-base font-semibold text-foreground mb-1">
            Awaiting assessment
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Complete the patient form and submit to generate a caries risk
            prediction and feature breakdown.
          </p>
        </CardContent>
      </Card>
    );
  }

  const isHigh = result.label === "High";

  return (
    <Card className="overflow-hidden border border-border shadow-xs">
      {/* Header Banner */}
      <div
        className={cn(
          "px-6 py-4 border-b border-border",
          isHigh ? "bg-destructive/10" : "bg-primary/10",
        )}
      >
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
          Caries Risk Classification
        </p>
        <div className="flex items-center gap-2.5">
          <h2
            className={cn(
              "font-sans text-2xl font-bold tracking-tight",
              isHigh ? "text-destructive" : "text-primary",
            )}
          >
            {result.label} Risk
          </h2>
          {result.isBorderline && (
            <span className="text-[10px] font-semibold uppercase tracking-wider rounded-full border border-border bg-card px-2 py-0.5 text-muted-foreground">
              Borderline
            </span>
          )}
        </div>
      </div>

      <CardContent className="p-6 space-y-6">
        <ProbabilityGauge probability={result.probability} />

        {/* Feature Importance Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Most Influential Factors
            </h3>

            {/* Pill Segmented Control */}
            <div
              role="radiogroup"
              aria-label="Explanation Mode"
              className="inline-flex rounded-md border border-border bg-muted/50 p-0.5 text-xs"
            >
              <button
                type="button"
                role="radio"
                aria-checked={explainMode === "plain"}
                onClick={() => setExplainMode("plain")}
                className={cn(
                  "px-2.5 py-0.5 font-medium rounded-xs transition-all text-xs",
                  explainMode === "plain"
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Plain
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={explainMode === "clinical"}
                onClick={() => setExplainMode("clinical")}
                className={cn(
                  "px-2.5 py-0.5 font-medium rounded-xs transition-all text-xs",
                  explainMode === "clinical"
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Clinical
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {result.topFeatures.map((f) => (
              <FeatureBar
                key={f.feature}
                label={explainMode === "clinical" ? f.feature : f.label}
                magnitude={f.magnitude}
                direction={f.direction}
              />
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
            Suggested Next Steps
          </h3>
          <ul className="space-y-2">
            {result.recommendations.map((r, i) => (
              <li
                key={i}
                className="text-xs text-foreground leading-relaxed pl-3 border-l-2 border-primary"
              >
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* DMFT Metric Grid */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-border">
          {(
            [
              { key: "d", label: "Decayed (D)" },
              { key: "m", label: "Missing (M)" },
              { key: "f", label: "Filled (F)" },
              { key: "total", label: "DMFT Total" },
            ] as const
          ).map(({ key, label }) => (
            <div key={key} className="text-center">
              <p className="text-base font-bold text-foreground">
                {result.dmft[key]}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Footnote */}
        <p className="text-[11px] text-muted-foreground leading-normal border-t border-border pt-3">
          {result.modelNote}
        </p>
      </CardContent>
    </Card>
  );
}
