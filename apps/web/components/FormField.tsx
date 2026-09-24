"use client";

import { FieldConfig, FormValues } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  field: FieldConfig;
  values: FormValues;
  onChange: (key: string, value: FormValues[string]) => void;
}

const helpClass = "mt-1 text-xs text-muted-foreground leading-snug";

export default function FormField({ field, values, onChange }: Props) {
  const value = values[field.key];

  if (field.type === "text") {
    return (
      <div>
        <Label htmlFor={field.key} className="mb-1.5 block">
          {field.label}
          {field.required && <span className="text-destructive"> *</span>}
        </Label>
        <Input
          id={field.key}
          type="text"
          placeholder={field.placeholder}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      </div>
    );
  }

  if (field.type === "number") {
    return (
      <div>
        <Label htmlFor={field.key} className="mb-1.5 block">
          {field.label}
          {field.required && <span className="text-destructive"> *</span>}
          {field.unit && (
            <span className="text-muted-foreground font-normal">
              {" "}
              ({field.unit})
            </span>
          )}
        </Label>
        <Input
          id={field.key}
          type="number"
          min={field.min}
          max={field.max}
          value={value === undefined ? "" : (value as number)}
          onChange={(e) =>
            onChange(
              field.key,
              e.target.value === "" ? undefined : Number(e.target.value),
            )
          }
        />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div>
        <Label htmlFor={field.key} className="mb-1.5 block">
          {field.label}
          {field.required && <span className="text-destructive"> *</span>}
        </Label>
        <Select
          value={value === undefined ? undefined : String(value)}
          onValueChange={(raw) => {
            const opt = field.options?.find((o) => String(o.value) === raw);
            onChange(field.key, opt ? opt.value : raw);
          }}
        >
          <SelectTrigger id={field.key}>
            <SelectValue placeholder="Select…" />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((opt) => (
              <SelectItem key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (field.type === "boolean") {
    // Treat undefined/null as false by default, or explicitly check equality
    const isYes = value === true;
    const isNo = value === false;

    return (
      <div>
        <Label className="mb-1.5 block">{field.label}</Label>
        <div className="grid grid-cols-2 gap-1 rounded-md border border-input bg-muted/50 p-1">
          <button
            type="button"
            onClick={() => onChange(field.key, false)}
            className={`rounded-sm py-1.5 text-xs font-medium transition-all ${
              isNo
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            No
          </button>
          <button
            type="button"
            onClick={() => onChange(field.key, true)}
            className={`rounded-sm py-1.5 text-xs font-medium transition-all ${
              isYes
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Yes
          </button>
        </div>
      </div>
    );
  }

  if (field.type === "checkboxGroup") {
    const group = (value as Record<string, boolean>) ?? {};
    return (
      <div>
        <Label className="mb-1.5 block">{field.label}</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 rounded-md border border-border bg-card p-3">
          {field.groupOptions?.map((opt) => (
            <div key={opt.key} className="flex items-center gap-2.5 py-1">
              <Checkbox
                id={`${field.key}-${opt.key}`}
                checked={!!group[opt.key]}
                onCheckedChange={(c) =>
                  onChange(field.key, { ...group, [opt.key]: c === true })
                }
              />
              <Label
                htmlFor={`${field.key}-${opt.key}`}
                className="font-normal cursor-pointer"
              >
                {opt.label}
              </Label>
            </div>
          ))}
        </div>
        {field.helpText && <p className={helpClass}>{field.helpText}</p>}
      </div>
    );
  }

  return null;
}
