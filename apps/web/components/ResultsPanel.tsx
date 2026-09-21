"use client";

import { useState } from "react";
import { PredictionResponse } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  result: PredictionResponse | null;
  isLoading: boolean;
}

function ProbabilityGauge({ probability }: { probability: number }) {
  const pct = Math.round(probability * 100);
  const isHigh = probability >= 0.5;
  return (
    <div>
      <div className="flex items-end justify-between mb-1.5">
        <span className="font-mono text-3xl text-foreground">{pct}%</span>
        <span className="text-xs text-muted-foreground mb-1">
          predicted risk
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full",
            isHigh ? "bg-destructive" : "bg-primary"
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
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-foreground">{label}</span>
        <span
          className={
            direction === "increases" ? "text-destructive" : "text-primary"
          }
        >
          {direction === "increases" ? "↑ risk" : "↓ risk"}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full",
            direction === "increases" ? "bg-destructive" : "bg-primary"
          )}
          style={{ width: `${Math.max(pct, 6)}%` }}
        />
      </div>
    </div>
  );
}

export default function ResultsPanel({ result, isLoading }: Props) {
  const [explainMode, setExplainMode] = useState<"plain" | "clinical">(
    "plain"
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="font-serif text-lg text-foreground mb-2">
            Assessing…
          </p>
          <div className="h-2 w-2/3 rounded-full bg-muted animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6">
          <p className="font-serif text-lg text-foreground mb-1.5">
            Awaiting assessment
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Complete the form and submit to generate a caries risk prediction
            for this patient.
          </p>
        </CardContent>
      </Card>
    );
  }

  const isHigh = result.label === "High";

  return (
    <Card className="overflow-hidden">
      <div
        className={cn(
          "px-6 py-5",
          isHigh ? "bg-destructive/10" : "bg-accent"
        )}
      >
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
          Caries risk classification
        </p>
        <div className="flex items-center gap-3">
          <h2
            className={cn(
              "font-serif text-2xl",
              isHigh ? "text-destructive" : "text-accent-foreground"
            )}
          >
            {result.label} risk
          </h2>
          {result.isBorderline && (
            <span className="text-xs rounded-full border border-border px-2 py-0.5 text-muted-foreground">
              borderline
            </span>
          )}
        </div>
      </div>

      <CardContent className="p-6 space-y-6">
        <ProbabilityGauge probability={result.probability} />

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground">
              Most influential factors
            </h3>
            <div className="flex text-xs rounded-md border border-border overflow-hidden">
              <Button
                type="button"
                variant={explainMode === "plain" ? "default" : "ghost"}
                size="sm"
                className="rounded-none h-auto py-1 px-2.5"
                onClick={() => setExplainMode("plain")}
              >
                Plain
              </Button>
              <Button
                type="button"
                variant={explainMode === "clinical" ? "default" : "ghost"}
                size="sm"
                className="rounded-none h-auto py-1 px-2.5"
                onClick={() => setExplainMode("clinical")}
              >
                Clinical
              </Button>
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

        <div>
          <h3 className="text-sm font-medium text-foreground mb-2">
            Suggested next steps
          </h3>
          <ul className="space-y-1.5">
            {result.recommendations.map((r, i) => (
              <li
                key={i}
                className="text-sm text-foreground/80 leading-snug pl-3 border-l-2 border-primary/40"
              >
                {r}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-4 gap-2 pt-1 border-t border-border">
          {(["d", "m", "f", "total"] as const).map((k) => (
            <div key={k} className="text-center pt-3">
              <p className="font-mono text-lg text-foreground">
                {result.dmft[k]}
              </p>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {k}
              </p>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">
          {result.modelNote}
        </p>
      </CardContent>
    </Card>
  );
}
