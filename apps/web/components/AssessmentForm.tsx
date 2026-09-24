"use client";

import { FORM_SCHEMA, SECTION_ORDER, SECTION_TITLES } from "@/lib/formSchema";
import { FormValues } from "@/lib/types";
import FormField from "./FormField";
import { Button } from "@/components/ui/button";

interface Props {
  values: FormValues;
  onChange: (key: string, value: FormValues[string]) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function AssessmentForm({
  values,
  onChange,
  onSubmit,
  isSubmitting,
}: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-10"
    >
      {SECTION_ORDER.map((sectionKey) => {
        const fields = FORM_SCHEMA.filter((f) => f.section === sectionKey);
        return (
          <fieldset key={sectionKey}>
            <legend className="w-full">
              <div className="flex items-center gap-2.5 border-b border-border pb-2.5 mb-5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {sectionKey}
                </span>
                <h2 className="font-sans text-base font-semibold text-foreground tracking-tight">
                  {SECTION_TITLES[sectionKey]}
                </h2>
              </div>
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              {fields.map((field) => (
                <div
                  key={field.key}
                  className={
                    field.type === "checkboxGroup" ? "sm:col-span-2" : ""
                  }
                >
                  <FormField
                    field={field}
                    values={values}
                    onChange={onChange}
                  />
                </div>
              ))}
            </div>
          </fieldset>
        );
      })}

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Assessing…" : "Assess caries risk"}
        </Button>
      </div>
    </form>
  );
}
