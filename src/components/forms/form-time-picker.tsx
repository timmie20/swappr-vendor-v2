"use client";

import { FieldPath, FieldValues, useController } from "react-hook-form";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldContent,
} from "@/components/ui/field";
import { BaseFormFieldProps } from "@/types/form";
import { cn } from "@/lib/utils";

interface FormTimePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  placeholder?: string;
}

function FormTimePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  required,
  disabled,
  className,
  placeholder,
}: FormTimePickerProps<TFieldValues, TName>) {
  const { field, fieldState } = useController({ control, name });

  return (
    <Field
      className={className}
      orientation="responsive"
      data-invalid={fieldState.invalid}
    >
      <FieldContent>
        {label && (
          <FieldLabel htmlFor={name}>
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </FieldLabel>
        )}
        <Timepicker
          id={name}
          value={field.value || ""}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={fieldState.invalid}
          // Match the shadcn Input look — the picker renders a plain <input>
          className={cn(
            "border-input selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground dark:bg-input/30 h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          )}
          options={{
            clock: { type: "12h" }, // input value stays "HH:mm" — matches the schema
            ui: { clearButton: true, theme: "basic" },
          }}
          onConfirm={({ hour, minutes }) => {
            if (hour && minutes) {
              field.onChange(
                `${hour.padStart(2, "0")}:${minutes.padStart(2, "0")}`,
              );
            }
          }}
          onClear={() => field.onChange("")}
          // Typed edits still flow into the form so zod can validate them
          onChange={(e) => field.onChange(e.target.value)}
          onBlur={field.onBlur}
        />
        {description && <FieldDescription>{description}</FieldDescription>}
        {fieldState.invalid && (
          <FieldError errors={[fieldState.error]} className="text-xs" />
        )}
      </FieldContent>
    </Field>
  );
}

export { FormTimePicker };
