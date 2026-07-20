import { Control, FieldPath, FieldValues } from "react-hook-form";

// Base props that all form components will share
export interface BaseFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// Common option type for selects, radio groups, etc.
export interface FormOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Textarea specific types
export interface TextareaConfig {
  maxLength?: number;
  showCharCount?: boolean;
  rows?: number;
  resize?: "none" | "vertical" | "horizontal" | "both";
}
