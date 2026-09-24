"use client";

export function CalculatingLoader({
  label = "Analyzing patient data…",
}: {
  label?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-3">
      <div className="relative flex items-center justify-center h-10 w-10">
        {/* Outer Spinner Track */}
        <div className="absolute h-10 w-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        {/* Center Pulsing Core */}
        <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground animate-pulse">
        {label}
      </p>
    </div>
  );
}
